import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSnippets } from '../context/SnippetContext';
import SnippetList from './SnippetList';

const Dashboard = () => {
  const { snippets, loading, error, fetchSnippets } = useSnippets();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  const filteredSnippets = filter === 'all' 
    ? snippets 
    : snippets.filter(snippet => {
        if (filter === 'recent') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return new Date(snippet.createdAt) > oneWeekAgo;
        }
        return true;
      });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Voice Snippets</h1>
        <Link to="/record" className="btn btn-primary flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Record New
        </Link>
      </div>

      {/* Filter Controls */}
      <div className="flex space-x-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('recent')}
          className={`px-3 py-1 rounded-md ${filter === 'recent' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
        >
          Recent (7 days)
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredSnippets.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">No snippets found</div>
          <Link to="/record" className="btn btn-primary">
            Record your first snippet
          </Link>
        </div>
      ) : (
        <SnippetList snippets={filteredSnippets} />
      )}
    </div>
  );
};

export default Dashboard;