import React, { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { formatDuration } from '../utils/formatters';

const AudioPlayer = ({ audioUrl, encrypted = false, encryptionData = null }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const containerRef = useRef(null);

  // Initialize WaveSurfer
  useEffect(() => {
    if (!audioUrl) return;
    
    setIsLoading(true);
    setError(null);
    
    // Create WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#94a3b8', // Slate-400
      progressColor: '#0ea5e9', // Sky-500
      cursorColor: '#0284c7', // Sky-600
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      responsive: true,
      normalize: true,
      partialRender: true,
      height: 80
    });
    
    wavesurferRef.current = wavesurfer;
    
    // Load audio
    wavesurfer.load(audioUrl);
    
    // Event listeners
    wavesurfer.on('ready', () => {
      setIsLoading(false);
      setDuration(wavesurfer.getDuration());
      wavesurfer.setVolume(volume);
    });
    
    wavesurfer.on('play', () => {
      setIsPlaying(true);
    });
    
    wavesurfer.on('pause', () => {
      setIsPlaying(false);
    });
    
    wavesurfer.on('audioprocess', () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });
    
    wavesurfer.on('seek', () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });
    
    wavesurfer.on('error', (err) => {
      setError('Error loading audio: ' + err);
      setIsLoading(false);
    });
    
    // Clean up
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [audioUrl]);

  // Handle play/pause
  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(newVolume);
    }
  };

  // Seek to position
  const handleSeek = (e) => {
    const seekPos = e.target.value / 100;
    
    if (wavesurferRef.current) {
      wavesurferRef.current.seekTo(seekPos);
    }
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="card" ref={containerRef}>
      {error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <>
          {/* Waveform */}
          <div className="waveform mb-4 rounded-md overflow-hidden" ref={waveformRef}>
            {isLoading && (
              <div className="flex justify-center items-center h-20 bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            
            {/* Time Display */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{formatDuration(currentTime)}</span>
              <span className="text-sm text-gray-500">/</span>
              <span className="text-sm text-gray-500">{formatDuration(duration)}</span>
            </div>
            
            {/* Volume Control */}
            <div className="flex items-center space-x-2 ml-auto">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 9.536a3 3 0 010 4.928m-3-7.072v4.928m6-7.072l-6-6v4h-3v6h3v4l6-6z" />
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          
          {/* Encryption Badge */}
          {encrypted && (
            <div className="mt-2 flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs text-gray-500">End-to-end encrypted audio</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AudioPlayer;