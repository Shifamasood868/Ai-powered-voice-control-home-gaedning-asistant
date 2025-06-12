import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  ChevronDown, 
  User, 
  LogOut, 
  Settings,
  Home,
  Users,
  MessageCircle,
  Phone,
  Calendar,
  Camera,
  Cloud
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setFeaturesOpen(false);
      setCommunityOpen(false);
      setUserOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-lg border-b-4 border-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-green-500 rounded-lg group-hover:bg-green-600 transition-colors">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                GardenAI
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            {/* Features Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFeaturesOpen(!featuresOpen);
                  setCommunityOpen(false);
                  setUserOpen(false);
                }}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                <span>Features</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {featuresOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <Link
                      to="/plant-care"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      onClick={() => setFeaturesOpen(false)}
                    >
                      <Calendar className="h-4 w-4 mr-3" />
                      Plant Care Reminder
                    </Link>
                    <Link
                      to="/plant-identification"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      onClick={() => setFeaturesOpen(false)}
                    >
                      <Camera className="h-4 w-4 mr-3" />
                      Plant Identification
                    </Link>
                    <Link
                      to="/garden-planning"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      onClick={() => setFeaturesOpen(false)}
                    >
                      <Leaf className="h-4 w-4 mr-3" />
                      Garden Planning
                    </Link>
                    <Link
                      to="/weather"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      onClick={() => setFeaturesOpen(false)}
                    >
                      <Cloud className="h-4 w-4 mr-3" />
                      Weather Update
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Community Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCommunityOpen(!communityOpen);
                  setFeaturesOpen(false);
                  setUserOpen(false);
                }}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                <span>Community</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${communityOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {communityOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <Link
                      to="/community"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      onClick={() => setCommunityOpen(false)}
                    >
                      <Users className="h-4 w-4 mr-3" />
                      Community Sharing
                    </Link>
                    <Link
                      to="/quiz"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      onClick={() => setCommunityOpen(false)}
                    >
                      <MessageCircle className="h-4 w-4 mr-3" />
                      Quiz
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link 
              to="/contact"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/contact') 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <Phone className="h-4 w-4" />
              <span>Contact</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserOpen(!userOpen);
                    setFeaturesOpen(false);
                    setCommunityOpen(false);
                  }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user.email || ''}</p>
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                </button>

                {userOpen && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user.email || ''}</p>
                      </div>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;