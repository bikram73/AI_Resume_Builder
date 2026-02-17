import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { ResumeData } from '../types';

const initialData: ResumeData = {
  personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '' },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: ''
};

export const Builder: React.FC = () => {
  const [data, setData] = useState<ResumeData>(initialData);

  useEffect(() => {
    const saved = localStorage.getItem('resumeData');
    if (saved) setData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(data));
  }, [data]);

  const handleChange = (section: keyof ResumeData, field: string, value: string) => {
    if (section === 'personalInfo') {
      setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
    } else {
      setData(prev => ({ ...prev, [section]: value }));
    }
  };

  const addEntry = (section: 'education' | 'experience' | 'projects') => {
    const id = Date.now().toString();
    if (section === 'education') {
      setData(prev => ({ ...prev, education: [...prev.education, { id, school: 'New School', degree: 'Degree', year: '2024' }] }));
    } else if (section === 'experience') {
      setData(prev => ({ ...prev, experience: [...prev.experience, { id, company: 'New Company', role: 'Role', duration: '2024', description: 'Description' }] }));
    } else {
      setData(prev => ({ ...prev, projects: [...prev.projects, { id, name: 'New Project', description: 'Description', technologies: 'Tech' }] }));
    }
  };

  const loadSample = () => {
    setData({
      personalInfo: { fullName: 'Alex Carter', email: 'alex@example.com', phone: '123-456-7890', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/alex', github: 'github.com/alex' },
      summary: 'Experienced software engineer with a focus on building scalable web applications. Proven track record of delivering high-quality code and leading teams.',
      education: [{ id: '1', school: 'University of Technology', degree: 'B.S. Computer Science', year: '2020' }],
      experience: [{ id: '1', company: 'Tech Corp', role: 'Senior Developer', duration: '2021 - Present', description: 'Led development of core features. Improved system performance by 30%.' }],
      projects: [{ id: '1', name: 'AI Resume Builder', description: 'Built a resume builder using React.', technologies: 'React, TypeScript, Tailwind' }],
      skills: 'React, TypeScript, Node.js, Python, AWS, Docker'
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1 h-[calc(100vh-65px)]">
        {/* Left: Form */}
        <div className="w-1/2 overflow-y-auto border-r border-gray-300 bg-white p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Editor</h2>
            <button onClick={loadSample} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Load Sample Data</button>
          </div>
          
          <div className="space-y-10">
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Personal Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Full Name" className="p-3 bg-gray-50 border border-gray-200 rounded focus:border-black outline-none transition-colors" value={data.personalInfo.fullName} onChange={e => handleChange('personalInfo', 'fullName', e.target.value)} />
                <input placeholder="Email" className="p-3 bg-gray-50 border border-gray-200 rounded focus:border-black outline-none transition-colors" value={data.personalInfo.email} onChange={e => handleChange('personalInfo', 'email', e.target.value)} />
                <input placeholder="Phone" className="p-3 bg-gray-50 border border-gray-200 rounded focus:border-black outline-none transition-colors" value={data.personalInfo.phone} onChange={e => handleChange('personalInfo', 'phone', e.target.value)} />
                <input placeholder="Location" className="p-3 bg-gray-50 border border-gray-200 rounded focus:border-black outline-none transition-colors" value={data.personalInfo.location} onChange={e => handleChange('personalInfo', 'location', e.target.value)} />
                <input placeholder="LinkedIn" className="p-3 bg-gray-50 border border-gray-200 rounded focus:border-black outline-none transition-colors" value={data.personalInfo.linkedin} onChange={e => handleChange('personalInfo', 'linkedin', e.target.value)} />
                <input placeholder="GitHub" className="p-3 bg-gray-50 border border-gray-200 rounded focus:border-black outline-none transition-colors" value={data.personalInfo.github} onChange={e => handleChange('personalInfo', 'github', e.target.value)} />
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Summary</h3>
              <textarea placeholder="Professional Summary..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded h-32 focus:border-black outline-none transition-colors resize-none" value={data.summary} onChange={e => handleChange('summary', '', e.target.value)} />
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Experience</h3>
                <button onClick={() => addEntry('experience')} className="text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors">+ Add</button>
              </div>
              {data.experience.map((exp) => (
                <div key={exp.id} className="p-4 border border-gray-200 rounded mb-3 bg-gray-50">
                  <div className="font-bold text-gray-900">{exp.company || 'Company Name'}</div>
                  <div className="text-sm text-gray-500">{exp.role || 'Role'}</div>
                </div>
              ))}
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Education</h3>
                <button onClick={() => addEntry('education')} className="text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors">+ Add</button>
              </div>
              {data.education.map((edu) => (
                <div key={edu.id} className="p-4 border border-gray-200 rounded mb-3 bg-gray-50">
                  <div className="font-bold text-gray-900">{edu.school || 'School Name'}</div>
                  <div className="text-sm text-gray-500">{edu.degree || 'Degree'}</div>
                </div>
              ))}
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Projects</h3>
                <button onClick={() => addEntry('projects')} className="text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors">+ Add</button>
              </div>
              {data.projects.map((proj) => (
                <div key={proj.id} className="p-4 border border-gray-200 rounded mb-3 bg-gray-50">
                  <div className="font-bold text-gray-900">{proj.name || 'Project Name'}</div>
                </div>
              ))}
            </section>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Skills</h3>
              <input placeholder="React, Node.js, TypeScript..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:border-black outline-none transition-colors" value={data.skills} onChange={e => handleChange('skills', '', e.target.value)} />
            </section>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="w-1/2 bg-gray-200 p-8 overflow-y-auto flex justify-center items-start">
          <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[20mm] text-sm text-black">
             <div className="text-center border-b-2 border-black pb-6 mb-6">
               <h1 className="text-4xl font-serif font-bold uppercase tracking-widest mb-3">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
               <div className="flex justify-center gap-4 text-xs font-medium tracking-wide uppercase text-gray-600">
                 {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                 {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                 {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
               </div>
             </div>

             {data.summary && (
               <div className="mb-8">
                 <h2 className="font-bold uppercase text-sm tracking-widest border-b border-gray-300 mb-3 pb-1">Professional Summary</h2>
                 <p className="leading-relaxed text-justify">{data.summary}</p>
               </div>
             )}

             {data.experience.length > 0 && (
               <div className="mb-8">
                 <h2 className="font-bold uppercase text-sm tracking-widest border-b border-gray-300 mb-4 pb-1">Experience</h2>
                 {data.experience.map(exp => (
                   <div key={exp.id} className="mb-4">
                     <div className="flex justify-between items-baseline mb-1">
                       <span className="font-bold text-base">{exp.company}</span>
                       <span className="text-xs font-medium">{exp.duration}</span>
                     </div>
                     <div className="italic text-gray-700 mb-2">{exp.role}</div>
                     <p className="text-sm leading-relaxed">{exp.description}</p>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};