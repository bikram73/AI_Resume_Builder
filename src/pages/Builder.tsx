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
  description: string; // newline separated bullets
}

interface Project {
  id: string;
  title: string;
  description: string; // max 200 chars
  techStack: string[]; // tag input
  liveUrl?: string;
  githubUrl?: string;
}

interface Skills {
  technical: string[];
  soft: string[];
  tools: string[];
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
        // Projects migration: support old shape {name, tech}
        if (Array.isArray(data.projects)) {
          const migrated: Project[] = data.projects.map((p: any) => ({
            id: p.id || String(Date.now() + Math.random()),
            title: p.title ?? p.name ?? '',
            description: p.description ?? '',
            techStack: Array.isArray(p.techStack)
              ? p.techStack
              : (typeof p.tech === 'string' && p.tech.trim().length>0)
                ? p.tech.split(',').map((s: string)=>s.trim()).filter(Boolean)
                : [],
            liveUrl: p.liveUrl ?? '',
            githubUrl: p.githubUrl ?? '',
          }));
          setProjects(migrated);
        }
        // Skills migration: support old string
        if (data.skills) {
          if (typeof data.skills === 'string') {
            const items = data.skills.split(',').map((s: string)=>s.trim()).filter(Boolean);
            setSkills({ technical: items, soft: [], tools: [] });
          } else if (typeof data.skills === 'object') {
            const s: Skills = {
              technical: data.skills.technical ?? [],
              soft: data.skills.soft ?? [],
              tools: data.skills.tools ?? [],
            };
            setSkills(s);
          }
        }
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
  const [skills, setSkills] = useState<Skills>({ technical: [], soft: [], tools: [] });
  const [links, setLinks] = useState({ github: '', linkedin: '' });

  // Template selection (persisted)
  const [template, setTemplate] = useState<'Classic' | 'Modern' | 'Minimal'>(() => {
    const saved = localStorage.getItem('resumeTemplate');
    return (saved === 'Modern' || saved === 'Minimal' || saved === 'Classic') ? (saved as any) : 'Classic';
  });
  useEffect(() => {
    try { localStorage.setItem('resumeTemplate', template); } catch {}
  }, [template]);

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
      { id: 'p1', title: 'AI Resume Builder', description: 'Built premium resume builder with live preview and ATS scoring; increased user conversion by 18%.', techStack: ['React','TypeScript','Tailwind'], liveUrl: '', githubUrl: '' },
      { id: 'p2', title: 'Analytics Dashboard', description: 'Real-time metrics with alerting; processed 2M+ events/day.', techStack: ['Next.js','Node','PostgreSQL'], liveUrl: '', githubUrl: '' }
    ]);
    setSkills({ technical: ['React','TypeScript','Node.js','AWS','Docker','PostgreSQL','GraphQL'], soft: ['Team Leadership'], tools: ['Git'] });
    setLinks({ github: 'https://github.com/janedoe', linkedin: 'https://linkedin.com/in/janedoe' });
  };

  const addEducation = () => {
    setEducation([...education, { id: Date.now().toString(), school: '', degree: '', year: '' }]);
  };

  const addExperience = () => {
    setExperience([...experience, { id: Date.now().toString(), company: '', role: '', duration: '', description: '' }]);
  };

  const addProject = () => {
    setProjects([
      ...projects,
      { id: Date.now().toString(), title: '', description: '', techStack: [], liveUrl: '', githubUrl: '' }
    ]);
    setOpenProjectIds(prev => new Set(prev).add('' + Date.now()));
  };

  // Accordion state
  const [skillsOpen, setSkillsOpen] = useState(true);
  const [openProjectIds, setOpenProjectIds] = useState<Set<string>>(new Set());
  const toggleProjectOpen = (id: string) => {
    setOpenProjectIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  // Tag input helpers
  const addTag = (group: keyof Skills, value: string) => {
    const v = value.trim();
    if (!v) return;
    setSkills(prev => ({ ...prev, [group]: Array.from(new Set([...(prev[group]||[]), v])) }));
  };
  const removeTag = (group: keyof Skills, idx: number) => {
    setSkills(prev => ({ ...prev, [group]: prev[group].filter((_, i) => i !== idx) }));
  };

  const addProjectTag = (pid: string, value: string) => {
    const v = value.trim();
    if (!v) return;
    setProjects(prev => prev.map(p => p.id === pid ? { ...p, techStack: Array.from(new Set([...(p.techStack||[]), v])) } : p));
  };
  const removeProjectTag = (pid: string, idx: number) => {
    setProjects(prev => prev.map(p => p.id === pid ? { ...p, techStack: p.techStack.filter((_, i)=>i!==idx) } : p));
  };

  const deleteProject = (pid: string) => {
    setProjects(prev => prev.filter(p => p.id !== pid));
    setOpenProjectIds(prev => { const n = new Set(prev); n.delete(pid); return n; });
  };

  const suggestSkills = async () => {
    setSuggesting(true);
    await new Promise(r => setTimeout(r, 1000));
    setSkills({
      technical: ['TypeScript','React','Node.js','PostgreSQL','GraphQL'],
      soft: ['Team Leadership','Problem Solving'],
      tools: ['Git','Docker','AWS']
    });
    setSuggesting(false);
  };
  const [suggesting, setSuggesting] = useState(false);

  // Template style helper
  const tpl = useMemo(() => {
    switch (template) {
      case 'Modern':
        return {
          container: 'shadow-sm',
          sectionTitle: 'tracking-widest text-black',
          name: 'tracking-tight',
        };
      case 'Minimal':
        return {
          container: 'border-gray-200',
          sectionTitle: 'text-gray-900 font-medium',
          name: 'text-2xl',
        };
      default: // Classic
        return {
          container: '',
          sectionTitle: '',
          name: '',
        };
    }
  }, [template]);

  // Derived flat skills for ATS score logic compatibility
  const skillsFlat = useMemo(() => (
    [...skills.technical, ...skills.soft, ...skills.tools].join(', ')
  ), [skills]);

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
                  placeholder="Description (one bullet per line)"
                  value={exp.description}
                  onChange={e => {
                    const updated = [...experience];
                    updated[idx].description = e.target.value;
                    setExperience(updated);
                  }}
                  rows={3}
                  className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none resize-none"
                />
                {/* Bullet Guidance */}
                {(() => {
                  const lines = (exp.description || '').split(/\n/).map(l => l.trim()).filter(Boolean);
                  if (lines.length === 0) return null;
                  const verbs = /^(Built|Developed|Designed|Implemented|Led|Improved|Created|Optimized|Automated)\b/i;
                  const hasNumber = /([0-9]+|%|k|K|m|M|x|X)/;
                  const firstLine = lines[0];
                  const missingVerb = !verbs.test(firstLine);
                  const noNumbers = !hasNumber.test(lines.join(' '));
                  return (
                    <div className="mt-2 space-y-1">
                      {missingVerb && (
                        <div className="text-[11px] text-gray-500">Start with a strong action verb.</div>
                      )}
                      {noNumbers && (
                        <div className="text-[11px] text-gray-500">Add measurable impact (numbers).</div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ))}
          </section>

          {/* Skills (Accordion) */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-serif font-bold text-gray-900 cursor-pointer" onClick={()=>setSkillsOpen(o=>!o)}>
                Skills {skillsOpen ? '▾' : '▸'}
              </h3>
              <button
                onClick={suggestSkills}
                className="text-xs font-bold uppercase tracking-wider text-[#8B0000] hover:underline disabled:opacity-60"
                disabled={suggesting}
              >
                {suggesting ? 'Suggesting…' : '✨ Suggest Skills'}
              </button>
            </div>
            {skillsOpen && (
              <div className="p-4 bg-white border border-gray-200 space-y-5">
                {([
                  { key: 'technical', label: 'Technical Skills' },
                  { key: 'soft', label: 'Soft Skills' },
                  { key: 'tools', label: 'Tools & Technologies' }
                ] as const).map(group => (
                  <div key={group.key}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-gray-900">{group.label} ({skills[group.key].length})</label>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {skills[group.key].map((tag, i) => (
                        <span key={tag+String(i)} className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-[#F7F6F3] border border-gray-300 text-gray-900">
                          {tag}
                          <button onClick={()=>removeTag(group.key, i)} className="text-gray-500 hover:text-black">×</button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder={`Add ${group.label.toLowerCase().replace('& technologies','')} and press Enter`}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const target = e.target as HTMLInputElement;
                          addTag(group.key, target.value);
                          target.value = '';
                        }
                      }}
                      className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Projects (Accordion entries) */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-serif font-bold text-gray-900">Projects</h3>
              <button
                onClick={addProject}
                className="text-xs font-bold uppercase tracking-wider text-[#8B0000] hover:underline"
              >
                + Add Project
              </button>
            </div>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={proj.id} className="bg-white border border-gray-200">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-2 cursor-pointer select-none" onClick={()=>toggleProjectOpen(proj.id)}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{openProjectIds.has(proj.id) ? '▾' : '▸'}</span>
                      <span className="font-semibold text-gray-900">{proj.title?.trim() || 'Untitled Project'}</span>
                      <span className="text-xs text-gray-500">({proj.techStack.length} tech)</span>
                    </div>
                    <button
                      onClick={(e)=>{ e.stopPropagation(); deleteProject(proj.id); }}
                      className="text-xs font-bold uppercase tracking-wider text-[#8B0000] hover:underline"
                    >Delete</button>
                  </div>
                  {openProjectIds.has(proj.id) && (
                    <div className="p-4 border-t border-gray-200">
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={proj.title}
                        onChange={e => {
                          const updated = [...projects];
                          updated[idx].title = e.target.value;
                          setProjects(updated);
                        }}
                        className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none mb-2"
                      />
                      <div className="mb-2">
                        <textarea
                          placeholder="Description (max 200 chars)"
                          value={proj.description}
                          onChange={e => {
                            const v = e.target.value.slice(0, 200);
                            const updated = [...projects];
                            updated[idx].description = v;
                            setProjects(updated);
                          }}
                          rows={3}
                          className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none resize-none"
                        />
                        <div className="text-[11px] text-gray-500 text-right">{proj.description.length}/200</div>
                      </div>

                      {/* Tech Stack tags */}
                      <div className="mb-3">
                        <div className="text-sm font-semibold text-gray-900 mb-1">Tech Stack ({proj.techStack.length})</div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {proj.techStack.map((tag, tIdx) => (
                            <span key={tag+String(tIdx)} className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-[#F7F6F3] border border-gray-300 text-gray-900">
                              {tag}
                              <button onClick={()=>removeProjectTag(proj.id, tIdx)} className="text-gray-500 hover:text-black">×</button>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="Add tech and press Enter"
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const target = e.target as HTMLInputElement;
                              addProjectTag(proj.id, target.value);
                              target.value = '';
                            }
                          }}
                          className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Live URL (optional)"
                          value={proj.liveUrl || ''}
                          onChange={e => {
                            const updated = [...projects];
                            updated[idx].liveUrl = e.target.value;
                            setProjects(updated);
                          }}
                          className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="GitHub URL (optional)"
                          value={proj.githubUrl || ''}
                          onChange={e => {
                            const updated = [...projects];
                            updated[idx].githubUrl = e.target.value;
                            setProjects(updated);
                          }}
                          className="w-full bg-[#F7F6F3] border border-gray-300 p-2 text-gray-900 focus:border-[#8B0000] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
            {/* Template Tabs */}
            <div className="flex items-center justify-center gap-3 mb-6">
              {(['Classic','Modern','Minimal'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`px-3 py-1.5 text-xs uppercase font-bold border ${template===t? 'border-black text-black' : 'border-gray-300 text-gray-600 hover:border-gray-500'}`}
                >{t}</button>
              ))}
            </div>

            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 text-center">Live Preview</h2>

            {/* ATS Score Card */}
            <ATSMetrics
              summary={summary}
              projects={projects}
              experience={experience}
              skills={skillsFlat}
              links={links}
              education={education}
            />
            
            {/* Resume Preview Shell */}
            <div className={`bg-white border border-gray-300 p-10 mt-6 ${tpl.container}`}>
              {/* Header */}
              <div className="text-center mb-8 pb-6 border-b border-gray-200">
                <h1 className={`text-3xl font-serif font-bold text-gray-900 mb-2 ${tpl.name}`}>
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
                  <h2 className={`text-sm font-bold uppercase tracking-wider text-gray-900 mb-2 border-b border-gray-300 pb-1 ${tpl.sectionTitle}`}>Summary</h2>
                  <p className="text-sm text-gray-800 leading-relaxed">{summary}</p>
                </div>
              )}

              {/* Education */}
              {education.filter(e => e.school || e.degree || e.year).length > 0 && (
                <div className="mb-6">
                  <h2 className={`text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 border-b border-gray-300 pb-1 ${tpl.sectionTitle}`}>Education</h2>
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
                  <h2 className={`text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 border-b border-gray-300 pb-1 ${tpl.sectionTitle}`}>Experience</h2>
                  {experience.filter(e => e.company || e.role || e.duration || e.description).map(exp => (
                    <div key={exp.id} className="mb-4">
                      <div className="flex justify-between items-baseline mb-1">
                        {exp.role && <h3 className="font-bold text-gray-900">{exp.role}</h3>}
                        {exp.duration && <span className="text-xs text-gray-500">{exp.duration}</span>}
                      </div>
                      {exp.company && <p className="text-sm text-gray-600 mb-1">{exp.company}</p>}
                      {exp.description && (
                        <ul className="list-disc list-inside text-sm text-gray-800 leading-relaxed space-y-1">
                          {exp.description.split(/\n/).map((line, i) => (
                            <li key={i}>{line}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {projects.filter(p => p.title || p.description || (p.techStack && p.techStack.length) || p.liveUrl || p.githubUrl).length > 0 && (
                <div className="mb-6">
                  <h2 className={`text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 border-b border-gray-300 pb-1 ${tpl.sectionTitle}`}>Projects</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {projects.filter(p => p.title || p.description || (p.techStack && p.techStack.length) || p.liveUrl || p.githubUrl).map(proj => (
                      <div key={proj.id} className="border border-gray-200 p-4">
                        {proj.title && <h3 className="font-bold text-gray-900 mb-1">{proj.title}</h3>}
                        {proj.description && <p className="text-sm text-gray-800 leading-relaxed mb-2">{proj.description}</p>}
                        {proj.techStack && proj.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {proj.techStack.map((t, i) => (
                              <span key={t+String(i)} className="px-2 py-0.5 text-xs border border-gray-300 text-gray-900">{t}</span>
                            ))}
                          </div>
                        )}
                        {(proj.liveUrl || proj.githubUrl) && (
                          <div className="flex items-center gap-4 text-sm text-gray-800">
                            {proj.liveUrl && <a className="underline" href={proj.liveUrl} target="_blank" rel="noreferrer">↗ Live</a>}
                            {proj.githubUrl && <a className="underline" href={proj.githubUrl} target="_blank" rel="noreferrer">{`{ }`} GitHub</a>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {([...skills.technical, ...skills.soft, ...skills.tools].length > 0) && (
                <div className="mb-6">
                  <h2 className={`text-sm font-bold uppercase tracking-wider text-gray-900 mb-2 border-b border-gray-300 pb-1 ${tpl.sectionTitle}`}>Skills</h2>
                  <div className="space-y-2">
                    {skills.technical.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-gray-700 mb-1">Technical</div>
                        <div className="flex flex-wrap gap-2">
                          {skills.technical.map((s, i)=> (
                            <span key={s+String(i)} className="px-2 py-0.5 text-xs border border-gray-300 text-gray-900">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {skills.soft.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-gray-700 mb-1">Soft</div>
                        <div className="flex flex-wrap gap-2">
                          {skills.soft.map((s, i)=> (
                            <span key={s+String(i)} className="px-2 py-0.5 text-xs border border-gray-300 text-gray-900">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {skills.tools.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-gray-700 mb-1">Tools & Technologies</div>
                        <div className="flex flex-wrap gap-2">
                          {skills.tools.map((s, i)=> (
                            <span key={s+String(i)} className="px-2 py-0.5 text-xs border border-gray-300 text-gray-900">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Links */}
              {(links.github || links.linkedin) && (
                <div>
                  <h2 className={`text-sm font-bold uppercase tracking-wider text-gray-900 mb-2 border-b border-gray-300 pb-1 ${tpl.sectionTitle}`}>Links</h2>
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
  skills: string; // flattened string
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
    const projectCount = projects.filter(p => p.title || p.description).length;
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

  // Improvement Panel (Top 3 Improvements)
  const improvements = useMemo(() => {
    const list: string[] = [];
    const projectCount = projects.filter(p => p.title || p.description).length;
    const hasNumbers = /([0-9]+|%|k|K|m|M|x|X)/.test([
      ...experience.map(e => e.description),
      ...projects.map(p => p.description),
    ].join(' '));
    const summaryWordCount = summary ? summary.trim().split(/\s+/).filter(Boolean).length : 0;
    const skillsItems = skills.split(',').map(s => s.trim()).filter(Boolean);
    const experienceCount = experience.filter(e => e.company || e.role || e.description).length;

    if (projectCount < 2) list.push('Add at least 2 projects.');
    if (!hasNumbers) list.push('Add measurable impact (numbers).');
    if (summaryWordCount < 40) list.push('Expand your summary to 40+ words.');
    if (skillsItems.length < 8) list.push('Add more skills (target 8+).');
    if (experienceCount === 0) list.push('Add experience or internship/project work.');

    return list.slice(0, 3);
  }, [projects, experience, summary, skills]);

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

      {/* Top 3 Improvements */}
      <div className="mt-4">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Top 3 Improvements</div>
        {improvements.length > 0 ? (
          <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
            {improvements.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        ) : (
          <div className="text-[12px] text-gray-600">Looking strong. Fine-tune phrasing and alignment to polish further.</div>
        )}
      </div>
    </div>
  );
};
