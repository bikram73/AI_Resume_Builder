import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F6F3] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 tracking-tight">
          Build a Resume That Gets Read.
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl font-serif italic">
          Create a professional, ATS-friendly resume in minutes with our premium builder.
        </p>
        <Link to="/builder" className="px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all shadow-lg">
          Start Building
        </Link>
      </main>
    </div>
  );
};