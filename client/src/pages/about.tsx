import { Badge } from "@/components/ui/badge";
import { Lightbulb, Heart, Shield, Rocket } from "lucide-react";

export default function About() {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">About TalentBridge</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Founded in 2020, TalentBridge has revolutionized the recruitment industry by combining innovative technology with human expertise. We believe that the right career opportunity can transform lives.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our mission is to connect exceptional talent with forward-thinking companies, creating meaningful partnerships that drive business success and career growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-4 py-2 font-medium">Innovation</Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-4 py-2 font-medium">Excellence</Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-4 py-2 font-medium">Integrity</Badge>
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Diverse team collaborating in modern office" 
              className="rounded-2xl shadow-xl w-full h-auto"
            />
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-16">Meet Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300" 
                alt="CEO Michael Thompson professional headshot" 
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover shadow-lg"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Michael Thompson</h3>
              <p className="text-blue-600 font-medium mb-4">CEO & Founder</p>
              <p className="text-gray-600 text-sm">15+ years in HR technology and talent acquisition</p>
            </div>
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300" 
                alt="CTO Sarah Chen professional headshot" 
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover shadow-lg"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Chen</h3>
              <p className="text-blue-600 font-medium mb-4">CTO</p>
              <p className="text-gray-600 text-sm">Former Google engineer, AI and machine learning expert</p>
            </div>
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300" 
                alt="Head of Operations David Rodriguez professional headshot" 
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover shadow-lg"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">David Rodriguez</h3>
              <p className="text-blue-600 font-medium mb-4">Head of Operations</p>
              <p className="text-gray-600 text-sm">Strategic operations leader with global scaling experience</p>
            </div>
          </div>
        </div>

        {/* Company Values */}
        <div className="bg-gray-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="text-white h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600">We continuously evolve our platform to stay ahead of industry trends and provide cutting-edge solutions.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="text-white h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Empathy</h3>
                <p className="text-gray-600">We understand the human side of recruitment and prioritize genuine connections over transactions.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="text-white h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Integrity</h3>
                <p className="text-gray-600">Transparency and honesty guide every interaction with candidates and client companies.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <Rocket className="text-white h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
                <p className="text-gray-600">We set high standards for ourselves and deliver exceptional results for all stakeholders.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
