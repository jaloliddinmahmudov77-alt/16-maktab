import React, { useState, useRef, useEffect } from 'react';
import { SchoolInfo } from '../types';
import { Bot, Send, User, Sparkles, RefreshCw, MessageSquare, Copy, Check, Info } from 'lucide-react';

interface SchoolAiChatProps {
  schoolInfo: SchoolInfo;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const SchoolAiChat: React.FC<SchoolAiChatProps> = ({ schoolInfo }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Assalomu alaykum! Men Sardoba tumani 16-sonli maktabning **AI Yordamchisiman** 🤖✨\n\nMaktabimizning tashkil topgan yili, STIR raqami, manzili, o'qituvchilar jamoasi yoki dars jarayonlari bo'yicha har qanday savolingizni berishingiz mumkin!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Maktab manzili va telefoni?",
    "STIR raqami va yuridik ma'lumotlari?",
    "Maktab direktori kim?",
    "Qachon tashkil etilgan?",
    "Maktab sinflari va o'quvchilar soni?",
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input.trim();
    if (!promptToSend || loading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: promptToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          history: messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();

      let replyText = '';
      if (response.ok && data.text) {
        replyText = data.text;
      } else {
        // Local smart fallback answer using official school data
        replyText = generateFallbackAnswer(promptToSend, schoolInfo);
      }

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Chat Error:", err);
      const fallbackText = generateFallbackAnswer(promptToSend, schoolInfo);
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: fallbackText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackAnswer = (query: string, info: SchoolInfo): string => {
    const q = query.toLowerCase();
    if (q.includes('manzil') || q.includes('joylash') || q.includes('qayer')) {
      return `📍 **Maktab Manzili:**\n${info.address}\n\nℹ️ *Izoh:* ${info.mapNote}\n📞 **Telefon:** ${info.phone}`;
    }
    if (q.includes('stir') || q.includes('inn') || q.includes('yuridik') || q.includes('vazirlik')) {
      return `🏛️ **Yuridik va Rasmiy Ma'lumotlar:**\n- **Tashkil etilgan yili:** ${info.foundedDate}\n- **STIR (ИНН):** ${info.stir}\n- **Tashkiliy-huquqiy shakli:** ${info.legalForm}\n- **Yuqori vazirlik:** ${info.parentMinistry}\n- **Faoliyat yo'nalishi:** ${info.activityType}`;
    }
    if (q.includes('direktor') || q.includes('rahbar')) {
      return `👤 **Maktab Direktori:** ${info.principalName}\n\n💬 *Direktor murojaati:* "${info.principalMessage}"\n📞 **Aloqa:** ${info.phone}`;
    }
    if (q.includes('telefon') || q.includes('raqam') || q.includes('aloqa')) {
      return `📞 **Maktab Aloqa Telefoni:** ${info.phone}\n📧 **Email:** ${info.email}\n⏰ **Ish vaqti:** ${info.workHours}`;
    }
    if (q.includes('soni') || q.includes('o\'quvchi') || q.includes('o\'qituvchi') || q.includes('statistika')) {
      return `📊 **Maktab Ko'rsatkichlari:**\n- 👨‍🎓 O'quvchilar soni: ${info.stats.studentsCount} nafar\n- 👩‍🏫 O'qituvchilar soni: ${info.stats.teachersCount} nafar\n- 🏫 Sinf xonalari: ${info.stats.classroomsCount} ta`;
    }
    return `Sardoba tumani 16-sonli maktabi 2000-yil 28-sentabrda tashkil etilgan. STIR raqami: ${info.stir}. Manzil: ${info.address}. Aloqa telefoni: ${info.phone}. Qanday boshqa ma'lumot kerak?`;
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: `Suhbat yangilandi! Maktab haqida nimani bilmoqchisiz?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div id="ai-school-chat" className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px] relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-400 to-blue-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-base sm:text-lg">Maktab AI Yordamchisi</h3>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Gemini AI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              16-maktab haqida barcha savollaringizga 24/7 tezkor javob
            </p>
          </div>
        </div>

        <button
          onClick={resetChat}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          title="Suhbatni tozalash"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested chips */}
      <div className="bg-slate-950/60 p-3 border-b border-slate-800/80 overflow-x-auto flex items-center gap-2 text-xs">
        <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
          <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
          Tezkor savollar:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="shrink-0 bg-slate-800/80 hover:bg-blue-600/30 text-slate-200 hover:text-blue-300 border border-slate-700 hover:border-blue-500/50 px-3 py-1 rounded-full transition-all text-xs font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-slate-950/80 to-slate-900">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed relative group ${
                  isAi
                    ? 'bg-slate-800/90 text-slate-100 border border-slate-700/80 shadow-md rounded-tl-sm'
                    : 'bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-600/20'
                }`}
              >
                {/* Formatting markdown bold / newlines */}
                <div className="whitespace-pre-line font-sans">
                  {msg.text.split('\n').map((line, lIdx) => (
                    <p key={lIdx} className="mb-1 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-white/10 text-[10px] opacity-70">
                  <span>{msg.time}</span>
                  {isAi && (
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="hover:opacity-100 transition-opacity flex items-center gap-1"
                      title="Nusxalash"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === msg.id ? 'Nusxalandi' : 'Nusxalash'}</span>
                    </button>
                  )}
                </div>
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl rounded-tl-sm p-4 text-slate-400 text-xs flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-100"></span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-200"></span>
              </div>
              <span>16-maktab AI javob o'ylamoqda...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Sardoba 16-maktab haqida so'rang... (Masalan: STIR raqami nima?)"
            className="flex-1 bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white p-3 rounded-xl transition-all shadow-md flex items-center justify-center shrink-0"
            aria-label="Yuborish"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-blue-400" />
            Maktabning rasmiy yuridik ma'lumotlar bazasi asosida ishlaydi
          </span>
          <span className="text-slate-600">STIR: {schoolInfo.stir}</span>
        </div>
      </div>
    </div>
  );
};
