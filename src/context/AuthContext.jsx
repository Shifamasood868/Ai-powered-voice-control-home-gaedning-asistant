
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('http://localhost:5000/api/auth/me');
          const userData = response.data?.user || null;
          setUser(userData);
          
          if (userData) {
            // Update user status to active when logged in
            await axios.put(`http://localhost:5000/api/auth/status/${userData._id}`, {
              status: 'active'
            });
            
            // Store token for admin panel if user is admin
            if (userData.role === 'admin') {
              localStorage.setItem('adminToken', token);
            }
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

 // In your AuthProvider component, update these functions:

const login = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    
    // Update user status to active
    await axios.put(`http://localhost:5000/api/auth/status/${userData.id}`, {
      status: 'active'
    });
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const handleLogout = async () => {
  try {
    if (user) {
      // Update user status to inactive
      await axios.put(`http://localhost:5000/api/auth/status/${user._id}`, {
        status: 'inactive'
      });
    }
    await axios.post('http://localhost:5000/api/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
  }
};

const register = async (name, email, password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name,
      email,
      password
    });
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    
    // Update user status to active
    await axios.put(`http://localhost:5000/api/auth/status/${userData.id}`, {
      status: 'active'
    });
    
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};
  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout: handleLogout,
      loading,
      token
    }}>
      {children}
    </AuthContext.Provider>
  );
};