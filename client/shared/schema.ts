import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Job schemas
export const insertJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().min(1, "Description is required"),
  salary: z.string().optional(),
  skills: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

// Application schemas
export const insertApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  resumeUrl: z.string().optional(),
  coverLetter: z.string().min(1, "Cover letter is required"),
  availability: z.string().optional(),
  salary: z.string().optional(),
});

// Types
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

// Job and Application types for API responses
export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salary?: string;
  skills?: string[];
  isActive: boolean;
  createdAt: string;
};

export type Application = {
  id: string;
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedin?: string;
  portfolio?: string;
  resumeUrl?: string;
  coverLetter: string;
  availability?: string;
  salary?: string;
  status: string;
  createdAt: string;
};

export type Admin = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};
