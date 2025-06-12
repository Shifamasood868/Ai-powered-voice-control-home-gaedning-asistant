import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';

import Home from './pages/Home.jsx';
import PlantCareReminder from './pages/PlantCareReminder.jsx';
import PlantIdentification from './pages/PlantIdentification.jsx';
import GardenPlanning from './pages/GardenPlanning.jsx';
import WeatherUpdate from './pages/WeatherUpdate.jsx';
import CommunitySharing from './pages/CommunitySharing.jsx';
import Quiz from './pages/Quiz.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminDashboard from './AdminPanel/AdminDashboard.jsx';

const AppLayout = () => {
  const location = useLocation();
  
  // ✅ Hide navbar on any admin route (more flexible)
  const isAdminRoute = location.pathname.toLowerCase().startsWith('/admindashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plant-care" element={<PlantCareReminder />} />
        <Route path="/plant-identification" element={<PlantIdentification />} />
        <Route path="/garden-planning" element={<GardenPlanning />} />
        <Route path="/weather" element={<WeatherUpdate />} />
        <Route path="/community" element={<CommunitySharing />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
