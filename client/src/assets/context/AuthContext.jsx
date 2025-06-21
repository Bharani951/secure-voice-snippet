import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [initializing, setInitializing] = useState(true);

  // Check for existing auth on load
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          // Set auth header for API calls
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // When backend is ready, verify the token:
          // const response = await axios.get('/api/auth/verify');
          // if (response.data.valid) {
          //   setUser(JSON.parse(storedUser));
          //   setIsAuthenticated(true);
          // } else {
          //   // Token invalid - clear storage
          //   localStorage.removeItem('user');
          //   localStorage.removeItem('token');
          // }

          // For now, just restore from localStorage:
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth verification error:", error);
          // Clear invalid auth data
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
      setInitializing(false);
    };
    
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // When backend is implemented:
      // const response = await axios.post('/api/auth/login', credentials);
      // const { token, user } = response.data;
      
      // For now, simulate a login with the entered email:
      const mockUser = {
        name: credentials.email.split('@')[0], // Generate name from email
        email: credentials.email,
        id: `user_${Date.now()}` // Mock user ID
      };
      
      // Mock token (in real app this would come from backend)
      const mockToken = `mock_token_${Date.now()}`;
      
      // Store auth data
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);
      
      // Set axios default header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      
      // Update state
      setUser(mockUser);
      setIsAuthenticated(true);
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // When backend is implemented:
      // const response = await axios.post('/api/auth/register', userData);
      
      // For now, simulate registration WITHOUT auto-login:
      console.log("User registered:", userData);
      
      // Store the registration data somewhere? (optional)
      // localStorage.setItem('registeredEmail', userData.email);
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      console.error("Register error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    // Clear auth state
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear stored data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Clear auth header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Create a function to update user data
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    loading,
    initializing
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;