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

export interface Course {
  id: string;
  name: string;
  collegeId: string;
  createdAt?: unknown;
}

export async function getCoursesByCollege(
  collegeId: string,
): Promise<Course[]> {
  const q = query(
    collection(db, "courses"),
    where("collegeId", "==", collegeId),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Course[];
}

export async function createCourse(
  name: string,
  collegeId: string,
): Promise<string> {
  const reference = await addDoc(collection(db, "courses"), {
    name,
    collegeId,
    createdAt: serverTimestamp(),
  });

  return reference.id;
}

export async function deleteCourse(id: string) {
  await deleteDoc(doc(db, "courses", id));
}
