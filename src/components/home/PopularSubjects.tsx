import { ArrowRight, FileText } from "lucide-react";

import { popularSubjects } from "../../data/homeData";

export default function PopularSubjects() {
    return (
        <section>
            {/* Section header */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-[#111111]">
                    Popular Subjects
                </h2>

                <button
                    type="button"
                    className="
            flex
            items-center
            gap-1
            text-xs
            font-semibold
            text-[#4F7FC7]
            transition
            hover:text-[#3D6DAF]
          "
                >
                    View all

                    <ArrowRight
                        size={14}
                        strokeWidth={1.8}
                    />
                </button>
            </div>

            {/* Subjects */}
            <div
                className="
          flex
          gap-3
          overflow-x-auto
          pb-2

          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]
        "
            >
                {popularSubjects.map((subject) => (
                    <button
                        key={subject.id}
                        type="button"
                        className="
              min-w-[145px]
              rounded-[24px]
              bg-white
              p-4
              text-left

              shadow-[0_2px_12px_rgba(15,23,42,0.04)]

              transition-all
              duration-200

              hover:-translate-y-0.5
              hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]

              active:scale-[0.98]
            "
                    >
                        {/* Icon */}
                        <div
                            className="
                mb-4
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-2xl
                bg-[#E8F1FF]
                text-[#4F7FC7]
              "
                        >
                            <FileText
                                size={18}
                                strokeWidth={1.8}
                            />
                        </div>

                        {/* Subject */}
                        <h3
                            className="
                line-clamp-2
                text-sm
                font-semibold
                text-[#111111]
              "
                        >
                            {subject.name}
                        </h3>

                        {/* File count */}
                        <p
                            className="
                mt-1
                text-xs
                text-[#777B7D]
              "
                        >
                            {subject.fileCount}+ files
                        </p>
                    </button>
                ))}
            </div>
        </section>
    );
}