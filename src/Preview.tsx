import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ResumeData } from '../types';

export const Preview: React.FC = () => {
  const [data, setData] = useState<ResumeData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('resumeData');
    if (saved) setData(JSON.parse(saved));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex justify-center py-10">
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-xl p-[20mm] text-sm text-black">
           {/* Header */}
           <div className="text-center border-b-2 border-black pb-6 mb-6">
             <h1 className="text-4xl font-serif font-bold uppercase tracking-widest mb-3">{data.personalInfo.fullName}</h1>
             <div className="flex justify-center gap-4 text-xs font-medium tracking-wide uppercase text-gray-600">
               {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
               {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
               {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
             </div>
             <div className="flex justify-center gap-4 text-xs font-medium tracking-wide uppercase text-gray-600 mt-1">
               {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
               {data.personalInfo.github && <span>{data.personalInfo.github}</span>}
             </div>
           </div>

           {/* Summary */}
           {data.summary && (
             <div className="mb-8">
               <h2 className="font-bold uppercase text-sm tracking-widest border-b border-gray-300 mb-3 pb-1">Professional Summary</h2>
               <p className="leading-relaxed text-justify">{data.summary}</p>
             </div>
           )}

           {/* Experience */}
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

           {/* Education */}
           {data.education.length > 0 && (
             <div className="mb-8">
               <h2 className="font-bold uppercase text-sm tracking-widest border-b border-gray-300 mb-4 pb-1">Education</h2>
               {data.education.map(edu => (
                 <div key={edu.id} className="mb-2">
                   <div className="flex justify-between items-baseline">
                     <span className="font-bold text-base">{edu.school}</span>
                     <span className="text-xs font-medium">{edu.year}</span>
                   </div>
                   <div className="text-gray-800">{edu.degree}</div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};