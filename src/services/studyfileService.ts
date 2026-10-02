import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "../firebase/config";

export type FileCategory =
  | "NOTES"
  | "IMPORTANT_QUESTIONS"
  | "PREVIOUS_YEAR_PAPER"
  | "ASSIGNMENT"
  | "PRACTICAL"
  | "REFERENCE";

export interface StudyFile {
  id: string;
  title: string;
  description?: string;
  category: FileCategory;
  subjectId: string;
  fileUrl: string;
  cloudinaryPublicId: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  createdAt?: unknown;
}

export async function getFilesBySubject(
  subjectId: string,
): Promise<StudyFile[]> {
  const q = query(
    collection(db, "studyFiles"),
    where("subjectId", "==", subjectId),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as StudyFile[];
}

export async function getFilesBySubjectAndCategory(
  subjectId: string,
  category: FileCategory,
): Promise<StudyFile[]> {
  const q = query(
    collection(db, "studyFiles"),
    where("subjectId", "==", subjectId),
    where("category", "==", category),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as StudyFile[];
}

export async function createStudyFile(
  data: Omit<StudyFile, "id" | "createdAt">,
): Promise<string> {
  const reference = await addDoc(collection(db, "studyFiles"), {
    ...data,
    createdAt: serverTimestamp(),
  });

  return reference.id;
}

export async function deleteStudyFile(id: string) {
  await deleteDoc(doc(db, "studyFiles", id));
}

export async function getAllStudyFiles(): Promise<StudyFile[]> {
  const snapshot = await getDocs(collection(db, "studyFiles"));

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as StudyFile[];
}
