import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#F7F7F5] text-[#111111]">
            {/* =====================================================
          BACKGROUND
      ====================================================== */}

            {/* Large soft blue circle - top right */}
            <div
                className="
          pointer-events-none
          absolute
          -right-40
          -top-40
          h-[420px]
          w-[420px]
          rounded-full
          bg-[#E8F1FF]
          opacity-90
          sm:h-[560px]
          sm:w-[560px]
        "
            />

            {/* Large soft blue circle - bottom left */}
            <div
                className="
          pointer-events-none
          absolute
          -bottom-48
          -left-48
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#E8F1FF]
          opacity-80
          sm:h-[620px]
          sm:w-[620px]
        "
            />

            {/* Small blue circle - middle right */}
            <div
                className="
          pointer-events-none
          absolute
          right-[8%]
          top-[42%]
          h-24
          w-24
          rounded-full
          bg-[#F0F5FC]
          sm:h-32
          sm:w-32
        "
            />

            {/* Small blue circle - bottom right */}
            <div
                className="
          pointer-events-none
          absolute
          -bottom-10
          right-[15%]
          h-32
          w-32
          rounded-full
          bg-[#EEF4FC]
          sm:h-44
          sm:w-44
        "
            />

            {/* =====================================================
          CONTENT
      ====================================================== */}

            <div className="relative z-10">
                {/* Header */}
                <header className="px-5 pt-6 sm:px-8">
                    <div
                        className="
              mx-auto
              flex
              max-w-6xl
              items-center
              justify-between
            "
                    >
                        {/* Brand */}
                        <button
                            type="button"
                            onClick={() => navigate("/")}
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
                        </button>

                        {/* Login */}
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
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
                duration-200
                hover:bg-[#FAFAF8]
                hover:shadow-[0_4px_14px_rgba(15,23,42,0.08)]
                active:scale-95
              "
                        >
                            Log in
                        </button>
                    </div>
                </header>

                {/* Hero */}
                <section
                    className="
            mx-auto
            flex
            min-h-[calc(100vh-88px)]
            max-w-6xl
            items-center
            px-5
            pb-16
            pt-12
            sm:px-8
            sm:pb-20
            sm:pt-16
          "
                >
                    <div className="w-full">
                        <div
                            className="
                mx-auto
                max-w-4xl
                text-center
              "
                        >
                            {/* Small label */}
                            <p
                                className="
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-[#7D91AA]
                  sm:text-xs
                "
                            >
                                Your college study space
                            </p>

                            {/* Heading */}
                            <h1
                                className="
                  mx-auto
                  mt-6
                  max-w-4xl
                  text-5xl
                  font-semibold
                  leading-[0.96]
                  tracking-[-0.06em]
                  text-[#111111]
                  sm:text-6xl
                  lg:text-7xl
                "
                            >
                                Study better.
                                <br />

                                <span className="text-[#4F7FC7]">
                                    Stay organized.
                                </span>
                            </h1>

                            {/* Description */}
                            <p
                                className="
                  mx-auto
                  mt-7
                  max-w-lg
                  text-sm
                  leading-6
                  text-[#777B7D]
                  sm:text-base
                  sm:leading-7
                "
                            >
                                A simple place for students to find,
                                organize and access their college study
                                material.
                            </p>

                            {/* CTA */}
                            <div className="mt-9">
                                <button
                                    type="button"
                                    onClick={() => navigate("/signup")}
                                    className="
                    inline-flex
                    h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-black
                    px-7
                    text-sm
                    font-medium
                    text-white
                    shadow-[0_8px_24px_rgba(0,0,0,0.14)]
                    transition-all
                    duration-200
                    hover:bg-[#242424]
                    hover:shadow-[0_10px_28px_rgba(0,0,0,0.17)]
                    active:scale-[0.98]
                  "
                                >
                                    Get started

                                    <ArrowRight
                                        size={17}
                                        strokeWidth={1.9}
                                    />
                                </button>
                            </div>

                            {/* Login link */}
                            <p
                                className="
                  mt-5
                  text-xs
                  text-[#9CA3AF]
                "
                            >
                                Already have an account?{" "}

                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="
                    font-medium
                    text-[#3D6DAF]
                    underline-offset-2
                    transition
                    hover:underline
                  "
                                >
                                    Log in
                                </button>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}