export interface SchoolInfo {
  name: string;
  shortName: string;
  foundedDate: string;
  stir?: string;
  oked?: string;
  legalForm: string;
  parentMinistry: string;
  address: string;
  mapNote: string;
  phone: string;
  email: string;
  workHours: string;
  activityType: string;
  principalName: string;
  principalTitle: string;
  principalMessage: string;
  principalImage: string;
  heroBgImage?: string;
  stats: {
    studentsCount: number;
    teachersCount: number;
    classroomsCount: number;
    higherEduPercent: number;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Tadbirlar' | 'Tanlovlar' | 'Ta\'lim' | 'Sport' | 'E\'lonlar';
  date: string;
  summary: string;
  content: string;
  image: string;
  views: number;
  featured?: boolean;
}

export interface PhotoItem {
  id: string;
  title: string;
  category: 'Maktab hayoti' | 'Tadbirlar' | 'Dars jarayoni' | 'Sport' | 'Sinflar';
  url: string;
  date: string;
  description: string;
}

export interface VideoItem {
  id: string;
  title: string;
  videoUrl: string; // youtube embed or direct mp4/webm
  thumbnail: string;
  duration: string;
  date: string;
  description: string;
}

export interface TeacherItem {
  id: string;
  name: string;
  role: string;
  subject: string;
  category?: 'Rahbariyat' | 'Aniq fanlar' | 'Gumanitar fanlar' | 'Chet tillari' | 'Boshlang\'ich' | 'Sport' | 'Tabiiy fanlar' | string;
  qualification: string; // e.g. Oliy toifali, Birinchi toifali
  experience: string; // e.g. 15 yil
  photo: string;
  phone?: string;
  email?: string;
  awards?: string[];
  bio?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export type PageTab = 'asosiy' | 'haqida' | 'yangiliklar' | 'galereya' | 'jamoa' | 'boglanish' | 'admin';
