import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-6xl font-serif font-bold text-gray-900 mb-8 leading-tight">
          Build a Resume That Gets Read.
        </h1>
        <p className="text-xl text-gray-600 mb-16 font-serif italic leading-relaxed">
          Create a professional resume with live preview and premium formatting.
        </p>
        <button
          onClick={() => navigate('/builder')}
          className="px-16 py-5 bg-[#8B0000] hover:bg-[#660000] text-white font-serif font-bold text-lg tracking-wide transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Start Building
        </button>
      </div>
    </div>
  );
};
