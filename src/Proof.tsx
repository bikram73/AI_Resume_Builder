import React from 'react';
import { Navbar } from '../components/Navbar';

export const Proof: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F6F3] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-10">
        <div className="bg-white p-10 shadow-lg border border-gray-200 max-w-2xl w-full text-center">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Proof of Work</h1>
          <p className="text-gray-600 mb-8">
            This area is reserved for final artifacts and deployment verification.
          </p>
          <div className="p-6 bg-gray-50 border border-dashed border-gray-300 rounded text-gray-400">
            Artifact Placeholder
          </div>
        </div>
      </main>
    </div>
  );
};