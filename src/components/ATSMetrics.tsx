import React, { useMemo } from 'react';

interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  tech: string;
}

interface ATSMetricsProps {
  summary: string;
  projects: Project[];
  experience: Experience[];
  skills: string;
  links: { github: string; linkedin: string };
  education: Education[];
}

export const ATSMetrics: React.FC<ATSMetricsProps> = ({ 
  summary, projects, experience, skills, links, education 
}) => {
  const scoreInfo = useMemo(() => {
    let score = 0;
    const suggestions: string[] = [];

    // Summary 40-120 words => +15
    const summaryWordCount = summary ? summary.trim().split(/\s+/).filter(Boolean).length : 0;
    const hasGoodSummary = summaryWordCount >= 40 && summaryWordCount <= 120;
    if (hasGoodSummary) score += 15;
    else if (summaryWordCount < 40) suggestions.push('Write a stronger summary (40–120 words).');

    // Projects >= 2 => +10
    const projectCount = projects.filter(p => p.name || p.description).length;
    if (projectCount >= 2) score += 10;
    else suggestions.push('Add at least 2 projects.');

    // Experience >= 1 => +10
    const experienceCount = experience.filter(e => e.company || e.role || e.description).length;
    if (experienceCount >= 1) score += 10;
    else suggestions.push('Add at least 1 experience entry.');

    // Skills >= 8 items => +10
    const skillsItems = skills.split(',').map(s => s.trim()).filter(Boolean);
    if (skillsItems.length >= 8) score += 10;
    else suggestions.push('Add more skills (target 8+).');

    // Links include GitHub or LinkedIn => +10
    const hasSocial = Boolean(links.github?.trim()) || Boolean(links.linkedin?.trim());
    if (hasSocial) score += 10;
    else suggestions.push('Add GitHub or LinkedIn link.');

    // Any number in experience/project bullets => +15
    const textBlobs = [
      ...experience.map(e => `${e.description}`),
      ...projects.map(p => `${p.description}`),
    ].join(' \n ');
    const hasNumbers = /([0-9]+|%|k|K|m|M|x|X)/.test(textBlobs);
    if (hasNumbers) score += 15;
    else suggestions.push('Add measurable impact (numbers) in bullets.');

    // Education completeness => +10
    const hasCompleteEducation = education.some(e => e.school && e.degree && e.year);
    if (hasCompleteEducation) score += 10;
    else suggestions.push('Complete education with school, degree, and year.');

    if (score > 100) score = 100;

    return { score, suggestions: suggestions.slice(0, 3) };
  }, [summary, projects, experience, skills, links, education]);

  // Top 3 Improvements
  const improvements = useMemo(() => {
    const list: string[] = [];
    const projectCount = projects.filter(p => p.name || p.description).length;
    const hasNumbers = /([0-9]+|%|k|K|m|M|x|X)/.test([
      ...experience.map(e => e.description),
      ...projects.map(p => p.description),
    ].join(' '));
    const summaryWordCount = summary ? summary.trim().split(/\s+/).filter(Boolean).length : 0;
    const skillsItems = skills.split(',').map(s => s.trim()).filter(Boolean);
    const experienceCount = experience.filter(e => e.company || e.role || e.description).length;

    if (projectCount < 2) list.push('Add at least 2 projects to showcase your work.');
    if (!hasNumbers) list.push('Add measurable impact with numbers (%, X, k) in your bullets.');
    if (summaryWordCount < 40) list.push('Expand your summary to 40–120 words.');
    if (skillsItems.length < 8) list.push('Add more skills to reach at least 8 items.');
    if (experienceCount === 0) list.push('Add internship or project work experience.');

    return list.slice(0, 3);
  }, [summary, projects, experience, skills]);

  const pct = scoreInfo.score;

  return (
    <div className="bg-[#F7F6F3] border border-gray-300 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600">ATS Readiness Score</h3>
        <span className="text-2xl font-serif font-bold text-gray-900">{pct}/100</span>
      </div>
      
      {/* Score Bar */}
      <div className="w-full h-2 bg-gray-200 mb-6">
        <div 
          className="h-full bg-[#8B0000] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Suggestions */}
      {scoreInfo.suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Suggestions</h4>
          {scoreInfo.suggestions.map((s, i) => (
            <div key={i} className="text-xs text-gray-700 leading-relaxed">• {s}</div>
          ))}
        </div>
      )}

      {/* Top 3 Improvements */}
      {improvements.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-300">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Top 3 Improvements</h4>
          <div className="space-y-2">
            {improvements.map((imp, i) => (
              <div key={i} className="text-xs text-gray-700 leading-relaxed">
                {i + 1}. {imp}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
