import React, { useState } from 'react';
import { useSnippets } from '../context/SnippetContext';

const ShareLink = ({ snippetId, onClose }) => {
  const [expiresIn, setExpiresIn] = useState('7d');
  const [shareLink, setShareLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { createShareLink } = useSnippets();
  
  // Generate share link
  const generateLink = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const data = await createShareLink(snippetId, expiresIn);
      
      // Construct full URL for sharing
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/share/${data.shareId}`;
      
      setShareLink(shareUrl);
    } catch (err) {
      setError('Failed to generate share link: ' + (err.response?.data?.message || err.message));
      console.error('Error creating share link:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Share Snippet</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="expiration" className="form-label">Link Expiration</label>
        <select
          id="expiration"
          value={expiresIn}
          onChange={(e) => setExpiresIn(e.target.value)}
          className="form-input"
          disabled={isLoading}
        >
          <option value="1h">1 hour</option>
          <option value="24h">24 hours</option>
          <option value="7d">7 days</option>
          <option value="30d">30 days</option>
          <option value="never">Never expires</option>
        </select>
      </div>
      
      {!shareLink ? (
        <button
          onClick={generateLink}
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating link...
            </div>
          ) : (
            <>
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Generate Share Link
            </>
          )}
        </button>
      ) : (
        <div>
          <div className="flex mb-4">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="form-input rounded-r-none flex-1"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-md flex items-center"
            >
              {isCopied ? (
                <>
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-1">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-1">Copy</span>
                </>
              )}
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            {expiresIn === 'never' ? (
              <span>This link will never expire.</span>
            ) : (
              <span>This link will expire after {expiresIn.replace('h', ' hour').replace('d', ' day').replace('s', 's')}.</span>
            )}
          </div>
          
          <button
            onClick={generateLink}
            className="mt-4 btn btn-secondary w-full"
          >
            Generate New Link
          </button>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <div className="flex items-start">
          <svg className="w-4 h-4 text-primary-500 mt-0.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Anyone with this link can access your snippet until the link expires.</span>
        </div>
      </div>
    </div>
  );
};

export default ShareLink;