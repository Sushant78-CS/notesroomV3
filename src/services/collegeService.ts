import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

export interface College {
  id: string;
  name: string;
  code?: string;
  createdAt?: unknown;
}

const collegesCollection = collection(db, "colleges");

export async function getColleges(): Promise<College[]> {
  const snapshot = await getDocs(collegesCollection);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as College[];
}

export async function getThakurCollege(): Promise<College> {
  const collegeRef = doc(db, "colleges", "thakur-college");
  const snapshot = await getDoc(collegeRef);

  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as College;
  }

  await setDoc(collegeRef, {
    name: "Thakur College of Science and Commerce",
    code: "TCSC",
    createdAt: serverTimestamp(),
  });

  return {
    id: "thakur-college",
    name: "Thakur College of Science and Commerce",
    code: "TCSC",
  };
}

export async function createCollege(
  name: string,
  code?: string,
): Promise<string> {
  const id = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  await setDoc(doc(db, "colleges", id), {
    name,
    code: code ?? "",
    createdAt: serverTimestamp(),
  });

  return id;
}

export async function deleteCollege(id: string) {
  await deleteDoc(doc(db, "colleges", id));
}
