import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Recent() {
    const navigate = useNavigate();
    return (
        <main className="min-h-screen bg-[#F7F7F5] px-4 py-6 text-[#111111]">
            <div className="mx-auto max-w-2xl">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="
              mb-6
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-[#777B7D]
              transition
              hover:text-[#111111]
            "
                >
                    <ArrowLeft
                        size={18}
                        strokeWidth={1.8}
                    />
                    Back to Home
                </button>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Recent
                </h1>

                <div
                    className="
            mt-8
            flex
            min-h-[300px]
            items-center
            justify-center
            rounded-[28px]
            bg-white
            px-6
            text-center
            shadow-[0_4px_18px_rgba(15,23,42,0.04)]
          "
                >
                    <div>
                        <p className="text-base font-medium text-[#111111]">
                            No recent material
                        </p>

                        <p className="mt-2 text-sm text-[#777B7D]">
                            Recently added study material will appear here.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}