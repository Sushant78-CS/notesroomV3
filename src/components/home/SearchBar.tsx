import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate("/search")}
            aria-label="Search NotesRoom"
            className="
        flex
        h-14
        w-full
        items-center
        gap-3
        rounded-full
        border
        border-[#D8D8D5]
        bg-white
        px-5
        text-left
        shadow-[0_4px_18px_rgba(0,0,0,0.07)]
        transition-all
        duration-200
        hover:border-[#C8D7ED]
        hover:shadow-[0_6px_22px_rgba(0,0,0,0.09)]
        active:scale-[0.99]
      "
        >
            <Search
                size={20}
                strokeWidth={1.8}
                className="shrink-0 text-[#171717]"
            />

            <span
                className="
          min-w-0
          flex-1
          text-sm
          text-[#777B7D]
        "
            >
                Search notes, topics...
            </span>
        </button>
    );
}