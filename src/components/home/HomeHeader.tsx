interface HomeHeaderProps {
    userName?: string;
}

export default function HomeHeader({
    userName,
}: HomeHeaderProps) {
    const firstName = userName || "Sushant";

    return (
        <header>
            {/* App Name */}
            <div>
                <h1
                    className="
            text-xl
            font-semibold
            tracking-tight
            text-[#111111]
            sm:text-2xl
          "
                >
                    NotesRoom
                </h1>
            </div>

            {/* Greeting */}
            <div className="mt-4">
                <p
                    className="
            text-3xl
            font-semibold
            tracking-tight
            text-[#777B7D]
            sm:text-4xl
          "
                >
                    Hi {firstName},
                </p>

                <h2
                    className="
            mt-1
            max-w-xl
            text-4xl
            font-semibold
            leading-[1.05]
            tracking-[-0.04em]
            text-[#111111]
            sm:text-5xl
          "
                >
                    What do you want to study today?
                </h2>
            </div>
        </header>
    );
}