import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RB_STEPS, STORAGE_PREFIX } from '../config';

export const RBStepPage: React.FC = () => {
  const { stepSlug } = useParams();
  const navigate = useNavigate();
  
  const stepIndex = RB_STEPS.findIndex(s => s.slug === stepSlug);
  const step = RB_STEPS[stepIndex];
  const nextStep = RB_STEPS[stepIndex + 1];

  const [artifact, setArtifact] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // 1. Load saved artifact
  useEffect(() => {
    if (step) {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}${step.id}_artifact`);
      setArtifact(saved || '');
      setFeedback(null);
    }
  }, [step]);

  // 2. Gating Logic: Redirect if previous step is missing
  useEffect(() => {
    if (stepIndex > 0) {
      const prevStepId = RB_STEPS[stepIndex - 1].id;
      const prevArtifact = localStorage.getItem(`${STORAGE_PREFIX}${prevStepId}_artifact`);
      if (!prevArtifact || prevArtifact.length < 5) {
        navigate(`/rb/${RB_STEPS[stepIndex - 1].slug}`);
      }
    }
  }, [stepIndex, navigate]);

  const handleSave = (val: string) => {
    setArtifact(val);
    if (step) {
      localStorage.setItem(`${STORAGE_PREFIX}${step.id}_artifact`, val);
    }
  };

  const handleNext = () => {
    if (nextStep) {
      navigate(`/rb/${nextStep.slug}`);
    } else {
      navigate('/rb/proof');
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(step?.prompt || '');
    setFeedback('copied');
    setTimeout(() => setFeedback(null), 2000);
  };

  if (!step) return <div className="p-10 text-white">Step not found.</div>;

  return (
    <div className="flex w-full h-full bg-[#F7F6F3]">
      {/* Main Workspace (70%) */}
      <div className="w-[70%] flex flex-col border-r border-gray-300">
        <div className="p-10 flex-1 flex flex-col overflow-hidden">
          <div className="shrink-0 mb-6">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">{step.title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
              Paste your build artifact, code, or architecture JSON below to proceed.
            </p>
          </div>

          <textarea
            value={artifact}
            onChange={(e) => handleSave(e.target.value)}
            placeholder="// Paste artifact here..."
            className="flex-1 w-full bg-white border border-gray-300 rounded-none p-6 text-gray-800 font-mono text-sm focus:outline-none focus:border-[#8B0000] resize-none shadow-sm"
          />
        </div>

        <div className="p-6 border-t border-gray-300 bg-[#F7F6F3] flex justify-end">
          <button
            onClick={handleNext}
            disabled={!artifact || artifact.length < 10}
            className={`px-8 py-3 rounded-none font-serif font-bold tracking-wide transition-all ${
              !artifact || artifact.length < 10
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#8B0000] hover:bg-[#660000] text-white shadow-md'
            }`}
          >
            {nextStep ? 'Next Step →' : 'Finish & Proof →'}
          </button>
        </div>
      </div>

      {/* Secondary Build Panel (30%) */}
      <div className="w-[30%] bg-white flex flex-col border-l border-gray-300">
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Copy This Into Lovable
              </label>
              {feedback === 'copied' && <span className="text-xs text-green-400">Copied!</span>}
            </div>
            <div className="relative group">
              <textarea
                readOnly
                value={step.prompt}
                className="w-full h-64 bg-[#F7F6F3] border border-gray-200 p-4 text-sm text-gray-700 resize-none focus:outline-none font-serif leading-relaxed"
              />
              <button
                onClick={copyPrompt}
                className="absolute bottom-3 right-3 bg-white border border-gray-300 hover:border-[#8B0000] text-gray-600 hover:text-[#8B0000] text-xs px-3 py-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all uppercase font-bold tracking-wider"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="mb-10">
            <a
              href="https://lovable.dev" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center w-full py-4 border-2 border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white font-bold tracking-widest uppercase text-xs transition-colors"
            >
              Build in Lovable ↗
            </a>
          </div>
        </div>

        {/* Feedback Footer */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4 text-center">
            Build Status Feedback
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setFeedback('worked')}
              className={`py-2 text-xs font-bold border transition-colors ${
                feedback === 'worked' ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 text-gray-500 hover:border-gray-400'
              }`}
            >
              It Worked
            </button>
            <button 
              onClick={() => setFeedback('error')}
              className={`py-2 text-xs font-bold border transition-colors ${
                feedback === 'error' ? 'bg-[#8B0000] text-white border-[#8B0000]' : 'border-gray-200 text-gray-500 hover:border-gray-400'
              }`}
            >
              Error
            </button>
            <button 
              onClick={() => setFeedback('screenshot')}
              className={`py-2 text-xs font-bold border transition-colors ${
                feedback === 'screenshot' ? 'bg-gray-200 text-gray-800 border-gray-300' : 'border-gray-200 text-gray-500 hover:border-gray-400'
              }`}
            >
              + Screenshot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
