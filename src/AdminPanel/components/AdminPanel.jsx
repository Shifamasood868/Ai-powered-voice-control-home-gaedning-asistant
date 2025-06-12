import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  HelpCircle, 
  Home, 
  Leaf,
  Menu,
  X
} from 'lucide-react';
import User from './User';
import ShowContact from './ShowContact';
import Quiz from './Quiz';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({
    users: 0,
    contacts: 0,
    quizzes: 0
  });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'contacts', label: 'Contacts', icon: MessageSquare },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle }
  ];

  useEffect(() => {
    // Fetch total users
    fetch('http://localhost:5000/api/auth/usercount')
      .then(res => res.json())
      .then(data => setCounts(prev => ({ ...prev, users: data.count })))
      .catch(err => console.error('Error fetching user count:', err));

    // Fetch total contacts
    fetch('http://localhost:5000/api/contact/contactcount')
      .then(res => res.json())
      .then(data => setCounts(prev => ({ ...prev, contacts: data.count })))
      .catch(err => console.error('Error fetching contact count:', err));

    // Fetch total quiz attempts
    fetch('http://localhost:5000/api/questions/quizcount')
      .then(res => res.json())
      .then(data => setCounts(prev => ({ ...prev, quizzes: data.count })))
      .catch(err => console.error('Error fetching quiz count:', err));
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <User />;
      case 'contacts':
        return <ShowContact />;
      case 'quiz':
        return <Quiz />;
      default:
        return (
          <div className="dashboard-overview">
            <div className="welcome-section">
              <div className="welcome-header">
                <Leaf className="welcome-icon" size={48} />
                <div>
                  <h1>Welcome to Garden Admin</h1>
                  <p>Manage your gardening website with ease</p>
                </div>
              </div>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon users-bg">
                  <Users size={24} />
                </div>
                <div className="stat-content">
                  <h3>Total Users</h3>
                  <span>{counts.users}</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon contacts-bg">
                  <MessageSquare size={24} />
                </div>
                <div className="stat-content">
                  <h3>Total Messages</h3>
                  <span>{counts.contacts}</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon quiz-bg">
                  <HelpCircle size={24} />
                </div>
                <div className="stat-content">
                  <h3>Quiz Attempts</h3>
                  <span>{counts.quizzes}</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-panel">
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Leaf className="logo-icon" size={32} />
            <span>Garden Admin</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-container">
          {renderContent()}
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
