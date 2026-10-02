import {
    ArrowLeft,
    Check,
    Download,
    Eye,
    FileText,
    Search as SearchIcon,
    X,
    Loader2,
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
    getAllStudyFiles,
    type FileCategory,
    type StudyFile,
} from "../../services/studyfileService";

const categoryLabels: Record<FileCategory, string> = {
    NOTES: "Notes",
    IMPORTANT_QUESTIONS: "Important",
    PREVIOUS_YEAR_PAPER: "Previous Year",
    ASSIGNMENT: "Assignment",
    PRACTICAL: "Practical",
    REFERENCE: "Reference",
};

function formatFileSize(bytes: number) {
    if (!bytes) return "";

    const mb = bytes / (1024 * 1024);

    if (mb < 1) {
        return `${Math.round(bytes / 1024)} KB`;
    }

    return `${mb.toFixed(1)} MB`;
}

function getSafeFileName(title: string) {
    const cleaned = title
        .trim()
        .replace(/[<>:"/\\|?*]+/g, "")
        .replace(/\s+/g, " ");

    return cleaned.toLowerCase().endsWith(".pdf")
        ? cleaned
        : `${cleaned || "notesroom-file"}.pdf`;
}

/* Highlights the part of the text that matches the search */
function Highlight({ text, query }: { text: string; query: string }) {
    const value = query.trim();

    if (!value) return <>{text}</>;

    const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));

    return (
        <>
            {parts.map((part, index) =>
                part.toLowerCase() === value.toLowerCase() ? (
                    <mark
                        key={index}
                        className="rounded bg-[#FFF1B8] px-0.5 text-inherit"
                    >
                        {part}
                    </mark>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </>
    );
}

function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-[24px] bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            <div className="flex gap-3">
                <div className="h-11 w-11 shrink-0 rounded-2xl bg-[#EDEDEA]" />

                <div className="flex-1 space-y-2.5 pt-1">
                    <div className="h-3.5 w-2/3 rounded-full bg-[#EDEDEA]" />
                    <div className="h-3 w-full rounded-full bg-[#F3F3F0]" />
                    <div className="h-3 w-1/3 rounded-full bg-[#F3F3F0]" />
                </div>
            </div>

            <div className="mt-4 flex gap-2">
                <div className="h-10 flex-1 rounded-xl bg-[#F3F3F0]" />
                <div className="h-10 flex-1 rounded-xl bg-[#EDEDEA]" />
            </div>
        </div>
    );
}

export default function Search() {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    const [files, setFiles] = useState<StudyFile[]>([]);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<
        FileCategory | "ALL"
    >("ALL");

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [downloadedId, setDownloadedId] = useState<string | null>(null);

    const loadFiles = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const result = await getAllStudyFiles();

            setFiles(result);
        } catch (error) {
            console.error("Failed to load study files:", error);

            setErrorMessage(
                "Unable to load study material. Check your connection and try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    /* Only show filter chips for categories that actually have files */
    const availableCategories = useMemo(() => {
        const present = new Set(files.map((file) => file.category));

        return (Object.keys(categoryLabels) as FileCategory[]).filter(
            (category) => present.has(category)
        );
    }, [files]);

    const filteredFiles = useMemo(() => {
        const value = search.trim().toLowerCase();

        return files.filter((file) => {
            if (
                activeCategory !== "ALL" &&
                file.category !== activeCategory
            ) {
                return false;
            }

            if (!value) return true;

            const title = file.title?.toLowerCase() ?? "";
            const description = file.description?.toLowerCase() ?? "";
            const category =
                categoryLabels[file.category]?.toLowerCase() ?? "";

            return (
                title.includes(value) ||
                description.includes(value) ||
                category.includes(value)
            );
        });
    }, [files, search, activeCategory]);

    const previewFile = (fileUrl: string) => {
        window.open(fileUrl, "_blank", "noopener,noreferrer");
    };

    const downloadFile = async (file: StudyFile) => {
        try {
            setDownloadingId(file.id);
            setDownloadedId(null);

            const response = await fetch(file.fileUrl);

            if (!response.ok) {
                throw new Error("Failed to download the file.");
            }

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const anchor = document.createElement("a");

            anchor.href = blobUrl;
            anchor.download = getSafeFileName(file.title);

            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();

            URL.revokeObjectURL(blobUrl);

            setDownloadedId(file.id);

            window.setTimeout(() => {
                setDownloadedId((current) =>
                    current === file.id ? null : current
                );
            }, 2000);
        } catch (error) {
            console.error("Download failed:", error);

            // Fallback for Cloudinary/CORS restrictions.
            window.open(file.fileUrl, "_blank", "noopener,noreferrer");
        } finally {
            setDownloadingId(null);
        }
    };

    const hasQuery = search.trim().length > 0;

    const resultLabel = hasQuery || activeCategory !== "ALL"
        ? `${filteredFiles.length} ${filteredFiles.length === 1 ? "result" : "results"}`
        : `${files.length} ${files.length === 1 ? "file" : "files"}`;

    return (
        <main className="min-h-screen bg-[#F7F7F5] text-[#111111]">
            {/* Sticky top bar: back button lives inside the search bar */}
            <div className="sticky top-0 z-20 bg-[#F7F7F5]/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
                <div className="mx-auto w-full max-w-2xl px-4 pb-3 pt-4 sm:px-6 lg:max-w-4xl">
                    <div className="flex h-14 items-center rounded-2xl bg-white shadow-[0_2px_12px_rgba(15,23,42,0.06)] ring-1 ring-transparent transition focus-within:ring-[#4F7FC7]/40">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex h-full w-12 shrink-0 items-center justify-center rounded-l-2xl text-[#111111] transition hover:bg-[#F7F7F5] active:scale-95"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={20} strokeWidth={1.9} />
                        </button>

                        <input
                            ref={inputRef}
                            type="search"
                            autoFocus
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search notes, subjects, papers..."
                            enterKeyHint="search"
                            className="h-full min-w-0 flex-1 bg-transparent pr-2 text-[15px] text-[#111111] outline-none placeholder:text-[#9CA3AF] [&::-webkit-search-cancel-button]:hidden"
                        />

                        {search ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    inputRef.current?.focus();
                                }}
                                className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F1F1EF] text-[#777B7D] transition hover:bg-[#E8E8E5] active:scale-95"
                                aria-label="Clear search"
                            >
                                <X size={16} strokeWidth={2} />
                            </button>
                        ) : (
                            <SearchIcon
                                size={19}
                                strokeWidth={1.8}
                                className="mr-4 shrink-0 text-[#9CA3AF]"
                            />
                        )}
                    </div>

                    {/* Category chips */}
                    {!loading && !errorMessage && availableCategories.length > 1 && (
                        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
                            {(["ALL", ...availableCategories] as const).map(
                                (category) => {
                                    const isActive = activeCategory === category;

                                    return (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() => setActiveCategory(category)}
                                            className={`h-9 shrink-0 rounded-full px-4 text-[13px] font-medium transition active:scale-95 ${isActive
                                                ? "bg-[#111111] text-white"
                                                : "bg-white text-[#555A5C] shadow-[0_1px_6px_rgba(15,23,42,0.05)] hover:bg-[#F1F1EF]"
                                                }`}
                                            aria-pressed={isActive}
                                        >
                                            {category === "ALL"
                                                ? "All"
                                                : categoryLabels[category]}
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mx-auto w-full max-w-2xl px-4 pb-10 pt-2 sm:px-6 lg:max-w-4xl">
                {/* Result count */}
                {!loading && !errorMessage && files.length > 0 && (
                    <p className="mb-3 mt-2 text-xs font-medium text-[#8A8E90]">
                        {resultLabel}
                    </p>
                )}

                {/* Loading skeletons */}
                {loading && (
                    <div className="mt-3 space-y-3" aria-busy="true">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                )}

                {/* Error */}
                {!loading && errorMessage && (
                    <div className="mt-6 rounded-[24px] bg-white p-8 text-center shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                        <p className="text-sm leading-6 text-[#777B7D]">
                            {errorMessage}
                        </p>

                        <button
                            type="button"
                            onClick={loadFiles}
                            className="mt-4 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#222222] active:scale-95"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Results */}
                {!loading && !errorMessage && filteredFiles.length > 0 && (
                    <section className="space-y-3">
                        {filteredFiles.map((file) => {
                            const isDownloading = downloadingId === file.id;
                            const isDownloaded = downloadedId === file.id;
                            const size = formatFileSize(file.fileSize);

                            return (
                                <article
                                    key={file.id}
                                    className="rounded-[24px] bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition hover:shadow-[0_6px_20px_rgba(15,23,42,0.07)]"
                                >
                                    {/* Tapping the info opens the PDF, like a real app */}
                                    <button
                                        type="button"
                                        onClick={() => previewFile(file.fileUrl)}
                                        className="flex w-full gap-3 text-left"
                                        aria-label={`Open ${file.title}`}
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FEECEC] text-[#E05252]">
                                            <FileText size={20} strokeWidth={1.8} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-[#111111]">
                                                <Highlight
                                                    text={file.title}
                                                    query={search}
                                                />
                                            </h2>

                                            {file.description && (
                                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#777B7D]">
                                                    <Highlight
                                                        text={file.description}
                                                        query={search}
                                                    />
                                                </p>
                                            )}

                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-[#E8F1FF] px-2.5 py-1 text-[11px] font-medium text-[#3D6DAF]">
                                                    {categoryLabels[file.category]}
                                                </span>

                                                <span className="text-[11px] text-[#9CA3AF]">
                                                    PDF{size ? ` • ${size}` : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Actions */}
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => previewFile(file.fileUrl)}
                                            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#E7E7E4] bg-white text-[13px] font-medium text-[#111111] transition hover:border-[#C9D9F2] hover:bg-[#F5F8FD] active:scale-[0.98]"
                                        >
                                            <Eye
                                                size={17}
                                                strokeWidth={1.9}
                                                className="text-[#4F7FC7]"
                                            />
                                            View
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => downloadFile(file)}
                                            disabled={isDownloading}
                                            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-[13px] font-medium text-white transition active:scale-[0.98] disabled:cursor-wait ${isDownloaded
                                                ? "bg-[#2E9E5B]"
                                                : "bg-[#111111] hover:bg-[#2A2A2A]"
                                                } ${isDownloading ? "opacity-70" : ""}`}
                                        >
                                            {isDownloading ? (
                                                <>
                                                    <Loader2
                                                        size={17}
                                                        className="animate-spin"
                                                    />
                                                    Saving...
                                                </>
                                            ) : isDownloaded ? (
                                                <>
                                                    <Check size={17} strokeWidth={2.2} />
                                                    Saved
                                                </>
                                            ) : (
                                                <>
                                                    <Download
                                                        size={17}
                                                        strokeWidth={1.9}
                                                    />
                                                    Download
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}

                {/* Empty state */}
                {!loading && !errorMessage && filteredFiles.length === 0 && (
                    <div className="mt-6 flex min-h-[300px] flex-col items-center justify-center rounded-[28px] bg-white px-6 text-center shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F1FF] text-[#4F7FC7]">
                            <SearchIcon size={24} strokeWidth={1.8} />
                        </div>

                        <h2 className="mt-5 text-base font-semibold text-[#111111]">
                            {hasQuery || activeCategory !== "ALL"
                                ? "No results found"
                                : "No study material yet"}
                        </h2>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-[#777B7D]">
                            {hasQuery
                                ? `Nothing matches "${search.trim()}". Check the spelling or try a shorter keyword.`
                                : activeCategory !== "ALL"
                                    ? "There are no files in this category yet."
                                    : "Study material uploaded to NotesRoom will appear here."}
                        </p>

                        {(hasQuery || activeCategory !== "ALL") && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setActiveCategory("ALL");
                                }}
                                className="mt-5 rounded-full bg-[#111111] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#2A2A2A] active:scale-95"
                            >
                                Clear search and filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}