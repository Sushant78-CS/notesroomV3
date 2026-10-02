import { Layers, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
    {
        id: "home",
        label: "Home",
        icon: Layers,
        path: "/home",
    },
    // {
    //     id: "search",
    //     label: "Search",
    //     icon: Search,
    //     path: "/search",
    // },
    {
        id: "profile",
        label: "Profile",
        icon: UserRound,
        path: "/profile",
    },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveTab = (): TabId => {
        if (location.pathname === "/") {
            return "home";
        }

        // if (location.pathname.startsWith("/search")) {
        //     return "search";
        // }

        if (location.pathname.startsWith("/profile")) {
            return "profile";
        }

        return "home";
    };

    const active = getActiveTab();

    return (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 pb-[env(safe-area-inset-bottom)]">
            <nav
                aria-label="Main navigation"
                className="
          flex
          h-[60px]
          items-center
          gap-1
          rounded-full
          bg-black
          p-1.5
          shadow-[0_10px_30px_rgba(0,0,0,0.25)]
        "
            >
                {TABS.map(({ id, label, icon: Icon, path }) => {
                    const isActive = active === id;

                    return (
                        <button
                            key={id}
                            type="button"
                            aria-label={label}
                            aria-current={
                                isActive ? "page" : undefined
                            }
                            onClick={() => navigate(path)}
                            className={`
                flex
                h-12
                items-center
                justify-center
                gap-2
                rounded-full
                transition-all
                duration-300
                ease-out
                active:scale-95

                ${isActive
                                    ? "bg-white px-5 text-black"
                                    : "w-12 text-neutral-400 hover:bg-[#242424] hover:text-white"
                                }
              `}
                        >
                            <Icon
                                size={20}
                                strokeWidth={isActive ? 2 : 1.8}
                            />

                            {isActive && (
                                <span className="text-sm font-medium leading-none">
                                    {label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}