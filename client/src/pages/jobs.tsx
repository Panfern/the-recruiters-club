import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Briefcase, DollarSign } from "lucide-react";
import { Link } from "wouter";
import type { Job } from "@shared/schema";

export default function Jobs() {
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const { data: jobs, isLoading, error } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const filteredJobs = jobs?.filter(job => {
    const isActive = job.isActive !== false; // Show active jobs only
    const matchesTitle = job.title.toLowerCase().includes(searchTitle.toLowerCase());
    const matchesLocation = selectedLocation === "all" || job.location.includes(selectedLocation);
    const matchesType = selectedType === "all" || job.type.toLowerCase() === selectedType.toLowerCase();
    return isActive && matchesTitle && matchesLocation && matchesType;
  }) || [];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to load jobs</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Next Opportunity</h1>
          <p className="text-xl text-gray-600">Discover amazing career opportunities from top companies worldwide.</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <Input
                  type="text"
                  placeholder="e.g. Software Engineer"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="San Francisco">San Francisco, CA</SelectItem>
                    <SelectItem value="New York">New York, NY</SelectItem>
                    <SelectItem value="Austin">Austin, TX</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Search Jobs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />
                  <div className="flex space-x-2 mb-6">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-6">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria to find more opportunities.</p>
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">
                              {job.company.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                            <p className="text-blue-600 font-medium">{job.company}</p>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {job.description}
                        </p>
                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-3 mb-6">
                            {job.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Briefcase className="h-4 w-4" />
                            <span>{job.type}</span>
                          </div>
                          {job.salary && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4" />
                              <span>{job.salary}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-6 lg:mt-0 lg:ml-8">
                        <Link href={`/apply/${job.id}`}>
                          <Button 
                            className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700"

                          >
                            Apply Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button size="sm" className="bg-blue-600">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
