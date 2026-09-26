import React from 'react';
import { PageTab, SchoolInfo } from '../types';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  ShieldCheck,
  ArrowUp,
  Heart,
  Bot,
  Lock,
} from 'lucide-react';

interface FooterProps {
  schoolInfo: SchoolInfo;
  setActiveTab: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ schoolInfo, setActiveTab }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-8 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Branding & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-snug">
                  Sardoba Tumani 16-Maktab
                </h3>
                <p className="text-xs text-emerald-400 font-medium">
                  Umumiy o'rta ta'lim muassasasi
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              O'quvchilarimizga chuqur va har taraflama bilim berish, zamonaviy axborot texnologiyalarini o'rgatish hamda sog'lom va barkamol avlodni tarbiyalash maktabimizning asosiy maqsadidir.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveTab('haqida');
                  scrollToTop();
                }}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-blue-400 hover:text-blue-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Maktab AI Yordamchisiga o'tish</span>
              </button>
            </div>
          </div>

          {/* Column 2: Legal & Official Data */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Rasmiy Ma'lumotlar
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Tashkil etilgan yili:</strong> {schoolInfo.foundedDate}</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Tashkiliy-huquqiy shakli:</strong> {schoolInfo.legalForm}</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Yuqori tashkilot:</strong> {schoolInfo.parentMinistry}</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base">Bo'limlar</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {[
                { id: 'asosiy', label: 'Asosiy Sahifa' },
                { id: 'haqida', label: 'Maktab Haqida va AI' },
                { id: 'yangiliklar', label: 'Maktab Yangiliklari' },
                { id: 'galereya', label: 'Rasmlar va Videolar' },
                { id: 'jamoa', label: 'O\'qituvchilar va Jamoa' },
                { id: 'boglanish', label: 'Bog\'lanish va Manzil' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setActiveTab(link.id as PageTab);
                      scrollToTop();
                    }}
                    className="hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <span className="text-blue-500">›</span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              Manzil va Aloqa
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                <span>{schoolInfo.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${schoolInfo.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-emerald-300 font-semibold text-slate-200">
                  {schoolInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{schoolInfo.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{schoolInfo.workHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <p>© {new Date().getFullYear()} Sardoba tumani 16-sonli maktab. Barcha huquqlar himoyalangan.</p>
            <button
              onClick={() => {
                setActiveTab('admin');
                scrollToTop();
              }}
              className="text-slate-600 hover:text-slate-400 p-1 rounded transition-colors"
              title="Admin Panelga kirish"
              aria-label="Admin panel"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Ta'lim va kelajak uchun yaratildi <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </span>
            <button
              onClick={scrollToTop}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 p-2 rounded-lg border border-slate-800 transition-colors"
              title="Tepaga qaytish"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
