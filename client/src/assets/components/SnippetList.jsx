import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { formatDuration } from '../utils/formatters';

const SnippetList = ({ snippets, onDelete }) => {
  return (
    <div className="space-y-4">
      {snippets.map((snippet) => (
        <div key={snippet._id} className="card hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row md:items-center">
            {/* Title and description */}
            <div className="flex-1">
              <Link to={`/snippet/${snippet._id}`} className="block">
                <h3 className="text-xl font-semibold text-primary-700 hover:text-primary-500">
                  {snippet.title}
                </h3>
                {snippet.description && (
                  <p className="text-gray-600 mt-1">{snippet.description}</p>
                )}
                
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <div className="flex items-center mr-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatDuration(snippet.duration)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{format(new Date(snippet.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Actions */}
            <div className="flex mt-4 md:mt-0">
              <Link 
                to={`/snippet/${snippet._id}`} 
                className="btn btn-secondary flex items-center mr-2"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Play
              </Link>
              
              {onDelete && (
                <button 
                  onClick={() => onDelete(snippet._id)}
                  className="btn btn-secondary flex items-center bg-red-100 hover:bg-red-200 text-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Encryption badge */}
          {snippet.encrypted && (
            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Encrypted
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SnippetList;