import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Briefcase, FileText, Clock, Calendar, Edit, Trash2, Eye, Download, Phone, Mail, LinkedinIcon, Globe, Power, ToggleLeft, ToggleRight, LogOut } from "lucide-react";
import { insertJobSchema, type Job, type Application } from "@shared/schema";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

type JobForm = {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salary?: string;
  skills: string;
};

export default function Admin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { admin, isLoading: authLoading, isAuthenticated } = useAuth();
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null);

  // Always call hooks at the top level
  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ["/api/admin/jobs"],
    enabled: isAuthenticated,
  });

  const { data: applications = [], isLoading: applicationsLoading } = useQuery<Application[]>({
    queryKey: ["/api/admin/applications"],
    enabled: isAuthenticated,
  });

  const form = useForm<JobForm>({
    resolver: zodResolver(
      z.object({
        title: z.string().min(1, "Title is required"),
        company: z.string().min(1, "Company is required"),
        location: z.string().min(1, "Location is required"),
        type: z.string().min(1, "Job type is required"),
        description: z.string().min(1, "Description is required"),
        salary: z.string().optional(),
        skills: z.string().optional(),
      })
    ),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      type: "",
      description: "",
      salary: "",
      skills: "",
    },
  });

  // All useMutation hooks must be called unconditionally
  const createJobMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingJob) {
        return apiRequest("PUT", `/api/admin/jobs/${editingJob.id}`, data);
      }
      return apiRequest("POST", "/api/admin/jobs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/jobs"] });
      setIsAddJobOpen(false);
      setEditingJob(null);
      form.reset();
      toast({
        title: editingJob ? "Job updated successfully!" : "Job created successfully!",
        description: editingJob ? "The job posting has been updated." : "The job posting has been added to the system.",
      });
    },
    onError: (error: any) => {
      toast({
        title: editingJob ? "Error updating job" : "Error creating job",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      return apiRequest("DELETE", `/api/admin/jobs/${jobId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/jobs"] });
      toast({
        title: "Job deleted successfully!",
        description: "The job posting has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting job",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const toggleJobStatusMutation = useMutation({
    mutationFn: async (jobId: string) => {
      return apiRequest("POST", `/api/admin/jobs/${jobId}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/jobs"] });
      toast({
        title: "Job status updated!",
        description: "The job status has been toggled.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating job status",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const updateApplicationStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: string }) => {
      return apiRequest("PUT", `/api/admin/applications/${applicationId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      toast({
        title: "Application status updated!",
        description: "The application status has been changed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating status",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation("/admin-auth");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin panel.",
      });
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/admin-auth");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render the component (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const onSubmit = (data: JobForm) => {
    const processedData = {
      ...data,
      skills: typeof data.skills === "string" 
        ? data.skills.split(",").map(s => s.trim()).filter(Boolean)
        : data.skills
    };
    createJobMutation.mutate(processedData);
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      deleteJobMutation.mutate(jobId);
    }
  };

  const handleUpdateApplicationStatus = (applicationId: string, status: string) => {
    updateApplicationStatusMutation.mutate({ applicationId, status });
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    form.reset({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      description: job.description,
      salary: job.salary || "",
      skills: job.skills ? job.skills.join(", ") : "",
    });
    setIsAddJobOpen(true);
  };

  const handleViewApplication = (application: Application) => {
    setViewingApplication(application);
  };

  const handleDownloadResume = (resumeUrl: string, candidateName: string) => {
    if (resumeUrl) {
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = `${candidateName}_Resume${resumeUrl.substring(resumeUrl.lastIndexOf('.'))}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getJobById = (jobId: string) => {
    return jobs.find(job => job.id === jobId);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    activeJobs: jobs.filter(job => job.isActive).length,
    totalJobs: jobs.length,
    totalApplications: applications.length,
    pendingReview: applications.filter(app => app.status === "pending").length,
    thisMonth: applications.filter(app => {
      const appDate = new Date(app.createdAt!);
      const now = new Date();
      return appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
    }).length,
  };

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {admin?.username}! Manage job postings and review applications</p>
            </div>
            <div className="mt-4 lg:mt-0 flex space-x-3">
              <Dialog open={isAddJobOpen} onOpenChange={(open) => {
                setIsAddJobOpen(open);
                if (!open) {
                  setEditingJob(null);
                  form.reset();
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{editingJob ? "Edit Job Posting" : "Add New Job Posting"}</DialogTitle>
                    <DialogDescription>
                      {editingJob ? "Update the job posting details below." : "Fill in the details to create a new job posting."}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title *</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company *</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location *</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Type *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select job type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="full-time">Full-time</SelectItem>
                                  <SelectItem value="part-time">Part-time</SelectItem>
                                  <SelectItem value="contract">Contract</SelectItem>
                                  <SelectItem value="internship">Internship</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="salary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Salary Range</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., $80k - $120k" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skills (comma-separated)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., React, TypeScript, Node.js" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Description *</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={6}
                                placeholder="Describe the role, responsibilities, and requirements..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={() => {
                          setIsAddJobOpen(false);
                          setEditingJob(null);
                          form.reset();
                        }}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createJobMutation.isPending}>
                          {createJobMutation.isPending 
                            ? (editingJob ? "Updating..." : "Creating...") 
                            : (editingJob ? "Update Job Posting" : "Create Job Posting")}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              <Button 
                variant="outline" 
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Active Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeJobs}</p>
                </div>
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <Briefcase className="text-blue-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <FileText className="text-green-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Pending Review</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.pendingReview}</p>
                </div>
                <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <Clock className="text-yellow-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">This Month</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.thisMonth}</p>
                </div>
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <Calendar className="text-purple-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="jobs" className="space-y-8">
          <TabsList>
            <TabsTrigger value="jobs">Job Postings</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          {/* Job Postings Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardContent className="p-0">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Job Postings Management</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {jobsLoading ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center">Loading jobs...</td>
                        </tr>
                      ) : jobs.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No jobs found</td>
                        </tr>
                      ) : (
                        jobs.map((job) => {
                          const jobApplications = applications.filter(app => app.jobId === job.id);
                          return (
                            <tr key={job.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">{job.title}</div>
                                <div className="text-sm text-gray-500">
                                  Posted {formatDistanceToNow(new Date(job.createdAt!))} ago
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{job.company}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{job.location}</td>
                              <td className="px-6 py-4">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  {job.type}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`${job.isActive ? 'text-green-600 hover:text-green-700' : 'text-gray-600 hover:text-gray-700'}`}
                                  onClick={() => toggleJobStatusMutation.mutate(job.id)}
                                  disabled={toggleJobStatusMutation.isPending}
                                >
                                  {job.isActive ? (
                                    <><ToggleRight className="h-4 w-4 mr-1" />Active</>
                                  ) : (
                                    <><ToggleLeft className="h-4 w-4 mr-1" />Inactive</>
                                  )}
                                </Button>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{jobApplications.length}</td>
                              <td className="px-6 py-4 text-sm space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700"
                                  onClick={() => handleEditJob(job)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleDeleteJob(job.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardContent className="p-0">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applicationsLoading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center">Loading applications...</td>
                        </tr>
                      ) : applications.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No applications found</td>
                        </tr>
                      ) : (
                        applications.map((application) => {
                          const job = getJobById(application.jobId);
                          return (
                            <tr key={application.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-medium text-sm">
                                      {application.firstName.charAt(0)}{application.lastName.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="font-medium text-gray-900">
                                      {application.firstName} {application.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500">{application.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{job?.title || "Unknown Position"}</div>
                                <div className="text-sm text-gray-500">{job?.company || "Unknown Company"}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {formatDistanceToNow(new Date(application.createdAt!))} ago
                              </td>
                              <td className="px-6 py-4">
                                <Badge className={getStatusBadgeColor(application.status || "pending")}>
                                  {application.status || "pending"}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-sm space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-blue-600 hover:text-blue-700"
                                  onClick={() => handleViewApplication(application)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {application.status === "pending" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-green-600 hover:text-green-700"
                                      onClick={() => handleUpdateApplicationStatus(application.id, "approved")}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => handleUpdateApplicationStatus(application.id, "rejected")}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Application Dialog */}
        {viewingApplication && (
          <Dialog open={!!viewingApplication} onOpenChange={() => setViewingApplication(null)}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
                <DialogDescription>
                  Review the candidate's application and resume
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Candidate Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {viewingApplication.firstName.charAt(0)}{viewingApplication.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {viewingApplication.firstName} {viewingApplication.lastName}
                    </h3>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{viewingApplication.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{viewingApplication.phone}</span>
                      </div>
                      {viewingApplication.linkedin && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <LinkedinIcon className="h-4 w-4" />
                          <a 
                            href={viewingApplication.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                      {viewingApplication.portfolio && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Globe className="h-4 w-4" />
                          <a 
                            href={viewingApplication.portfolio} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Portfolio
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusBadgeColor(viewingApplication.status || "pending")}>
                    {viewingApplication.status || "pending"}
                  </Badge>
                </div>

                {/* Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Position Applied For</h4>
                    <p className="text-gray-600">{getJobById(viewingApplication.jobId)?.title || "Unknown Position"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Applied Date</h4>
                    <p className="text-gray-600">
                      {formatDistanceToNow(new Date(viewingApplication.createdAt!))} ago
                    </p>
                  </div>
                  {viewingApplication.salary && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Salary Expectation</h4>
                      <p className="text-gray-600">{viewingApplication.salary}</p>
                    </div>
                  )}
                  {viewingApplication.availability && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Availability</h4>
                      <p className="text-gray-600">{viewingApplication.availability}</p>
                    </div>
                  )}
                </div>

                {/* Cover Letter */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cover Letter</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{viewingApplication.coverLetter}</p>
                  </div>
                </div>

                {/* Resume */}
                {viewingApplication.resumeUrl && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Resume</h4>
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(viewingApplication.resumeUrl!, '_blank')}
                        className="flex items-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Resume</span>
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleDownloadResume(
                          viewingApplication.resumeUrl!, 
                          `${viewingApplication.firstName}_${viewingApplication.lastName}`
                        )}
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Resume</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {viewingApplication.status === "pending" && (
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => {
                        handleUpdateApplicationStatus(viewingApplication.id, "rejected");
                        setViewingApplication(null);
                      }}
                    >
                      Reject Application
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        handleUpdateApplicationStatus(viewingApplication.id, "approved");
                        setViewingApplication(null);
                      }}
                    >
                      Approve Application
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
