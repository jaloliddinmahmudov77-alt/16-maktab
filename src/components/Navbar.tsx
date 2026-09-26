import React, { useState } from 'react';
import { PageTab, SchoolInfo } from '../types';
import {
  GraduationCap,
  Home,
  Info,
  Newspaper,
  Image as ImageIcon,
  Users,
  PhoneCall,
  Lock,
  Menu,
  X,
  Bot,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  schoolInfo: SchoolInfo;
  unreadMessagesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  schoolInfo,
  unreadMessagesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageTab; label: string; icon: React.ReactNode }[] = [
    { id: 'asosiy', label: 'Asosiy', icon: <Home className="w-4 h-4" /> },
    { id: 'haqida', label: 'Haqida', icon: <Info className="w-4 h-4" /> },
    { id: 'yangiliklar', label: 'Yangiliklar', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'galereya', label: 'Videolar va Rasmlar', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'jamoa', label: 'Jamoa', icon: <Users className="w-4 h-4" /> },
    { id: 'boglanish', label: 'Bog\'lanish', icon: <PhoneCall className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: PageTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header id="main-header" className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      {/* Top Banner Bar */}
      <div id="top-announcement-bar" className="bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 text-xs py-1.5 px-4 text-white">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="bg-white/20 px-2 py-0.5 rounded font-medium text-[11px] uppercase tracking-wider">
              Rasmiy Veb-Sayt
            </span>
            <span className="hidden sm:inline text-slate-100">
              O'zbekiston Respublikasi Maktabgacha va maktab ta'limi vazirligi
            </span>
          </div>
          <div className="flex items-center gap-4 ml-auto text-slate-100 font-medium">
            <a href={`tel:${schoolInfo.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-amber-300 transition-colors flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{schoolInfo.phone}</span>
            </a>
            <button
              onClick={() => handleNavClick('haqida')}
              className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 text-[11px] font-semibold transition-all"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Maktab AI Agent</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Name */}
          <div
            onClick={() => handleNavClick('asosiy')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center border border-white/10">
                <GraduationCap className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                  Sardoba Tumani
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded font-semibold">
                  16-Maktab
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent leading-tight">
                16-Sonli Maktab
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <nav id="desktop-navigation" className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Trigger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-drawer" className="lg:hidden bg-slate-900/98 border-t border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium w-full text-left transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
