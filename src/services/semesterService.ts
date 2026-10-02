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

export interface Semester {
  id: string;
  number: number;
  courseId: string;
  createdAt?: unknown;
}

export async function getSemestersByCourse(
  courseId: string,
): Promise<Semester[]> {
  const q = query(
    collection(db, "semesters"),
    where("courseId", "==", courseId),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Semester[];
}

export async function createSemester(
  number: number,
  courseId: string,
): Promise<string> {
  const reference = await addDoc(collection(db, "semesters"), {
    number,
    courseId,
    createdAt: serverTimestamp(),
  });

  return reference.id;
}

export async function deleteSemester(id: string) {
  await deleteDoc(doc(db, "semesters", id));
}
