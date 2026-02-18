import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Small utility types mirroring Builder-side structures (lenient for backward compatibility)
interface PersonalInfo { name?: string; email?: string; phone?: string; location?: string }
interface Education { id?: string; school?: string; degree?: string; year?: string }
interface Experience { id?: string; company?: string; role?: string; duration?: string; description?: string }
interface ProjectRaw { id?: string; title?: string; name?: string; description?: string; techStack?: string[]; tech?: string; liveUrl?: string; githubUrl?: string }
interface SkillsRaw { technical?: string[]; soft?: string[]; tools?: string[] }

export const Preview: React.FC = () => {
  const navigate = useNavigate();

  // Template choice (persisted)
  const [template, setTemplate] = useState<'Classic' | 'Modern' | 'Minimal'>(() => {
    const saved = localStorage.getItem('resumeTemplate');
    return (saved === 'Modern' || saved === 'Minimal' || saved === 'Classic') ? (saved as any) : 'Classic';
  });
  useEffect(() => {
    try { localStorage.setItem('resumeTemplate', template); } catch {}
  }, [template]);

  // Accent color (persisted)
  const [accent, setAccent] = useState<string>(() => localStorage.getItem('resumeAccent') || 'hsl(168, 60%, 40%)');
  useEffect(() => { try { localStorage.setItem('resumeAccent', accent); } catch {} }, [accent]);

  // Builder data for display and export/validation
  const [builderData, setBuilderData] = useState<any>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('resumeBuilderData');
      if (raw) setBuilderData(JSON.parse(raw));
    } catch {}
  }, []);

  // Validation warning (non-blocking)
  const missingCritical = useMemo(() => {
    const name = builderData?.personalInfo?.name?.trim();
    const exps = (builderData?.experience || []).filter((e: any) => e.company || e.role || e.description);
    const projs = (builderData?.projects || []).filter((p: any) => p.name || p.title || p.description);
    return !name || (exps.length + projs.length) === 0;
  }, [builderData]);

  // Print + toast
  const [toast, setToast] = useState(false);
  const handlePrint = () => {
    window.print();
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  // Plain text export based on builderData
  const plainText = useMemo(() => {
    const d = builderData || {}; const pi = d.personalInfo || {};
    const lines: string[] = [];
    if (pi.name) lines.push(pi.name);
    const contact = [pi.email, pi.phone, pi.location].filter(Boolean).join(' | ');
    if (contact) lines.push(contact);
    if (lines.length) lines.push('');

    if (d.summary) { lines.push('Summary'); lines.push(String(d.summary)); lines.push(''); }

    const edu = (d.education || []).filter((e: any)=>e.school||e.degree||e.year);
    if (edu.length) { lines.push('Education');
      edu.forEach((e: any)=>{ const h = [e.degree||e.school, e.school && e.degree? ` at ${e.school}`: '', e.year? ` (${e.year})`: ''].join(''); lines.push(h.trim()); });
      lines.push('');
    }

    const exp = (d.experience || []).filter((e: any)=>e.company||e.role||e.description);
    if (exp.length) { lines.push('Experience');
      exp.forEach((e: any)=>{
        if (e.role) lines.push(`- ${e.role}${e.company? ' @ '+e.company: ''}${e.duration? ' | '+e.duration: ''}`);
        else if (e.company || e.duration) lines.push(`- ${(e.company||'')}${e.duration? ' | '+e.duration: ''}`.trim());
        if (e.description) String(e.description).split(/\n/).forEach((b: string)=> lines.push(`  • ${b.trim()}`));
      });
      lines.push('');
    }

    const pr = (d.projects || []).filter((p: any)=>p.name||p.title||p.description||p.tech||p.techStack);
    if (pr.length) { lines.push('Projects');
      pr.forEach((p: any)=>{
        const title = p.title || p.name; if (title) lines.push(`- ${title}`);
        if (p.description) String(p.description).split(/\n/).forEach((b: string)=> lines.push(`  • ${b.trim()}`));
        const stack = Array.isArray(p.techStack) ? p.techStack : (typeof p.tech === 'string' ? p.tech.split(',').map((s:string)=>s.trim()).filter(Boolean) : []);
        if (stack.length) lines.push(`  Tech: ${stack.join(', ')}`);
      });
      lines.push('');
    }

    if (d.skills) {
      if (typeof d.skills === 'string') { lines.push('Skills'); lines.push(d.skills); lines.push(''); }
      else if (typeof d.skills === 'object') {
        const s = d.skills as SkillsRaw; const all = [...(s.technical||[]), ...(s.soft||[]), ...(s.tools||[])];
        if (all.length) { lines.push('Skills'); lines.push(all.join(', ')); lines.push(''); }
      }
    }

    const links = d.links || {}; if (links.github || links.linkedin) { lines.push('Links'); if (links.github) lines.push(`GitHub: ${links.github}`); if (links.linkedin) lines.push(`LinkedIn: ${links.linkedin}`); }
    return lines.join('\n').trim();
  }, [builderData]);

  const handleCopy = async () => { try { await navigator.clipboard.writeText(plainText || ''); } catch {} };

  // Derive display content from builderData with sensible fallbacks
  const display = useMemo(() => {
    const d = builderData || {};
    const pi: PersonalInfo = d.personalInfo || {};
    const name = pi.name || 'Jane Doe';
    const email = pi.email || 'jane.doe@email.com';
    const phone = pi.phone || '+1 (555) 123-4567';
    const location = pi.location || 'San Francisco, CA';

    const summary: string = (d.summary || 'Experienced software engineer with 5+ years building scalable web applications. Passionate about clean code and user experience.') as string;

    const experience: Experience[] = (Array.isArray(d.experience) && d.experience.length)
      ? d.experience
      : [{ role: 'Senior Software Engineer', company: 'Tech Corp', duration: '2020 - Present', description: 'Led development of microservices architecture serving 1M+ users. Improved performance by 40%.' }];

    const education: Education[] = (Array.isArray(d.education) && d.education.length)
      ? d.education
      : [{ degree: 'Bachelor of Science in Computer Science', school: 'Stanford University', year: '2018' }];

    const projects: ProjectRaw[] = (Array.isArray(d.projects) && d.projects.length)
      ? d.projects
      : [{ title: 'AI Resume Builder', description: 'Built premium resume builder with live preview and export functionality', techStack: ['React','TypeScript','Tailwind CSS'] }];

    const skillsRaw = d.skills;
    const skills: SkillsRaw = typeof skillsRaw === 'string'
      ? { technical: skillsRaw.split(',').map((s:string)=>s.trim()).filter(Boolean), soft: [], tools: [] }
      : (skillsRaw || {});

    return { name, email, phone, location, summary, experience, education, projects, skills };
  }, [builderData]);

  // Template + typography helpers
  const tpl = useMemo(() => {
    const serifHead = template !== 'Minimal' ? 'font-serif' : 'font-sans';
    return { serifHead };
  }, [template]);

  // Accent style var for inline usage
  const accentVar: CSSProperties = { ['--accent' as any]: accent };

  // Template thumbnails UI (120px-wide sketch cards)
  const TemplateThumb: React.FC<{ id: 'Classic'|'Modern'|'Minimal'; active: boolean; onClick: () => void }>
    = ({ id, active, onClick }) => (
      <button onClick={onClick} className={`relative w-[120px] h-[80px] border ${active? 'border-blue-600' : 'border-gray-300 hover:border-gray-500'} bg-white flex items-center justify-center`}>
        {/* Sketch */}
        {id === 'Classic' && (
          <div className="w-[100px] h-[64px] flex flex-col justify-between">
            <div className="h-2 bg-gray-800" />
            <div className="h-[1px] bg-gray-400" />
            <div className="h-2 bg-gray-300" />
            <div className="h-[1px] bg-gray-400" />
            <div className="h-2 bg-gray-300" />
          </div>
        )}
        {id === 'Modern' && (
          <div className="w-[100px] h-[64px] flex">
            <div className="w-[28px] h-full" style={{ background: 'var(--accent)' }} />
            <div className="flex-1 pl-1 py-1 space-y-1">
              <div className="h-2 bg-gray-800" />
              <div className="h-2 bg-gray-300" />
              <div className="h-2 bg-gray-300" />
            </div>
          </div>
        )}
        {id === 'Minimal' && (
          <div className="w-[100px] h-[64px] flex flex-col justify-center gap-2">
            <div className="h-2 bg-gray-800" />
            <div className="h-2 bg-gray-300" />
          </div>
        )}
        {active && <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] px-1 rounded">✓</div>}
      </button>
    );

  // Color circle UI
  const ColorSwatch: React.FC<{ color: string; active: boolean; onClick: () => void }>
    = ({ color, active, onClick }) => (
      <button onClick={onClick} title={color} className={`w-6 h-6 rounded-full border ${active? 'border-black' : 'border-gray-300'}`} style={{ background: color }} />
    );

  // Resume blocks shared renderers
  const ContactInline = () => (
    <div className="text-sm text-gray-800 space-x-3">
      {display.email && <span>{display.email}</span>}
      {display.phone && <><span>•</span><span>{display.phone}</span></>}
      {display.location && <><span>•</span><span>{display.location}</span></>}
    </div>
  );

  const SkillsPills: React.FC<{ group?: 'all'|'technical'|'soft'|'tools' }>
    = ({ group = 'all' }) => {
      const groups: [string, string[]][] = group==='all'
        ? [ ['Technical', display.skills.technical||[]], ['Soft', display.skills.soft||[]], ['Tools & Technologies', display.skills.tools||[]] ]
        : group==='technical'
          ? [ ['Technical', display.skills.technical||[]] ]
          : group==='soft'
            ? [ ['Soft', display.skills.soft||[]] ]
            : [ ['Tools & Technologies', display.skills.tools||[]] ];
      const any = groups.some(([, arr]) => (arr||[]).length > 0);
      if (!any) return null;
      return (
        <div className="space-y-2">
          {groups.map(([label, arr]) => arr?.length ? (
            <div key={label}>
              {group==='all' && <div className="text-xs font-semibold text-gray-700 mb-1">{label}</div>}
              <div className="flex flex-wrap gap-2">
                {arr.map((s, i)=> (
                  <span key={s+String(i)} className="px-2 py-0.5 text-xs border border-gray-300 text-gray-900">{s}</span>
                ))}
              </div>
            </div>
          ) : null)}
        </div>
      );
    };

  const ExperienceBlock = () => (
    <div className="space-y-5">
      {(display.experience||[]).filter(e=>e.company||e.role||e.description).map((e, idx) => (
        <div key={idx}>
          <div className="flex justify-between items-baseline mb-1">
            {e.role && <h3 className="font-bold text-black">{e.role}</h3>}
            {e.duration && <span className="text-xs text-gray-700">{e.duration}</span>}
          </div>
          {e.company && <p className="text-sm text-gray-800 mb-1">{e.company}</p>}
          {e.description && (
            <ul className="list-disc list-inside text-sm text-black leading-relaxed space-y-1">
              {String(e.description).split(/\n/).map((line, i) => (<li key={i}>{line}</li>))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );

  const EducationBlock = () => (
    <div className="space-y-3">
      {(display.education||[]).filter(e=>e.school||e.degree||e.year).map((e, idx) => (
        <div key={idx} className="flex justify-between items-baseline">
          <div>
            {(e.degree || e.school) && (
              <h3 className="font-bold text-black">{e.degree || e.school}</h3>
            )}
            {e.school && <p className="text-sm text-gray-800">{e.school}</p>}
          </div>
          {e.year && <span className="text-xs text-gray-700">{e.year}</span>}
        </div>
      ))}
    </div>
  );

  const ProjectsBlock = () => (
    <div className="grid grid-cols-1 gap-4">
      {(display.projects||[]).filter(p=>p.title||p.name||p.description||p.tech||p.techStack).map((p, idx) => {
        const title = p.title || p.name;
        const stack = Array.isArray(p.techStack) ? p.techStack : (typeof p.tech === 'string' ? p.tech.split(',').map(s=>s.trim()).filter(Boolean) : []);
        return (
          <div key={idx} className="border border-gray-200 p-4">
            {title && <h3 className="font-bold text-black mb-1">{title}</h3>}
            {p.description && <p className="text-sm text-black leading-relaxed mb-2">{p.description}</p>}
            {stack.length>0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {stack.map((t, i) => (<span key={t+String(i)} className="px-2 py-0.5 text-xs border border-gray-300 text-gray-900">{t}</span>))}
              </div>
            )}
            {(p.liveUrl || p.githubUrl) && (
              <div className="flex items-center gap-4 text-sm text-gray-800">
                {p.liveUrl && <a className="underline" href={p.liveUrl} target="_blank" rel="noreferrer">↗ Live</a>}
                {p.githubUrl && <a className="underline" href={p.githubUrl} target="_blank" rel="noreferrer">{`{ }`} GitHub</a>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  // Render resume per template
  const renderClassic = () => (
    <div className="p-16 print:p-8" style={accentVar}>
      {/* Header */}
      <div className="text-center mb-10 pb-8 border-b" style={{ borderColor: 'var(--accent)' }}>
        <h1 className={`text-4xl ${tpl.serifHead} font-bold text-black mb-3`}>{display.name}</h1>
        <ContactInline />
      </div>
      {/* Summary */}
      {display.summary && (
        <div className="mb-8">
          <h2 className={`text-xs font-bold uppercase mb-2`} style={{ color: 'var(--accent)' }}>Professional Summary</h2>
          <p className="text-sm text-black leading-relaxed">{display.summary}</p>
        </div>
      )}
      {/* Experience */}
      <div className="mb-8 break-inside-avoid">
        <h2 className={`text-xs font-bold uppercase mb-2`} style={{ color: 'var(--accent)' }}>Experience</h2>
        <ExperienceBlock />
      </div>
      {/* Education */}
      <div className="mb-8 break-inside-avoid">
        <h2 className={`text-xs font-bold uppercase mb-2`} style={{ color: 'var(--accent)' }}>Education</h2>
        <EducationBlock />
      </div>
      {/* Projects */}
      <div className="mb-8 break-inside-avoid">
        <h2 className={`text-xs font-bold uppercase mb-2`} style={{ color: 'var(--accent)' }}>Projects</h2>
        <ProjectsBlock />
      </div>
      {/* Skills */}
      <div className="break-inside-avoid">
        <h2 className={`text-xs font-bold uppercase mb-2`} style={{ color: 'var(--accent)' }}>Skills</h2>
        <SkillsPills group="all" />
      </div>
    </div>
  );

  const renderModern = () => (
    <div className="p-0 print:p-0" style={accentVar}>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-1/3 p-8 text-white" style={{ background: 'var(--accent)' }}>
          <h1 className={`text-3xl ${tpl.serifHead} font-bold mb-1`}>{display.name}</h1>
          <div className="opacity-90 mb-6 text-sm">
            {display.email && <div>{display.email}</div>}
            {display.phone && <div>{display.phone}</div>}
            {display.location && <div>{display.location}</div>}
          </div>
          {/* Skills in sidebar */}
          <div className="space-y-3">
            {(display.skills.technical||[]).length>0 && (
              <div>
                <div className="text-[11px] uppercase tracking-widest opacity-90 mb-1">Technical</div>
                <div className="flex flex-wrap gap-1">
                  {(display.skills.technical||[]).map((s,i)=>(<span key={s+String(i)} className="px-2 py-0.5 text-[11px] bg-white/10 border border-white/20">{s}</span>))}
                </div>
              </div>
            )}
            {(display.skills.soft||[]).length>0 && (
              <div>
                <div className="text-[11px] uppercase tracking-widest opacity-90 mb-1">Soft</div>
                <div className="flex flex-wrap gap-1">
                  {(display.skills.soft||[]).map((s,i)=>(<span key={s+String(i)} className="px-2 py-0.5 text-[11px] bg-white/10 border border-white/20">{s}</span>))}
                </div>
              </div>
            )}
            {(display.skills.tools||[]).length>0 && (
              <div>
                <div className="text-[11px] uppercase tracking-widest opacity-90 mb-1">Tools</div>
                <div className="flex flex-wrap gap-1">
                  {(display.skills.tools||[]).map((s,i)=>(<span key={s+String(i)} className="px-2 py-0.5 text-[11px] bg-white/10 border border-white/20">{s}</span>))}
                </div>
              </div>
            )}
          </div>
        </aside>
        {/* Main */}
        <main className="w-2/3 p-12 bg-white">
          {display.summary && (
            <div className="mb-8">
              <h2 className={`text-xs font-bold uppercase mb-2`} style={{ color: 'var(--accent)' }}>Professional Summary</h2>
              <p className="text-sm text-black leading-relaxed">{display.summary}</p>
            </div>
          )}
          <div className="mb-8 break-inside-avoid">
            <h2 className={`text-xs font-bold uppercase mb-2`} style={{ color: 'var(--accent)' }}>Experience</h2>
            <ExperienceBlock />
          </div>
          <div className="mb-8 break-inside-avoid">
            <h2 className={`text-xs font-bold uppercase mb-2`} style={{ color: 'var(--accent)' }}>Education</h2>
            <EducationBlock />
          </div>
          <div className="break-inside-avoid">
            <h2 className={`text-xs font-bold uppercase mb-2`} style={{ color: 'var(--accent)' }}>Projects</h2>
            <ProjectsBlock />
          </div>
        </main>
      </div>
    </div>
  );

  const renderMinimal = () => (
    <div className="p-16 print:p-8" style={accentVar}>
      {/* Header */}
      <div className="text-center mb-10 pb-4">
        <h1 className={`text-4xl font-sans font-bold text-black mb-2`}>{display.name}</h1>
        <ContactInline />
      </div>
      {/* Summary */}
      {display.summary && (
        <div className="mb-10">
          <h2 className={`text-xs font-bold uppercase mb-3 font-sans`} style={{ color: 'var(--accent)' }}>Professional Summary</h2>
          <p className="text-sm text-black leading-relaxed">{display.summary}</p>
        </div>
      )}
      {/* Experience */}
      <div className="mb-10 break-inside-avoid">
        <h2 className={`text-xs font-bold uppercase mb-3 font-sans`} style={{ color: 'var(--accent)' }}>Experience</h2>
        <ExperienceBlock />
      </div>
      {/* Education */}
      <div className="mb-10 break-inside-avoid">
        <h2 className={`text-xs font-bold uppercase mb-3 font-sans`} style={{ color: 'var(--accent)' }}>Education</h2>
        <EducationBlock />
      </div>
      {/* Projects */}
      <div className="mb-10 break-inside-avoid">
        <h2 className={`text-xs font-bold uppercase mb-3 font-sans`} style={{ color: 'var(--accent)' }}>Projects</h2>
        <ProjectsBlock />
      </div>
      {/* Skills */}
      <div className="break-inside-avoid">
        <h2 className={`text-xs font-bold uppercase mb-3 font-sans`} style={{ color: 'var(--accent)' }}>Skills</h2>
        <SkillsPills group="all" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F6F3]" style={accentVar}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-black text-white text-sm px-3 py-2 shadow no-print">PDF export ready! Check your downloads.</div>
      )}

      {/* Top Nav */}
      <nav className="h-16 bg-white border-b border-gray-300 flex items-center justify-between px-10 no-print">
        <div className="flex items-center gap-8">
          <span className="font-serif font-bold text-xl text-[#8B0000]">AI Resume Builder</span>
          <div className="flex gap-6 text-sm">
            <button onClick={() => navigate('/builder')} className="text-gray-500 hover:text-gray-900">Builder</button>
            <button onClick={() => navigate('/preview')} className="text-gray-900 font-medium border-b-2 border-[#8B0000] pb-1">Preview</button>
            <button onClick={() => navigate('/proof')} className="text-gray-500 hover:text-gray-900">Proof</button>
          </div>
        </div>
      </nav>

      {/* Preview Content */}
      <div className="flex items-center justify-center p-16">
        <div className={`w-full max-w-4xl bg-white shadow`}
        >
          {/* Action Bar: Template Thumbnails + Color Picker + Export buttons */}
          <div className="px-10 pt-8 no-print">
            <div className="flex items-center gap-4 mb-3">
              <TemplateThumb id="Classic" active={template==='Classic'} onClick={()=>setTemplate('Classic')} />
              <TemplateThumb id="Modern" active={template==='Modern'} onClick={()=>setTemplate('Modern')} />
              <TemplateThumb id="Minimal" active={template==='Minimal'} onClick={()=>setTemplate('Minimal')} />
            </div>
            <div className="flex items-center gap-3 mb-6">
              {[
                'hsl(168, 60%, 40%)', // Teal default
                'hsl(220, 60%, 35%)', // Navy
                'hsl(345, 60%, 35%)', // Burgundy
                'hsl(150, 50%, 30%)', // Forest
                'hsl(0, 0%, 25%)',    // Charcoal
              ].map(c => (
                <ColorSwatch key={c} color={c} active={accent===c} onClick={()=>setAccent(c)} />
              ))}
            </div>
            {/* Export actions */}
            <div className="flex items-center justify-between">
              <div className="text-[12px] text-gray-600">{missingCritical ? 'Your resume may look incomplete.' : ''}</div>
              <div className="flex items-center gap-3">
                <button onClick={async ()=>{ await handleCopy(); }} className="px-3 py-1.5 text-xs uppercase font-bold border border-gray-300 text-gray-700 hover:border-black">Copy Resume as Text</button>
                <button onClick={handlePrint} className="px-3 py-1.5 text-xs uppercase font-bold border border-black text-black">Download PDF</button>
              </div>
            </div>
          </div>

          {/* A4 Paper Simulation (per-template) */}
          <div className="print:bg-white">
            {template === 'Classic' && renderClassic()}
            {template === 'Modern' && renderModern()}
            {template === 'Minimal' && renderMinimal()}
          </div>
        </div>
      </div>
    </div>
  );
};
