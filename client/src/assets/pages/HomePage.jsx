import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Secure Voice Snippets</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Record, store, and share voice snippets with end-to-end encryption.
          Your voice messages, secure by design.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary text-lg px-8 py-3">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="rounded-full bg-primary-100 p-4 inline-flex mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Recording</h3>
            <p className="text-gray-600">
              Record voice snippets directly in your browser with a simple, intuitive interface.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="rounded-full bg-primary-100 p-4 inline-flex mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">End-to-End Encryption</h3>
            <p className="text-gray-600">
              Your voice recordings are encrypted before leaving your device, ensuring only you and your intended recipients can access them.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="rounded-full bg-primary-100 p-4 inline-flex mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Sharing</h3>
            <p className="text-gray-600">
              Share your voice snippets with secure, expiring links that you control.
            </p>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 007.072 0m-9.9-2.828a9 9 0 0112.728 0M12 19.5v2m0-22v2" />
                </svg>
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-4">1. Record Your Voice</h3>
              <p className="text-gray-600 mb-4">
                Use our simple recording interface to capture your voice snippet. You can pause, resume, and re-record until you're satisfied with the result.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row-reverse items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pl-8">
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-4">2. Automatic Encryption</h3>
              <p className="text-gray-600 mb-4">
                Your audio is automatically encrypted with AES-256 encryption before it's uploaded to our servers. No one, not even us, can access your original recordings.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-4">3. Share Securely</h3>
              <p className="text-gray-600 mb-4">
                Generate secure, time-limited links to share your snippets with others. You control how long the links remain active, and you can revoke access at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-12 bg-primary-50 rounded-lg text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join SecureVoice Snippet today and start sharing your voice with confidence.
        </p>
        
        {isAuthenticated ? (
          <Link to="/record" className="btn btn-primary text-lg px-8 py-3">
            Record Your First Snippet
          </Link>
        ) : (
          <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
            Create Free Account
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;