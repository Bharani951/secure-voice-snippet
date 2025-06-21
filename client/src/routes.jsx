import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './assets/context/AuthContext';

// Pages
import HomePage from './assets/pages/HomePage';
import LoginPage from './assets/pages/LoginPage';
import RegisterPage from './assets/pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import SnippetPage from './assets/pages/SnippetPage';
import ViewPage from './assets/pages/ViewPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading indicator while checking auth status
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/share/:shareId" element={<ViewPage />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/snippet/:id" 
        element={
          <ProtectedRoute>
            <SnippetPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/record" 
        element={
          <ProtectedRoute>
            <SnippetPage isRecording={true} />
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;