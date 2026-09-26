import { TeacherItem } from '../types';

/**
 * Checks if a teacher holds the primary Director / School Principal position
 * (and is NOT a deputy/vice director).
 */
export function isDirectorTeacher(teacher: TeacherItem): boolean {
  if (!teacher) return false;
  const role = (teacher.role || '').toLowerCase();
  
  // Exclude deputy / vice-director roles
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

  const isDirectorWord =
    role.includes('direktor') ||
    role.includes('director') ||
    role.includes('maktab rahbari') ||
    role.includes('muassasa rahbari') ||
    role.includes('bosh rahbar');

  return isDirectorWord;
}

/**
 * Checks if a teacher holds a Deputy Director position.
 */
export function isDeputyDirector(teacher: TeacherItem): boolean {
  if (!teacher) return false;
  const role = (teacher.role || '').toLowerCase();
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

/**
 * Computes hierarchy rank:
 * 0 = Primary Director (1st place)
 * 1 = Deputy Directors
 * 2 = Other Leadership / Rahbariyat
 * 10 = Regular Teachers
 */
export function getTeacherRank(teacher: TeacherItem): number {
  if (isDirectorTeacher(teacher)) return 0;
  if (isDeputyDirector(teacher)) return 1;
  if ((teacher.category || '').toLowerCase() === 'rahbariyat') return 2;
  return 10;
}

/**
 * Sorts teachers so that the Director is ALWAYS placed 1st,
 * followed by deputy directors, leadership, and teachers.
 */
export function sortTeachersDirectorFirst(teachers: TeacherItem[]): TeacherItem[] {
  if (!Array.isArray(teachers)) return [];
  return [...teachers].sort((a, b) => {
    const rankA = getTeacherRank(a);
    const rankB = getTeacherRank(b);
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return 0; // preserve relative order for same ranks
  });
}
