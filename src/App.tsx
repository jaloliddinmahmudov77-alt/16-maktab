import React, { useState, useEffect } from 'react';
import {
  PageTab,
  SchoolInfo,
  NewsItem,
  PhotoItem,
  VideoItem,
  TeacherItem,
  ContactMessage,
} from './types';
import {
  initialSchoolInfo,
  initialNews,
  initialPhotos,
  initialVideos,
  initialTeachers,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { NewsView } from './components/NewsView';
import { GalleryView } from './components/GalleryView';
import { TeamView } from './components/TeamView';
import { ContactView } from './components/ContactView';
import { AdminView } from './components/AdminView';
import { sortTeachersDirectorFirst } from './utils/teacherUtils';

// Bundled data fingerprint: when a new deploy ships different initial data,
// caches saved by an older deploy are ignored so visitors see the new content.
const DATA_VERSION = (() => {
  const str = JSON.stringify([initialSchoolInfo, initialNews, initialPhotos, initialVideos, initialTeachers]);
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return String(h);
})();

function readCache<T>(key: string): T | null {
  try {
    if (localStorage.getItem('sardoba16_dataVersion') !== DATA_VERSION) return null;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('asosiy');
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => readCache('sardoba16_schoolInfo') ?? initialSchoolInfo);
  const [newsList, setNewsList] = useState<NewsItem[]>(() => readCache('sardoba16_newsList') ?? initialNews);
  const [photoList, setPhotoList] = useState<PhotoItem[]>(() => readCache('sardoba16_photoList') ?? initialPhotos);
  const [videoList, setVideoList] = useState<VideoItem[]>(() => readCache('sardoba16_videoList') ?? initialVideos);
  const [teacherList, setTeacherList] = useState<TeacherItem[]>(() => {
    const cached = readCache<TeacherItem[]>('sardoba16_teacherList');
    return sortTeachersDirectorFirst(Array.isArray(cached) && cached.length > 0 ? cached : initialTeachers);
  });
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  // Sync to localStorage for immediate resilience
  useEffect(() => {
    try {
      localStorage.setItem('sardoba16_dataVersion', DATA_VERSION);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('sardoba16_schoolInfo', JSON.stringify(schoolInfo));
    } catch {}
  }, [schoolInfo]);

  useEffect(() => {
    try {
      localStorage.setItem('sardoba16_newsList', JSON.stringify(newsList));
    } catch {}
  }, [newsList]);

  useEffect(() => {
    try {
      localStorage.setItem('sardoba16_photoList', JSON.stringify(photoList));
    } catch {}
  }, [photoList]);

  useEffect(() => {
    try {
      localStorage.setItem('sardoba16_videoList', JSON.stringify(videoList));
    } catch {}
  }, [videoList]);

  useEffect(() => {
    try {
      localStorage.setItem('sardoba16_teacherList', JSON.stringify(teacherList));
    } catch {}
  }, [teacherList]);

  // Fetch data on load from server
  const loadServerData = async () => {
    try {
      const [resSchool, resNews, resPhotos, resVideos, resTeachers, resMsg] = await Promise.all([
        fetch('/api/school').then((r) => r.ok ? r.json() : null),
        fetch('/api/news').then((r) => r.ok ? r.json() : null),
        fetch('/api/photos').then((r) => r.ok ? r.json() : null),
        fetch('/api/videos').then((r) => r.ok ? r.json() : null),
        fetch('/api/teachers').then((r) => r.ok ? r.json() : null),
        fetch('/api/messages').then((r) => r.ok ? r.json() : null),
      ]);

      if (resSchool) {
        setSchoolInfo(resSchool);
        try { localStorage.setItem('sardoba16_schoolInfo', JSON.stringify(resSchool)); } catch {}
      }
      if (resNews && Array.isArray(resNews)) {
        setNewsList(resNews);
        try { localStorage.setItem('sardoba16_newsList', JSON.stringify(resNews)); } catch {}
      }
      if (resPhotos && Array.isArray(resPhotos)) {
        setPhotoList(resPhotos);
        try { localStorage.setItem('sardoba16_photoList', JSON.stringify(resPhotos)); } catch {}
      }
      if (resVideos && Array.isArray(resVideos)) {
        setVideoList(resVideos);
        try { localStorage.setItem('sardoba16_videoList', JSON.stringify(resVideos)); } catch {}
      }
      if (resTeachers && Array.isArray(resTeachers)) {
        const listToUse = resTeachers.length > 0 ? resTeachers : initialTeachers;
        const sorted = sortTeachersDirectorFirst(listToUse);
        setTeacherList(sorted);
        try { localStorage.setItem('sardoba16_teacherList', JSON.stringify(sorted)); } catch {}
      }
      if (resMsg && Array.isArray(resMsg)) setMessages(resMsg);
    } catch (err) {
      console.warn("Server API fetch error, using client state:", err);
    }
  };

  useEffect(() => {
    loadServerData();
  }, []);

  // API Action Handlers
  const handleUpdateSchoolInfo = async (info: SchoolInfo) => {
    setSchoolInfo(info);
    try {
      await fetch('/api/school', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddNews = async (news: Omit<NewsItem, 'id' | 'views' | 'date'>) => {
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(news),
      });
      const data = await res.json();
      if (data.data) {
        setNewsList((prev) => [data.data, ...prev]);
      }
    } catch (e) {
      const fallbackNews: NewsItem = {
        id: 'news-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        views: 0,
        ...news,
      };
      setNewsList((prev) => [fallbackNews, ...prev]);
    }
  };

  const handleDeleteNews = async (id: string) => {
    setNewsList((prev) => prev.filter((n) => n.id !== id));
    try {
      await fetch(`/api/news/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateNews = async (news: NewsItem) => {
    setNewsList((prev) => prev.map((n) => (n.id === news.id ? news : n)));
    try {
      await fetch(`/api/news/${news.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(news),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddPhoto = async (photo: Omit<PhotoItem, 'id' | 'date'>) => {
    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photo),
      });
      const data = await res.json();
      if (data.data) {
        setPhotoList((prev) => [data.data, ...prev]);
      }
    } catch (e) {
      const fallbackPhoto: PhotoItem = {
        id: 'p-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...photo,
      };
      setPhotoList((prev) => [fallbackPhoto, ...prev]);
    }
  };

  const handleUpdatePhoto = async (photo: PhotoItem) => {
    setPhotoList((prev) => prev.map((p) => (p.id === photo.id ? photo : p)));
    try {
      await fetch(`/api/photos/${photo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photo),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    setPhotoList((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/photos/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddVideo = async (video: Omit<VideoItem, 'id' | 'date'>) => {
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(video),
      });
      const data = await res.json();
      if (data.data) {
        setVideoList((prev) => [data.data, ...prev]);
      }
    } catch (e) {
      const fallbackVideo: VideoItem = {
        id: 'v-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...video,
      };
      setVideoList((prev) => [fallbackVideo, ...prev]);
    }
  };

  const handleUpdateVideo = async (video: VideoItem) => {
    setVideoList((prev) => prev.map((v) => (v.id === video.id ? video : v)));
    try {
      await fetch(`/api/videos/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(video),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    setVideoList((prev) => prev.filter((v) => v.id !== id));
    try {
      await fetch(`/api/videos/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTeacher = async (teacher: Omit<TeacherItem, 'id'>) => {
    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacher),
      });
      const data = await res.json();
      if (data.data) {
        setTeacherList((prev) => sortTeachersDirectorFirst([...prev, data.data]));
      }
    } catch (e) {
      const fallbackTeacher: TeacherItem = {
        id: 't-' + Date.now(),
        ...teacher,
      };
      setTeacherList((prev) => sortTeachersDirectorFirst([...prev, fallbackTeacher]));
    }
  };

  const handleUpdateTeacher = async (teacher: TeacherItem) => {
    setTeacherList((prev) =>
      sortTeachersDirectorFirst(prev.map((t) => (t.id === teacher.id ? teacher : t)))
    );
    try {
      await fetch(`/api/teachers/${teacher.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacher),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    setTeacherList((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (msg: { name: string; phone: string; subject: string; message: string }) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
      const data = await res.json();
      if (data.data) {
        setMessages((prev) => [data.data, ...prev]);
      }
    } catch (e) {
      const fallbackMsg: ContactMessage = {
        id: 'msg-' + Date.now(),
        date: new Date().toLocaleString('uz-UZ'),
        read: false,
        ...msg,
      };
      setMessages((prev) => [fallbackMsg, ...prev]);
    }
  };

  const handleMarkMessageRead = async (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
    try {
      await fetch(`/api/messages/${id}/read`, { method: 'PUT' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetSystem = async () => {
    try {
      localStorage.removeItem('sardoba16_schoolInfo');
      localStorage.removeItem('sardoba16_newsList');
      localStorage.removeItem('sardoba16_photoList');
      localStorage.removeItem('sardoba16_videoList');
      localStorage.removeItem('sardoba16_teacherList');
      await fetch('/api/reset', { method: 'POST' });
      await loadServerData();
    } catch (e) {
      setSchoolInfo(initialSchoolInfo);
      setNewsList(initialNews);
      setPhotoList(initialPhotos);
      setVideoList(initialVideos);
      setTeacherList(initialTeachers);
    }
  };

  const handleRestoreBackup = async (backupData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backupData),
      });
      const resJson = await res.json();
      if (resJson.success && resJson.data) {
        if (resJson.data.schoolInfo) {
          setSchoolInfo(resJson.data.schoolInfo);
          try { localStorage.setItem('sardoba16_schoolInfo', JSON.stringify(resJson.data.schoolInfo)); } catch {}
        }
        if (Array.isArray(resJson.data.newsList)) {
          setNewsList(resJson.data.newsList);
          try { localStorage.setItem('sardoba16_newsList', JSON.stringify(resJson.data.newsList)); } catch {}
        }
        if (Array.isArray(resJson.data.photoList)) {
          setPhotoList(resJson.data.photoList);
          try { localStorage.setItem('sardoba16_photoList', JSON.stringify(resJson.data.photoList)); } catch {}
        }
        if (Array.isArray(resJson.data.videoList)) {
          setVideoList(resJson.data.videoList);
          try { localStorage.setItem('sardoba16_videoList', JSON.stringify(resJson.data.videoList)); } catch {}
        }
        if (Array.isArray(resJson.data.teacherList)) {
          setTeacherList(resJson.data.teacherList);
          try { localStorage.setItem('sardoba16_teacherList', JSON.stringify(resJson.data.teacherList)); } catch {}
        }
        if (Array.isArray(resJson.data.messageList)) {
          setMessages(resJson.data.messageList);
        }
        return true;
      }
    } catch (err) {
      console.error("Restore server call failed, restoring locally:", err);
      if (backupData.schoolInfo) setSchoolInfo(backupData.schoolInfo);
      if (Array.isArray(backupData.newsList)) setNewsList(backupData.newsList);
      if (Array.isArray(backupData.photoList)) setPhotoList(backupData.photoList);
      if (Array.isArray(backupData.videoList)) setVideoList(backupData.videoList);
      if (Array.isArray(backupData.teacherList)) setTeacherList(backupData.teacherList);
      return true;
    }
    return false;
  };

  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  return (
    <div id="app-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        schoolInfo={schoolInfo}
        unreadMessagesCount={unreadMessagesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'asosiy' && (
          <HomeView
            schoolInfo={schoolInfo}
            newsList={newsList}
            videoList={videoList}
            setActiveTab={setActiveTab}
            setSelectedNews={setSelectedNews}
            setSelectedVideo={setSelectedVideo}
          />
        )}

        {activeTab === 'haqida' && <AboutView schoolInfo={schoolInfo} />}

        {activeTab === 'yangiliklar' && (
          <NewsView
            newsList={newsList}
            selectedNews={selectedNews}
            setSelectedNews={setSelectedNews}
          />
        )}

        {activeTab === 'galereya' && (
          <GalleryView
            videoList={videoList}
            selectedVideo={selectedVideo}
            setSelectedVideo={setSelectedVideo}
          />
        )}

        {activeTab === 'jamoa' && <TeamView teacherList={teacherList} />}

        {activeTab === 'boglanish' && (
          <ContactView
            schoolInfo={schoolInfo}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            schoolInfo={schoolInfo}
            newsList={newsList}
            videoList={videoList}
            teacherList={teacherList}
            messages={messages}
            onUpdateSchoolInfo={handleUpdateSchoolInfo}
            onAddNews={handleAddNews}
            onUpdateNews={handleUpdateNews}
            onDeleteNews={handleDeleteNews}
            onAddPhoto={handleAddPhoto}
            onUpdatePhoto={handleUpdatePhoto}
            onDeletePhoto={handleDeletePhoto}
            onAddVideo={handleAddVideo}
            onUpdateVideo={handleUpdateVideo}
            onDeleteVideo={handleDeleteVideo}
            onAddTeacher={handleAddTeacher}
            onUpdateTeacher={handleUpdateTeacher}
            onDeleteTeacher={handleDeleteTeacher}
            onMarkMessageRead={handleMarkMessageRead}
            onResetSystem={handleResetSystem}
            onRestoreBackup={handleRestoreBackup}
          />
        )}
      </main>

      {/* Footer */}
      <Footer schoolInfo={schoolInfo} setActiveTab={setActiveTab} />
    </div>
  );
}
