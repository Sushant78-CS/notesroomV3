import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db} from "../firebase/config";

export type UserRole = "STUDENT" | "ADMIN";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  profileImage?: string;
  role: UserRole;
  collegeId?: string;
  courseId?: string;
  semesterId?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export async function createUserProfile(
  profile: Omit<UserProfile, "createdAt" | "updatedAt">,
) {
  const userRef = doc(db, "users", profile.uid);

  await setDoc(
    userRef,
    {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  );
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<UserProfile, "uid" | "createdAt">>,
) {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
