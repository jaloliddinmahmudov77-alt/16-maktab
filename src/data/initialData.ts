import { SchoolInfo, NewsItem, PhotoItem, VideoItem, TeacherItem } from '../types';

export const initialSchoolInfo: SchoolInfo = {
  name: "Sardoba tumani 16-sonli umumiy o'rta ta'lim maktabi",
  shortName: "Sardoba 16-maktab",
  foundedDate: "2000-yil 28-sentabr",
  legalForm: "Davlat muassasasi (100% davlat ulushi)",
  parentMinistry: "Oʻzbekiston Respublikasi Maktabgacha va maktab taʼlimi vazirligi",
  address: "99JV+JG, Navoi, Sirdaryo Region, Oʻzbekiston",
  mapNote: "Google Xaritalar kodi: 99JV+JG, Navoi, Sirdaryo Region, Oʻzbekiston",
  phone: "+998 (94) 160-16-74",
  email: "sardoba16maktab@umail.uz",
  workHours: "Dushanba - Shanba: 08:00 - 17:00",
  activityType: "Umumiy oʻrta taʼlim berish. Maktab ijtimoiy muassasa hisoblanadi.",
  principalName: "Qodirova Zulfiya Abdullayevna",
  principalTitle: "Maktab direktori",
  principalMessage: "Xush kelibsiz! Bizning 16-sonli maktabimiz o'quvchilarga chuqur bilim, yuksak ma'naviyat va zamonaviy ko'nikmalarni berishni o'z oldiga bosh maqsad qilib qo'ygan. Har bir farzandimizning kelajakda davlatimiz va jamiyatimizga munosib xizmat qilishi uchun barcha sharoitlar yaratilgan.",
  principalImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  heroBgImage: "/hero.webp",
  stats: {
    studentsCount: 480,
    teachersCount: 38,
    classroomsCount: 22,
    higherEduPercent: 88,
  }
};

export const initialNews: NewsItem[] = [
  {
    id: "news-1",
    title: "16-maktabda 'Bilimlar kuni' tantanali ravishda nishonlandi",
    category: "Tadbirlar",
    date: "2025-09-02",
    summary: "Sardoba tumani 16-sonli maktabda yangi o'quv yili boshlanishi munosabati bilan bayram tadbiri bo'lib o'tdi.",
    content: "Maktab hovlisida yangi 2025-2026 o'quv yili bag'ishlangan 'Bilimlar kuni' tantanasi bo'lib o'tdi. Tadbirda Sardoba tumani Maktabgacha va maktab ta'limi bo'limi vakillari, mahalla faollari hamda ota-onalar ishtirok etishdi. Birinchi sinf o'quvchilariga 'Prezident sovg'asi' topshirildi.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80",
    views: 342,
    featured: true
  },
  {
    id: "news-2",
    title: "Informatika va zamonaviy texnologiyalar to'garagi ish boshladi",
    category: "Ta'lim",
    date: "2025-10-15",
    summary: "Maktabimizda o'quvchilar uchun kompyuter savodxonligi va dasturlash bo'yicha bepul to'garaklar tashkil etildi.",
    content: "Prezidentimizning 5 ta muhim tashabbusi doirasida maktabimiz informatika xonasida zamonaviy AKT to'garaklari yo'lga qo'yildi. O'quvchilar Python va web-dasturlash asoslarini o'rganishmoqda.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
    views: 215,
    featured: true
  },
  {
    id: "news-3",
    title: "Tuman fan olimpiadasida o'quvchilarimiz faxrli o'rinlarni egallashdi",
    category: "Tanlovlar",
    date: "2025-11-20",
    summary: "Matematika va fizika fanlaridan tuman bosqichida 16-maktab o'quvchilaridan 3 nafari 1-o'rinni qo'lga kiritdi.",
    content: "Sardoba tumani bo'yicha o'tkazilgan umumta'lim fanlari olimpiadasida 9-11 sinf o'quvchilarimiz yuqori natijalarni ko'rsatishdi. Matematika fanidan 10-sinf o'quvchisi Alimov Jasur viloyat bosqichiga yo'llanma oldi.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
    views: 189,
    featured: false
  },
  {
    id: "news-4",
    title: "Maktablaro futbol musobaqasida jamoamiz g'olib bo'ldi",
    category: "Sport",
    date: "2025-12-05",
    summary: "Sardoba tumani maktablari o'rtasida o'tkazilgan 'Quvnoq startlar' va futbol musobaqasi yakunlandi.",
    content: "Sportning futbol turi bo'yicha maktabimiz terma jamoasi final uchrashuvida g'alaba qozonib, tuman kubogini maktabimizga olib kelishdi. Barcha g'oliblarga diplom va sovg'alar topshirildi.",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80",
    views: 156,
    featured: false
  }
];

export const initialPhotos: PhotoItem[] = [
  {
    id: "p1",
    title: "Maktab binosi va hududi",
    category: "Sinflar",
    url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80",
    date: "2025-09-01",
    description: "Sardoba tumani 16-maktabining zamonaviy ta'mirlangan binosi"
  },
  {
    id: "p2",
    title: "Shinam sinf xonalari",
    category: "Dars jarayoni",
    url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80",
    date: "2025-09-10",
    description: "Interaktiv doska va qulay mebellar bilan jihozlangan sinf xonasi"
  },
  {
    id: "p3",
    title: "Informatika xonasi va kompyuterlar",
    category: "Dars jarayoni",
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
    date: "2025-10-02",
    description: "O'quvchilar uchun zamonaviy kompyuter va internet tarmog'i"
  },
  {
    id: "p4",
    title: "Bayram tadbirlaridan fotolavhalar",
    category: "Tadbirlar",
    url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80",
    date: "2025-10-21",
    description: "O'zbek tili bayrami va badiiy kechalar"
  },
  {
    id: "p5",
    title: "Maktab kutubxonasi",
    category: "Maktab hayoti",
    url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80",
    date: "2025-11-05",
    description: "5000 dan ortiq badiiy va darslik adabiyotlar jamlangan kutubxona"
  },
  {
    id: "p6",
    title: "Sport zali va musobaqalar",
    category: "Sport",
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=80",
    date: "2025-11-12",
    description: "O'quvchilarning sport bilan shug'ullanishi uchun barcha sharoitlar"
  }
];

export const initialVideos: VideoItem[] = [
  {
    id: "yt-DqgC3jlpIhM",
    title: "“ONA TILIM — FAXRIM, G‘URURIM!” CHELLENJI TASHKIL ETILDI",
    videoUrl: "https://www.youtube.com/embed/DqgC3jlpIhM",
    thumbnail: "https://i.ytimg.com/vi/DqgC3jlpIhM/maxresdefault.jpg",
    duration: "",
    date: "2026-10-17",
    description: "Joriy yilning 17-oktabr kuni Sardoba tumani Ta’lim va ilm-fan bo‘limi tasarrufidagi 16-umumiy o‘rta ta’lim maktabida o‘zbek tiliga davlat tili maqomi berilgan kun munosabati bilan “Ona tilim — faxrim, g‘ururim!”…"
  },
  {
    id: "yt-d2K8E8lARGA",
    title: "📚 «JADIDLAR IZIDAN» KITOBXONLIK KLUBIGA MARHAMAT!",
    videoUrl: "https://www.youtube.com/embed/d2K8E8lARGA",
    thumbnail: "https://i.ytimg.com/vi/d2K8E8lARGA/maxresdefault.jpg",
    duration: "",
    date: "2026-10-14",
    description: "Joriy yilning 14-oktabr kuni Sardoba tumani Maktabgacha va maktab ta’limi bo‘limi tasarrufidagi 16-sonli umumiy o‘rta ta’lim maktabida yosh avlodning kitobxonlik madaniyatini yuksaltirish, milliy ma’naviyatimizni…"
  },
  {
    id: "yt-l9Zm1MYKqKQ",
    title: "#QizBolaOilaKo‘rki#ErtaNikohningOldiniOlish#XotinQizlar_yig'ilishi",
    videoUrl: "https://www.youtube.com/embed/l9Zm1MYKqKQ",
    thumbnail: "https://i.ytimg.com/vi/l9Zm1MYKqKQ/maxresdefault.jpg",
    duration: "",
    date: "2026-10-12",
    description: "Joriy yilning 12-oktabr kuni Sardoba tumani Maktabgacha va maktab ta’limi bo‘limi tasarrufidagi 16-sonli umumiy o‘rta ta’lim maktabida o‘quvchi qizlar ishtirokida “Qiz bola — oila ko‘rki” mavzusida davra suhbati…"
  },
  {
    id: "yt--W9MdgngMkI",
    title: "📚 “KELAJAK SOATI” — USTOZGA EHTIROM, KELAJAKKA HURMAT!",
    videoUrl: "https://www.youtube.com/embed/-W9MdgngMkI",
    thumbnail: "https://i.ytimg.com/vi/-W9MdgngMkI/maxresdefault.jpg",
    duration: "",
    date: "2026-10-12",
    description: "Joriy yilning 12-oktabr kuni Sardoba tumani Maktabgacha va maktab ta’limi bo‘limi tasarrufidagi 16-sonli umumiy o‘rta ta’lim maktabida  navbatdagi “Kelajak soati” mashg‘ulotlari o‘tkaziladi."
  },
  {
    id: "yt-lLQrZ-qoNSo",
    title: "#KelajakMarkazlari#MaktabMaslahatchilari",
    videoUrl: "https://www.youtube.com/embed/lLQrZ-qoNSo",
    thumbnail: "https://i.ytimg.com/vi/lLQrZ-qoNSo/maxresdefault.jpg",
    duration: "",
    date: "2026-10-10",
    description: "📚 MAKTAB MASLAHATCHILARI FAOLIYATINI TAKOMILLASHTIRISHGA QARATILGAN AMALIY SEMINAR📍Joriy yilning 10-oktabr kuni Sardoba tumani Maktabgacha va maktab ta’limi bo‘limi tasarrufidagi 16-sonli umumiy o‘rta ta’lim…"
  },
  {
    id: "yt-NvGqFoGYChg",
    title: "Milliy liboslar kuni",
    videoUrl: "https://www.youtube.com/embed/NvGqFoGYChg",
    thumbnail: "https://i.ytimg.com/vi/NvGqFoGYChg/maxresdefault.jpg",
    duration: "",
    date: "2026-10-09",
    description: "Joriy yilning 9-oktabr kuni maktabimizda “Milliy liboslar kuni” munosabati bilan barcha o‘qituvchi va o‘quvchilar milliy liboslarda dars mashg‘ulotlarida ishtirok etdilar. Ushbu tashabbus milliy qadriyatlarimiz,…"
  },
  {
    id: "yt-4-YcRaGAnYw",
    title: "Ustozlar va murabbiylar kuniga chellenj",
    videoUrl: "https://www.youtube.com/embed/4-YcRaGAnYw",
    thumbnail: "https://i.ytimg.com/vi/4-YcRaGAnYw/maxresdefault.jpg",
    duration: "",
    date: "2026-09-24",
    description: "🌟 USTOZ VA MURABBIYLAR — KELAJAK BUNYODKORLARI! 🌟"
  },
  {
    id: "yt-CJjsBVo6egs",
    title: "3-hafta kelajak soati",
    videoUrl: "https://www.youtube.com/embed/CJjsBVo6egs",
    thumbnail: "https://i.ytimg.com/vi/CJjsBVo6egs/maxresdefault.jpg",
    duration: "",
    date: "2026-09-14",
    description: "Joriy yilning14-sentabr kuni Sardoba tumani Maktabgacha va maktab ta’limi bo‘limi tasarrufidagi 16-sonli umumiy o‘rta ta’lim maktabida 2026–2027-o‘quv yilining 3-haftasi doirasida o'quvchilar  uchun 1-4 -sinflarda…"
  },
  {
    id: "yt-xJQEWroKLE4",
    title: "2026–2027-O‘QUV YILINING ILK KUNI",
    videoUrl: "https://www.youtube.com/embed/xJQEWroKLE4",
    thumbnail: "https://i.ytimg.com/vi/xJQEWroKLE4/maxresdefault.jpg",
    duration: "",
    date: "2026-09-14",
    description: "🏫 SARDОBA TUMANI MAKTABGACHA VA MAKTAB TA’LIMI BO‘LIMI TASARRUFIDAGI  16-SONLI UMUMIY O‘RTA TA’LIM MAKTABIDA"
  }
];

export const initialTeachers: TeacherItem[] = [
  {
    id: "team-20",
    name: "Fayzullayev Bobomurod ",
    role: "Maktab direktori",
    subject: "Direktor",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/20.jpg",
    category: "Rahbariyat",
    awards: []
  },
  {
    id: "team-29",
    name: "Abdullayev Abdumalik",
    role: "Direktor O'rinbosari",
    subject: "Direktor O'rinbosari",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/29.jpg",
    category: "Rahbariyat",
    awards: []
  },
  {
    id: "team-15",
    name: "Zulpiqarov Jaloliddin",
    role: "Direktor O'rinbosari",
    subject: "Direktor O'rinbosari",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/15.jpg",
    category: "Rahbariyat",
    awards: []
  },
  {
    id: "team-4",
    name: "Bakirova Ro'zigul",
    role: "Maktab Maslahatchisi",
    subject: "Maktab Maslahatchisi",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/4.jpg",
    category: "Rahbariyat",
    awards: []
  },
  {
    id: "team-26",
    name: "Saidmuradova Sanobar",
    role: "O'qituvchi",
    subject: "Kutubxona mudirasi",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/26.jpg",
    category: "Rahbariyat",
    awards: []
  },
  {
    id: "team-1",
    name: "Yaxshilikova Oltinoy",
    role: "O'qituvchi",
    subject: "Tasviriy san'at va chizmachilik",
    qualification: "",
    experience: "10 yil",
    photo: "/team/1.jpg",
    category: "Aniq fanlar",
    awards: []
  },
  {
    id: "team-2",
    name: "Tangirova Oysara",
    role: "O'qituvchi",
    subject: "Ona tili va adabiyot",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/2.jpg",
    category: "Gumanitar fanlar",
    awards: []
  },
  {
    id: "team-3",
    name: "Karimova Ra'no",
    role: "O'qituvchi",
    subject: "Rus tili",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/3.jpg",
    category: "Chet tillari",
    awards: []
  },
  {
    id: "team-5",
    name: "Juvoshova Mavjuda",
    role: "O'qituvchi",
    subject: "Boshlang'ich ta'lim",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/5.jpg",
    category: "Boshlang'ich",
    awards: []
  },
  {
    id: "team-6",
    name: "Yaxshilikova Nafisa",
    role: "O'qituvchi",
    subject: "Matematika",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/6.jpg",
    category: "Aniq fanlar",
    awards: []
  },
  {
    id: "team-7",
    name: "Dusanova Nafisa",
    role: "O'qituvchi",
    subject: "Ingliz tili",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/7.jpg",
    category: "Chet tillari",
    awards: []
  },
  {
    id: "team-8",
    name: "Janibekov Odil",
    role: "O'qituvchi",
    subject: "Informatika va AKT",
    qualification: "",
    experience: "",
    photo: "/team/8.jpg",
    category: "Aniq fanlar",
    awards: []
  },
  {
    id: "team-9",
    name: "Turg'unboyev Davron",
    role: "O'qituvchi",
    subject: "Jismoniy tarbiya (Sport)",
    qualification: "",
    experience: "",
    photo: "/team/9.jpg",
    category: "Sport",
    awards: []
  },
  {
    id: "team-10",
    name: "Altmishova Dilorom",
    role: "O'qituvchi",
    subject: "Ona tili va adabiyot",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/10.jpg",
    category: "Gumanitar fanlar",
    awards: []
  },
  {
    id: "team-11",
    name: "Umrzoqova Dinara",
    role: "O'qituvchi",
    subject: "Ona tili va adabiyot",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/11.jpg",
    category: "Gumanitar fanlar",
    awards: []
  },
  {
    id: "team-12",
    name: "Ismoilov Goffor",
    role: "O'qituvchi",
    subject: "CHQBT",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/12.jpg",
    category: "Sport",
    awards: []
  },
  {
    id: "team-14",
    name: "Cho'tanova Gulnoza",
    role: "O'qituvchi",
    subject: "Boshlang'ich ta'lim",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/14.jpg",
    category: "Boshlang'ich",
    awards: []
  },
  {
    id: "team-16",
    name: "Qo'chqorov Jo'raboy ",
    role: "O'qituvchi",
    subject: "Informatika va AKT",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/16.jpg",
    category: "Aniq fanlar",
    awards: []
  },
  {
    id: "team-17",
    name: "Ismoilova Malika",
    role: "O'qituvchi",
    subject: "Ingliz tili",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/17.jpg",
    category: "Chet tillari",
    awards: []
  },
  {
    id: "team-18",
    name: "Berdiyorova Aziza",
    role: "O'qituvchi",
    subject: "Boshlang'ich ta'lim",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/18.jpg",
    category: "Boshlang'ich",
    awards: []
  },
  {
    id: "team-19",
    name: "Ismatov Begzod",
    role: "O'qituvchi",
    subject: "Tarix",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/19.jpg",
    category: "Gumanitar fanlar",
    awards: []
  },
  {
    id: "team-21",
    name: "O'risheva Hayri",
    role: "O'qituvchi",
    subject: "Boshlang'ich ta'lim",
    qualification: "",
    experience: "",
    photo: "/team/21.jpg",
    category: "Boshlang'ich",
    awards: []
  },
  {
    id: "team-22",
    name: "Suyarov Ziyodulla",
    role: "O'qituvchi",
    subject: "Jismoniy tarbiya (Sport)",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/22.jpg",
    category: "Sport",
    awards: []
  },
  {
    id: "team-23",
    name: "Pardaboyeva Umida",
    role: "O'qituvchi",
    subject: "Boshlang'ich ta'lim",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/23.jpg",
    category: "Boshlang'ich",
    awards: []
  },
  {
    id: "team-24",
    name: "Oqnazarov Shaxzod",
    role: "O'qituvchi",
    subject: "Matematika",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/24.jpg",
    category: "Aniq fanlar",
    awards: []
  },
  {
    id: "team-25",
    name: "Pardaboyev Sardor",
    role: "O'qituvchi",
    subject: "Matematika",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/25.jpg",
    category: "Aniq fanlar",
    awards: []
  },
  {
    id: "team-27",
    name: "Yalg‘ashev Rustambek",
    role: "O'qituvchi",
    subject: "Fizika",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/27.jpg",
    category: "Aniq fanlar",
    awards: []
  },
  {
    id: "team-28",
    name: "Qo'chqorov Ahmad",
    role: "O'qituvchi",
    subject: "Pisixolog",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/28.jpg",
    category: "Tabiiy fanlar",
    awards: []
  },
  {
    id: "team-30",
    name: "Mahmudov Jasurbek",
    role: "O'qituvchi",
    subject: "Ingliz tili",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/30.webp",
    category: "Chet tillari",
    awards: []
  },
  {
    id: "team-31",
    name: "Mahmudov Jafar",
    role: "O'qituvchi",
    subject: "Jismoniy tarbiya (Sport)",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/31.webp",
    category: "Sport",
    awards: []
  },
  {
    id: "team-32",
    name: "Jonboyeva Dilafruz",
    role: "O'qituvchi",
    subject: "Kimyo",
    qualification: "",
    experience: "10 Yil",
    photo: "/team/32.jpg",
    category: "Aniq fanlar",
    awards: []
  },
  {
    id: "team-33",
    name: "Jamoa a'zosi 33",
    role: "O'qituvchi",
    subject: "",
    qualification: "",
    experience: "",
    photo: "/team/33.jpg"
  }
];
