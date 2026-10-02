import {
    LogOut,
    Mail,
    UserRound,
    type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomNav from "../../components/home/BottomNav";
import { useAuthStore } from "../../store/authStore";

export default function Profile() {
    const navigate = useNavigate();

    const { user, loading, logout } = useAuthStore();

    const [loggingOut, setLoggingOut] = useState(false);

    /*
     * Logout
     */
    const handleLogout = async () => {
        if (loggingOut) return;

        try {
            setLoggingOut(true);

            await logout();

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            console.error("Failed to logout:", error);
            setLoggingOut(false);
        }
    };

    /*
     * Loading state
     */
    if (loading) {
        return (
            <main className="min-h-screen bg-[#F7F7F5]">
                <div className="flex min-h-screen items-center justify-center">
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
                            Loading profile...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    /*
     * No authenticated user
     */
    if (!user) {
        return (
            <main className="min-h-screen bg-[#F7F7F5]">
                <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-5">
                    <div
                        className="
              w-full
              rounded-[28px]
              bg-white
              p-7
              text-center
              shadow-[0_6px_25px_rgba(15,23,42,0.05)]
            "
                    >
                        <div
                            className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-[22px]
                bg-[#E8F1FF]
                text-[#4F7FC7]
              "
                        >
                            <UserRound
                                size={27}
                                strokeWidth={1.8}
                            />
                        </div>

                        <h1 className="mt-5 text-xl font-semibold tracking-tight text-[#111111]">
                            Profile unavailable
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-[#777B7D]">
                            Sign in to view your NotesRoom profile.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="
                mt-6
                h-11
                rounded-full
                bg-black
                px-6
                text-sm
                font-medium
                text-white
                transition
                hover:bg-[#242424]
                active:scale-95
              "
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    /*
     * Generate initials
     */
    const initials =
        user.name
            ?.trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((part) => part.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U";

    return (
        <main className="min-h-screen bg-[#F7F7F5] text-[#111111]">
            <div className="relative z-10">
                <div
                    className="
            mx-auto
            w-full
            max-w-2xl
            px-4
            pb-[calc(9rem+env(safe-area-inset-bottom))]
            pt-6
            sm:px-6
            lg:max-w-3xl
          "
                >
                    {/* Header */}
                    <header>
                        <p
                            className="
                text-xs
                font-medium
                uppercase
                tracking-[0.18em]
                text-[#7D91AA]
              "
                        >
                            NotesRoom
                        </p>

                        <div className="mt-2">
                            <h1
                                className="
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                  text-[#111111]
                  sm:text-4xl
                "
                            >
                                Profile
                            </h1>

                            <p className="mt-1.5 text-sm text-[#777B7D]">
                                Manage your account
                            </p>
                        </div>
                    </header>

                    {/* Profile */}
                    <section
                        className="
              mt-7
              overflow-hidden
              rounded-[30px]
              bg-white
              p-6
              shadow-[0_6px_25px_rgba(15,23,42,0.05)]
              sm:p-7
            "
                    >
                        <div>
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt=""
                                        className="
                      h-[76px]
                      w-[76px]
                      shrink-0
                      rounded-[24px]
                      object-cover
                    "
                                    />
                                ) : (
                                    <div
                                        className="
                      flex
                      h-[76px]
                      w-[76px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-[24px]
                      bg-[#E8F1FF]
                      text-xl
                      font-semibold
                      text-[#3D6DAF]
                    "
                                    >
                                        {initials}
                                    </div>
                                )}

                                {/* User information */}
                                <div className="min-w-0">
                                    <h2
                                        className="
                      truncate
                      text-xl
                      font-semibold
                      tracking-[-0.025em]
                      text-[#111111]
                    "
                                    >
                                        {user.name}
                                    </h2>

                                    <div className="mt-1.5 flex min-w-0 items-center gap-1.5">
                                        <Mail
                                            size={14}
                                            strokeWidth={1.8}
                                            className="shrink-0 text-[#9CA3AF]"
                                        />

                                        <p className="truncate text-sm text-[#777B7D]">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Account */}
                    <section className="mt-7">
                        <div className="px-1">
                            <h2 className="text-base font-semibold text-[#111111]">
                                Account
                            </h2>

                            <p className="mt-1 text-xs text-[#9CA3AF]">
                                Your NotesRoom account information
                            </p>
                        </div>

                        <div
                            className="
                mt-3
                overflow-hidden
                rounded-[26px]
                bg-white
                shadow-[0_4px_18px_rgba(15,23,42,0.04)]
              "
                        >
                            <InfoRow
                                icon={Mail}
                                label="Email address"
                                value={user.email}
                            />

                            <InfoRow
                                icon={UserRound}
                                label="Account type"
                                value={user.role === "ADMIN" ? "Administrator" : "Student"}
                                isLast
                            />
                        </div>
                    </section>

                    {/* Sign out */}
                    <section className="mt-7">
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-[#DCDCD8]
                bg-white
                text-sm
                font-medium
                text-[#111111]
                shadow-[0_3px_14px_rgba(15,23,42,0.03)]
                transition-all
                hover:border-[#CFCFCC]
                hover:bg-[#FAFAF8]
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
                        >
                            {loggingOut ? (
                                <>
                                    <span
                                        className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-[#D6D6D2]
                      border-t-[#111111]
                    "
                                    />

                                    Signing out...
                                </>
                            ) : (
                                <>
                                    <LogOut
                                        size={17}
                                        strokeWidth={1.9}
                                    />

                                    Sign out
                                </>
                            )}
                        </button>
                    </section>
                </div>

                {/* Bottom Navigation */}
                <div
                    className="
            pointer-events-none
            fixed
            inset-x-0
            bottom-0
            z-50
            bg-gradient-to-t
            from-[#F7F7F5]
            via-[#F7F7F5]/90
            to-transparent
            px-4
            pb-[max(1rem,env(safe-area-inset-bottom))]
            pt-10
            sm:px-6
          "
                >
                    <div
                        className="
              pointer-events-auto
              mx-auto
              flex
              w-full
              max-w-md
              justify-center
            "
                    >
                        <BottomNav />
                    </div>
                </div>
            </div>
        </main>
    );
}

/*
 * Account information row
 */
interface InfoRowProps {
    icon: LucideIcon;
    label: string;
    value: string;
    isLast?: boolean;
}

function InfoRow({
    icon: Icon,
    label,
    value,
    isLast = false,
}: InfoRowProps) {
    return (
        <div
            className={`
        flex
        items-center
        gap-3
        px-5
        py-4
        ${!isLast ? "border-b border-[#F0F0ED]" : ""}
      `}
        >
            {/* Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[#4F7FC7]">
                <Icon
                    size={18}
                    strokeWidth={1.8}
                />
            </div>

            {/* Information */}
            <div className="min-w-0 flex-1">
                <p
                    className="
            text-[11px]
            font-medium
            text-[#9CA3AF]
          "
                >
                    {label}
                </p>

                <p
                    className="
            mt-0.5
            truncate
            text-sm
            font-medium
            text-[#111111]
          "
                >
                    {value}
                </p>
            </div>
        </div>
    );
}