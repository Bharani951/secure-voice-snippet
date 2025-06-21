import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnippets } from '../context/SnippetContext';
import AudioPlayer from '../components/AudioPlayer';
import AudioRecorder from '../components/AudioRecorder';
import ShareLink from '../components/ShareLink';
import { format } from 'date-fns';

const SnippetPage = ({ isRecording = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSnippet, createSnippet, deleteSnippet } = useSnippets();
  
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(!isRecording);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Fetch snippet data if not in recording mode
  useEffect(() => {
    if (!isRecording && id) {
      const fetchSnippet = async () => {
        try {
          setLoading(true);
          const data = await getSnippet(id);
          setSnippet(data);
        } catch (err) {
          setError('Failed to load snippet: ' + (err.response?.data?.message || err.message));
          console.error('Error fetching snippet:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchSnippet();
    }
  }, [isRecording, id, getSnippet]);
  
  // Handle new recording save
  const handleSaveRecording = async (recordingData) => {
    try {
      setLoading(true);
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('title', recordingData.title);
      formData.append('description', recordingData.description || '');
      formData.append('duration', recordingData.duration || 0);
      formData.append('audio', recordingData.audio);
      
      // Create snippet
      const newSnippet = await createSnippet(recordingData, recordingData.audio);
      
      // Navigate to the new snippet page
      navigate(`/snippet/${newSnippet._id}`);
    } catch (err) {
      setError('Failed to save recording: ' + (err.response?.data?.message || err.message));
      console.error('Error saving recording:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle snippet deletion
  const handleDeleteSnippet = async () => {
    try {
      setLoading(true);
      await deleteSnippet(id);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete snippet: ' + (err.response?.data?.message || err.message));
      console.error('Error deleting snippet:', err);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };
  
  // Handle recording cancel
  const handleCancelRecording = () => {
    navigate('/dashboard');
  };

  // Show loading state
  if (loading && !isRecording) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // Show error state
  if (error && !isRecording) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 btn btn-primary"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      {isRecording ? (
        // Recording view
        <div>
          <h1 className="text-2xl font-bold mb-6">Record New Snippet</h1>
          <AudioRecorder 
            onSave={handleSaveRecording}
            onCancel={handleCancelRecording}
          />
        </div>
      ) : snippet ? (
        // Snippet detail view
        <div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold">{snippet.title}</h1>
              <div className="text-sm text-gray-500 mt-1">
                Created on {format(new Date(snippet.createdAt), 'MMMM d, yyyy')}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowShareModal(true)}
                className="btn btn-secondary flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-secondary flex items-center bg-red-100 hover:bg-red-200 text-red-700"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
          
          {snippet.description && (
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Description</h2>
              <p className="text-gray-700">{snippet.description}</p>
            </div>
          )}
          
          <AudioPlayer 
            audioUrl={snippet.audioUrl}
            encrypted={snippet.encrypted}
          />
          
          {/* Share Modal */}
          {showShareModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="max-w-md w-full">
                <ShareLink 
                  snippetId={snippet._id}
                  onClose={() => setShowShareModal(false)}
                />
              </div>
            </div>
          )}
          
          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="max-w-md w-full bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Delete Snippet</h3>
                <p className="mb-6">
                  Are you sure you want to delete this snippet? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteSnippet}
                    className="btn btn-primary bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Fallback for when not recording and no snippet found
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">Snippet not found</div>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default SnippetPage;