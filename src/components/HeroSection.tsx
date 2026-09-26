import React from 'react';
import { PageTab, SchoolInfo } from '../types';
import {
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Sparkles,
  PhoneCall,
  Play,
  ArrowRight,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface HeroSectionProps {
  schoolInfo: SchoolInfo;
  setActiveTab: (tab: PageTab) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ schoolInfo, setActiveTab }) => {
  return (
    <div id="hero-section" className="relative bg-slate-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden min-h-[520px] flex flex-col justify-center">
      {/* Background Image with High-Contrast Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={schoolInfo.heroBgImage || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=2000&q=80"}
          alt="Sardoba 16-maktab binosi orqa foni"
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.75]"
        />
        {/* Multilayer gradient dark overlay to ensure readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/80 to-slate-950/95"></div>
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1.5px]"></div>
      </div>

      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[500px] bg-gradient-to-tr from-blue-600/25 via-indigo-600/20 to-emerald-500/15 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Centered Hero Content */}
        <div className="max-w-4xl mx-auto text-center space-y-6 flex flex-col items-center justify-center">
          
          {/* School Tag Badge - Centered */}
          <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 p-1.5 pr-4 rounded-full text-xs font-semibold text-slate-200 shadow-2xl backdrop-blur-md">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <GraduationCap className="w-3.5 h-3.5" />
              Sardoba Tumani
            </span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              16-Sonli O'rta Maktab
            </span>
          </div>

          {/* Main Headline - Centered */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.14] drop-shadow-md">
            Zamonaviy bilim, <br />
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-300 bg-clip-text text-transparent">
              Yuksak ma'naviyat
            </span>{' '}
            va kelajak sari!
          </h1>

          {/* Description - Centered */}
          <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-sm">
            Sardoba tumani Qo'rg'ontepa MFYda joylashgan 16-sonli davlat ta'lim muassasasi. 2000-yildan buyon yoshlarga chuqur bilim berib, ularning iqtidorini ro'yobga chiqarib kelmoqda.
          </p>

          {/* Call to Action Buttons - Centered */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => {
                setActiveTab('haqida');
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 text-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>Maktab AI Yordamchisidan so'rash</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setActiveTab('galereya');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-semibold px-5 py-3.5 rounded-2xl transition-all flex items-center gap-2 text-sm backdrop-blur-md cursor-pointer hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
              <span>Videolarni tomosha qilish</span>
            </button>

            <a
              href={`tel:${schoolInfo.phone.replace(/[^0-9+]/g, '')}`}
              className="bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-500/50 font-semibold px-4 py-3.5 rounded-2xl transition-all flex items-center gap-2 text-sm backdrop-blur-md hover:scale-[1.02]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{schoolInfo.phone}</span>
            </a>
          </div>

          {/* Quick Legal Strip - Centered */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 border-t border-slate-800/80 w-full max-w-xl mx-auto">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <strong>STIR:</strong> {schoolInfo.stir || "200000000"}
            </span>
            <span className="text-slate-600">•</span>
            <span><strong>OKED:</strong> 85200</span>
            <span className="text-slate-600">•</span>
            <span><strong>Davlat Muassasasi</strong> (100% Davlat)</span>
          </div>
        </div>

        {/* Bottom Statistics Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-slate-800/80">
          <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-colors shadow-lg text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 mx-auto sm:mx-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{schoolInfo.stats.studentsCount}+</div>
            <div className="text-xs text-slate-300 font-medium mt-1">O'quvchilar soni</div>
          </div>

          <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-colors shadow-lg text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 mx-auto sm:mx-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{schoolInfo.stats.teachersCount}</div>
            <div className="text-xs text-slate-300 font-medium mt-1">Oliy toifali o'qituvchilar</div>
          </div>

          <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-colors shadow-lg text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 mx-auto sm:mx-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{schoolInfo.stats.classroomsCount}</div>
            <div className="text-xs text-slate-300 font-medium mt-1">Jihozlangan sinfxonalar</div>
          </div>

          <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-colors shadow-lg text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 mx-auto sm:mx-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">2000-yil</div>
            <div className="text-xs text-slate-300 font-medium mt-1">Davlat ro'yxatidan o'tgan</div>
          </div>
        </div>
      </div>
    </div>
  );
};
