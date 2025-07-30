import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useParams } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import type { Job } from "@shared/schema";

const applicationSchema = z.object({
  jobId: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  coverLetter: z.string().min(100, "Cover letter must be at least 100 characters"),
  availability: z.string().optional(),
  salary: z.string().optional(),
  consent: z.boolean().refine(val => val === true, "You must consent to processing"),
  updates: z.boolean().optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export default function Apply() {
  const [location] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get job ID from URL parameters - try both route params and query params
  const [, search] = location.split('?');
  const urlParams = new URLSearchParams(search || '');
  const jobIdFromQuery = urlParams.get('jobId');
  const jobIdFromRoute = params.jobId;
  const jobId = jobIdFromRoute || jobIdFromQuery;
  


  const { data: job, isLoading: jobLoading } = useQuery<Job>({
    queryKey: ["/api/jobs", jobId],
    enabled: !!jobId,
  });

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      jobId: jobId || "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      linkedin: "",
      portfolio: "",
      coverLetter: "",
      availability: "",
      salary: "",
      consent: false,
      updates: false,
    },
  });

  const submitApplicationMutation = useMutation({
    mutationFn: async (data: ApplicationForm) => {
      if (!resumeFile) {
        throw new Error("Resume is required");
      }
      
      // Upload the resume file first
      const formData = new FormData();
      formData.append('resume', resumeFile);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload resume');
      }
      
      const uploadResult = await uploadResponse.json();
      
      // Submit application with resume URL
      const applicationData = {
        ...data,
        resumeUrl: uploadResult.url,
      };
      
      return apiRequest("POST", "/api/applications", applicationData);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Application submitted successfully!",
        description: "We'll review your application and get back to you soon.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting application",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ApplicationForm) => {
    if (!resumeFile) {
      toast({
        title: "Resume required",
        description: "Please upload your resume to continue.",
        variant: "destructive",
      });
      return;
    }
    submitApplicationMutation.mutate(data);
  };

  if (!jobId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">No Job Selected</h2>
            <p className="text-gray-600 mb-4">Please select a job from the jobs page to apply.</p>
            <Link href="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading job details...</div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-green-900 mb-4">Application Submitted Successfully!</h3>
              <p className="text-green-700 mb-6">Thank you for your interest. We'll review your application and get back to you within 5-7 business days.</p>
              <Link href="/jobs">
                <Button className="bg-green-600 hover:bg-green-700">
                  Browse More Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/jobs">
            <Button variant="ghost" className="mb-4 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Apply for Position</h1>
          {job && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold text-blue-900 mb-2">{job.title}</h2>
                <p className="text-blue-700">{job.company} • {job.location} • {job.type}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardContent className="p-8 space-y-12">
                {/* Personal Information */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-6">
                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn Profile</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Resume & Documents</h3>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV *</label>
                    <FileUpload onFileSelect={setResumeFile} />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="portfolio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portfolio/Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://yourportfolio.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Cover Letter</h3>
                  <FormField
                    control={form.control}
                    name="coverLetter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Why are you interested in this position? *</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={6}
                            placeholder="Tell us about your interest in this role and how your experience aligns with our requirements..."
                            {...field}
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500">Minimum 100 characters</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Additional Information</h3>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="availability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>When can you start?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select availability" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="immediately">Immediately</SelectItem>
                              <SelectItem value="2weeks">2 weeks notice</SelectItem>
                              <SelectItem value="1month">1 month notice</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="salary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Salary Range</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., $80,000 - $100,000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Consent and Submit */}
                <div className="border-t border-gray-200 pt-8">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="consent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm text-gray-600">
                              I consent to the processing of my personal data for recruitment purposes. I understand that my information will be used to evaluate my application and may be shared with relevant team members. *
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="updates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm text-gray-600">
                              I would like to receive updates about similar job opportunities from TalentBridge.
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Link href="/jobs">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      disabled={submitApplicationMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {submitApplicationMutation.isPending ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
