import React, { useState, useEffect } from 'react';
import {
  SchoolInfo,
  NewsItem,
  PhotoItem,
  VideoItem,
  TeacherItem,
  ContactMessage,
} from '../types';
import {
  Lock,
  Key,
  Building2,
  Newspaper,
  Image as ImageIcon,
  Video,
  Users,
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  X,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Eye,
  FileText,
  ChevronDown,
  BookOpen,
  Download,
  UploadCloud,
  Shield,
  AlertTriangle,
  Crown,
} from 'lucide-react';
import { MediaUploadInput } from './MediaUploadInput';
import {
  isDirectorTeacher,
  isDeputyDirector,
  sortTeachersDirectorFirst,
} from '../utils/teacherUtils';

const STANDARD_SUBJECTS = [
  'Matematika',
  'Informatika va AKT',
  'Fizika',
  'Kimyo',
  'Biologiya',
  'Ona tili va adabiyot',
  "O'zbek tili",
  'Rus tili',
  'Ingliz tili',
  'Nemis tili',
  'Tarix',
  'Huquq',
  'Geografiya',
  "Boshlang'ich ta'lim",
  'Jismoniy tarbiya (Sport)',
  'Musiqa madaniyati',
  "Tasviriy san'at va chizmachilik",
  'Texnologiya (Mehnat)',
  'Tarbiya',
  'Iqtisodiy bilim asoslari',
];

const TEACHER_CATEGORIES = [
  'Aniq fanlar',
  'Gumanitar fanlar',
  'Tabiiy fanlar',
  'Chet tillari',
  "Boshlang'ich",
  'Sport',
  'Rahbariyat',
];

interface AdminViewProps {
  schoolInfo: SchoolInfo;
  newsList: NewsItem[];
  photoList: PhotoItem[];
  videoList: VideoItem[];
  teacherList: TeacherItem[];
  messages: ContactMessage[];
  onUpdateSchoolInfo: (info: SchoolInfo) => Promise<void>;
  onAddNews: (news: Omit<NewsItem, 'id' | 'views' | 'date'>) => Promise<void>;
  onUpdateNews: (news: NewsItem) => Promise<void>;
  onDeleteNews: (id: string) => Promise<void>;
  onAddPhoto: (photo: Omit<PhotoItem, 'id' | 'date'>) => Promise<void>;
  onUpdatePhoto: (photo: PhotoItem) => Promise<void>;
  onDeletePhoto: (id: string) => Promise<void>;
  onAddVideo: (video: Omit<VideoItem, 'id' | 'date'>) => Promise<void>;
  onUpdateVideo: (video: VideoItem) => Promise<void>;
  onDeleteVideo: (id: string) => Promise<void>;
  onAddTeacher: (teacher: Omit<TeacherItem, 'id'>) => Promise<void>;
  onUpdateTeacher: (teacher: TeacherItem) => Promise<void>;
  onDeleteTeacher: (id: string) => Promise<void>;
  onMarkMessageRead: (id: string) => Promise<void>;
  onResetSystem: () => Promise<void>;
  onRestoreBackup?: (backupData: any) => Promise<boolean>;
}

export const AdminView: React.FC<AdminViewProps> = ({
  schoolInfo,
  newsList,
  photoList,
  videoList,
  teacherList,
  messages,
  onUpdateSchoolInfo,
  onAddNews,
  onUpdateNews,
  onDeleteNews,
  onAddPhoto,
  onUpdatePhoto,
  onDeletePhoto,
  onAddVideo,
  onUpdateVideo,
  onDeleteVideo,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onMarkMessageRead,
  onResetSystem,
  onRestoreBackup,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [adminTab, setAdminTab] = useState<'info' | 'news' | 'media' | 'teachers' | 'messages' | 'settings'>('info');

  // School info form state
  const [editSchool, setEditSchool] = useState<SchoolInfo>({ ...schoolInfo });
  const [infoSaved, setInfoSaved] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  useEffect(() => {
    setEditSchool({ ...schoolInfo });
  }, [schoolInfo]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleDownloadBackup = () => {
    const data = {
      schoolInfo,
      newsList,
      photoList,
      videoList,
      teacherList,
      messages,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateSlug = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `sardoba16_maktab_zaxira_${dateSlug}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Zaxira nusxasi kompyuteringizga yuklab olindi!");
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (!parsed || typeof parsed !== 'object') {
          alert("Noto'g'ri zaxira fayl formati!");
          return;
        }
        if (onRestoreBackup) {
          const ok = await onRestoreBackup(parsed);
          if (ok) {
            showToast("Barcha ma'lumotlar zaxiradan muvaffaqiyatli tiklandi!");
          }
        }
      } catch (err: any) {
        alert("Zaxirani tiklashda xatolik: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Edit IDs tracking
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

  // New item modal form states
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [newNews, setNewNews] = useState({
    title: '',
    category: 'Tadbirlar' as NewsItem['category'],
    summary: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
  });

  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    category: 'Tadbirlar' as PhotoItem['category'],
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
    description: '',
  });

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
    duration: '04:15',
    description: '',
  });

  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    role: '',
    subject: 'Matematika',
    customSubject: '',
    isCustomSubject: false,
    category: 'Aniq fanlar',
    qualification: 'Oliy toifali',
    experience: '10 yil',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    awards: '',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'jaloliddin201178') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError("Parol noto'g'ri!");
    }
  };

  const handleSaveSchoolInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSchoolInfo(editSchool);
    setInfoSaved(true);
    showToast("✓ Maktab ma'lumotlari muvaffaqiyatli saqlandi va tizimda saqlanib qoladi!");
    setTimeout(() => setInfoSaved(false), 3000);
  };

  // --- NEWS CRUD HANDLERS ---
  const handleOpenCreateNews = () => {
    setEditingNewsId(null);
    setNewNews({
      title: '',
      category: 'Tadbirlar',
      summary: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    });
    setNewsModalOpen(true);
  };

  const handleStartEditNews = (item: NewsItem) => {
    setEditingNewsId(item.id);
    setNewNews({
      title: item.title,
      category: item.category,
      summary: item.summary,
      content: item.content,
      image: item.image,
    });
    setNewsModalOpen(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNewsId) {
      const existing = newsList.find((n) => n.id === editingNewsId);
      await onUpdateNews({
        id: editingNewsId,
        date: existing ? existing.date : new Date().toISOString().split('T')[0],
        views: existing ? existing.views : 0,
        ...newNews,
      });
      showToast("✓ Yangilik muvaffaqiyatli tahrirlandi va saqlandi!");
    } else {
      await onAddNews(newNews);
      showToast("✓ Yangi yangilik muvaffaqiyatli saqlandi va tizimga qo'shildi!");
    }
    setNewsModalOpen(false);
    setEditingNewsId(null);
    setNewNews({
      title: '',
      category: 'Tadbirlar',
      summary: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    });
  };

  // --- PHOTO CRUD HANDLERS ---
  const handleOpenCreatePhoto = () => {
    setEditingPhotoId(null);
    setNewPhoto({
      title: '',
      category: 'Tadbirlar',
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
      description: '',
    });
    setPhotoModalOpen(true);
  };

  const handleStartEditPhoto = (item: PhotoItem) => {
    setEditingPhotoId(item.id);
    setNewPhoto({
      title: item.title,
      category: item.category,
      url: item.url,
      description: item.description || '',
    });
    setPhotoModalOpen(true);
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPhotoId) {
      const existing = photoList.find((p) => p.id === editingPhotoId);
      await onUpdatePhoto({
        id: editingPhotoId,
        date: existing ? existing.date : new Date().toISOString().split('T')[0],
        ...newPhoto,
      });
      showToast("✓ Foto rasm muvaffaqiyatli tahrirlandi va saqlandi!");
    } else {
      await onAddPhoto(newPhoto);
      showToast("✓ Yangi foto rasm galereyaga muvaffaqiyatli saqlandi!");
    }
    setPhotoModalOpen(false);
    setEditingPhotoId(null);
    setNewPhoto({
      title: '',
      category: 'Tadbirlar',
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
      description: '',
    });
  };

  // --- VIDEO CRUD HANDLERS ---
  const handleOpenCreateVideo = () => {
    setEditingVideoId(null);
    setNewVideo({
      title: '',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
      duration: '04:15',
      description: '',
    });
    setVideoModalOpen(true);
  };

  const handleStartEditVideo = (item: VideoItem) => {
    setEditingVideoId(item.id);
    setNewVideo({
      title: item.title,
      videoUrl: item.videoUrl,
      thumbnail: item.thumbnail,
      duration: item.duration,
      description: item.description || '',
    });
    setVideoModalOpen(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVideoId) {
      const existing = videoList.find((v) => v.id === editingVideoId);
      await onUpdateVideo({
        id: editingVideoId,
        date: existing ? existing.date : new Date().toISOString().split('T')[0],
        ...newVideo,
      });
      showToast("✓ Video muvaffaqiyatli tahrirlandi va saqlandi!");
    } else {
      await onAddVideo(newVideo);
      showToast("✓ Yangi video muvaffaqiyatli saqlandi va tizimga qo'shildi!");
    }
    setVideoModalOpen(false);
    setEditingVideoId(null);
    setNewVideo({
      title: '',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
      duration: '04:15',
      description: '',
    });
  };

  // --- TEACHER CRUD HANDLERS ---
  const handleOpenCreateTeacher = () => {
    setEditingTeacherId(null);
    setNewTeacher({
      name: '',
      role: '',
      subject: 'Matematika',
      customSubject: '',
      isCustomSubject: false,
      category: 'Aniq fanlar',
      qualification: 'Oliy toifali',
      experience: '10 yil',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      awards: '',
    });
    setTeacherModalOpen(true);
  };

  const handleStartEditTeacher = (item: TeacherItem) => {
    setEditingTeacherId(item.id);
    const isCustom = !STANDARD_SUBJECTS.includes(item.subject);
    setNewTeacher({
      name: item.name,
      role: item.role,
      subject: isCustom ? STANDARD_SUBJECTS[0] : item.subject,
      customSubject: isCustom ? item.subject : '',
      isCustomSubject: isCustom,
      category: item.category || 'Aniq fanlar',
      qualification: item.qualification,
      experience: item.experience,
      photo: item.photo,
      awards: item.awards ? item.awards.join(', ') : '',
    });
    setTeacherModalOpen(true);
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    const awardsArr = newTeacher.awards
      ? newTeacher.awards.split(',').map((a) => a.trim()).filter(Boolean)
      : [];

    const finalSubject = newTeacher.isCustomSubject
      ? (newTeacher.customSubject.trim() || 'Umumiy fan')
      : newTeacher.subject;

    const teacherData = {
      name: newTeacher.name,
      role: newTeacher.role,
      subject: finalSubject,
      category: newTeacher.category,
      qualification: newTeacher.qualification,
      experience: newTeacher.experience,
      photo: newTeacher.photo,
      awards: awardsArr,
    };

    if (editingTeacherId) {
      await onUpdateTeacher({
        id: editingTeacherId,
        ...teacherData,
      });
      showToast("✓ O'qituvchi ma'lumotlari tahrirlandi va saqlandi!");
    } else {
      await onAddTeacher(teacherData);
      showToast("✓ Yangi o'qituvchi muvaffaqiyatli saqlandi va jamoaga qo'shildi!");
    }

    setTeacherModalOpen(false);
    setEditingTeacherId(null);
    setNewTeacher({
      name: '',
      role: '',
      subject: 'Matematika',
      customSubject: '',
      isCustomSubject: false,
      category: 'Aniq fanlar',
      qualification: 'Oliy toifali',
      experience: '10 yil',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      awards: '',
    });
  };

  if (!isAuthenticated) {
    return (
      <div id="admin-login-screen" className="max-w-md mx-auto my-16 p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">16-Maktab Admin Paneli</h1>
          <p className="text-xs text-slate-400">
            Maktab matnlarini, yangiliklarini, video va rasmlarini boshqarish uchun tizimga kiring.
          </p>
        </div>

        {authError && (
          <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-xs font-medium text-center">
            {authError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              Admin Paroli
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Parolni kiriting..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Tizimga Kirish</span>
          </button>
        </form>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div id="admin-panel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      {/* Floating Save Notification / Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-bold px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-100 flex-shrink-0" />
          <span className="text-xs sm:text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border border-emerald-500/30 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Boshqaruv Paneli (Admin)</h1>
            <p className="text-xs text-emerald-400 font-medium">Sardoba tumani 16-sonli maktab rasmiy boshqaruv tizimi</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/40 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 shadow-sm"
            title="Barcha ma'lumotlarni kompyuterga .json fayl qilib yuklab olish"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Zaxira Olish (.json)</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs text-emerald-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Doimiy saqlash faol
          </div>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Chiqish</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setAdminTab('info')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            adminTab === 'info'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Maktab Ma'lumotlari</span>
        </button>

        <button
          onClick={() => setAdminTab('news')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            adminTab === 'news'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Yangiliklar ({newsList.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('media')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            adminTab === 'media'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Videolar ({videoList.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('teachers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            adminTab === 'teachers'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>O'qituvchilar ({teacherList.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('messages')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap relative ${
            adminTab === 'messages'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Xabarlar ({messages.length})</span>
          {unreadCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ml-auto ${
            adminTab === 'settings'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Xavfsizlik va Zaxira</span>
        </button>
      </div>

      {/* TAB 1: SCHOOL INFO EDIT FORM */}
      {adminTab === 'info' && (
        <form onSubmit={handleSaveSchoolInfo} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Maktab Matnlari va Rekvizitlarini Tahrirlash</h2>
              <p className="text-xs text-slate-400">Rasmiy yuridik rekvizitlar, manzil, telefon va direktor murojaatini o'zgartirish</p>
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>O'zgarishlarni Saqlash</span>
            </button>
          </div>

          {infoSaved && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Maktab ma'lumotlari muvaffaqiyatli saqlandi va veb-saytda yangilandi!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Maktab To'liq Nomi</label>
              <input
                type="text"
                value={editSchool.name}
                onChange={(e) => setEditSchool({ ...editSchool, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Qisqa Nomi</label>
              <input
                type="text"
                value={editSchool.shortName}
                onChange={(e) => setEditSchool({ ...editSchool, shortName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Tashkil Etilgan Yili va Sanasi</label>
              <input
                type="text"
                value={editSchool.foundedDate}
                onChange={(e) => setEditSchool({ ...editSchool, foundedDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Aloqa Telefoni</label>
              <input
                type="text"
                value={editSchool.phone}
                onChange={(e) => setEditSchool({ ...editSchool, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Aniq Manzili</label>
              <input
                type="text"
                value={editSchool.address}
                onChange={(e) => setEditSchool({ ...editSchool, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Xarita bo'yicha qo'shimcha izoh</label>
              <input
                type="text"
                value={editSchool.mapNote}
                onChange={(e) => setEditSchool({ ...editSchool, mapNote: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Direktor Ismi va Familiyasi</label>
              <input
                type="text"
                value={editSchool.principalName}
                onChange={(e) => setEditSchool({ ...editSchool, principalName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                  Bosh Sahifa (Kirish Menyusi) Orqa Fon Rasmi
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Saytga kirgandagi asosiy kirish qismining orqa fonida to'liq ko'rinadigan rasm (kompyuteringizdan yuklang yoki URL kiriting).
                </p>
              </div>

              <MediaUploadInput
                label="Bosh Sahifa Orqa Foni (C:, D: diskdan yoki URL)"
                value={editSchool.heroBgImage || ""}
                onChange={(val) => setEditSchool({ ...editSchool, heroBgImage: val })}
                type="image"
                placeholder="https://... yoki kompyuterdan rasm tanlang"
              />

              {/* Quick Presets for Convenient Switching */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-slate-400 mb-2">Yoki tayyor maktab fonlaridan birini tanlang:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { title: "Zamonaviy Maktab Binosi", url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=2000&q=80" },
                    { title: "Maktab Hovlisi va Binosi", url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=80" },
                    { title: "Sinfxona va Doska", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2000&q=80" },
                    { title: "Zamonaviy Kutubxona", url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=2000&q=80" },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditSchool({ ...editSchool, heroBgImage: preset.url })}
                      className={`relative rounded-xl overflow-hidden border text-left p-1 transition-all group ${
                        editSchool.heroBgImage === preset.url
                          ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-950/20'
                          : 'border-slate-800 hover:border-slate-600 bg-slate-900'
                      }`}
                    >
                      <img src={preset.url} alt={preset.title} className="w-full h-16 object-cover rounded-lg group-hover:scale-105 transition-transform" />
                      <div className="text-[10px] text-slate-300 font-medium truncate mt-1 px-1">{preset.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <MediaUploadInput
                label="Direktor Rasmi (C:, D: diskdan yoki URL)"
                value={editSchool.principalImage}
                onChange={(val) => setEditSchool({ ...editSchool, principalImage: val })}
                type="image"
                placeholder="https://... yoki faylni tanlang"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Direktor Murojaati / Kirish So'zi</label>
              <textarea
                rows={3}
                value={editSchool.principalMessage}
                onChange={(e) => setEditSchool({ ...editSchool, principalMessage: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl p-3 text-sm text-white focus:outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-sm font-bold text-white mb-4">Statistika Ko'rsatkichlari</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">O'quvchilar Soni</label>
                <input
                  type="number"
                  value={editSchool.stats.studentsCount}
                  onChange={(e) =>
                    setEditSchool({
                      ...editSchool,
                      stats: { ...editSchool.stats, studentsCount: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">O'qituvchilar Soni</label>
                <input
                  type="number"
                  value={editSchool.stats.teachersCount}
                  onChange={(e) =>
                    setEditSchool({
                      ...editSchool,
                      stats: { ...editSchool.stats, teachersCount: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Sinf Xonalari</label>
                <input
                  type="number"
                  value={editSchool.stats.classroomsCount}
                  onChange={(e) =>
                    setEditSchool({
                      ...editSchool,
                      stats: { ...editSchool.stats, classroomsCount: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-sm text-white"
                />
              </div>


            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Saqlash</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: MANAGE NEWS */}
      {adminTab === 'news' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Yangiliklar Boshqaruvi</h2>
            <button
              onClick={handleOpenCreateNews}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Yangilik Qo'shish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsList.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex gap-4 items-start justify-between hover:border-slate-700 transition-colors">
                <img src={item.image} alt={item.title} className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-800" />
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">{item.category}</span>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.summary}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartEditNews(item)}
                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                    title="Tahrirlash"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteNews(item.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE VIDEOS */}
      {adminTab === 'media' && (
        <div className="space-y-8">
          {/* Videos Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-400" />
                Videolavhalar Boshqaruvi ({videoList.length})
              </h2>
              <button
                onClick={handleOpenCreateVideo}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Video Qo'shish</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videoList.map((v) => (
                <div key={v.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex gap-4 items-center justify-between hover:border-slate-700 transition-colors">
                  <img src={v.thumbnail} alt={v.title} className="w-24 h-16 rounded-xl object-cover shrink-0 bg-slate-800" />
                  <div className="flex-1 space-y-1">
                    <h3 className="text-sm font-bold text-white line-clamp-1">{v.title}</h3>
                    <p className="text-xs text-slate-400 font-mono">Davomiyligi: {v.duration}</p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEditVideo(v)}
                      className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors"
                      title="Tahrirlash"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteVideo(v.id)}
                      className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MANAGE TEACHERS */}
      {adminTab === 'teachers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">O'qituvchilar va Jamoa Boshqaruvi</h2>
            <button
              onClick={handleOpenCreateTeacher}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi O'qituvchi Qo'shish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortTeachersDirectorFirst(teacherList).map((t) => {
              const isDir = isDirectorTeacher(t);
              const isDep = isDeputyDirector(t);

              return (
                <div
                  key={t.id}
                  className={`bg-slate-900 border p-4 rounded-2xl flex items-center gap-4 justify-between transition-colors ${
                    isDir
                      ? 'border-amber-500/70 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 ring-1 ring-amber-500/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={t.photo} alt={t.name} className="w-16 h-16 rounded-xl object-cover bg-slate-800" />
                    {isDir && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow">
                        <Crown className="w-3 h-3 fill-slate-950" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-white">{t.name}</h3>
                      {isDir && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          1-o'rin (Rahbar)
                        </span>
                      )}
                      {isDep && (
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded font-medium">
                          O'rinbosar
                        </span>
                      )}
                      {t.category && !isDir && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-medium">
                          {t.category}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs font-semibold ${isDir ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                      {t.role}
                    </p>
                    <p className="text-xs text-slate-300">
                      <span className="text-slate-400">Fani:</span> <strong className="text-indigo-300">{t.subject}</strong> · {t.qualification}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEditTeacher(t)}
                      className="p-2 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors"
                      title="Tahrirlash"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTeacher(t.id)}
                      className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: CONTACT MESSAGES INBOX */}
      {adminTab === 'messages' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Saytdan Tushgan Murojaat va Xabarlar ({messages.length})</h2>

          {messages.length === 0 ? (
            <div className="text-center py-12 bg-slate-900 rounded-3xl border border-slate-800 text-slate-400">
              Hali xabarlar mavjud emas.
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    m.read
                      ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                      : 'bg-slate-900 border-blue-500/40 shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-base font-bold text-white">{m.name}</span>
                      <a href={`tel:${m.phone}`} className="ml-3 text-xs text-emerald-400 hover:underline">
                        📞 {m.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{m.date}</span>
                      {!m.read && (
                        <button
                          onClick={() => onMarkMessageRead(m.id)}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg"
                        >
                          O'qildi deb belgilash
                        </button>
                      )}
                    </div>
                  </div>
                  {m.subject && <div className="text-xs font-bold text-blue-300 mt-2">Mavzu: {m.subject}</div>}
                  <p className="text-sm text-slate-200 mt-2 leading-relaxed whitespace-pre-line">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: SETTINGS, BACKUP & DATA PROTECTION */}
      {adminTab === 'settings' && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Status & Explanation Card */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/30 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Ma'lumotlar Xavfsizligi va Doimiy Saqlash Tizimi
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                    Faol
                  </span>
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Siz admin panelida kiritgan har qanday o'zgarishlar (maktab ma'lumotlari, orqa fon rasmlari, yangiliklar, foto-videolar, o'qituvchilar ro'yxati) 
                  server diskida (<code className="text-emerald-400 font-mono text-xs bg-slate-950 px-1.5 py-0.5 rounded">storage.json</code> va <code className="text-emerald-400 font-mono text-xs bg-slate-950 px-1.5 py-0.5 rounded">storage.backup.json</code>) 
                  hamda brauzeringiz xotirasida avtomatik ikki tomonlama mustahkam saqlanadi. Kelajakda yangi buyruq bersangiz yoki sayt yangilansa ham, barcha kiritgan narsalaringiz aslo o'chib ketmaydi.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Export / Backup Card */}
            <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-colors rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">1. Zaxira Nusxasini Saqlash (Eksport)</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Saytdagi barcha o'qituvchilar, yangiliklar, foto-video galereyasi va maktab ma'lumotlarini bitta <strong className="text-emerald-300">.json fayl</strong> ko'rinishida kompyuteringizga (C: yoki D: diskka) yuklab oling.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Zaxira Faylini Yuklab Olish (.json)</span>
                </button>
                <div className="text-[11px] text-center text-slate-500">
                  Fayl nomi: <span className="font-mono text-slate-400">sardoba16_maktab_zaxira.json</span>
                </div>
              </div>
            </div>

            {/* 2. Import / Restore Card */}
            <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-colors rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">2. Zaxira Faylidan Tiklash (Import)</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Avval saqlab qo'ygan <strong className="text-blue-300">.json zaxira faylingizni</strong> yuklang. Sayt bir zumda o'sha zaxiradagi holatiga to'liq tiklanadi va barcha ma'lumotlar yangilanadi.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 cursor-pointer">
                  <UploadCloud className="w-4 h-4" />
                  <span>Kompyuterdan Zaxira Faylini Tanlash (.json)</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileRestore}
                    className="hidden"
                  />
                </label>
                <div className="text-[11px] text-center text-slate-500">
                  Faqat to'g'ri .json formatdagi zaxira fayllar qabul qilinadi
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone: Reset to Initial Default Data */}
          <div className="bg-slate-900/80 border border-rose-950 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center border border-rose-500/20 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-base font-bold text-white">Xavfli Hudud: Boshlang'ich Holatga Qaytarish</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Agarda barcha kiritilgan o'zgartirishlarni o'chirib, dastlabki namunaviy Sardoba 16-maktab ma'lumotlariga qaytmoqchi bo'lsangizgina ushbu amaldan foydalaning.
                </p>
              </div>
            </div>

            {showResetConfirm ? (
              <div className="bg-rose-950/40 border border-rose-600/50 p-4 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-rose-200">
                  Haqiqatdan ham barcha kiritgan ma'lumotlaringizni o'chirib, boshlang'ich holatga qaytarmoqchimisiz?
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      await onResetSystem();
                      setShowResetConfirm(false);
                      showToast("Barcha ma'lumotlar boshlang'ich holatga qaytarildi");
                    }}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-lg"
                  >
                    Ha, O'chirib Qaytarsin
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="bg-slate-800 hover:bg-rose-900/40 hover:text-rose-300 text-slate-400 border border-slate-700 hover:border-rose-500/40 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Boshlang'ich Holatga Tiklash</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD / EDIT NEWS MODAL */}
      {newsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSaveNews} className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-4 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button type="button" onClick={() => setNewsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white">
              {editingNewsId ? "Yangilikni Tahrirlash" : "Yangi Yangilik Qo'shish"}
            </h3>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Sarlavha</label>
              <input
                type="text"
                required
                placeholder="Yangilik sarlavhasi..."
                value={newNews.title}
                onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Kategoriya</label>
              <div className="relative">
                <select
                  value={newNews.category}
                  onChange={(e) => setNewNews({ ...newNews, category: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white appearance-none pr-10"
                >
                  <option value="Tadbirlar">Tadbirlar</option>
                  <option value="Tanlovlar">Tanlovlar</option>
                  <option value="Ta'lim">Ta'lim</option>
                  <option value="Sport">Sport</option>
                  <option value="E'lonlar">E'lonlar</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2 TA YO'L BILAN RASM: C:/D: DISKDAN YOKI URL */}
            <MediaUploadInput
              label="Yangilik Rasmi (C:, D: diskdan yoki URL)"
              value={newNews.image}
              onChange={(val) => setNewNews({ ...newNews, image: val })}
              type="image"
              placeholder="https://... yoki faylni tanlang"
            />

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Qisqacha mazmuni</label>
              <textarea
                required
                rows={2}
                placeholder="Qisqacha mazmuni..."
                value={newNews.summary}
                onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white"
              ></textarea>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">To'liq matni</label>
              <textarea
                required
                rows={4}
                placeholder="To'liq yangilik matni..."
                value={newNews.content}
                onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white"
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-lg flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              <span>{editingNewsId ? "O'zgarishlarni Saqlash" : "Yangilikni Saqlash"}</span>
            </button>
          </form>
        </div>
      )}

      {/* ADD / EDIT VIDEO MODAL */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSaveVideo} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button type="button" onClick={() => setVideoModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white">
              {editingVideoId ? "Videoni Tahrirlash" : "Yangi Video Qo'shish"}
            </h3>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Video sarlavhasi</label>
              <input
                type="text"
                required
                placeholder="Video sarlavhasi"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            {/* 2 TA YO'L: C:/D: DISKDAN VIDEO FAYL YOKI YOUTUBE LINK */}
            <MediaUploadInput
              label="Video Fayli yoki YouTube Embed Link"
              value={newVideo.videoUrl}
              onChange={(val) => setNewVideo({ ...newVideo, videoUrl: val })}
              type="video"
              placeholder="https://www.youtube.com/embed/... yoki MP4 fayl"
              required
            />

            {/* 2 TA YO'L: MUQOVA RASMI C:/D: DISKDAN YOKI URL */}
            <MediaUploadInput
              label="Video Muqovasi (Thumbnail - C:, D: disk yoki URL)"
              value={newVideo.thumbnail}
              onChange={(val) => setNewVideo({ ...newVideo, thumbnail: val })}
              type="image"
              placeholder="https://... yoki muqova rasmini tanlang"
            />

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Davomiyligi (Masalan: 04:15)</label>
              <input
                type="text"
                placeholder="04:15"
                value={newVideo.duration}
                onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Tavsif</label>
              <textarea
                placeholder="Video haqida qisqacha tavsif..."
                rows={2}
                value={newVideo.description}
                onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white"
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-lg flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              <span>{editingVideoId ? "O'zgarishlarni Saqlash" : "Videoni Saqlash"}</span>
            </button>
          </form>
        </div>
      )}

      {/* ADD / EDIT TEACHER MODAL */}
      {teacherModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSaveTeacher} className="bg-slate-900 border border-slate-800 p-6 sm:p-7 rounded-3xl max-w-lg w-full space-y-4 relative shadow-2xl max-h-[92vh] overflow-y-auto">
            <button type="button" onClick={() => setTeacherModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            
            <div>
              <h3 className="text-lg font-bold text-white">
                {editingTeacherId ? "O'qituvchi Ma'lumotlarini Tahrirlash" : "Yangi O'qituvchi Qo'shish"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">O'qituvchi ma'lumotlari va dars beradigan fanini kiriting.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Ism va Familiyasi *</label>
              <input
                type="text"
                required
                placeholder="Masalan: Karimov Alisher Zokirovich"
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Lavozimi *</label>
                <span className="text-[10px] text-amber-400/90 font-medium">Tezkor tanlov tugmalari:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pb-1">
                <button
                  type="button"
                  onClick={() =>
                    setNewTeacher({
                      ...newTeacher,
                      role: 'Maktab direktori',
                      category: 'Rahbariyat',
                    })
                  }
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-all ${
                    newTeacher.role === 'Maktab direktori'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                  }`}
                >
                  <Crown className="w-3 h-3" />
                  Maktab direktori (1-o'rin)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNewTeacher({
                      ...newTeacher,
                      role: "O'quv ishlari bo'yicha direktor o'rinbosari",
                      category: 'Rahbariyat',
                    })
                  }
                  className="text-[11px] px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
                >
                  Direktor o'rinbosari (O'quv)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNewTeacher({
                      ...newTeacher,
                      role: "Ma'naviy-ma'rifiy ishlar bo'yicha direktor o'rinbosari",
                      category: 'Rahbariyat',
                    })
                  }
                  className="text-[11px] px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
                >
                  Direktor o'rinbosari (Ma'naviyat)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNewTeacher({
                      ...newTeacher,
                      role: "O'qituvchi",
                    })
                  }
                  className="text-[11px] px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
                >
                  Fan o'qituvchisi
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="Masalan: Maktab direktori / O'qituvchi / Direktor o'rinbosari"
                value={newTeacher.role}
                onChange={(e) => {
                  const val = e.target.value;
                  const isDir = isDirectorTeacher({ role: val } as any);
                  setNewTeacher({
                    ...newTeacher,
                    role: val,
                    category: isDir ? 'Rahbariyat' : newTeacher.category,
                  });
                }}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white"
              />
              {isDirectorTeacher({ role: newTeacher.role } as any) && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex items-center gap-2 text-xs text-amber-300 font-medium animate-in fade-in duration-150">
                  <Crown className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400" />
                  <span>
                    <strong>Direktor lavozimi:</strong> Ushbu xodim jamoa ro'yxatida va <strong>«Rahbariyat»</strong> hamda <strong>«Barchasi»</strong> bo'limida doimo eng <strong>1-o'rinda</strong> turadi.
                  </span>
                </div>
              )}
            </div>

            {/* QAYSI TUR / YO'NALISH: STRELKA CHIQQAN SELECT */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span>Yo'nalish / Turi (Kategoriya) *</span>
              </label>
              <div className="relative">
                <select
                  value={newTeacher.category}
                  onChange={(e) => setNewTeacher({ ...newTeacher, category: e.target.value })}
                  className="w-full bg-slate-950 border border-amber-500/40 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white appearance-none pr-10 font-medium"
                >
                  {TEACHER_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-amber-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-400">Jamoa sahifasidagi asosiy filtr shu tur bo'yicha ishlaydi.</p>
            </div>

            {/* FAN YOZADIGAN / TANLAYDIGAN VA YANGI FAN QO'SHADIGAN JOY */}
            <div className="space-y-1.5 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  Dars Beradigan Fani *
                </label>
                <button
                  type="button"
                  onClick={() => setNewTeacher({ ...newTeacher, isCustomSubject: !newTeacher.isCustomSubject })}
                  className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  {newTeacher.isCustomSubject ? 'Ro\'yxatdan tanlash' : 'Yangi fan kiritish'}
                </button>
              </div>

              {newTeacher.isCustomSubject ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    required
                    placeholder="Yangi fan nomini yozing (Masalan: Robototexnika, Fransuz tili...)"
                    value={newTeacher.customSubject}
                    onChange={(e) => setNewTeacher({ ...newTeacher, customSubject: e.target.value })}
                    className="w-full bg-slate-900 border border-indigo-500/60 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500"
                  />
                  <span className="text-[10px] text-indigo-300 block">Ushbu yangi fan jamoa sahifasida ko'rinadi.</span>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={newTeacher.subject}
                    onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white appearance-none pr-10"
                  >
                    {STANDARD_SUBJECTS.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}
            </div>

            {/* TOIFASI VA TAJRIBASI */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Toifasi</label>
                <div className="relative">
                  <select
                    value={newTeacher.qualification}
                    onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white appearance-none pr-8"
                  >
                    <option value="Oliy toifali">Oliy toifali</option>
                    <option value="Birinchi toifali">Birinchi toifali</option>
                    <option value="Ikkinchi toifali">Ikkinchi toifali</option>
                    <option value="Mutaxassis">Mutaxassis</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Tajribasi (Staji)</label>
                <input
                  type="text"
                  placeholder="12 yil"
                  value={newTeacher.experience}
                  onChange={(e) => setNewTeacher({ ...newTeacher, experience: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* O'QITUVCHI RASMI: C:, D: DISKDAN YOKI URL ORQALI */}
            <MediaUploadInput
              label="O'qituvchi Rasmi (C:, D: diskdan yoki URL)"
              value={newTeacher.photo}
              onChange={(val) => setNewTeacher({ ...newTeacher, photo: val })}
              type="image"
              placeholder="https://... yoki faylni tanlang"
            />

            {/* YUTUQLARI */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Mukofot va Yutuqlari (Ixtiyoriy)</label>
              <input
                type="text"
                placeholder="Vergul bilan ajrating: Xalq ta'limi a'lochisi, Yil o'qituvchisi"
                value={newTeacher.awards}
                onChange={(e) => setNewTeacher({ ...newTeacher, awards: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500"
              />
            </div>

            <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-lg mt-2 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              <span>{editingTeacherId ? "O'zgarishlarni Saqlash" : "O'qituvchini Saqlash"}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
