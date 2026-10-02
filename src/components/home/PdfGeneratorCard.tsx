import {
    ArrowUpRight,
    FileImage,
    Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PdfGeneratorCard() {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate(-1)}
            className="
        group
        relative
        w-full
        overflow-hidden
        rounded-[28px]
        bg-black
        p-6
        text-left
        shadow-[0_4px_20px_rgba(15,23,42,0.08)]
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-[0_10px_30px_rgba(15,23,42,0.12)]
        active:scale-[0.98]
      "
        >
            {/* Decorative background */}
            <div
                className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-40
          w-40
          rounded-full
          bg-[#4F7FC7]/20
          blur-2xl
        "
            />

            <div className="relative">
                <div className="flex items-start justify-between">
                    <div
                        className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-[#E8F1FF]
              text-[#4F7FC7]
            "
                    >
                        <FileImage
                            size={23}
                            strokeWidth={1.8}
                        />
                    </div>

                    <div
                        className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              transition
              group-hover:bg-white
              group-hover:text-black
            "
                    >
                        <ArrowUpRight
                            size={18}
                            strokeWidth={1.8}
                        />
                    </div>
                </div>

                <div className="mt-7">
                    <div className="mb-2 flex items-center gap-2">
                        <Sparkles
                            size={14}
                            className="text-[#8EB5F0]"
                            strokeWidth={1.8}
                        />

                        <span className="text-xs font-medium text-[#8EB5F0]">
                            PDF TOOL
                        </span>
                    </div>

                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                        Create a PDF
                    </h2>

                    <p className="mt-2 max-w-md text-sm leading-6 text-[#B8B8B8]">
                        Convert multiple images into a single
                        PDF and organize your study material.
                    </p>
                </div>

                <div className="mt-6 inline-flex items-center rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-black">
                    Open PDF Generator
                </div>
            </div>
        </button>
    );
}