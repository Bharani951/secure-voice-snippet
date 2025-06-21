import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSnippets } from '../context/SnippetContext';
import AudioPlayer from '../components/AudioPlayer';
import { format } from 'date-fns';

const ViewPage = () => {
  const { shareId } = useParams();
  const { getSharedSnippet } = useSnippets();
  
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSharedSnippet = async () => {
      try {
        setLoading(true);
        const data = await getSharedSnippet(shareId);
        setSnippet(data);
      } catch (err) {
        setError('Failed to load shared snippet: ' + (err.response?.data?.message || err.message));
        console.error('Error fetching shared snippet:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (shareId) {
      fetchSharedSnippet();
    }
  }, [shareId, getSharedSnippet]);
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error || !snippet) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="card">
          <div className="text-xl font-bold mb-4 text-red-600">Unable to access this snippet</div>
          <p className="text-gray-700 mb-6">
            {error || "This shared snippet may have expired or been removed by the owner."}
          </p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="card">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white mr-3">
            {snippet.owner?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="font-semibold">{snippet.owner?.name || 'Anonymous User'}</div>
            <div className="text-sm text-gray-500">
              Shared on {format(new Date(snippet.sharedAt || snippet.createdAt), 'MMMM d, yyyy')}
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">{snippet.title}</h1>
        
        {snippet.description && (
          <div className="mb-6">
            <p className="text-gray-700">{snippet.description}</p>
          </div>
        )}
        
        <AudioPlayer 
          audioUrl={snippet.audioUrl}
          encrypted={snippet.encrypted}
        />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-4">
            This is a shared voice snippet from SecureVoice Snippet.
          </p>
          <Link to="/" className="text-primary-500 hover:underline">
            Create your own secure voice snippets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewPage;