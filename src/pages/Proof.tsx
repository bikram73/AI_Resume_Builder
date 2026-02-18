import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Proof: React.FC = () => {
  const navigate = useNavigate();

  // Load submission links from localStorage
  const [links, setLinks] = useState({ lovable: '', github: '', deploy: '' });
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rb_final_submission');
      if (saved) {
        const parsed = JSON.parse(saved);
        setLinks(parsed);
      }
    } catch {}
  }, []);

  // Persist links
  useEffect(() => {
    try {
      localStorage.setItem('rb_final_submission', JSON.stringify(links));
    } catch {}
  }, [links]);

  // 10-item test checklist (stored in localStorage)
  const [checklist, setChecklist] = useState<boolean[]>(Array(10).fill(false));
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rb_test_checklist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 10) {
          setChecklist(parsed);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('rb_test_checklist', JSON.stringify(checklist));
    } catch {}
  }, [checklist]);

  const toggleCheck = (idx: number) => {
    const updated = [...checklist];
    updated[idx] = !updated[idx];
    setChecklist(updated);
  };

  const checklistItems = [
    'All form sections save to localStorage',
    'Live preview updates in real-time',
    'Template switching preserves data',
    'Color theme persists after refresh',
    'ATS score calculates correctly',
    'Score updates live on edit',
    'Export buttons work (copy/download)',
    'Empty states handled gracefully',
    'Mobile responsive layout works',
    'No console errors on any page'
  ];

  // URL validation
  const isValidUrl = (str: string) => {
    if (!str || str.trim().length === 0) return false;
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const allLinksValid = isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deploy);
  const allChecksPassed = checklist.every(c => c);
  
  // Shipped status
  const isShipped = allLinksValid && allChecksPassed;

  const handleCopySubmission = () => {
    const text = `------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deploy}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------`;
    
    navigator.clipboard.writeText(text);
    alert('Final submission copied to clipboard!');
  };

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
        
        {/* Status Badge */}
        <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
          isShipped 
            ? 'bg-[#8B0000] text-white' 
            : 'bg-gray-200 text-gray-600'
        }`}>
          {isShipped ? 'SHIPPED' : 'IN PROGRESS'}
        </div>
      </nav>

      {/* Proof Content */}
      <div className="p-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Proof of Work</h1>
          <p className="text-gray-600 mb-12 font-serif italic">
            Complete the checklist and provide deployment links to mark this project as shipped.
          </p>

          {/* Shipped Confirmation */}
          {isShipped && (
            <div className="mb-8 p-6 bg-[#8B0000] text-white">
              <div className="text-lg font-serif font-bold">Project 3 Shipped Successfully.</div>
              <div className="text-sm mt-1">All requirements met. Ready for submission.</div>
            </div>
          )}

          {/* Test Checklist (10 items) */}
          <div className="mb-10 bg-white border border-gray-300 p-8">
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-6">Test Checklist (10 Items)</h3>
            <div className="space-y-3">
              {checklistItems.map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checklist[idx]}
                    onChange={() => toggleCheck(idx)}
                    className="w-5 h-5 accent-[#8B0000]"
                  />
                  <span className={`text-sm ${checklist[idx] ? 'text-gray-900 line-through' : 'text-gray-700'}`}>
                    {item}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Progress: {checklist.filter(c => c).length} / 10 tests passed
              </div>
            </div>
          </div>

          {/* Artifact Collection */}
          <div className="mb-10 bg-white border border-gray-300 p-8">
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-6">Deployment Links (Required)</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Lovable Project Link
                </label>
                <input 
                  type="url" 
                  placeholder="https://lovable.dev/..."
                  className={`w-full bg-[#F7F6F3] border p-4 text-gray-900 focus:outline-none transition-colors ${
                    links.lovable && !isValidUrl(links.lovable) 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-[#8B0000]'
                  }`}
                  value={links.lovable}
                  onChange={e => setLinks({...links, lovable: e.target.value})}
                />
                {links.lovable && !isValidUrl(links.lovable) && (
                  <div className="text-xs text-red-600 mt-1">Please enter a valid URL</div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  GitHub Repository
                </label>
                <input 
                  type="url" 
                  placeholder="https://github.com/..."
                  className={`w-full bg-[#F7F6F3] border p-4 text-gray-900 focus:outline-none transition-colors ${
                    links.github && !isValidUrl(links.github) 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-[#8B0000]'
                  }`}
                  value={links.github}
                  onChange={e => setLinks({...links, github: e.target.value})}
                />
                {links.github && !isValidUrl(links.github) && (
                  <div className="text-xs text-red-600 mt-1">Please enter a valid URL</div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Live Deployment URL
                </label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  className={`w-full bg-[#F7F6F3] border p-4 text-gray-900 focus:outline-none transition-colors ${
                    links.deploy && !isValidUrl(links.deploy) 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-[#8B0000]'
                  }`}
                  value={links.deploy}
                  onChange={e => setLinks({...links, deploy: e.target.value})}
                />
                {links.deploy && !isValidUrl(links.deploy) && (
                  <div className="text-xs text-red-600 mt-1">Please enter a valid URL</div>
                )}
              </div>
            </div>
          </div>

          {/* Final Submission */}
          <div className="flex justify-end">
            <button
              onClick={handleCopySubmission}
              disabled={!isShipped}
              className={`px-10 py-4 font-serif font-bold text-lg shadow-lg transition-all ${
                isShipped 
                  ? 'bg-[#8B0000] hover:bg-[#660000] text-white transform hover:-translate-y-1' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isShipped ? 'Copy Final Submission' : 'Complete All Requirements First'}
            </button>
          </div>

          {!isShipped && (
            <div className="mt-6 text-center text-sm text-gray-600">
              {!allChecksPassed && <div>✓ Complete all 10 test checklist items</div>}
              {!allLinksValid && <div>✓ Provide all 3 valid deployment links</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
