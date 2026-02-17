import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Preview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      {/* Top Nav */}
      <nav className="h-16 bg-white border-b border-gray-300 flex items-center justify-between px-10">
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
        <div className="w-full max-w-4xl bg-white shadow-2xl">
          {/* A4 Paper Simulation */}
          <div className="p-16">
            {/* Header */}
            <div className="text-center mb-10 pb-8 border-b-2 border-black">
              <h1 className="text-4xl font-serif font-bold text-black mb-3 tracking-tight">
                Jane Doe
              </h1>
              <div className="text-sm text-gray-800 space-x-3">
                <span>jane.doe@email.com</span>
                <span>•</span>
                <span>+1 (555) 123-4567</span>
                <span>•</span>
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-3 border-b border-black pb-1">
                Professional Summary
              </h2>
              <p className="text-sm text-black leading-relaxed">
                Experienced software engineer with 5+ years building scalable web applications. 
                Passionate about clean code and user experience.
              </p>
            </div>

            {/* Experience */}
            <div className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-3 border-b border-black pb-1">
                Experience
              </h2>
              <div className="mb-5">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-black">Senior Software Engineer</h3>
                  <span className="text-xs text-gray-700">2020 - Present</span>
                </div>
                <p className="text-sm text-gray-800 mb-2">Tech Corp</p>
                <p className="text-sm text-black leading-relaxed">
                  Led development of microservices architecture serving 1M+ users. 
                  Improved system performance by 40% through optimization.
                </p>
              </div>
            </div>

            {/* Education */}
            <div className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-3 border-b border-black pb-1">
                Education
              </h2>
              <div className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-black">Bachelor of Science in Computer Science</h3>
                  <p className="text-sm text-gray-800">Stanford University</p>
                </div>
                <span className="text-xs text-gray-700">2018</span>
              </div>
            </div>

            {/* Projects */}
            <div className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-3 border-b border-black pb-1">
                Projects
              </h2>
              <div className="mb-4">
                <h3 className="font-bold text-black">AI Resume Builder</h3>
                <p className="text-sm text-black leading-relaxed mb-1">
                  Built premium resume builder with live preview and export functionality
                </p>
                <p className="text-xs text-gray-700 italic">React, TypeScript, Tailwind CSS</p>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-3 border-b border-black pb-1">
                Skills
              </h2>
              <p className="text-sm text-black">
                React, TypeScript, Node.js, Python, AWS, Docker, PostgreSQL, GraphQL
              </p>
            </div>

            {/* Links */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-3 border-b border-black pb-1">
                Links
              </h2>
              <div className="text-sm text-black space-y-1">
                <div>GitHub: github.com/janedoe</div>
                <div>LinkedIn: linkedin.com/in/janedoe</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
