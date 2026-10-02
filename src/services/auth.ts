import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type Unsubscribe,
  type User as FirebaseUser,
} from "firebase/auth";

import { auth } from "../firebase/config";

export const loginWithEmail = async (
  email: string,
  password: string,
): Promise<FirebaseUser> => {
  const result = await signInWithEmailAndPassword(auth, email, password);

  return result.user;
};

export const signupWithEmail = async (
  name: string,
  email: string,
  password: string,
): Promise<FirebaseUser> => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  await updateProfile(credential.user, {
    displayName: name,
  });

  return credential.user;
};

export const loginWithGoogle = async (): Promise<FirebaseUser> => {
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);

  return result.user;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const subscribeToAuthChanges = (
  callback: (user: FirebaseUser | null) => void,
): Unsubscribe => {
  return onAuthStateChanged(auth, callback);
};
