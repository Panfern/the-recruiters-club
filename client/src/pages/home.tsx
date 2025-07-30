import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Search, Clock, Handshake } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="brand-gradient py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Find Your Perfect 
                  <span className="text-blue-200"> Career Match</span>
                </h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Connect talented professionals with innovative companies. Our platform streamlines the recruitment process for both job seekers and employers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/jobs">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 font-semibold">
                      Browse Jobs
                    </Button>
                  </Link>
                  <Link href="/admin">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold">
                      For Employers
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Professional team collaborating in modern office" 
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose TalentBridge?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with personalized service to deliver exceptional recruitment experiences.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-blue-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI-powered system matches candidates with opportunities based on skills, experience, and culture fit.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="text-blue-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Fast Process</h3>
              <p className="text-gray-600 leading-relaxed">
                Streamlined application process that saves time for both candidates and hiring managers.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Handshake className="text-blue-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Dedicated account managers provide guidance throughout the entire recruitment journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600 font-medium">Active Jobs</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Candidates</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">2K+</div>
              <div className="text-gray-600 font-medium">Companies</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
