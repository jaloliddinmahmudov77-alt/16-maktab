import React from 'react';
import { VideoItem } from '../types';
import { openVideo } from '../utils/videoUtils';
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
  videoList: VideoItem[];
  selectedVideo: VideoItem | null;
  setSelectedVideo: (video: VideoItem | null) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  videoList,
  selectedVideo,
  setSelectedVideo,
}) => {
  return (
    <div id="gallery-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5" />
          Media Galereya
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Maktab Hayotidan Videolar
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          16-sonli maktabimizdagi tadbirlar, o'quv jarayonlari va maktab hayotidan video lavhalar.
        </p>
      </div>

      {/* VIDEOS TAB CONTENT */}
      {videoList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoList.map((video) => (
            <div
              key={video.id}
              onClick={() => openVideo(video, setSelectedVideo)}
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
                {video.duration && (
                  <span className="absolute bottom-3 right-3 bg-slate-950/90 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-md border border-white/10">
                    {video.duration}
                  </span>
                )}
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
                {selectedVideo.duration && (
                  <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-white">
                    Davomiyligi: {selectedVideo.duration}
                  </span>
                )}
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
