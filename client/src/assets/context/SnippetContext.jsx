import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const SnippetContext = createContext();

export const SnippetProvider = ({ children }) => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch snippets when user is authenticated
  useEffect(() => {
    if (user) {
      fetchSnippets();
    } else {
      setSnippets([]);
    }
  }, [user]);

  // Fetch all snippets for the authenticated user
  const fetchSnippets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/snippets');
      setSnippets(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch snippets');
      console.error('Error fetching snippets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get a single snippet by ID
  const getSnippet = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/snippets/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch snippet');
      console.error('Error fetching snippet:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new snippet
  const createSnippet = async (snippetData, audioFile) => {
    setLoading(true);
    setError(null);
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('title', snippetData.title);
      formData.append('description', snippetData.description || '');
      formData.append('duration', snippetData.duration || 0);
      
      if (snippetData.iv) {
        formData.append('iv', snippetData.iv);
      }
      
      if (snippetData.authTag) {
        formData.append('authTag', snippetData.authTag);
      }
      
      if (audioFile) {
        formData.append('audio', audioFile);
      }
      
      const response = await api.post('/snippets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update snippets list with the new snippet
      setSnippets(prevSnippets => [...prevSnippets, response.data]);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create snippet');
      console.error('Error creating snippet:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing snippet
  const updateSnippet = async (id, snippetData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/snippets/${id}`, snippetData);
      
      // Update snippets list with the updated snippet
      setSnippets(prevSnippets => 
        prevSnippets.map(snippet => 
          snippet._id === id ? response.data : snippet
        )
      );
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update snippet');
      console.error('Error updating snippet:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a snippet
  const deleteSnippet = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/snippets/${id}`);
      
      // Remove deleted snippet from list
      setSnippets(prevSnippets => 
        prevSnippets.filter(snippet => snippet._id !== id)
      );
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete snippet');
      console.error('Error deleting snippet:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a share link for a snippet
  const createShareLink = async (snippetId, expiresIn) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/share`, {
        snippetId,
        expiresIn: expiresIn || '7d'
      });
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create share link');
      console.error('Error creating share link:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a shared snippet by share ID
  const getSharedSnippet = async (shareId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/share/${shareId}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch shared snippet');
      console.error('Error fetching shared snippet:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    snippets,
    loading,
    error,
    fetchSnippets,
    getSnippet,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    createShareLink,
    getSharedSnippet
  };

  return (
    <SnippetContext.Provider value={value}>
      {children}
    </SnippetContext.Provider>
  );
};

export const useSnippets = () => {
  const context = useContext(SnippetContext);
  if (!context) {
    throw new Error('useSnippets must be used within a SnippetProvider');
  }
  return context;
};

export default SnippetContext;