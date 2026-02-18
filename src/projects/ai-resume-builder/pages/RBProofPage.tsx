import React, { useEffect, useMemo, useState } from 'react';
import { RB_STEPS, STORAGE_PREFIX } from '../config';

export const RBProofPage: React.FC = () => {
  const [links, setLinks] = useState({ lovable: '', github: '', deploy: '' });
  const [copied, setCopied] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('rb_final_submission');
      if (raw) {
        const parsed = JSON.parse(raw);
        setLinks({
          lovable: parsed?.lovable || '',
          github: parsed?.github || '',
          deploy: parsed?.deploy || ''
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('rb_final_submission', JSON.stringify(links)); } catch {}
  }, [links]);

  const getStepStatus = (id: number) => {
    const artifact = localStorage.getItem(`${STORAGE_PREFIX}${id}_artifact`);
    return artifact && artifact.length > 10;
  };

  const allComplete = RB_STEPS.every(s => getStepStatus(s.id));

  // simple URL validation
  const isUrl = (v: string) => /^https?:\/\//i.test(v.trim());
  const allProofLinks = isUrl(links.lovable) && isUrl(links.github) && isUrl(links.deploy);

  // checklist tests (10) passed flag from localStorage (external system sets), default false if missing
  const checklistPassed = (() => {
    try {
      const raw = localStorage.getItem('rb_checklist_results');
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return parsed?.total === 10 && parsed?.passed === 10;
    } catch { return false; }
  })();

  const shipped = useMemo(() => allComplete && checklistPassed && allProofLinks, [allComplete, checklistPassed, allProofLinks]);

  const handleCopy = () => {
    const text = `
------------------------------------------
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
------------------------------------------
`.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(()=>setCopied(false), 1800);
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#F7F6F3] p-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Proof of Work</h1>
        <p className="text-gray-600 mb-12 font-serif italic">Verify all build steps are complete and submit your project links.</p>

        {/* Step Completion Overview */}
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

        {/* Artifact Collection (Required to mark Shipped) */}
        <div className="bg-white border border-gray-200 p-10 mb-10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-serif font-bold text-gray-900">Final Submission Links</h3>
            <div className={`text-xs font-bold uppercase tracking-widest px-3 py-1 ${shipped ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {shipped ? 'Shipped' : 'In Progress'}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Lovable Project Link</label>
              <input 
                type="text" 
                placeholder="https://lovable.dev/..."
                className={`w-full bg-[#F7F6F3] border p-4 text-gray-900 focus:outline-none transition-colors font-mono text-sm ${isUrl(links.lovable)?'border-gray-300 focus:border-[#8B0000]':'border-red-300 focus:border-red-500'}`}
                value={links.lovable}
                onChange={e => setLinks({...links, lovable: e.target.value})}
              />
              {!isUrl(links.lovable) && links.lovable.trim() !== '' && (
                <div className="text-[11px] text-red-600 mt-1">Enter a valid URL starting with http or https.</div>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">GitHub Repository</label>
              <input 
                type="text" 
                placeholder="https://github.com/..."
                className={`w-full bg-[#F7F6F3] border p-4 text-gray-900 focus:outline-none transition-colors font-mono text-sm ${isUrl(links.github)?'border-gray-300 focus:border-[#8B0000]':'border-red-300 focus:border-red-500'}`}
                value={links.github}
                onChange={e => setLinks({...links, github: e.target.value})}
              />
              {!isUrl(links.github) && links.github.trim() !== '' && (
                <div className="text-[11px] text-red-600 mt-1">Enter a valid URL starting with http or https.</div>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Live Deployment URL</label>
              <input 
                type="text" 
                placeholder="https://..."
                className={`w-full bg-[#F7F6F3] border p-4 text-gray-900 focus:outline-none transition-colors font-mono text-sm ${isUrl(links.deploy)?'border-gray-300 focus:border-[#8B0000]':'border-red-300 focus:border-red-500'}`}
                value={links.deploy}
                onChange={e => setLinks({...links, deploy: e.target.value})}
              />
              {!isUrl(links.deploy) && links.deploy.trim() !== '' && (
                <div className="text-[11px] text-red-600 mt-1">Enter a valid URL starting with http or https.</div>
              )}
            </div>
          </div>
        </div>

        {/* Final Submission Export */}
        <div className="flex items-center justify-between pb-10">
          <div className="text-[12px] text-gray-600">
            {shipped ? 'Project 3 Shipped Successfully.' : 'Provide all proof links and complete all steps/checks to ship.'}
          </div>
          <button
            onClick={handleCopy}
            disabled={!shipped}
            className={`px-10 py-4 font-serif font-bold text-lg shadow-lg transition-all ${
              shipped 
                ? 'bg-[#8B0000] hover:bg-[#660000] text-white transform hover:-translate-y-1' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {shipped ? (copied ? 'Copied!' : 'Copy Final Submission') : 'Awaiting Completion'}
          </button>
        </div>
      </div>
    </div>
  );
};
