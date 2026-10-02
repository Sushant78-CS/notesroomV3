import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ArrowLeft,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../../firebase/config";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
    const navigate = useNavigate();

    const {
        user,
        initialized,
        loading: authLoading,
        login,
        googleLogin,
    } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [resetLoading, setResetLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [resetMessage, setResetMessage] =
        useState("");

    /*
     * If the user is already authenticated,
     * don't let them stay on the login page.
     */
    useEffect(() => {
        if (
            initialized &&
            !authLoading &&
            user
        ) {
            navigate("/home", {
                replace: true,
            });
        }
    }, [
        initialized,
        authLoading,
        user,
        navigate,
    ]);

    /*
     * Email/password login
     */
    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setResetMessage("");

        const cleanEmail = email.trim();

        if (!cleanEmail) {
            setError("Please enter your email.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);

            await login(
                cleanEmail,
                password
            );

            navigate("/home", {
                replace: true,
            });
        } catch (error: any) {
            console.error(
                "Login error:",
                error
            );

            switch (error?.code) {
                case "auth/invalid-credential":
                    setError(
                        "Invalid email or password."
                    );
                    break;

                case "auth/user-not-found":
                    setError(
                        "No account was found with this email."
                    );
                    break;

                case "auth/wrong-password":
                    setError(
                        "Incorrect password."
                    );
                    break;

                case "auth/invalid-email":
                    setError(
                        "Please enter a valid email address."
                    );
                    break;

                case "auth/too-many-requests":
                    setError(
                        "Too many failed attempts. Please try again later."
                    );
                    break;

                case "auth/user-disabled":
                    setError(
                        "This account has been disabled."
                    );
                    break;

                case "auth/network-request-failed":
                    setError(
                        "Network error. Please check your connection and try again."
                    );
                    break;

                default:
                    setError(
                        "Unable to sign in. Please try again."
                    );
            }
        } finally {
            setLoading(false);
        }
    };

    /*
     * Google login
     */
    const handleGoogleLogin = async () => {
        setError("");
        setResetMessage("");

        try {
            setLoading(true);

            await googleLogin();

            navigate("/home", {
                replace: true,
            });
        } catch (error: any) {
            console.error(
                "Google login error:",
                error
            );

            switch (error?.code) {
                case "auth/popup-closed-by-user":
                    setError(
                        "Google sign-in was cancelled."
                    );
                    break;

                case "auth/popup-blocked":
                    setError(
                        "The Google sign-in popup was blocked. Please allow popups and try again."
                    );
                    break;

                case "auth/network-request-failed":
                    setError(
                        "Network error. Please check your connection and try again."
                    );
                    break;

                default:
                    setError(
                        "Google sign-in failed. Please try again."
                    );
            }
        } finally {
            setLoading(false);
        }
    };

    /*
     * Forgot password
     */
    const handleForgotPassword = async () => {
        setError("");
        setResetMessage("");

        const cleanEmail = email.trim();

        if (!cleanEmail) {
            setError(
                "Enter your email address first."
            );
            return;
        }

        try {
            setResetLoading(true);

            await sendPasswordResetEmail(
                auth,
                cleanEmail
            );

            setResetMessage(
                "Password reset email sent. Check your inbox."
            );
        } catch (error: any) {
            console.error(
                "Password reset error:",
                error
            );

            switch (error?.code) {
                case "auth/invalid-email":
                    setError(
                        "Please enter a valid email address."
                    );
                    break;

                case "auth/user-not-found":
                    setError(
                        "No account was found with this email."
                    );
                    break;

                default:
                    setError(
                        "Unable to send the reset email. Please try again."
                    );
            }
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#F7F7F5] text-[#111111]">
            {/* =====================================================
          BACKGROUND CIRCLES
      ====================================================== */}

            {/* Top-right blue circle */}
            <div
                className="
          pointer-events-none
          absolute
          -right-40
          -top-40
          h-[380px]
          w-[380px]
          rounded-full
          bg-[#E8F1FF]
          opacity-90
          sm:h-[520px]
          sm:w-[520px]
        "
            />

            {/* Bottom-left blue circle */}
            <div
                className="
          pointer-events-none
          absolute
          -bottom-48
          -left-48
          h-[480px]
          w-[480px]
          rounded-full
          bg-[#E8F1FF]
          opacity-80
          sm:h-[600px]
          sm:w-[600px]
        "
            />

            {/* Middle-right soft circle */}
            <div
                className="
          pointer-events-none
          absolute
          right-[8%]
          top-[48%]
          h-24
          w-24
          rounded-full
          bg-[#F0F5FC]
          sm:h-32
          sm:w-32
        "
            />

            {/* Bottom-right soft circle */}
            <div
                className="
          pointer-events-none
          absolute
          -bottom-12
          right-[12%]
          h-36
          w-36
          rounded-full
          bg-[#EEF4FC]
          sm:h-48
          sm:w-48
        "
            />

            {/* =====================================================
          CONTENT
      ====================================================== */}

            <div className="relative z-10 min-h-screen">
                {/* Header */}
                <header className="px-5 pt-6 sm:px-8">
                    <div className="mx-auto flex max-w-6xl items-center justify-between">
                        <Link
                            to="/"
                            className="
                text-lg
                font-semibold
                tracking-[-0.02em]
                text-[#111111]
                transition
                hover:opacity-70
              "
                        >
                            NotesRoom
                        </Link>

                        <Link
                            to="/signup"
                            className="
                rounded-full
                bg-white
                px-5
                py-2.5
                text-sm
                font-medium
                text-[#111111]
                shadow-[0_2px_10px_rgba(15,23,42,0.06)]
                transition-all
                hover:bg-[#FAFAF8]
                hover:shadow-[0_4px_14px_rgba(15,23,42,0.08)]
                active:scale-95
              "
                        >
                            Register
                        </Link>
                    </div>
                </header>

                {/* Login content */}
                <section
                    className="
            mx-auto
            flex
            min-h-[calc(100vh-88px)]
            w-full
            max-w-6xl
            items-center
            justify-center
            px-5
            py-10
            sm:px-8
            sm:py-16
          "
                >
                    <div className="w-full max-w-md">
                        {/* Back */}
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="
                mb-6
                inline-flex
                items-center
                gap-2
                text-xs
                font-medium
                text-[#777B7D]
                transition
                hover:text-[#111111]
              "
                        >
                            <ArrowLeft
                                size={15}
                                strokeWidth={1.8}
                            />

                            Back
                        </button>

                        {/* Heading */}
                        <div className="mb-7">
                            <p
                                className="
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-[#7D91AA]
                "
                            >
                                Welcome back
                            </p>

                            <h1
                                className="
                  mt-3
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                  text-[#111111]
                  sm:text-4xl
                "
                            >
                                Sign in to NotesRoom
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-[#777B7D]">
                                Continue to your college study space.
                            </p>
                        </div>

                        {/* Form container */}
                        <div
                            className="
                rounded-[28px]
                bg-white
                p-6
                shadow-[0_8px_30px_rgba(15,23,42,0.06)]
                sm:p-7
              "
                        >
                            {/* Error */}
                            {error && (
                                <div
                                    role="alert"
                                    className="
                    mb-5
                    rounded-2xl
                    border
                    border-red-100
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    leading-5
                    text-red-600
                  "
                                >
                                    {error}
                                </div>
                            )}

                            {/* Reset success */}
                            {resetMessage && (
                                <div
                                    role="status"
                                    className="
                    mb-5
                    rounded-2xl
                    border
                    border-[#DCEAFB]
                    bg-[#F1F6FD]
                    px-4
                    py-3
                    text-sm
                    leading-5
                    text-[#3D6DAF]
                  "
                                >
                                    {resetMessage}
                                </div>
                            )}

                            {/* Google */}
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={
                                    loading ||
                                    resetLoading
                                }
                                className="
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-full
                  border
                  border-[#D8D8D5]
                  bg-white
                  px-4
                  text-sm
                  font-medium
                  text-[#111111]
                  transition-all
                  duration-200
                  hover:border-[#C8D7ED]
                  hover:bg-[#FAFAF8]
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
                            >
                                <GoogleIcon />

                                Continue with Google
                            </button>

                            {/* Divider */}
                            <div className="my-6 flex items-center gap-4">
                                <div className="h-px flex-1 bg-[#E8E8E5]" />

                                <span
                                    className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.16em]
                    text-[#9CA3AF]
                  "
                                >
                                    or
                                </span>

                                <div className="h-px flex-1 bg-[#E8E8E5]" />
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                      text-[#555957]
                    "
                                    >
                                        Email address
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            size={18}
                                            strokeWidth={1.8}
                                            className="
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-[#9CA3AF]
                      "
                                        />

                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(event) =>
                                                setEmail(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            disabled={loading}
                                            className="
                        h-12
                        w-full
                        rounded-2xl
                        border
                        border-[#D8D8D5]
                        bg-white
                        pl-11
                        pr-4
                        text-sm
                        text-[#111111]
                        outline-none
                        transition-all
                        placeholder:text-[#9CA3AF]
                        hover:border-[#C8C8C5]
                        focus:border-[#4F7FC7]
                        focus:ring-4
                        focus:ring-[#E8F1FF]
                        disabled:bg-[#FAFAF8]
                      "
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="mb-1.5 flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="
                        block
                        text-xs
                        font-medium
                        text-[#555957]
                      "
                                        >
                                            Password
                                        </label>

                                        <button
                                            type="button"
                                            onClick={handleForgotPassword}
                                            disabled={
                                                loading ||
                                                resetLoading
                                            }
                                            className="
                        text-xs
                        font-medium
                        text-[#3D6DAF]
                        transition
                        hover:underline
                        disabled:opacity-50
                      "
                                        >
                                            {resetLoading
                                                ? "Sending..."
                                                : "Forgot password?"}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <LockKeyhole
                                            size={18}
                                            strokeWidth={1.8}
                                            className="
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-[#9CA3AF]
                      "
                                        />

                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            disabled={loading}
                                            className="
                        h-12
                        w-full
                        rounded-2xl
                        border
                        border-[#D8D8D5]
                        bg-white
                        pl-11
                        pr-12
                        text-sm
                        text-[#111111]
                        outline-none
                        transition-all
                        placeholder:text-[#9CA3AF]
                        hover:border-[#C8C8C5]
                        focus:border-[#4F7FC7]
                        focus:ring-4
                        focus:ring-[#E8F1FF]
                        disabled:bg-[#FAFAF8]
                      "
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (value) => !value
                                                )
                                            }
                                            className="
                        absolute
                        right-3.5
                        top-1/2
                        -translate-y-1/2
                        text-[#9CA3AF]
                        transition
                        hover:text-[#555957]
                      "
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                    mt-2
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    rounded-full
                    bg-black
                    px-4
                    text-sm
                    font-semibold
                    text-white
                    shadow-[0_6px_18px_rgba(0,0,0,0.12)]
                    transition-all
                    duration-200
                    hover:bg-[#242424]
                    hover:shadow-[0_8px_22px_rgba(0,0,0,0.15)]
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                                >
                                    {loading
                                        ? "Signing in..."
                                        : "Sign in"}
                                </button>
                            </form>

                            {/* Register */}
                            <p className="mt-6 text-center text-sm text-[#777B7D]">
                                Don't have an account?{" "}

                                <Link
                                    to="/signup"
                                    className="
                    font-semibold
                    text-[#3D6DAF]
                    underline-offset-2
                    transition
                    hover:underline
                  "
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>

                        {/* Footer */}
                        <p className="mt-6 text-center text-[11px] text-[#9CA3AF]">
                            NotesRoom · Your college study space
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}

/* =========================================================
   GOOGLE ICON
========================================================= */

function GoogleIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                fill="#4285F4"
                d="M21.35 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.22a4.46 4.46 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.19Z"
            />

            <path
                fill="#34A853"
                d="M12 21.99c2.63 0 4.84-.87 6.45-2.36l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.5A9.74 9.74 0 0 0 12 21.99Z"
            />

            <path
                fill="#FBBC05"
                d="M6.54 14.09A5.86 5.86 0 0 1 6.23 12c0-.73.13-1.43.31-2.09v-2.5H3.3A9.99 9.99 0 0 0 2 12c0 1.61.38 3.13 1.3 4.5l3.24-2.41Z"
            />

            <path
                fill="#EA4335"
                d="M12 5.88c1.43 0 2.7.49 3.71 1.45l2.78-2.78C16.83 2.94 14.63 2 12 2a9.74 9.74 0 0 0-8.7 5.41l3.24 2.5C7.31 7.6 9.46 5.88 12 5.88Z"
            />
        </svg>
    );
}