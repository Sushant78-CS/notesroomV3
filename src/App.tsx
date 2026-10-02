import type { ReactNode } from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "./hooks/useAuth";

// Public pages
import Landing from "./pages/auth/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// App pages
import Home from "./pages/home/Home";
import Search from "./pages/search/Search";
import Profile from "./pages/profile/Profile";

// Study pages
import Notes from "./pages/study/Notes";
import Important from "./pages/study/Important";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import PdfMaker from "./pages/admin/PdfMaker";
import Recent from "./pages/study/Recent";

/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const {
    firebaseUser,
    initialized,
  } = useAuth();

  /*
   * Firebase is still checking the current
   * authentication state.
   */
  if (!initialized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F5]">
        <div className="text-center">
          <div
            className="
              mx-auto
              h-8
              w-8
              animate-spin
              rounded-full
              border-2
              border-[#E8F1FF]
              border-t-[#4F7FC7]
            "
          />

          <p className="mt-4 text-sm text-[#777B7D]">
            Loading NotesRoom...
          </p>
        </div>
      </main>
    );
  }

  /*
   * User is not authenticated.
   */
  if (!firebaseUser) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /*
   * User is authenticated.
   */
  return children;
}

/* =========================================================
   PUBLIC ROUTE
========================================================= */

function PublicRoute({
  children,
}: {
  children: ReactNode;
}) {
  const {
    firebaseUser,
    initialized,
  } = useAuth();

  /*
   * Wait until Firebase finishes checking auth.
   */
  if (!initialized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F5]">
        <div className="text-center">
          <div
            className="
              mx-auto
              h-8
              w-8
              animate-spin
              rounded-full
              border-2
              border-[#E8F1FF]
              border-t-[#4F7FC7]
            "
          />

          <p className="mt-4 text-sm text-[#777B7D]">
            Loading NotesRoom...
          </p>
        </div>
      </main>
    );
  }

  /*
   * Already authenticated.
   *
   * Don't allow an authenticated user to
   * stay on Login or Signup.
   */
  if (firebaseUser) {
    return (
      <Navigate
        to="/home"
        replace
      />
    );
  }

  return children;
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =================================================
            PUBLIC
        ================================================= */}

        <Route
          path="/"
          element={
            <Landing />
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* =================================================
            PROTECTED APP
        ================================================= */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            STUDY
        ================================================= */}

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recent"
          element={
            <ProtectedRoute>
              <Recent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/important"
          element={
            <ProtectedRoute>
              <Important />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN
        ================================================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pdf-maker"
          element={
            <ProtectedRoute>
              <PdfMaker />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}