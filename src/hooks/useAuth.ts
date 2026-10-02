import { useEffect } from "react";

import { subscribeToAuthChanges } from "../services/auth";

import {
  createUserProfile,
  getUserProfile,
  type UserProfile,
} from "../services/userService";

import { useAuthStore, type AppUser } from "../store/authStore";

const USER_STORAGE_KEY = "notesroom_user";

export const useAuth = () => {
  const firebaseUser = useAuthStore((state) => state.firebaseUser);

  const user = useAuthStore((state) => state.user);

  const loading = useAuthStore((state) => state.loading);

  const initialized = useAuthStore((state) => state.initialized);

  const login = useAuthStore((state) => state.login);

  const signup = useAuthStore((state) => state.signup);

  const googleLogin = useAuthStore((state) => state.googleLogin);

  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      // ==================================================
      // Firebase logged out
      // ==================================================

      if (!firebaseUser) {
        localStorage.removeItem(USER_STORAGE_KEY);

        useAuthStore.setState({
          firebaseUser: null,
          user: null,
          loading: false,
          initialized: true,
        });

        return;
      }

      // ==================================================
      // Firebase logged in
      // ==================================================

      useAuthStore.setState({
        firebaseUser,
        loading: true,
      });

      try {
        // ------------------------------------------------
        // Get existing Firestore profile
        // ------------------------------------------------

        let profile = await getUserProfile(firebaseUser.uid);

        // ------------------------------------------------
        // Create Firestore profile if it doesn't exist
        // ------------------------------------------------

        if (!profile) {
          const newProfile: Omit<UserProfile, "createdAt" | "updatedAt"> = {
            uid: firebaseUser.uid,

            name: firebaseUser.displayName ?? "Student",

            email: firebaseUser.email ?? "",

            profileImage: firebaseUser.photoURL ?? "",

            role: "STUDENT",
          };

          await createUserProfile(newProfile);

          // Read the document again so we get
          // the same structure as an existing user.
          profile = await getUserProfile(firebaseUser.uid);
        }

        // ------------------------------------------------
        // Safety check
        // ------------------------------------------------

        if (!profile) {
          throw new Error("Failed to create or load user profile.");
        }

        // ------------------------------------------------
        // Convert Firestore profile to AppUser
        // ------------------------------------------------

        const appUser: AppUser = {
          uid: profile.uid,
          name: profile.name,
          email: profile.email,
          profileImage: profile.profileImage ?? "",
          role: profile.role,
          collegeId: profile.collegeId,
          courseId: profile.courseId,
          semesterId: profile.semesterId,
        };

        // ------------------------------------------------
        // Save locally
        // ------------------------------------------------

        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));

        // ------------------------------------------------
        // Update Zustand
        // ------------------------------------------------

        useAuthStore.setState({
          firebaseUser,
          user: appUser,
          loading: false,
          initialized: true,
        });
      } catch (error) {
        console.error("Failed to load Firebase user profile:", error);

        localStorage.removeItem(USER_STORAGE_KEY);

        useAuthStore.setState({
          firebaseUser,
          user: null,
          loading: false,
          initialized: true,
        });
      }
    });

    return unsubscribe;
  }, []);

  return {
    firebaseUser,
    user,
    loading,
    initialized,

    login,
    signup,
    googleLogin,
    logout,
  };
};
