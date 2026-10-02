import HomeHeader from "../../components/home/HomeHeader";
import QuickActions from "../../components/home/QuickActions";
import BottomNav from "../../components/home/BottomNav";
import SearchBar from "../../components/home/SearchBar";
import { useAuthStore } from "../../store/authStore";

export default function Home() {
    const { user } = useAuthStore();

    return (
        <main className="relative min-h-screen bg-[#F7F7F5] text-[#111111]">
            {/* Main content */}
            <div
                className="
          mx-auto
          w-full
          max-w-2xl
          px-4
          pt-6
          pb-[calc(8rem+env(safe-area-inset-bottom))]
          sm:px-6
          lg:max-w-4xl
        "
            >
                <HomeHeader userName={user?.name || "User"} />

                {/* Search */}
                <section className="mt-8">
                    <SearchBar />
                </section>

                {/* Quick actions */}
                <section className="mt-6">
                    <QuickActions />
                </section>
            </div>

            {/* Bottom dock */}
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
          pt-10
          pb-[max(1rem,env(safe-area-inset-bottom))]
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
        </main>
    );
}