import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Users, 
  Camera, 
  Calendar, 
  Cloud, 
  MessageCircle,
  Star,
  ArrowRight,
  Play
} from 'lucide-react';
import shifa  from "../images/shifa.jpeg"
const Home = () => {
  const features = [
    {
      icon: <Camera className="h-8 w-8" />,
      title: "AI Plant Identification",
      description: "Instantly identify plants with our advanced AI technology. Simply take a photo and get detailed information about any plant."
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Smart Care Reminders",
      description: "Never forget to water or fertilize your plants again. Get personalized care schedules based on your plants' needs."
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Weather Integration",
      description: "Get real-time weather updates and recommendations for your garden activities based on local conditions."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Sharing",
      description: "Connect with fellow gardeners, share your progress, and learn from experienced plant enthusiasts."
    }
  ];

  const teamMembers = [
    {
      name: "Shifa Masood",
      role: "MERN Stack Web developer",
      image: shifa,
      description: "PhD in Plant Biology with 15+ years of gardening expertise"
    },
    {
      name: "Aqib Sajjad",
      role: "Frontend Developer",
      image: "https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      description: "Machine learning expert specializing in plant recognition systems"
    },
    {
      name: "Abdullah Ghouri",
      role: "Frontend developer",
      image: "https://images.pexels.com/photos/3768114/pexels-photo-3768114.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      description: "Award-winning landscape architect and sustainable gardening advocate"
    },
    
     
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1200')"
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your AI-Powered
              <span className="block text-green-300">Gardening Assistant</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your gardening experience with intelligent plant care, AI identification, 
              and a thriving community of green-thumb enthusiasts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/plant-identification"
                className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <Camera className="h-6 w-6" />
                <span>Try Plant ID</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <button className="flex items-center space-x-2 text-white hover:text-green-300 transition-colors">
                <Play className="h-6 w-6" />
                <span className="text-lg">Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Perfect Gardens
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of AI-powered tools helps both beginners and experts 
              create thriving, beautiful gardens with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2"
              >
                <div className="text-green-500 mb-4 group-hover:text-green-600 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Gardening Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Magic of Gardening
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Gardening is more than just growing plants—it's about nurturing life, connecting with nature, 
                and creating beautiful spaces that bring joy and peace to our daily lives.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Whether you're growing herbs on a windowsill or tending to acres of landscape, 
                every garden tells a story of patience, care, and the miracle of growth.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">10,000+</div>
                  <div className="text-gray-600">Plants Identified</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">5,000+</div>
                  <div className="text-gray-600">Happy Gardeners</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Beautiful garden"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our passionate team combines decades of gardening expertise with cutting-edge 
              technology to bring you the best gardening experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
              >
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 rounded-full bg-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 w-24 h-24 mx-auto"></div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-green-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.description}
                </p>
                
                <div className="flex justify-center mt-4 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Gardening Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of gardeners who are already growing better with GardenAI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              to="/community"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              Join Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;