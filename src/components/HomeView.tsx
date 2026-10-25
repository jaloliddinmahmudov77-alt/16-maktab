import React from 'react';
import { PageTab, SchoolInfo, NewsItem, VideoItem } from '../types';
import { openVideo } from '../utils/videoUtils';
import { HeroSection } from './HeroSection';
import {
  Newspaper,
  Video,
  Image as ImageIcon,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle,
  Eye,
  Play,
  Calendar,
  Building2,
  ShieldCheck,
  MapPin,
  Bot,
} from 'lucide-react';

interface HomeViewProps {
  schoolInfo: SchoolInfo;
  newsList: NewsItem[];
  videoList: VideoItem[];
  setActiveTab: (tab: PageTab) => void;
  setSelectedNews: (news: NewsItem) => void;
  setSelectedVideo: (video: VideoItem) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  schoolInfo,
  newsList,
  videoList,
  setActiveTab,
  setSelectedNews,
  setSelectedVideo,
}) => {
  const featuredNews = newsList.slice(0, 3);
  const recentVideos = videoList.slice(0, 2);

  return (
    <div id="home-view" className="space-y-16 pb-16">
      {/* Hero Header */}
      <HeroSection schoolInfo={schoolInfo} setActiveTab={setActiveTab} />

      {/* Ticker / Announcement Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-slate-900 border border-blue-500/30 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white font-bold text-xs px-3 py-1 rounded-lg uppercase tracking-wider animate-pulse flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              E'lon
            </span>
            <p className="text-sm text-slate-200 font-medium line-clamp-1">
              2026-2027 o'quv yili uchun o'quvchilarni 1-sinfga va to'garaklarga qabul qilish davom etmoqda.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('boglanish')}
            className="text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition-all shrink-0 flex items-center gap-1.5"
          >
            <span>Qabul bo'yicha bog'lanish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Official Legal Summary Section */}
      <section id="home-official-info" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Rasmiy va Yuridik Ma'lumotlar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Sardoba Tumani 16-Sonli Davlat O'rta Ta'lim Maktabi
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {schoolInfo.activityType}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-slate-400">STIR (ИНН) raqami</div>
                    <div className="text-white font-bold text-sm">{schoolInfo.stir}</div>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <div className="text-slate-400">Tashkil etilgan yili</div>
                    <div className="text-white font-bold text-sm">{schoolInfo.foundedDate}</div>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <div className="text-slate-400">Tashkiliy shakli</div>
                    <div className="text-white font-bold text-sm">Davlat Muassasasi (100%)</div>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-slate-400">Manzil</div>
                    <div className="text-white font-bold text-xs line-clamp-1">{schoolInfo.address}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
                <Bot className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-white font-bold text-lg">Maktab AI Agentidan So'rang</h3>
              <p className="text-xs text-slate-400">
                Savollaringiz bormi? AI Yordamchi maktab haqida istalgan ma'lumotni tezkor taqdim etadi.
              </p>
              <button
                onClick={() => {
                  setActiveTab('haqida');
                  window.scrollTo({ top: 450, behavior: 'smooth' });
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI bilan muloqot qilish</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured News Section */}
      <section id="home-featured-news" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Newspaper className="w-4 h-4" />
              <span>So'nggi Voqealar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Maktab Yangiliklari
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('yangiliklar')}
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
          >
            <span>Barchasini ko'rish</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredNews.map((news) => (
            <div
              key={news.id}
              onClick={() => setSelectedNews(news)}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-xl transition-all cursor-pointer group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow">
                  {news.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      {news.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {news.views} ko'rildi
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {news.summary}
                  </p>
                </div>
                <div className="pt-2 text-xs text-blue-400 font-semibold flex items-center gap-1 group-hover:underline">
                  <span>Batafsil o'qish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Videos Preview Section */}
      <section id="home-video-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Video className="w-4 h-4" />
              <span>Video Lavhalar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Maktabimiz Hayotidan Videolar
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('galereya')}
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
          >
            <span>Barcha Videolar</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentVideos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => openVideo(vid, setSelectedVideo)}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all cursor-pointer group"
            >
              <div className="relative h-60 overflow-hidden bg-slate-950">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-slate-950 ml-1" />
                  </div>
                </div>
                {vid.duration && (
                  <span className="absolute bottom-3 right-3 bg-slate-950/80 text-white text-xs font-mono font-semibold px-2.5 py-1 rounded-md border border-white/10">
                    {vid.duration}
                  </span>
                )}
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {vid.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {vid.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Call & Contact CTA Banner */}
      <section id="home-cta-banner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-500/30 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Savollaringiz Bormi?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold">
              Sardoba Tumani 16-Maktab Bilan Bog'laning
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Maktabimizga tashrif buyuring yoki telefon orqali ma'lumot oling. Har qanday savollarga javob berishga tayyormiz!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={`tel:${schoolInfo.phone.replace(/[^0-9+]/g, '')}`}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-lg flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Qo'ng'iroq qilish ({schoolInfo.phone})</span>
              </a>
              <button
                onClick={() => setActiveTab('boglanish')}
                className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-semibold px-6 py-3.5 rounded-2xl text-sm transition-all"
              >
                <span>Xabar Qoldirish</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
