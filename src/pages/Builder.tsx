import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
}

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

export const Builder: React.FC = () => {
  const navigate = useNavigate();

  // Load persisted state on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('resumeBuilderData');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.personalInfo) setPersonalInfo(data.personalInfo);
        if (typeof data.summary === 'string') setSummary(data.summary);
        if (Array.isArray(data.education)) setEducation(data.education);
        if (Array.isArray(data.experience)) setExperience(data.experience);
        if (Array.isArray(data.projects)) setProjects(data.projects);
        if (typeof data.skills === 'string') setSkills(data.skills);
        if (data.links) setLinks(data.links);
      }
    } catch {}
  }, []);
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    email: '',
    phone: '',
    location: ''
  });
  
  const [summary, setSummary] = useState('');
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState('');
  const [links, setLinks] = useState({ github: '', linkedin: '' });

  // Persist to localStorage whenever any part changes
  useEffect(() => {
    const payload = {
      personalInfo,
      summary,
      education,
      experience,
      projects,
      skills,
      links,
    };
    try {
      localStorage.setItem('resumeBuilderData', JSON.stringify(payload));
    } catch {}
  }, [personalInfo, summary, education, experience, projects, skills, links]);

  const loadSampleData = () => {
    setPersonalInfo({
      name: 'Jane Doe',
      email: 'jane.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA'
    });
    setSummary('Experienced software engineer with 5+ years building scalable web applications. Passionate about clean code and user experience. Skilled in React, TypeScript, and cloud-native architectures with a track record of delivering measurable impact in performance and reliability.');
    setEducation([
      { id: '1', school: 'Stanford University', degree: 'BS Computer Science', year: '2018' }
    ]);
    setExperience([
      { 
        id: '1', 
        company: 'Tech Corp', 
        role: 'Senior Software Engineer', 
        duration: '2020 - Present',
        description: 'Led development of microservices architecture serving 1M+ users; improved latency by 35% and reduced costs by 20%.'
      }
    ]);
    setProjects([
      { id: '1', name: 'AI Resume Builder', description: 'Built premium resume builder with live preview and ATS scoring; increased user conversion by 18%.', tech: 'React, TypeScript, Tailwind' },
      { id: '2', name: 'Analytics Dashboard', description: 'Real-time metrics with alerting; processed 2M+ events/day.', tech: 'Next.js, Node, PostgreSQL' }
    ]);
    setSkills('React, TypeScript, Node.js, Python, AWS, Docker, PostgreSQL, GraphQL');
    setLinks({ github: 'https://github.com/janedoe', linkedin: 'https://linkedin.com/in/janedoe' });
  };

  const addEducation = () => {
    setEducation([...education, { id: Date.now().toString(), school: '', degree: '', year: '' }]);
  };

  const addExperience = () => {
    setExperience([...experience, { id: Date.now().toString(), company: '', role: '', duration: '', description: '' }]);
  };

  const addProject = () => {
    setProjects([...projects, { id: Date.now().toString(), name: '', description: '', tech: '' }]);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      {/* Top Nav */}
      <nav className="h-16 bg-white border-b border-gray-300 flex items-center justify-between px-10">
        <div className="flex items-center gap-8">
          <span className="font-serif font-bold text-xl text-[#8B0000]">AI Resume Builder</span>
          <div className="flex gap-6 text-sm">
            <button onClick={() => navigate('/builder')} className="text-gray-900 font-medium border-b-2 border-[#8B0000] pb-1">Builder</button>
            <button onClick={() => navigate('/preview')} className="text-gray-500 hover:text-gray-900">Preview</button>
            <button onClick={() => navigate('/proof')} className="text-gray-500 hover:text-gray-900">Proof</button>
          </div>
        </div>
        <button
          onClick={loadSampleData}
          className="px-4 py-2 border border-gray-300 text-gray-600 hover:border-[#8B0000] hover:text-[#8B0000] text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Load Sample Data
        </button>
      </nav>

      {/* Two Column Layout */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left: Form */}
        <div className="w-1/2 overflow-y-auto p-10 border-r border-gray-300">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Build Your Resume</h2>

          {/* Personal Info */}
          <section className="mb-10">
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={personalInfo.name}
                onChange={e => setPersonalInfo({...personalInfo, name: e.target.value})}
                className="w-full bg-white border border-gray-300 p-3 text-gray-900 focus:border-[#8B0000] focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={personalInfo.email}
                onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})}
                className="w-full bg-white border border-gray-300 p-3 text-gray-900 focus:border-[#8B0000] focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={personalInfo.phone}
                onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})}
                className="w-full bg-white border border-gray-300 p-3 text-gray-900 focus:border-[#8B0000] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Location"
                value={personalInfo.location}
                onChange={e => setPersonalInfo({...personalInfo, location: e.target.value})}
                className="w-full bg-white border border-gray-300 p-3 text-gray-900 focus:border-[#8B0000] focus:outline-none"
              />
            </div>
          </section>

          {/* Summary */}
          <section className="mb-10">
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Professional Summary</h3>
            <textarea
              placeholder="Brief summary of your experience and skills..."
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={4}
              className="w-full bg-white border border-gray-300 p-3 text-gray-900 focus:border-[#8B0000] focus:outline-none resize-none"
            />
          </section>

          {/* Education */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-serif font-bold text-gray-900">Education</h3>
              <button
                onClick={addEducation}
                className="text-xs font-bold uppercase tracking-wider text-[#8B0000] hover:underline"
              >
                + Add
              </button>
            </div>
            {education.map((edu, idx) => (
              <div key={edu.id} className="mb-4 p-4 bg-white border border-gray-200">
                <input
                  type="text"
                  placeholder="School"
                  value={edu.school}
                  onChange={e => {
                    const updated = [...education];
                    updated[idx].school = e.target.value;
                    setEducation(updated);
                  }}
                  className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none mb-2"
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={e => {
                    const updated = [...education];
                    updated[idx].degree = e.target.value;
                    setEducation(updated);
                  }}
                  className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none mb-2"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={edu.year}
                  onChange={e => {
                    const updated = [...education];
                    updated[idx].year = e.target.value;
                    setEducation(updated);
                  }}
                  className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none"
                />
              </div>
            ))}
          </section>

          {/* Experience */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-serif font-bold text-gray-900">Experience</h3>
              <button
                onClick={addExperience}
                className="text-xs font-bold uppercase tracking-wider text-[#8B0000] hover:underline"
              >
                + Add
              </button>
            </div>
            {experience.map((exp, idx) => (
              <div key={exp.id} className="mb-4 p-4 bg-white border border-gray-200">
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={e => {
                    const updated = [...experience];
                    updated[idx].company = e.target.value;
                    setExperience(updated);
                  }}
                  className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none mb-2"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={exp.role}
                  onChange={e => {
                    const updated = [...experience];
                    updated[idx].role = e.target.value;
                    setExperience(updated);
                  }}
                  className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none mb-2"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., 2020 - 2023)"
                  value={exp.duration}
                  onChange={e => {
                    const updated = [...experience];
                    updated[idx].duration = e.target.value;
                    setExperience(updated);
                  }}
                  className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none mb-2"
                />
                <textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={e => {
                    const updated = [...experience];
                    updated[idx].description = e.target.value;
                    setExperience(updated);
                  }}
                  rows={3}
                  className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none resize-none"
                />
              </div>
            ))}
          </section>

          {/* Projects */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-serif font-bold text-gray-900">Projects</h3>
              <button
                onClick={addProject}
                className="text-xs font-bold uppercase tracking-wider text-[#8B0000] hover:underline"
              >
                + Add
              </button>
            </div>
            {projects.map((proj, idx) => (
              <div key={proj.id} className="mb-4 p-4 bg-white border border-gray-200">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={proj.name}
                  onChange={e => {
                    const updated = [...projects];
                    updated[idx].name = e.target.value;
                    setProjects(updated);
                  }}
                  className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none mb-2"
                />
                <textarea
                  placeholder="Description"
                  value={proj.description}
                  onChange={e => {
                    const updated = [...projects];
                    updated[idx].description = e.target.value;
                    setProjects(updated);
                  }}
                  rows={2}
                  className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none resize-none mb-2"
                />
                <input
                  type="text"
                  placeholder="Technologies"
                  value={proj.tech}
                  onChange={e => {
                    const updated = [...projects];
                    updated[idx].tech = e.target.value;
                    setProjects(updated);
                  }}
                  className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none"
                />
              </div>
            ))}
          </section>

          {/* Skills */}
          <section className="mb-10">
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Skills</h3>
            <input
              type="text"
              placeholder="Comma-separated skills (e.g., React, TypeScript, Node.js)"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              className="w-full bg-white border border-gray-300 p-3 text-gray-900 focus:border-[#8B0000] focus:outline-none"
            />
          </section>

          {/* Links */}
          <section className="mb-10">
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Links</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="GitHub URL"
                value={links.github}
                onChange={e => setLinks({...links, github: e.target.value})}
                className="w-full bg-white border border-gray-300 p-3 text-gray-900 focus:border-[#8B0000] focus:outline-none"
              />
              <input
                type="text"
                placeholder="LinkedIn URL"
                value={links.linkedin}
                onChange={e => setLinks({...links, linkedin: e.target.value})}
                className="w-full bg-white border border-gray-300 p-3 text-gray-900 focus:border-[#8B0000] focus:outline-none"
              />
            </div>
          </section>
        </div>

        {/* Right: Live Preview + ATS Score */}
        <div className="w-1/2 overflow-y-auto p-10 bg-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8 text-center">Live Preview</h2>

            {/* ATS Score Card */}
            <ATSMetrics
              summary={summary}
              projects={projects}
              experience={experience}
              skills={skills}
              links={links}
              education={education}
            />
            
            {/* Resume Preview Shell */}
            <div className="bg-white border border-gray-300 p-10 shadow-sm mt-6">
              {/* Header */}
              <div className="text-center mb-8 pb-6 border-b border-gray-200">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                  {personalInfo.name || 'Your Name'}
                </h1>
                <div className="text-sm text-gray-600 space-x-2">
                  {(personalInfo.email || personalInfo.phone || personalInfo.location) ? (
                    <>
                      {personalInfo.email && <span>{personalInfo.email}</span>}
                      {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                      {personalInfo.location && <span>• {personalInfo.location}</span>}
                    </>
                  ) : (
                    <span className="text-gray-400">email@example.com • 000-000-0000 • City, ST</span>
                  )}
                </div>
              </div>

              {/* Summary */}
              {summary && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-2 border-b border-gray-300 pb-1">Summary</h2>
                  <p className="text-sm text-gray-800 leading-relaxed">{summary}</p>
                </div>
              )}

              {/* Education */}
              {education.filter(e => e.school || e.degree || e.year).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 border-b border-gray-300 pb-1">Education</h2>
                  {education.filter(e => e.school || e.degree || e.year).map(edu => (
                    <div key={edu.id} className="mb-2">
                      <div className="flex justify-between items-baseline">
                        <div>
                          {(edu.degree || edu.school) && (
                            <h3 className="font-bold text-gray-900">{edu.degree || edu.school}</h3>
                          )}
                          {edu.school && <p className="text-sm text-gray-600">{edu.school}</p>}
                        </div>
                        {edu.year && <span className="text-xs text-gray-500">{edu.year}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Experience */}
              {experience.filter(e => e.company || e.role || e.duration || e.description).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 border-b border-gray-300 pb-1">Experience</h2>
                  {experience.filter(e => e.company || e.role || e.duration || e.description).map(exp => (
                    <div key={exp.id} className="mb-4">
                      <div className="flex justify-between items-baseline mb-1">
                        {exp.role && <h3 className="font-bold text-gray-900">{exp.role}</h3>}
                        {exp.duration && <span className="text-xs text-gray-500">{exp.duration}</span>}
                      </div>
                      {exp.company && <p className="text-sm text-gray-600 mb-1">{exp.company}</p>}
                      {exp.description && <p className="text-sm text-gray-800 leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {projects.filter(p => p.name || p.description || p.tech).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 border-b border-gray-300 pb-1">Projects</h2>
                  {projects.filter(p => p.name || p.description || p.tech).map(proj => (
                    <div key={proj.id} className="mb-3">
                      {proj.name && <h3 className="font-bold text-gray-900">{proj.name}</h3>}
                      {proj.description && <p className="text-sm text-gray-800 leading-relaxed mb-1">{proj.description}</p>}
                      {proj.tech && <p className="text-xs text-gray-500 italic">{proj.tech}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {skills && skills.trim().length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-2 border-b border-gray-300 pb-1">Skills</h2>
                  <p className="text-sm text-gray-800">{skills}</p>
                </div>
              )}

              {/* Links */}
              {(links.github || links.linkedin) && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-2 border-b border-gray-300 pb-1">Links</h2>
                  <div className="text-sm text-gray-800 space-y-1">
                    {links.github && <div>GitHub: {links.github}</div>}
                    {links.linkedin && <div>LinkedIn: {links.linkedin}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Premium, calm ATS score meter + suggestions
const ATSMetrics: React.FC<{
  summary: string;
  projects: Project[];
  experience: Experience[];
  skills: string;
  links: { github: string; linkedin: string };
  education: Education[];
}> = ({ summary, projects, experience, skills, links, education }) => {
  const scoreInfo = useMemo(() => {
    let score = 0;
    const suggestions: string[] = [];

    // Summary 40-120 words => +15
    const summaryWordCount = summary ? summary.trim().split(/\s+/).filter(Boolean).length : 0;
    const hasGoodSummary = summaryWordCount >= 40 && summaryWordCount <= 120;
    if (hasGoodSummary) score += 15; else suggestions.push('Write a stronger summary (40–120 words).');

    // Projects >= 2 => +10
    const projectCount = projects.filter(p => p.name || p.description).length;
    if (projectCount >= 2) score += 10; else suggestions.push('Add at least 2 projects.');

    // Experience >= 1 => +10
    const experienceCount = experience.filter(e => e.company || e.role || e.description).length;
    if (experienceCount >= 1) score += 10; else suggestions.push('Add at least 1 experience entry.');

    // Skills >= 8 items => +10
    const skillsItems = skills.split(',').map(s => s.trim()).filter(Boolean);
    if (skillsItems.length >= 8) score += 10; else suggestions.push('Add more skills (target 8+).');

    // Links include GitHub or LinkedIn => +10
    const hasSocial = Boolean(links.github?.trim()) || Boolean(links.linkedin?.trim());
    if (hasSocial) score += 10; else suggestions.push('Add GitHub or LinkedIn link.');

    // Any number in experience/project bullets => +15
    const textBlobs = [
      ...experience.map(e => `${e.description}`),
      ...projects.map(p => `${p.description}`),
    ].join(' \n ');
    const hasNumbers = /([0-9]+|%|k|K|m|M|x|X)/.test(textBlobs);
    if (hasNumbers) score += 15; else suggestions.push('Add measurable impact (numbers) in bullets.');

    // Education completeness => +10 (any entry with school, degree, year)
    const hasCompleteEducation = education.some(e => e.school && e.degree && e.year);
    if (hasCompleteEducation) score += 10; else suggestions.push('Complete education with school, degree, and year.');

    if (score > 100) score = 100;

    return {
      score,
      suggestions: suggestions.slice(0, 3)
    };
  }, [summary, projects, experience, skills, links, education]);

  const pct = scoreInfo.score;

  return (
    <div className="border border-gray-300 bg-[#F7F6F3] p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">ATS Readiness Score</span>
        <span className="text-sm font-serif font-bold text-gray-900">{pct}/100</span>
      </div>
      <div className="w-full h-3 bg-white border border-gray-300 relative">
        <div
          className="h-full"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #cbd5e1 0%, #8B0000 100%)',
            transition: 'width 200ms ease-out'
          }}
        />
      </div>
      {scoreInfo.suggestions.length > 0 && (
        <ul className="mt-3 list-disc list-inside text-xs text-gray-700 space-y-1">
          {scoreInfo.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
