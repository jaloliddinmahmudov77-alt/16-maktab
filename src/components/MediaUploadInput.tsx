import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, HardDrive, Check, X, Film, Image as ImageIcon } from 'lucide-react';

interface MediaUploadInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'image' | 'video';
  placeholder?: string;
  required?: boolean;
}

export const MediaUploadInput: React.FC<MediaUploadInputProps> = ({
  label,
  value,
  onChange,
  type = 'image',
  placeholder = 'https://...',
  required = false,
}) => {
  // Mode: 'file' (C:, D: disk) or 'url' (Internet URL)
  const isDataUrl = value?.startsWith('data:');
  const [mode, setMode] = useState<'file' | 'url'>(isDataUrl ? 'file' : 'url');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (file: File) => {
    if (!file) return;

    // Fayl hajmi tekshiruvi (video uchun 40MB, rasm uchun 15MB)
    const maxMb = type === 'video' ? 40 : 15;
    if (file.size > maxMb * 1024 * 1024) {
      alert(`Fayl hajmi juda katta! Iltimos ${maxMb}MB dan kichikroq fayl tanlang.`);
      return;
    }

    setLoading(true);
    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
      setLoading(false);
    };
    reader.onerror = () => {
      alert("Faylni o'qishda xatolik yuz berdi!");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearSelection = () => {
    onChange('');
    setFileName('');
    setFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          {type === 'video' ? <Film className="w-3.5 h-3.5 text-emerald-400" /> : <ImageIcon className="w-3.5 h-3.5 text-blue-400" />}
          {label} {required && <span className="text-rose-400">*</span>}
        </label>

        {/* 2 Ta Yo'l Tanlash Tugmalari: Kompyuter diskidan YOKI Internet URL */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
          <button
            type="button"
            onClick={() => setMode('file')}
            className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'file'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HardDrive className="w-3 h-3" />
            <span>C: / D: Diskdan</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'url'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>URL Havola</span>
          </button>
        </div>
      </div>

      {/* 1-USUL: KOMPYUTERNING C: VA D: DISKIDAN YUKLASH */}
      {mode === 'file' ? (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={type === 'video' ? 'video/mp4,video/webm,video/ogg,video/*' : 'image/*'}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-700 bg-slate-950/80 hover:border-slate-600 hover:bg-slate-950'
            }`}
          >
            {loading ? (
              <div className="py-3 flex items-center justify-center gap-2 text-xs text-blue-400">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Fayl o'qilmoqda...</span>
              </div>
            ) : value ? (
              <div className="flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3 overflow-hidden">
                  {type === 'image' ? (
                    <img
                      src={value}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0 bg-slate-900"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <Film className="w-6 h-6" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">
                      {fileName || 'Kompyuterdan tanlangan fayl'}
                    </p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                      <Check className="w-3 h-3" /> Yuklandi {fileSize ? `(${fileSize})` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-blue-400 font-semibold hover:underline">
                    O'zgartirish
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection();
                    }}
                    className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                    title="O'chirish"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-2 space-y-1">
                <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-1.5 border border-blue-500/20">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-white">
                  Kompyuterdan {type === 'video' ? 'video' : 'rasm'} faylini tanlang
                </p>
                <p className="text-[11px] text-slate-400">
                  C: yoki D: diskdagi fayllarni bosing yoki shu yerga sudrab tashlang
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 2-USUL: URL HAVOLA ORQALI */
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={value?.startsWith('data:') ? '' : value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              required={required && !value}
              className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            {value && !value.startsWith('data:') && (
              <button
                type="button"
                onClick={clearSelection}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {value && !value.startsWith('data:') && type === 'image' && (
            <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
              <img
                src={value}
                alt="Preview"
                className="w-10 h-10 rounded-lg object-cover border border-slate-700 bg-slate-900 shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-[11px] text-slate-400 truncate">URL orqali rasm yuklandi</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
