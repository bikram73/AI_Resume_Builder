import React, { useState } from 'react';
import { RB_STEPS, STORAGE_PREFIX } from '../config';

export const RBProofPage: React.FC = () => {
  const [links, setLinks] = useState({ lovable: '', github: '', deploy: '' });

  const getStepStatus = (id: number) => {
    const artifact = localStorage.getItem(`${STORAGE_PREFIX}${id}_artifact`);
    return artifact && artifact.length > 10;
  };

  const allComplete = RB_STEPS.every(s => getStepStatus(s.id));

  const handleCopy = () => {
    const text = `
Project: AI Resume Builder (Build Track)
----------------------------------------
Lovable Link: ${links.lovable}
GitHub Repo:  ${links.github}
Deployment:   ${links.deploy}
----------------------------------------
Status: ${allComplete ? 'COMPLETE' : 'INCOMPLETE'}
    `.trim();
    navigator.clipboard.writeText(text);
    alert('Submission copied to clipboard!');
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#F7F6F3] p-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Proof of Work</h1>
        <p className="text-gray-600 mb-12 font-serif italic">Verify all build steps are complete and submit your project links.</p>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {RB_STEPS.map((step) => {
            const isDone = getStepStatus(step.id);
            return (
              <div 
                key={step.id} 
                className={`p-6 border flex items-center justify-between transition-colors bg-white ${
                  isDone 
                    ? 'border-gray-200' 
                    : 'border-[#8B0000]/30'
                }`}
              >
                <div>
                  <span className="text-xs font-bold tracking-widest text-gray-400 block mb-1 uppercase">{step.slug}</span>
                  <span className="text-gray-900 font-serif font-medium text-lg">{step.title}</span>
                </div>
                <div className={`px-3 py-1 text-xs font-bold tracking-widest uppercase ${
                  isDone ? 'bg-gray-100 text-gray-600' : 'bg-[#8B0000] text-white'
                }`}>
                  {isDone ? 'PASS' : 'MISSING'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submission Form */}
        <div className="bg-white border border-gray-200 p-10 mb-10 shadow-sm">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8">Final Submission Links</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Lovable Project Link</label>
              <input 
                type="text" 
                placeholder="https://lovable.dev/..."
                className="w-full bg-[#F7F6F3] border border-gray-300 p-4 text-gray-900 focus:border-[#8B0000] focus:outline-none transition-colors font-mono text-sm"
                value={links.lovable}
                onChange={e => setLinks({...links, lovable: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">GitHub Repository</label>
              <input 
                type="text" 
                placeholder="https://github.com/..."
                className="w-full bg-[#F7F6F3] border border-gray-300 p-4 text-gray-900 focus:border-[#8B0000] focus:outline-none transition-colors font-mono text-sm"
                value={links.github}
                onChange={e => setLinks({...links, github: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Live Deployment URL</label>
              <input 
                type="text" 
                placeholder="https://..."
                className="w-full bg-[#F7F6F3] border border-gray-300 p-4 text-gray-900 focus:border-[#8B0000] focus:outline-none transition-colors font-mono text-sm"
                value={links.deploy}
                onChange={e => setLinks({...links, deploy: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Final Action */}
        <div className="flex justify-end pb-10">
          <button
            onClick={handleCopy}
            disabled={!allComplete}
            className={`px-10 py-4 font-serif font-bold text-lg shadow-lg transition-all ${
              allComplete 
                ? 'bg-[#8B0000] hover:bg-[#660000] text-white transform hover:-translate-y-1' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {allComplete ? 'Copy Final Submission' : 'Complete All Steps First'}
          </button>
        </div>
      </div>
    </div>
  );
};
