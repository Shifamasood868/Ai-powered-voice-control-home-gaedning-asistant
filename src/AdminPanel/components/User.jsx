import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Mail, Calendar, MapPin, Phone, Edit, Trash2, Search } from 'lucide-react';

const User = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/allusers');
        if (res.data.status === "success") {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/api/auth/deleteuser/${userId}`);
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Delete error:', error);
      Swal.fire('Error!', 'Failed to delete user', 'error');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-section">
      <div className="section-header">
        <h2>User Management</h2>
        <p>Manage and monitor user accounts</p>
      </div>

      <div className="section-controls">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="users-grid">
        {filteredUsers.map((user) => (
          <div key={user._id} className="user-card">
            <div className="user-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user.name?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
              <div className={`status-indicator ${user.status}`}></div>
            </div>

            <div className="user-info">
              <h3>{user.name}</h3>
              <div className="user-details">
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="detail-item">
                    <Phone size={16} />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.location && (
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="user-stats">
                <div className="stat">
                  <span>Status:</span>
                  <span className={`status-badge ${user.status}`}>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="user-actions">
              <button className="action-btn edit">
                <Edit size={16} />
              </button>
              <button
                className="action-btn delete"
                onClick={() => handleDelete(user._id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default User;