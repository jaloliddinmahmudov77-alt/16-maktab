import React, { useState } from 'react';
import { TeacherItem } from '../types';
import {
  Users,
  Search,
  Award,
  Phone,
  Mail,
  GraduationCap,
  BookOpen,
  X,
  Star,
  CheckCircle,
  Crown,
  ShieldAlert,
} from 'lucide-react';
import {
  isDirectorTeacher,
  isDeputyDirector,
  sortTeachersDirectorFirst,
} from '../utils/teacherUtils';

interface TeamViewProps {
  teacherList: TeacherItem[];
}

export const TeamView: React.FC<TeamViewProps> = ({ teacherList }) => {
  const [selectedRole, setSelectedRole] = useState<string>('Barchasi');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherItem | null>(null);

  const roleCategories = [
    'Barchasi',
    'Rahbariyat',
    'Aniq fanlar',
    'Gumanitar fanlar',
    'Chet tillari',
    'Boshlang\'ich',
    'Sport',
    'Tabiiy fanlar',
  ];

  const filteredTeachers = teacherList.filter((teacher) => {
    let matchesRole = true;
    if (selectedRole !== 'Barchasi') {
      if (selectedRole === 'Rahbariyat') {
        const isDir = isDirectorTeacher(teacher);
        const isDep = isDeputyDirector(teacher);
        const catMatch = teacher.category && teacher.category.toLowerCase() === 'rahbariyat';
        const roleMatch = (teacher.role || '').toLowerCase().includes('rahbar');
        matchesRole = Boolean(isDir || isDep || catMatch || roleMatch);
      } else if (teacher.category) {
        matchesRole = teacher.category.toLowerCase() === selectedRole.toLowerCase();
      } else {
        if (selectedRole === 'Aniq fanlar') {
          matchesRole = teacher.subject.toLowerCase().includes('matematika') || teacher.subject.toLowerCase().includes('informatika') || teacher.subject.toLowerCase().includes('fizika');
        } else if (selectedRole === 'Gumanitar fanlar') {
          matchesRole = teacher.subject.toLowerCase().includes('o\'zbek') || teacher.subject.toLowerCase().includes('tarix') || teacher.subject.toLowerCase().includes('huquq');
        } else if (selectedRole === 'Chet tillari') {
          matchesRole = teacher.subject.toLowerCase().includes('ingliz') || teacher.subject.toLowerCase().includes('rus') || teacher.subject.toLowerCase().includes('chet');
        } else if (selectedRole === 'Boshlang\'ich') {
          matchesRole = teacher.role.toLowerCase().includes('boshlang\'ich') || teacher.subject.toLowerCase().includes('boshlang\'ich');
        } else if (selectedRole === 'Sport') {
          matchesRole = teacher.subject.toLowerCase().includes('jismoniy') || teacher.subject.toLowerCase().includes('sport');
        } else if (selectedRole === 'Tabiiy fanlar') {
          matchesRole = teacher.subject.toLowerCase().includes('biologiya') || teacher.subject.toLowerCase().includes('kimyo') || teacher.subject.toLowerCase().includes('geografiya');
        }
      }
    }

    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (teacher.category && teacher.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRole && matchesSearch;
  });

  // Director is strictly #1 in 'Barchasi', 'Rahbariyat', and all listings
  const sortedTeachers = sortTeachersDirectorFirst(filteredTeachers);

  return (
    <div id="team-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          Pedagogik Jamoa
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Maktabimiz O'qituvchilari va Rahbariyati
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          16-sonli maktabda ta'lim va tarbiya berib kelayotgan oliy toifali, tajribali hamda jonkuyar pedagoglar jamoasi.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {roleCategories.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedRole === role
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="O'qituvchi ismi yoki fan..."
            className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Information status banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-900/60 border border-slate-800 px-4 py-2.5 rounded-xl">
        <div className="flex items-center gap-2 font-medium">
          {selectedRole === 'Rahbariyat' ? (
            <>
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-amber-300">Maktab direktori avtomatik ravishda 1-o'rinda boshchilik qiladi</span>
            </>
          ) : (
            <>
              <Users className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-slate-300">
                {selectedRole === 'Barchasi' ? "Barcha jamoa ro'yxati (Direktor 1-o'rinda)" : `${selectedRole} yo'nalishi bo'yicha`}
              </span>
            </>
          )}
        </div>
        <span className="text-slate-500 font-medium">Ko'rsatilmoqda: {sortedTeachers.length} nafar</span>
      </div>

      {/* Teachers Cards Grid */}
      {sortedTeachers.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 text-slate-400">
          <p className="text-base font-semibold">O'qituvchi topilmadi</p>
          <p className="text-xs text-slate-500 mt-1">Qidiruv so'rovini o'zgartirib ko'ring.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTeachers.map((teacher, idx) => {
            const isDir = isDirectorTeacher(teacher);
            const isDep = isDeputyDirector(teacher);

            return (
              <div
                key={teacher.id}
                onClick={() => setSelectedTeacher(teacher)}
                className={`bg-slate-900 border rounded-2xl p-6 transition-all cursor-pointer group space-y-4 shadow-xl flex flex-col justify-between ${
                  isDir
                    ? 'border-amber-500/60 hover:border-amber-400 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20 ring-1 ring-amber-500/30'
                    : 'border-slate-800 hover:border-indigo-500/50'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={teacher.photo}
                        alt={teacher.name}
                        className={`w-20 h-20 rounded-2xl object-cover border-2 transition-colors shadow-md bg-slate-800 ${
                          isDir
                            ? 'border-amber-500/70 group-hover:border-amber-400'
                            : 'border-slate-700 group-hover:border-indigo-500'
                        }`}
                      />
                      {isDir && (
                        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
                          <Crown className="w-3.5 h-3.5 fill-slate-950" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isDir && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                            1-o'rin • Maktab Rahbari
                          </span>
                        )}
                        {isDep && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">
                            Direktor O'rinbosari
                          </span>
                        )}
                        {teacher.qualification && (
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-semibold">
                            {teacher.qualification}
                          </span>
                        )}
                        {teacher.category && !isDir && !isDep && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
                            {teacher.category}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors mt-1.5">
                        {teacher.name}
                      </h3>
                      <p className={`text-xs font-medium ${isDir ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                        {teacher.role}
                      </p>
                    </div>
                  </div>

                  {/* FAN NOMI - BOSH O'RINDA KO'RSATILADI */}
                  {(teacher.subject || teacher.experience) && (
                  <div className="bg-gradient-to-r from-indigo-950/60 to-slate-950 p-3.5 rounded-xl border border-indigo-500/20 space-y-2">
                    {teacher.subject && (
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider block">
                          Dars beradigan fani:
                        </span>
                        <span className="text-sm font-extrabold text-white leading-tight block mt-0.5">
                          {teacher.subject}
                        </span>
                      </div>
                    </div>
                    )}
                    {teacher.experience && (
                    <div className={`flex items-center justify-between text-xs ${teacher.subject ? 'pt-1.5 border-t border-slate-800/80' : ''}`}>
                      <span className="text-slate-400">Pedagogik staji:</span>
                      <span className="font-semibold text-emerald-400">{teacher.experience}</span>
                    </div>
                    )}
                  </div>
                  )}

                  {teacher.awards && teacher.awards.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {teacher.awards.map((award, aIdx) => (
                        <span
                          key={aIdx}
                          className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1"
                        >
                          <Award className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{award}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-semibold">
                  <span>Batafsil profil</span>
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Teacher Detail Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedTeacher(null)}
              className="absolute top-4 right-4 w-9 h-9 bg-slate-950 hover:bg-slate-800 text-white rounded-full flex items-center justify-center border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <img
                src={selectedTeacher.photo}
                alt={selectedTeacher.name}
                className="w-28 h-28 rounded-2xl object-cover border-4 border-indigo-500/30 shadow-xl shrink-0 bg-slate-800"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  {selectedTeacher.qualification && (
                    <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block">
                      {selectedTeacher.qualification}
                    </span>
                  )}
                  {selectedTeacher.category && (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block">
                      {selectedTeacher.category}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">{selectedTeacher.name}</h2>
                <p className="text-sm font-semibold text-slate-300">{selectedTeacher.role}</p>
              </div>
            </div>

            {/* FAN VA MA'LUMOT BLOKI (Telefon va bio butunlay olib tashlangan) */}
            {(selectedTeacher.subject || selectedTeacher.category || selectedTeacher.qualification || selectedTeacher.experience || selectedTeacher.email) && (
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3.5 text-xs text-slate-300">
              {selectedTeacher.subject && (
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  Dars beradigan fani:
                </span>
                <span className="font-bold text-white text-sm text-indigo-300">{selectedTeacher.subject}</span>
              </div>
              )}
              {selectedTeacher.category && (
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <span className="text-slate-400">Yo'nalishi / Turi:</span>
                  <span className="font-bold text-emerald-400">{selectedTeacher.category}</span>
                </div>
              )}
              {selectedTeacher.qualification && (
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <span className="text-slate-400">Pedagogik toifasi:</span>
                  <span className="font-bold text-white">{selectedTeacher.qualification}</span>
                </div>
              )}
              {selectedTeacher.experience && (
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <span className="text-slate-400">Ish tajribasi (Staj):</span>
                  <span className="font-bold text-white">{selectedTeacher.experience}</span>
                </div>
              )}
              {selectedTeacher.email && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Rasmiy elektron pochta:</span>
                  <span className="font-bold text-white">{selectedTeacher.email}</span>
                </div>
              )}
            </div>
            )}

            {selectedTeacher.awards && selectedTeacher.awards.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Yutuq va Mukofotlari:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedTeacher.awards.map((award, idx) => (
                    <li key={idx} className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                      <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-medium">{award}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
