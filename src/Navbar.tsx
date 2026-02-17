import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-xl font-serif font-bold text-gray-900 tracking-tight">AI Resume Builder</Link>
      </div>
      <div className="flex gap-8 text-sm font-medium text-gray-500">
        <Link to="/builder" className={`transition-colors ${isActive('/builder') ? 'text-black font-bold' : 'hover:text-black'}`}>Builder</Link>
        <Link to="/preview" className={`transition-colors ${isActive('/preview') ? 'text-black font-bold' : 'hover:text-black'}`}>Preview</Link>
        <Link to="/proof" className={`transition-colors ${isActive('/proof') ? 'text-black font-bold' : 'hover:text-black'}`}>Proof</Link>
      </div>
    </nav>
  );
};