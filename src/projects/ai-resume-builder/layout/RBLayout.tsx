import React from 'react';
import { Outlet, useLocation, matchPath } from 'react-router-dom';
import { RB_STEPS, STORAGE_PREFIX } from '../config';

export const RBLayout: React.FC = () => {
  const location = useLocation();
  
  // Extract current step from URL
  // We use a flexible match to catch the step slug
  const match = matchPath({ path: '/rb/:stepSlug', end: false }, location.pathname);
  const stepSlug = match?.params.stepSlug;
  const currentStep = RB_STEPS.find(s => s.slug === stepSlug);
  const isProofPage = location.pathname.endsWith('/proof');

  // Calculate Status
  const getStatus = () => {
    if (isProofPage) return 'Proofing';
    if (!currentStep) return 'Unknown';
    const artifact = localStorage.getItem(`${STORAGE_PREFIX}${currentStep.id}_artifact`);
    return artifact && artifact.length > 10 ? 'Completed' : 'In Progress';
  };

  const status = getStatus();

  return (
    <div className="flex flex-col h-screen bg-[#F7F6F3] text-gray-900 font-sans overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 bg-[#F7F6F3] border-b border-gray-300 flex items-center justify-between px-10 shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-serif font-bold text-xl tracking-tight text-[#8B0000]">AI Resume Builder</span>
          <span className="text-gray-400">|</span>
          <span className="text-sm font-medium text-gray-600">Build Track</span>
        </div>
        
        <div className="text-sm font-serif text-gray-500 italic">
          {isProofPage ? 'Final Validation' : `Project 3 — Step ${currentStep?.id || 0} of 8`}
        </div>

        <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${
          status === 'Completed' ? 'bg-gray-200 text-gray-800 border-gray-400' : 
          status === 'Proofing' ? 'bg-[#8B0000] text-white border-[#8B0000]' :
          'bg-white text-[#8B0000] border-[#8B0000]'
        }`}>
          {status}
        </div>
      </header>

      {/* Context Header */}
      {!isProofPage && currentStep && (
        <div className="h-10 bg-[#F7F6F3] border-b border-gray-200 flex items-center px-10 text-xs shrink-0">
          <span className="text-gray-500 uppercase font-bold tracking-wider mr-3">Context:</span>
          <span className="text-[#8B0000] font-serif font-medium italic">{currentStep.title}</span>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        <Outlet />
      </div>

      {/* Proof Footer */}
      <footer className="h-10 bg-[#F7F6F3] border-t border-gray-300 flex items-center justify-center text-[10px] text-gray-400 uppercase tracking-widest shrink-0">
        KodNest Premium Build System • Project 3 • AI Resume Builder
      </footer>
    </div>
  );
};
