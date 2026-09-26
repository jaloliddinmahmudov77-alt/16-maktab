import React, { useState } from 'react';
import { NewsItem } from '../types';
import {
  Newspaper,
  Search,
  Calendar,
  Eye,
  ArrowRight,
  X,
  Share2,
  Tag,
  Clock,
} from 'lucide-react';

interface NewsViewProps {
  newsList: NewsItem[];
  selectedNews: NewsItem | null;
  setSelectedNews: (news: NewsItem | null) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({
  newsList,
  selectedNews,
  setSelectedNews,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Barchasi', 'Tadbirlar', 'Tanlovlar', 'Ta\'lim', 'Sport', 'E\'lonlar'];

  const filteredNews = newsList.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Barchasi' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="news-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
          <Newspaper className="w-3.5 h-3.5" />
          Maktab Hayoti
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Maktab Yangiliklari va E'lonlar
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          16-sonli maktabimizdagi so'nggi voqealar, tanlovlar g'oliblari va o'quv jarayoni e'lonlari.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Yangilik izlash..."
            className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* News Cards Grid */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 text-slate-400 space-y-2">
          <p className="text-base font-semibold">Hech qanday yangilik topilmadi</p>
          <p className="text-xs text-slate-500">Qidiruv so'rovini yoki kategoriyani o'zgartirib ko'ring.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              onClick={() => setSelectedNews(news)}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-2xl transition-all cursor-pointer group flex flex-col"
            >
              <div className="relative h-52 overflow-hidden bg-slate-950">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-md">
                  {news.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      {news.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {news.views}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {news.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {news.summary}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-blue-400 font-semibold border-t border-slate-800">
                  <span>To'liq o'qish</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed News Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-slate-950/80 hover:bg-slate-800 text-white rounded-full flex items-center justify-center border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 sm:h-80 bg-slate-950">
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              <span className="absolute bottom-4 left-6 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                {selectedNews.category}
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-4 text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  {selectedNews.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  {selectedNews.views} marotaba ko'rildi
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {selectedNews.title}
              </h2>

              <p className="text-sm text-slate-300 font-medium leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                {selectedNews.summary}
              </p>

              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-3 pt-2">
                {selectedNews.content}
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">Sardoba tumani 16-sonli maktab matbuot xizmati</span>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
