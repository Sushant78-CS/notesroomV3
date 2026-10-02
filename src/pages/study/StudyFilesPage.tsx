import {
    ArrowLeft,
    Download,
    Eye,
    FileText,
    Loader2,
    Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    type FileCategory,
    type StudyFile,
} from "../../services/studyfileService";

interface StudyFilesPageProps {
    category: FileCategory;
    title: string;
    description: string;
}

export default function StudyFilesPage({
    category,
    title,
}: StudyFilesPageProps) {
    const navigate = useNavigate();

    const [files, setFiles] = useState<StudyFile[]>([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadFiles();
    }, [category]);

    const loadFiles = async () => {
        try {
            setLoading(true);
            setError("");

            /*
             * We currently don't have a global category query
             * in the service. So this page will initially load
             * all study files and filter by category.
             *
             * This can later be optimized with a dedicated
             * getFilesByCategory() Firestore query.
             */
            const { collection, getDocs, query, where } =
                await import("firebase/firestore");

            const { db } = await import(
                "../../firebase/config"
            );

            const filesQuery = query(
                collection(db, "studyFiles"),
                where("category", "==", category)
            );

            const snapshot = await getDocs(filesQuery);

            const studyFiles = snapshot.docs.map((item) => ({
                id: item.id,
                ...item.data(),
            })) as StudyFile[];

            setFiles(studyFiles);
        } catch (err) {
            console.error(
                "Failed to load study files:",
                err
            );

            setError(
                "Failed to load study material. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredFiles = useMemo(() => {
        const value = search
            .trim()
            .toLowerCase();

        if (!value) {
            return files;
        }

        return files.filter((file) => {
            return (
                file.title
                    .toLowerCase()
                    .includes(value) ||
                file.description
                    ?.toLowerCase()
                    .includes(value)
            );
        });
    }, [files, search]);

    const formatFileSize = (bytes: number) => {
        if (!bytes) return "Unknown size";

        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(1)} MB`;
    };

    // const openFile = (fileUrl: string) => {
    //     window.open(
    //         fileUrl,
    //         "_blank",
    //         "noopener,noreferrer"
    //     );
    // };

    const previewFile = (fileUrl: string) => {
        window.open(
            fileUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    const downloadFile = async (
        fileUrl: string,
        fileName: string
    ) => {
        try {
            const response = await fetch(fileUrl);

            if (!response.ok) {
                throw new Error("Failed to download file.");
            }

            const blob = await response.blob();

            const url = URL.createObjectURL(blob);

            const anchor = document.createElement("a");

            anchor.href = url;
            anchor.download = `${fileName}.pdf`;

            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(
                "Failed to download PDF:",
                error
            );

            // Fallback: open the PDF
            window.open(
                fileUrl,
                "_blank",
                "noopener,noreferrer"
            );
        }
    };

    return (
        <main className="min-h-screen bg-[#F7F7F5] text-[#111111]">
            <div
                className="
          mx-auto
          w-full
          max-w-4xl
          px-4
          py-6
          pb-12
          sm:px-6
        "
            >
                {/* Header */}
                <header className="mb-7">
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

                    {/* <div className="flex items-start gap-4">
                        <div
                            className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-[#E8F1FF]
                text-[#4F7FC7]
              "
                        >
                            {category === "NOTES" ? (
                                <BookOpen
                                    size={23}
                                    strokeWidth={1.8}
                                />
                            ) : (
                                <FileText
                                    size={23}
                                    strokeWidth={1.8}
                                />
                            )}
                        </div>

                        <div>
                            <h1
                                className="
                  text-3xl
                  font-semibold
                  tracking-tight
                  text-[#111111]
                  sm:text-4xl
                "
                            >
                                {title}
                            </h1>

                            <p
                                className="
                  mt-2
                  max-w-xl
                  text-sm
                  leading-6
                  text-[#777B7D]
                "
                            >
                                {description}
                            </p>
                        </div>
                    </div> */}
                </header>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search
                            size={18}
                            strokeWidth={1.8}
                            className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#9CA3AF]
              "
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder={`Search ${title.toLowerCase()}...`}
                            className="
                h-12
                w-full
                rounded-2xl
                border
                border-[#E7E7E7]
                bg-white
                pl-11
                pr-4
                text-sm
                text-[#111111]
                outline-none
                transition
                placeholder:text-[#A0A0A0]
                focus:border-[#4F7FC7]
              "
                        />
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div
                        className="
              flex
              min-h-[300px]
              items-center
              justify-center
              rounded-[28px]
              bg-white
            "
                    >
                        <div className="flex items-center gap-3 text-sm text-[#777B7D]">
                            <Loader2
                                size={20}
                                className="animate-spin"
                            />
                            Loading study material...
                        </div>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div
                        className="
              rounded-[28px]
              border
              border-red-100
              bg-red-50
              p-6
              text-center
              text-sm
              text-red-600
            "
                    >
                        {error}

                        <button
                            type="button"
                            onClick={loadFiles}
                            className="
                mt-4
                block
                mx-auto
                rounded-full
                bg-black
                px-5
                py-2.5
                text-xs
                font-semibold
                text-white
              "
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!loading &&
                    !error &&
                    filteredFiles.length === 0 && (
                        <div
                            className="
                rounded-[28px]
                bg-white
                px-6
                py-16
                text-center
                shadow-[0_2px_12px_rgba(15,23,42,0.04)]
              "
                        >
                            <div
                                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#E8F1FF]
                  text-[#4F7FC7]
                "
                            >
                                <FileText
                                    size={24}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <h2 className="mt-5 text-lg font-semibold">
                                No material found
                            </h2>

                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#777B7D]">
                                {search
                                    ? "Try a different search term."
                                    : `There are no ${title.toLowerCase()} available yet.`}
                            </p>
                        </div>
                    )}

                {/* Files */}
                {!loading &&
                    !error &&
                    filteredFiles.length > 0 && (
                        <div className="space-y-3">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-[#111111]">
                                    {filteredFiles.length}{" "}
                                    {filteredFiles.length === 1
                                        ? "file"
                                        : "files"}
                                </h2>
                            </div>

                            {filteredFiles.map((file) => (
                                <article
                                    key={file.id}
                                    className="
                    group
                    flex
                    items-center
                    gap-4
                    rounded-[24px]
                    bg-white
                    p-4
                    shadow-[0_2px_12px_rgba(15,23,42,0.04)]
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]
                  "
                                >
                                    {/* PDF icon */}
                                    <div
                                        className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#FEECEC]
                      text-[#E05252]
                    "
                                    >
                                        <FileText
                                            size={22}
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    {/* Information */}
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-sm font-semibold text-[#111111]">
                                            {file.title}
                                        </h3>

                                        {file.description && (
                                            <p className="mt-1 line-clamp-1 text-xs text-[#777B7D]">
                                                {file.description}
                                            </p>
                                        )}

                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#9CA3AF]">
                                            <span>
                                                PDF
                                            </span>

                                            <span>•</span>

                                            <span>
                                                {formatFileSize(
                                                    file.fileSize
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Open */}
                                    {/* Actions */}
                                    <div className="flex shrink-0 items-center gap-2">
                                        {/* Preview */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                previewFile(file.fileUrl)
                                            }
                                            className="
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-full
      bg-[#F7F7F5]
      text-[#4F7FC7]
      transition
      hover:bg-[#E8F1FF]
      active:scale-95
    "
                                            aria-label={`Preview ${file.title}`}
                                            title="Preview PDF"
                                        >
                                            <Eye
                                                size={18}
                                                strokeWidth={1.8}
                                            />
                                        </button>

                                        {/* Download */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                downloadFile(
                                                    file.fileUrl,
                                                    file.title
                                                )
                                            }
                                            className="
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-full
      bg-[#F7F7F5]
      text-[#4F7FC7]
      transition
      hover:bg-[#E8F1FF]
      active:scale-95
    "
                                            aria-label={`Download ${file.title}`}
                                            title="Download PDF"
                                        >
                                            <Download
                                                size={18}
                                                strokeWidth={1.8}
                                            />
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
            </div>
        </main>
    );
}