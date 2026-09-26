import React, { useState } from 'react';
import { SchoolInfo } from '../types';
import {
  PhoneCall,
  MapPin,
  Mail,
  Clock,
  Send,
  Building2,
  CheckCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface ContactViewProps {
  schoolInfo: SchoolInfo;
  onSendMessage: (msg: { name: string; phone: string; subject: string; message: string }) => Promise<void>;
}

export const ContactView: React.FC<ContactViewProps> = ({ schoolInfo, onSendMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;

    setSending(true);
    try {
      await onSendMessage(formData);
      setSuccessMsg(true);
      setFormData({ name: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSuccessMsg(false), 5000);
    } catch (err) {
      console.error("Xabar yuborishda xatolik:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div id="contact-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5" />
          Aloqa va Manzil
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Maktabimiz Bilan Bog'laning
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          Savollaringiz yoki takliflaringiz bo'lsa, quyidagi ma'lumotlar orqali bog'lanishingiz yoki onlayn xabar qoldirishingiz mumkin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Contact Info & Map Mockup */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building2 className="w-5 h-5 text-emerald-400" />
              Rasmiy Aloqa Ma'lumotlari
            </h2>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs text-blue-400">Tashkilot Manzili:</div>
                  <div className="text-slate-200 mt-1 leading-snug">{schoolInfo.address}</div>
                  <p className="text-[11px] text-amber-300 italic mt-1">{schoolInfo.mapNote}</p>
                </div>
              </li>

              <li className="flex items-start gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="w-full">
                  <div className="font-bold text-xs text-emerald-400">Telefon Raqami:</div>
                  <a
                    href={`tel:${schoolInfo.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-white font-bold text-base hover:text-emerald-300 block mt-0.5"
                  >
                    {schoolInfo.phone}
                  </a>
                  <a
                    href={`tel:${schoolInfo.phone.replace(/[^0-9+]/g, '')}`}
                    className="mt-2 inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>To'g'ridan-to'g me'morga/direktorga qo'ng'iroq qilish</span>
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                <Mail className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-indigo-400">Elektron Pochta:</div>
                  <div className="text-white font-mono mt-0.5">{schoolInfo.email}</div>
                </div>
              </li>

              <li className="flex items-start gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-amber-400">Ish Rejimi:</div>
                  <div className="text-white font-medium mt-0.5">{schoolInfo.workHours}</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Map Location Visualization Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                Maktab Joylashuvi (Xarita)
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                99JV+JG, Navoi, Sirdaryo Region
              </span>
            </div>
            <div className="relative h-72 w-full bg-slate-950">
              <iframe
                title="Maktab xaritasi"
                src="https://maps.google.com/maps?q=99JV%2BJG%2C+Navoi%2C+Sirdaryo+Region%2C+O%CA%BBzbekiston&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
              ></iframe>
            </div>
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">
                📍 99JV+JG, Navoi, Sirdaryo Region, Oʻzbekiston
              </span>
              <a
                href="https://maps.google.com/?q=99JV%2BJG%2C+Navoi%2C+Sirdaryo+Region%2C+O%CA%BBzbekiston"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition-all shrink-0"
              >
                Google Xaritalarda Ochish
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Online Contact Message Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4 space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              Onlayn Xabar Yuborish
            </h2>
            <p className="text-xs text-slate-400">
              Yuborilgan xabarlar to'g'ridan-to'g'ri maktab ma'muriyati Admin Paneliga kelib tushadi.
            </p>
          </div>

          {successMsg && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 animate-in fade-in duration-300">
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
              <div>
                <strong>Xabar muvaffaqiyatli yuborildi!</strong>
                <p className="font-normal text-emerald-200 mt-0.5">
                  Murojaatingiz uchun rahmat. Tez orada siz bilan bog'lanamiz.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Ismingiz va Familiyangiz *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masalan: Jasur Rahimov"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Telefon Raqamingiz *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+998 90 123 45 67"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Murojaat Mavzusi
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Masalan: 1-sinfga qabul yoki to'garaklar bo'yicha"
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Xabar Matni *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Murojaatingiz matnini batafsil yozing..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Yuborilmoqda...' : 'Xabarni Yuborish'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
