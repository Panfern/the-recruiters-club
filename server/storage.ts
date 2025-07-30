import { type Job, type Application, type InsertJob, type InsertApplication, type Admin, type InsertAdmin, jobs, applications, admins } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

interface IStorage {
  // Job operations
  createJob(job: InsertJob): Promise<Job>;
  getJobs(): Promise<Job[]>;
  getActiveJobs(): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  updateJob(id: string, job: Partial<InsertJob>): Promise<Job | undefined>;
  toggleJobStatus(id: string): Promise<Job | undefined>;
  deleteJob(id: string): Promise<boolean>;

  // Application operations
  createApplication(application: InsertApplication): Promise<Application>;
  getApplications(): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  updateApplicationStatus(id: string, status: string): Promise<Application | undefined>;

  // Admin operations
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  getAdmin(id: string): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  verifyAdminPassword(username: string, password: string): Promise<Admin | null>;
}

class DatabaseStorage implements IStorage {
  // Job operations
  async createJob(jobData: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values(jobData)
      .returning();
    return job;
  }

  async getJobs(): Promise<Job[]> {
    return await db.select().from(jobs);
  }

  async getActiveJobs(): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.isActive, true));
  }

  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async updateJob(id: string, jobData: Partial<InsertJob>): Promise<Job | undefined> {
    const [job] = await db
      .update(jobs)
      .set(jobData)
      .where(eq(jobs.id, id))
      .returning();
    return job || undefined;
  }

  async toggleJobStatus(id: string): Promise<Job | undefined> {
    // First get the current job to check its status
    const currentJob = await this.getJob(id);
    if (!currentJob) return undefined;

    const [job] = await db
      .update(jobs)
      .set({ isActive: !currentJob.isActive })
      .where(eq(jobs.id, id))
      .returning();
    return job || undefined;
  }

  async deleteJob(id: string): Promise<boolean> {
    const result = await db.delete(jobs).where(eq(jobs.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Application operations
  async createApplication(applicationData: InsertApplication): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values(applicationData)
      .returning();
    return application;
  }

  async getApplications(): Promise<Application[]> {
    return await db.select().from(applications);
  }

  async getApplication(id: string): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || undefined;
  }

  async updateApplicationStatus(id: string, status: string): Promise<Application | undefined> {
    const [application] = await db
      .update(applications)
      .set({ status })
      .where(eq(applications.id, id))
      .returning();
    return application || undefined;
  }

  // Admin operations
  async createAdmin(adminData: InsertAdmin): Promise<Admin> {
    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
    
    const [admin] = await db
      .insert(admins)
      .values({
        ...adminData,
        password: hashedPassword,
      })
      .returning();
    return admin;
  }

  async getAdmin(id: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin || undefined;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async verifyAdminPassword(username: string, password: string): Promise<Admin | null> {
    const admin = await this.getAdminByUsername(username);
    if (!admin) return null;

    const isValidPassword = await bcrypt.compare(password, admin.password);
    return isValidPassword ? admin : null;
  }
}

export const storage = new DatabaseStorage();