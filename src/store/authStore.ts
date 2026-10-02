import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";

import { create } from "zustand";

import { auth } from "../firebase/config";

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  profileImage?: string;
  role: "STUDENT" | "ADMIN";
  collegeId?: string;
  courseId?: string;
  semesterId?: string;
}

interface AuthState {
  firebaseUser: FirebaseUser | null;

  user: AppUser | null;

  loading: boolean;

  initialized: boolean;

  login: (email: string, password: string) => Promise<void>;

  signup: (name: string, email: string, password: string) => Promise<void>;

  googleLogin: () => Promise<void>;

  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(() => ({
  firebaseUser: null,

  user: null,

  loading: true,

  initialized: false,

  // ================================================
  // Login
  // ================================================

  login: async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  // ================================================
  // Signup
  // ================================================

  signup: async (name, email, password) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    /*
     * Don't manually set the Zustand user here.
     *
     * Firebase's auth listener will run automatically
     * and useAuth.ts will create/read:
     *
     * users/{uid}
     *
     * from Firestore.
     */

    console.log("Firebase account created:", credential.user.uid, name);
  },

  // ================================================
  // Google Login
  // ================================================

  googleLogin: async () => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider);
  },

  // ================================================
  // Logout
  // ================================================

  logout: async () => {
    await signOut(auth);

    /*
     * The Firebase auth listener will clear:
     *
     * firebaseUser
     * user
     * localStorage
     *
     * automatically.
     */
  },
}));
