export interface Subject {
  id: number;
  name: string;
  fileCount: number;
  color: string;
  iconColor: string;
}

export interface RecentNote {
  id: number;
  title: string;
  subject: string;
  semester: string;
  type: "PDF" | "DOC";
}

export const popularSubjects: Subject[] = [
  {
    id: 1,
    name: "Data Structures",
    fileCount: 120,
    color: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: 2,
    name: "Operating Systems",
    fileCount: 98,
    color: "bg-sky-50 dark:bg-sky-950/40",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    id: 3,
    name: "Computer Networks",
    fileCount: 76,
    color: "bg-violet-50 dark:bg-violet-950/40",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    id: 4,
    name: "Database Management",
    fileCount: 102,
    color: "bg-orange-50 dark:bg-orange-950/40",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
];

export const recentNotes: RecentNote[] = [
  {
    id: 1,
    title: "DSA - Arrays and Strings",
    subject: "Computer Science",
    semester: "Semester 3",
    type: "PDF",
  },
  {
    id: 2,
    title: "Operating Systems - Process Management",
    subject: "Computer Science",
    semester: "Semester 4",
    type: "PDF",
  },
  {
    id: 3,
    title: "Computer Networks - OSI Model",
    subject: "Computer Science",
    semester: "Semester 4",
    type: "PDF",
  },
  {
    id: 4,
    title: "DBMS - Normalization",
    subject: "Computer Science",
    semester: "Semester 4",
    type: "PDF",
  },
];
