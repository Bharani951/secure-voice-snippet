import React, { useState, useEffect } from 'react';
import useAudioRecorder from '../hooks/useAudioRecorder';
import { formatDuration } from '../utils/formatters';

const AudioRecorder = ({ onSave, onCancel }) => {
  const {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    audioUrl,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
    convertAudio
  } = useAudioRecorder();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Format duration for display
  const formattedDuration = formatDuration(duration);

  // Handle recording start
  const handleStartRecording = async () => {
    await startRecording();
  };

  // Handle recording completion
  const handleSave = async () => {
    if (!audioBlob) {
      setSaveError('No recording available to save');
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);

      // Convert to MP3 if needed
      const mp3Blob = await convertAudio('audio/mp3');

      // Call the save callback with the recorded audio and metadata
      await onSave({
        title: title || `Recording ${new Date().toLocaleString()}`,
        description,
        audio: mp3Blob,
        duration
      });

      // Reset state
      setTitle('');
      setDescription('');
      cancelRecording();
    } catch (err) {
      setSaveError('Failed to save recording: ' + err.message);
      console.error('Error saving recording:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    cancelRecording();
    setTitle('');
    setDescription('');
    if (onCancel) onCancel();
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Voice Recorder</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {saveError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {saveError}
        </div>
      )}

      {/* Recording UI */}
      <div className="mb-6">
        {/* Timer Display */}
        <div className="text-center mb-4">
          <div className="text-3xl font-mono">{formattedDuration}</div>
          {isRecording && (
            <div className="mt-1">
              <span className={`inline-block h-3 w-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 recording-indicator'}`}></span>
              <span className="ml-2 text-sm text-gray-500">{isPaused ? 'Paused' : 'Recording...'}</span>
            </div>
          )}
        </div>

        {/* Recording Controls */}
        <div className="flex justify-center space-x-4">
          {!isRecording && !audioBlob && (
            <button
              onClick={handleStartRecording}
              className="btn btn-primary flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Start Recording
            </button>
          )}

          {isRecording && !isPaused && (
            <>
              <button
                onClick={pauseRecording}
                className="btn btn-secondary flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pause
              </button>
              <button
                onClick={stopRecording}
                className="btn btn-primary flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Stop
              </button>
            </>
          )}

          {isRecording && isPaused && (
            <>
              <button
                onClick={resumeRecording}
                className="btn btn-primary flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resume
              </button>
              <button
                onClick={stopRecording}
                className="btn btn-secondary flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Stop
              </button>
            </>
          )}

          {audioBlob && !isRecording && (
            <>
              <button
                onClick={handleStartRecording}
                className="btn btn-secondary flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Record Again
              </button>
            </>
          )}
        </div>
      </div>

      {/* Audio Preview */}
      {audioUrl && !isRecording && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Preview</h3>
          <audio 
            src={audioUrl} 
            controls 
            className="w-full"
          />
        </div>
      )}

      {/* Metadata Form */}
      {audioBlob && !isRecording && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Save Recording</h3>
          
          <div className="mb-4">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your recording"
              className="form-input"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="form-label">Description (optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              className="form-input resize-none h-24"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-primary flex items-center"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Recording
                </>
              )}
            </button>
            
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;