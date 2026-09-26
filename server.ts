import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import {
  initialSchoolInfo,
  initialNews,
  initialPhotos,
  initialVideos,
  initialTeachers,
} from "./src/data/initialData";
import {
  SchoolInfo,
  NewsItem,
  PhotoItem,
  VideoItem,
  TeacherItem,
  ContactMessage,
} from "./src/types";

// Storage file paths for permanent data persistence on disk
const STORAGE_FILE = path.join(process.cwd(), "storage.json");
const BACKUP_STORAGE_FILE = path.join(process.cwd(), "storage.backup.json");

interface StorageData {
  schoolInfo: SchoolInfo;
  newsList: NewsItem[];
  photoList: PhotoItem[];
  videoList: VideoItem[];
  teacherList: TeacherItem[];
  messageList: ContactMessage[];
}

// Teacher hierarchy sorting helper
function isDirectorTeacherServer(t: TeacherItem): boolean {
  if (!t) return false;
  const role = (t.role || '').toLowerCase();
  const isDeputy =
    role.includes("o'rinbosar") ||
    role.includes("oʻrinbosar") ||
    role.includes("o`rinbosar") ||
    role.includes("o'rinbosari") ||
    role.includes("orinbosar") ||
    role.includes("muovin") ||
    role.includes("deputy") ||
    role.includes("yordamchi");
  if (isDeputy) return false;
  return (
    role.includes("direktor") ||
    role.includes("director") ||
    role.includes("maktab rahbari") ||
    role.includes("muassasa rahbari")
  );
}

function isDeputyDirectorServer(t: TeacherItem): boolean {
  if (!t) return false;
  const role = (t.role || '').toLowerCase();
  return (
    role.includes("o'rinbosar") ||
    role.includes("oʻrinbosar") ||
    role.includes("o`rinbosar") ||
    role.includes("o'rinbosari") ||
    role.includes("orinbosar") ||
    role.includes("muovin") ||
    role.includes("deputy")
  );
}

function sortTeachersWithDirectorFirst(list: TeacherItem[]): TeacherItem[] {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const isDirA = isDirectorTeacherServer(a);
    const isDirB = isDirectorTeacherServer(b);
    if (isDirA && !isDirB) return -1;
    if (!isDirA && isDirB) return 1;

    const isDepA = isDeputyDirectorServer(a);
    const isDepB = isDeputyDirectorServer(b);
    if (isDepA && !isDepB) return -1;
    if (!isDepA && isDepB) return 1;

    const isLdrA = (a.category || '').toLowerCase() === 'rahbariyat';
    const isLdrB = (b.category || '').toLowerCase() === 'rahbariyat';
    if (isLdrA && !isLdrB) return -1;
    if (!isLdrA && isLdrB) return 1;

    return 0;
  });
}

function loadStorage(): StorageData {
  // 1. Try primary storage file
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          schoolInfo: parsed.schoolInfo || { ...initialSchoolInfo },
          newsList: Array.isArray(parsed.newsList) ? parsed.newsList : [...initialNews],
          photoList: Array.isArray(parsed.photoList) ? parsed.photoList : [...initialPhotos],
          videoList: Array.isArray(parsed.videoList) ? parsed.videoList : [...initialVideos],
          teacherList: Array.isArray(parsed.teacherList) && parsed.teacherList.length > 0
            ? sortTeachersWithDirectorFirst(parsed.teacherList)
            : sortTeachersWithDirectorFirst([...initialTeachers]),
          messageList: Array.isArray(parsed.messageList) ? parsed.messageList : [],
        };
      }
    }
  } catch (err) {
    console.error("Error reading primary storage.json, checking backup:", err);
  }

  // 2. Fallback to secondary backup file
  try {
    if (fs.existsSync(BACKUP_STORAGE_FILE)) {
      const raw = fs.readFileSync(BACKUP_STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          schoolInfo: parsed.schoolInfo || { ...initialSchoolInfo },
          newsList: Array.isArray(parsed.newsList) ? parsed.newsList : [...initialNews],
          photoList: Array.isArray(parsed.photoList) ? parsed.photoList : [...initialPhotos],
          videoList: Array.isArray(parsed.videoList) ? parsed.videoList : [...initialVideos],
          teacherList: Array.isArray(parsed.teacherList) && parsed.teacherList.length > 0
            ? sortTeachersWithDirectorFirst(parsed.teacherList)
            : sortTeachersWithDirectorFirst([...initialTeachers]),
          messageList: Array.isArray(parsed.messageList) ? parsed.messageList : [],
        };
      }
    }
  } catch (err) {
    console.error("Error reading storage.backup.json:", err);
  }

  // 3. Fallback to initial defaults if no storage exists yet
  return {
    schoolInfo: { ...initialSchoolInfo },
    newsList: [...initialNews],
    photoList: [...initialPhotos],
    videoList: [...initialVideos],
    teacherList: sortTeachersWithDirectorFirst([...initialTeachers]),
    messageList: [
      {
        id: "msg-1",
        name: "Sardor Alimov",
        phone: "+998 90 123 45 67",
        subject: "1-sinfga qabul bo'yicha",
        message: "Assalomu alaykum! 2026-2027 o'quv yili uchun 1-sinfga qabul hujjalarini qachondan topshirsa bo'ladi?",
        date: "2026-07-20 14:30",
        read: false,
      },
    ],
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Load persistent data from storage.json
  const initialStorage = loadStorage();
  let schoolInfo: SchoolInfo = initialStorage.schoolInfo;
  let newsList: NewsItem[] = initialStorage.newsList;
  let photoList: PhotoItem[] = initialStorage.photoList;
  let videoList: VideoItem[] = initialStorage.videoList;
  let teacherList: TeacherItem[] = initialStorage.teacherList;
  let messageList: ContactMessage[] = initialStorage.messageList;

  function saveStorage() {
    try {
      const data: StorageData = {
        schoolInfo,
        newsList,
        photoList,
        videoList,
        teacherList,
        messageList,
      };
      const json = JSON.stringify(data, null, 2);
      fs.writeFileSync(STORAGE_FILE, json, "utf-8");
      // Secondary safety backup mirror
      try {
        fs.writeFileSync(BACKUP_STORAGE_FILE, json, "utf-8");
      } catch {}
    } catch (err) {
      console.error("Error writing to storage.json:", err);
    }
  }

  // Ensure file is created
  saveStorage();

  // Initialize Gemini AI Client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // --- API ENDPOINTS ---

  // Gemini AI Chat Endpoint
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { prompt, history } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.status(503).json({
          error: "Gemini API kaliti sozlanmagan. Settings > Secrets bo'limida GEMINI_API_KEY ni tekshiring.",
        });
      }

      const systemInstruction = `Siz Sardoba tumani 16-sonli umumiy o'rta ta'lim maktabining rasmiy AI Yordamchisiz.
Sizning vazifangiz foydalanuvchilar, o'quvchilar va ota-onalarning maktab haqidagi barcha savollariga aniq, xushmuomala va o'zbek tilida javob berishdir.

MAKTAB HAQIDA RASMIY MA'LUMOTLAR:
- Maktab nomi: ${schoolInfo.name} (${schoolInfo.shortName})
- Tashkil etilgan yili: Muassasa 2000-yil 28-sentabrda davlat roʻyxatidan oʻtgan va shu vaqtdan buyon faoliyat koʻrsatib kelmoqda.
- Tashkiliy-huquqiy shakli: Davlat muassasasi boʻlib, ulushi 100% davlatga tegishli.
- Yuqori turuvchi vazirlik: Oʻzbekiston Respublikasi Maktabgacha va maktab taʼlimi vazirligi.
- Aniq Manzili: 99JV+JG, Navoi, Sirdaryo Region, Oʻzbekiston.
- Aloqa telefoni: ${schoolInfo.phone} (+998 (94) 160-16-74)
- Faoliyat Yoʻnalishi: Asosiy faoliyati - Umumiy oʻrta taʼlim berish.
- Direktor: ${schoolInfo.principalName}
- Ko'rsatkichlar: ${schoolInfo.stats.studentsCount} nafar o'quvchi, ${schoolInfo.stats.teachersCount} nafar oliy va birinchi toifali o'qituvchi, ${schoolInfo.stats.classroomsCount} ta sinf xonasi.
- Ish vaqti: ${schoolInfo.workHours}

JAVOB BERISH QOIDALARI:
1. Har doim xushmuomala, do'stona va rasmiy o'zbek tilida javob bering.
2. Agar foydalanuvchi maktab manzili, telefoni, direktori yoki tashkil topgan yili haqida so'rasa, yuqoridagi rasmiy ma'lumotlarni aniq keltiring.
3. Javoblarni tartibli, tushunarli va chiroyli formatda bering (kerak bo'lsa punktlar va emojilardan foydalaning).`;

      let formattedPrompt = prompt;
      if (history && Array.isArray(history) && history.length > 0) {
        const historyText = history
          .map((item: { sender: string; text: string }) => `${item.sender === 'user' ? 'Foydalanuvchi' : 'AI'}: ${item.text}`)
          .join('\n');
        formattedPrompt = `Oldingi suhbat:\n${historyText}\n\nYangi savol: ${prompt}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: formattedPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: error?.message || "AI javob berishda xatolik yuz berdi." });
    }
  });

  // School Info CRUD
  app.get("/api/school", (req, res) => res.json(schoolInfo));
  app.post("/api/school", (req, res) => {
    schoolInfo = { ...schoolInfo, ...req.body };
    saveStorage();
    res.json({ success: true, data: schoolInfo });
  });

  // News CRUD
  app.get("/api/news", (req, res) => res.json(newsList));
  app.post("/api/news", (req, res) => {
    const newItem: NewsItem = {
      id: "news-" + Date.now(),
      views: 0,
      date: new Date().toISOString().split("T")[0],
      ...req.body,
    };
    newsList.unshift(newItem);
    saveStorage();
    res.json({ success: true, data: newItem });
  });
  app.put("/api/news/:id", (req, res) => {
    const idx = newsList.findIndex((n) => n.id === req.params.id);
    if (idx !== -1) {
      newsList[idx] = { ...newsList[idx], ...req.body };
      saveStorage();
      res.json({ success: true, data: newsList[idx] });
    } else {
      res.status(404).json({ error: "Yangilik topilmadi" });
    }
  });
  app.delete("/api/news/:id", (req, res) => {
    newsList = newsList.filter((n) => n.id !== req.params.id);
    saveStorage();
    res.json({ success: true });
  });

  // Photos CRUD
  app.get("/api/photos", (req, res) => res.json(photoList));
  app.post("/api/photos", (req, res) => {
    const newPhoto: PhotoItem = {
      id: "p-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      ...req.body,
    };
    photoList.unshift(newPhoto);
    saveStorage();
    res.json({ success: true, data: newPhoto });
  });
  app.put("/api/photos/:id", (req, res) => {
    const idx = photoList.findIndex((p) => p.id === req.params.id);
    if (idx !== -1) {
      photoList[idx] = { ...photoList[idx], ...req.body };
      saveStorage();
      res.json({ success: true, data: photoList[idx] });
    } else {
      res.status(404).json({ error: "Rasm topilmadi" });
    }
  });
  app.delete("/api/photos/:id", (req, res) => {
    photoList = photoList.filter((p) => p.id !== req.params.id);
    saveStorage();
    res.json({ success: true });
  });

  // Videos CRUD
  app.get("/api/videos", (req, res) => res.json(videoList));
  app.post("/api/videos", (req, res) => {
    const newVideo: VideoItem = {
      id: "v-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      ...req.body,
    };
    videoList.unshift(newVideo);
    saveStorage();
    res.json({ success: true, data: newVideo });
  });
  app.put("/api/videos/:id", (req, res) => {
    const idx = videoList.findIndex((v) => v.id === req.params.id);
    if (idx !== -1) {
      videoList[idx] = { ...videoList[idx], ...req.body };
      saveStorage();
      res.json({ success: true, data: videoList[idx] });
    } else {
      res.status(404).json({ error: "Video topilmadi" });
    }
  });
  app.delete("/api/videos/:id", (req, res) => {
    videoList = videoList.filter((v) => v.id !== req.params.id);
    saveStorage();
    res.json({ success: true });
  });

  // Teachers CRUD
  app.get("/api/teachers", (req, res) => res.json(sortTeachersWithDirectorFirst(teacherList)));
  app.post("/api/teachers", (req, res) => {
    const newTeacher: TeacherItem = {
      id: "t-" + Date.now(),
      ...req.body,
    };
    teacherList = sortTeachersWithDirectorFirst([...teacherList, newTeacher]);
    saveStorage();
    res.json({ success: true, data: newTeacher });
  });
  app.put("/api/teachers/:id", (req, res) => {
    const idx = teacherList.findIndex((t) => t.id === req.params.id);
    if (idx !== -1) {
      teacherList[idx] = { ...teacherList[idx], ...req.body };
      teacherList = sortTeachersWithDirectorFirst(teacherList);
      saveStorage();
      res.json({ success: true, data: teacherList.find((t) => t.id === req.params.id) || teacherList[idx] });
    } else {
      res.status(404).json({ error: "O'qituvchi topilmadi" });
    }
  });
  app.delete("/api/teachers/:id", (req, res) => {
    teacherList = teacherList.filter((t) => t.id !== req.params.id);
    saveStorage();
    res.json({ success: true });
  });

  // Contact Messages CRUD
  app.get("/api/messages", (req, res) => res.json(messageList));
  app.post("/api/messages", (req, res) => {
    const newMsg: ContactMessage = {
      id: "msg-" + Date.now(),
      date: new Date().toLocaleString("uz-UZ"),
      read: false,
      ...req.body,
    };
    messageList.unshift(newMsg);
    saveStorage();
    res.json({ success: true, data: newMsg });
  });
  app.put("/api/messages/:id/read", (req, res) => {
    const idx = messageList.findIndex((m) => m.id === req.params.id);
    if (idx !== -1) {
      messageList[idx].read = true;
      saveStorage();
      res.json({ success: true, data: messageList[idx] });
    } else {
      res.status(404).json({ error: "Xabar topilmadi" });
    }
  });

  // Export / Backup all data as JSON
  app.get("/api/backup", (req, res) => {
    res.setHeader("Content-Disposition", 'attachment; filename="sardoba16_maktab_zaxira.json"');
    res.setHeader("Content-Type", "application/json");
    res.json({
      schoolInfo,
      newsList,
      photoList,
      videoList,
      teacherList,
      messageList,
      exportedAt: new Date().toISOString(),
    });
  });

  // Import / Restore all data from JSON
  app.post("/api/restore", (req, res) => {
    try {
      const data = req.body;
      if (!data || typeof data !== "object") {
        return res.status(400).json({ error: "Noto'g'ri zaxira fayl formati" });
      }
      if (data.schoolInfo) schoolInfo = { ...initialSchoolInfo, ...data.schoolInfo };
      if (Array.isArray(data.newsList)) newsList = data.newsList;
      if (Array.isArray(data.photoList)) photoList = data.photoList;
      if (Array.isArray(data.videoList)) videoList = data.videoList;
      if (Array.isArray(data.teacherList)) teacherList = data.teacherList;
      if (Array.isArray(data.messageList)) messageList = data.messageList;
      saveStorage();
      res.json({
        success: true,
        message: "Zaxira muvaffaqiyatli tiklandi!",
        data: { schoolInfo, newsList, photoList, videoList, teacherList, messageList },
      });
    } catch (err: any) {
      console.error("Error restoring backup:", err);
      res.status(500).json({ error: "Zaxirani tiklashda xatolik: " + err.message });
    }
  });

  // Client-to-Server Sync endpoint (preserves client modifications if newer)
  app.post("/api/sync", (req, res) => {
    try {
      const { schoolInfo: s, newsList: n, photoList: p, videoList: v, teacherList: t } = req.body;
      let modified = false;
      if (s && typeof s === "object") {
        schoolInfo = { ...schoolInfo, ...s };
        modified = true;
      }
      if (Array.isArray(n) && n.length > 0) {
        newsList = n;
        modified = true;
      }
      if (Array.isArray(p) && p.length > 0) {
        photoList = p;
        modified = true;
      }
      if (Array.isArray(v) && v.length > 0) {
        videoList = v;
        modified = true;
      }
      if (Array.isArray(t) && t.length > 0) {
        teacherList = t;
        modified = true;
      }
      if (modified) {
        saveStorage();
      }
      res.json({
        success: true,
        data: { schoolInfo, newsList, photoList, videoList, teacherList, messageList },
      });
    } catch (err: any) {
      res.status(500).json({ error: "Sinxronlashda xatolik: " + err.message });
    }
  });

  // Reset to initial state endpoint
  app.post("/api/reset", (req, res) => {
    schoolInfo = { ...initialSchoolInfo };
    newsList = [...initialNews];
    photoList = [...initialPhotos];
    videoList = [...initialVideos];
    teacherList = [...initialTeachers];
    saveStorage();
    res.json({ success: true, message: "Barcha ma'lumotlar boshlang'ich holatga qaytarildi" });
  });

  // Vite Middleware for Dev or Static files for Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
