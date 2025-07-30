import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { storage } from "./storage";
import { insertJobSchema, insertApplicationSchema, loginSchema, signupSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Authentication middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session?.adminId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: 7 * 24 * 60 * 60, // 1 week
    tableName: "sessions",
  });

  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  }));

  // Configure multer for file uploads
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const upload = multer({
    dest: uploadDir,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
      }
    },
  });

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      
      // Check if admin already exists
      const existingAdmin = await storage.getAdminByUsername(validatedData.username);
      if (existingAdmin) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const admin = await storage.createAdmin(validatedData);
      (req as any).session.adminId = admin.id;
      
      res.json({ 
        message: "Admin created successfully",
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create admin" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const admin = await storage.verifyAdminPassword(validatedData.username, validatedData.password);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      (req as any).session.adminId = admin.id;
      
      res.json({ 
        message: "Login successful",
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    (req as any).session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!(req as any).session?.adminId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const admin = await storage.getAdmin((req as any).session.adminId);
      if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
      }

      res.json({
        id: admin.id,
        username: admin.username,
        email: admin.email,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get admin info" });
    }
  });

  // File upload route
  app.post("/api/upload", upload.single('resume'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl, filename: req.file.originalname });
    } catch (error) {
      res.status(500).json({ message: "File upload failed" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Public job routes (only show active jobs)
  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getActiveJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job || !job.isActive) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  // Admin job routes (protected)
  app.get("/api/admin/jobs", requireAuth, async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.post("/api/admin/jobs", requireAuth, async (req, res) => {
    try {
      const validatedData = insertJobSchema.parse(req.body);
      
      // Convert skills string to array
      if (typeof validatedData.skills === 'string') {
        (validatedData as any).skills = validatedData.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean);
      }
      validatedData.created_at = new Date();
      
      const job = await storage.createJob(validatedData);
      res.json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  app.put("/api/admin/jobs/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertJobSchema.partial().parse(req.body);
      
      // Convert skills string to array
      if (typeof validatedData.skills === 'string') {
        (validatedData as any).skills = validatedData.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean);
      }
      
      const job = await storage.updateJob(req.params.id, validatedData);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to update job" });
    }
  });

  app.post("/api/admin/jobs/:id/toggle", requireAuth, async (req, res) => {
    try {
      const job = await storage.toggleJobStatus(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle job status" });
    }
  });

  app.delete("/api/admin/jobs/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteJob(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete job" });
    }
  });

  // Application routes
  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  app.get("/api/admin/applications", requireAuth, async (req, res) => {
    try {
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.get("/api/admin/applications/:id", requireAuth, async (req, res) => {
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });

  app.put("/api/admin/applications/:id/status", requireAuth, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const application = await storage.updateApplicationStatus(req.params.id, status);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to update application status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}