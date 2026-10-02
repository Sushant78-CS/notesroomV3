import {
    ArrowUpRight,
    BookOpen,
    Clock3,
    FileImage,
    FileText,
} from "lucide-react";
import type { ElementType } from "react";
import { useNavigate } from "react-router-dom";

interface QuickAction {
    title: string;
    description: string;
    icon: ElementType;
    path: string;
}

const actions: QuickAction[] = [
    {
        title: "Notes",
        description: "Lecture notes and study material",
        icon: BookOpen,
        path: "/notes",
    },
    {
        title: "Important",
        description: "Important questions and key topics",
        icon: FileText,
        path: "/important",
    },
    {
        title: "PDF Maker",
        description: "Convert images into a PDF",
        icon: FileImage,
        path: "/admin/pdf-maker",
    },
    {
        title: "Recent",
        description: "Recently added study material",
        icon: Clock3,
        path: "/recent",
    },
];

export default function QuickActions() {
    const navigate = useNavigate();

    return (
        <section className="grid grid-cols-2 gap-3">
            {actions.map((action) => {
                const Icon = action.icon;

                return (
                    <button
                        key={action.title}
                        type="button"
                        onClick={() => navigate(action.path)}
                        className="
              group
              min-h-[150px]
              rounded-[26px]
              bg-white
              p-5
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
                mb-5
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-[#E8F1FF]
                text-[#4F7FC7]
              "
                        >
                            <Icon
                                size={21}
                                strokeWidth={1.8}
                            />
                        </div>

                        {/* Title + Arrow */}
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-[#111111]">
                                {action.title}
                            </h3>

                            <ArrowUpRight
                                size={17}
                                strokeWidth={1.8}
                                className="
                  text-[#9CA3AF]
                  transition
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
                            />
                        </div>

                        {/* Description */}
                        <p
                            className="
                mt-1
                text-xs
                leading-5
                text-[#777B7D]
              "
                        >
                            {action.description}
                        </p>
                    </button>
                );
            })}
        </section>
    );
}