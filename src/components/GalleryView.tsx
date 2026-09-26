import React, { useState } from 'react';
import { PhotoItem, VideoItem } from '../types';
import {
  Image as ImageIcon,
  Video,
  Play,
  Calendar,
  X,
  Tag,
  Maximize2,
  Film,
} from 'lucide-react';

interface GalleryViewProps {
  photoList: PhotoItem[];
  videoList: VideoItem[];
  selectedVideo: VideoItem | null;
  setSelectedVideo: (video: VideoItem | null) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  photoList,
  videoList,
  selectedVideo,
  setSelectedVideo,
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'videos'>('photos');
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState<string>('Barchasi');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const photoCategories = ['Barchasi', 'Maktab hayoti', 'Tadbirlar', 'Dars jarayoni', 'Sport', 'Sinflar'];

  const filteredPhotos = photoList.filter(
    (p) => selectedPhotoCategory === 'Barchasi' || p.category === selectedPhotoCategory
  );

  return (
    <div id="gallery-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5" />
          Media Galereya
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Videolar va Fotolavhalar
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          16-sonli maktabimizning foto va video arxivlari, tadbirlar, o'quv jarayonlari hamda sport musobaqalaridan lavhalar.
        </p>
      </div>

      {/* Primary Tab Toggle (Photos vs Videos) */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-2 shadow-xl">
          <button
            onClick={() => setActiveMediaTab('photos')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeMediaTab === 'photos'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Fotogalereya ({photoList.length})</span>
          </button>

          <button
            onClick={() => setActiveMediaTab('videos')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeMediaTab === 'videos'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Lavhalar ({videoList.length})</span>
          </button>
        </div>
      </div>

      {/* PHOTOS TAB CONTENT */}
      {activeMediaTab === 'photos' && (
        <div className="space-y-6">
          {/* Photo Category Chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {photoCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedPhotoCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedPhotoCategory === cat
                    ? 'bg-slate-800 text-blue-400 border border-blue-500/40 shadow-md'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photo Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group cursor-pointer hover:border-slate-700 transition-all shadow-lg"
              >
                <div className="relative h-60 overflow-hidden bg-slate-950">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                    <span className="self-end bg-slate-950/80 text-white p-2 rounded-xl border border-white/10">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded uppercase">
                        {photo.category}
                      </span>
                      <h3 className="text-white font-bold text-sm mt-1">{photo.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
                  <span className="font-semibold text-slate-200 line-clamp-1">{photo.title}</span>
                  <span className="shrink-0 text-slate-500">{photo.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIDEOS TAB CONTENT */}
      {activeMediaTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoList.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all cursor-pointer group flex flex-col shadow-xl"
            >
              <div className="relative h-56 overflow-hidden bg-slate-950">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-slate-950 ml-1" />
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 bg-slate-950/90 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-md border border-white/10">
                  {video.duration}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{video.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div className="pt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <span>Videoni ijro etish</span>
                  <Play className="w-3 h-3 fill-emerald-400 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PHOTO LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-slate-950/80 hover:bg-slate-800 text-white rounded-full flex items-center justify-center border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                  {selectedPhoto.category}
                </span>
                <span className="text-xs text-slate-400">{selectedPhoto.date}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{selectedPhoto.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PLAYER MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-slate-950/80 hover:bg-slate-800 text-white rounded-full flex items-center justify-center border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Frame */}
            <div className="relative aspect-video bg-slate-950">
              <iframe
                src={`${selectedVideo.videoUrl}?autoplay=1`}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedVideo.date}
                </span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-white">
                  Davomiyligi: {selectedVideo.duration}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{selectedVideo.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
