import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Proof: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      {/* Top Nav */}
      <nav className="h-16 bg-white border-b border-gray-300 flex items-center justify-between px-10">
        <div className="flex items-center gap-8">
          <span className="font-serif font-bold text-xl text-[#8B0000]">AI Resume Builder</span>
          <div className="flex gap-6 text-sm">
            <button onClick={() => navigate('/builder')} className="text-gray-500 hover:text-gray-900">Builder</button>
            <button onClick={() => navigate('/preview')} className="text-gray-500 hover:text-gray-900">Preview</button>
            <button onClick={() => navigate('/proof')} className="text-gray-900 font-medium border-b-2 border-[#8B0000] pb-1">Proof</button>
          </div>
        </div>
      </nav>

      {/* Proof Content */}
      <div className="p-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Proof of Work</h1>
          <p className="text-gray-600 mb-12 font-serif italic">
            Artifacts and validation for the AI Resume Builder project.
          </p>

          {/* Placeholder Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-300 p-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                Resume Data
              </h3>
              <p className="text-sm text-gray-700">
                Placeholder for resume data artifacts
              </p>
            </div>

            <div className="bg-white border border-gray-300 p-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                Export History
              </h3>
              <p className="text-sm text-gray-700">
                Placeholder for export history
              </p>
            </div>

            <div className="bg-white border border-gray-300 p-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                ATS Score
              </h3>
              <p className="text-sm text-gray-700">
                Placeholder for ATS scoring (not implemented yet)
              </p>
            </div>

            <div className="bg-white border border-gray-300 p-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                Build Artifacts
              </h3>
              <p className="text-sm text-gray-700">
                Placeholder for build artifacts
              </p>
            </div>
          </div>

          <div className="mt-12 p-8 bg-white border border-gray-300">
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">
              Project Status
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>Builder Interface</span>
                <span className="text-[#8B0000] font-bold">COMPLETE</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>Live Preview</span>
                <span className="text-[#8B0000] font-bold">COMPLETE</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>ATS Scoring</span>
                <span className="text-gray-400 font-bold">PENDING</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>Export Functionality</span>
                <span className="text-gray-400 font-bold">PENDING</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
