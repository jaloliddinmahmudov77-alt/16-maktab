import React from 'react';
import { SchoolInfo } from '../types';
import { SchoolAiChat } from './SchoolAiChat';
import {
  Building2,
  ShieldCheck,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  GraduationCap,
  Users,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface AboutViewProps {
  schoolInfo: SchoolInfo;
}

export const AboutView: React.FC<AboutViewProps> = ({ schoolInfo }) => {
  return (
    <div id="about-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5" />
          Sardoba Tumani 16-Maktab
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
          Maktabimiz Haqida va Rasmiy Ma'lumotlar
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Sardoba tumani 16-sonli umumiy o'rta ta'lim maktabi tarixi, yuridik ma'lumotlari, rahbariyat va AI intellektual yordamchisi.
        </p>
      </div>

      {/* Official Legal Cards Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Rasmiy va Yuridik Ma'lumotlar</h2>
            <p className="text-xs text-slate-400">Maktabning davlat ro'yxatidan o'tgan rasmiy hujjatlari rekvizitlari</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold">
              <Calendar className="w-4 h-4" />
              <span>Tashkil Etilgan Yili</span>
            </div>
            <div className="text-white font-extrabold text-base">{schoolInfo.foundedDate}</div>
            <p className="text-xs text-slate-400">Muassasa 2000-yil 28-sentabrda davlat roʻyxatidan oʻtgan hamda doimiy faoliyat koʻrsatib kelmoqda.</p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
              <Building2 className="w-4 h-4" />
              <span>Tashkiliy-Huquqiy Shakli</span>
            </div>
            <div className="text-white font-bold text-sm">{schoolInfo.legalForm}</div>
            <p className="text-xs text-slate-400">100% davlat mulkchiligidagi ijtimoiy-ma'rifiy muassasa.</p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>Yuqori Turuvchi Vazirlik</span>
            </div>
            <div className="text-white font-bold text-sm leading-snug">{schoolInfo.parentMinistry}</div>
            <p className="text-xs text-slate-400">Maktabgacha va maktab ta'limi vazirligi tizimida.</p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
              <MapPin className="w-4 h-4" />
              <span>Aniq Manzili</span>
            </div>
            <div className="text-white font-bold text-xs leading-relaxed">{schoolInfo.address}</div>
            <p className="text-[11px] text-amber-300 italic">{schoolInfo.mapNote}</p>
          </div>
        </div>
      </div>

      {/* AI ASSISTANT EMBEDDED SECTION (Directly requested by user in Haqida) */}
      <section id="about-ai-assistant" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-max mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              AI Intellektual Interaktiv Tizim
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              16-Maktab AI Yordamchisi bilan Muloqot
            </h2>
          </div>
        </div>

        <div className="bg-slate-950 p-2 sm:p-4 rounded-3xl border border-slate-800 shadow-2xl">
          {/* AI Chat Bot Component */}
          <SchoolAiChat schoolInfo={schoolInfo} />
        </div>
      </section>

      {/* School Principal & Leadership */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-400" />
          Maktab Rahbariyati
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
            <img
              src={schoolInfo.principalImage}
              alt={schoolInfo.principalName}
              className="w-36 h-36 rounded-2xl object-cover border-4 border-blue-500/40 shadow-xl"
            />
            <div>
              <h3 className="text-lg font-bold text-white">{schoolInfo.principalName}</h3>
              <p className="text-xs font-semibold text-emerald-400">{schoolInfo.principalTitle}</p>
              <p className="text-xs text-slate-400 mt-1">{schoolInfo.phone}</p>
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4" />
              Direktor Murojaati
            </h4>
            <blockquote className="text-sm sm:text-base text-slate-200 italic leading-relaxed">
              "{schoolInfo.principalMessage}"
            </blockquote>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                ✓ Ta'lim sifati nazorati
              </span>
              <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                ✓ Zamonaviy infratuzilma
              </span>
              <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                ✓ Ma'naviy-ma'rifiy tarbiya
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* History & Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          Maktab Tarixi va Rivojlanish Bosqichlari
        </h2>

        <div className="space-y-6 relative border-l-2 border-slate-800 ml-4 pl-6">
          <div className="relative">
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900"></div>
            <span className="text-xs font-bold text-blue-400">2000-yil 28-sentabr</span>
            <h3 className="text-base font-bold text-white">Maktab tashkil etilishi</h3>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              Sardoba tumani Qo'rg'ontepa MFY hududida 16-sonli davlat ta'lim muassasasi rasman davlat ro'yxatidan o'tib, dastlabki o'quvchilarga o'z eshiklarini ochdi.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900"></div>
            <span className="text-xs font-bold text-emerald-400">2018-2020 yillar</span>
            <h3 className="text-base font-bold text-white">Kapital ta'mirlash va zamonaviylashtirish</h3>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              Maktab binosi to'liq zamonaviy ta'mirdan chiqarildi. Kompyuter sinfi, laboratoriya xonalari va sport zali yangi jihozlar bilan ta'minlandi.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-900"></div>
            <span className="text-xs font-bold text-indigo-400">Bugungi kun</span>
            <h3 className="text-base font-bold text-white">Raqamli ta'lim va AI texnologiyalari</h3>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              Hozirgi kunda maktabda 480 dan ortiq o'quvchiga 38 nafar oliy malakali o'qituvchi saboq bermoqda. O'quvchilarimiz turli fan olimpiadalari va tanlovlarda faol ishtirok etib kelmoqda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
