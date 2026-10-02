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

export interface Subject {
  id: string;
  name: string;
  code?: string;
  semesterId: string;
  createdAt?: unknown;
}

export async function getSubjectsBySemester(
  semesterId: string,
): Promise<Subject[]> {
  const q = query(
    collection(db, "subjects"),
    where("semesterId", "==", semesterId),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Subject[];
}

export async function createSubject(
  name: string,
  code: string,
  semesterId: string,
): Promise<string> {
  const reference = await addDoc(collection(db, "subjects"), {
    name,
    code,
    semesterId,
    createdAt: serverTimestamp(),
  });

  return reference.id;
}

export async function deleteSubject(id: string) {
  await deleteDoc(doc(db, "subjects", id));
}
