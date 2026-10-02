import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    FileImage,
    GripVertical,
    Loader2,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

import { auth } from "../../firebase/config";
import {
    createStudyFile,
    type FileCategory,
} from "../../services/studyfileService";
import { uploadFileToCloudinary } from "../../services/cloudinaryService";

interface ImageItem {
    id: string;
    file: File;
    preview: string;
}

const MAX_IMAGES = 50;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB

const categories: {
    value: FileCategory;
    label: string;
}[] = [
        {
            value: "NOTES",
            label: "Notes",
        },
        {
            value: "IMPORTANT_QUESTIONS",
            label: "Important Questions",
        },
        {
            value: "PREVIOUS_YEAR_PAPER",
            label: "Previous Year Paper",
        },
        {
            value: "ASSIGNMENT",
            label: "Assignment",
        },
        {
            value: "PRACTICAL",
            label: "Practical",
        },
        {
            value: "REFERENCE",
            label: "Reference",
        },
    ];

export default function PdfMaker() {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    const [images, setImages] = useState<ImageItem[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] =
        useState<FileCategory>("NOTES");

    const [isGenerating, setIsGenerating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const addImages = (files: FileList | File[]) => {
        setErrorMessage("");
        setSuccessMessage("");

        const selectedFiles = Array.from(files);

        const imageFiles = selectedFiles.filter((file) =>
            file.type.startsWith("image/")
        );

        if (imageFiles.length !== selectedFiles.length) {
            setErrorMessage(
                "Only image files are allowed."
            );
        }

        if (
            images.length + imageFiles.length >
            MAX_IMAGES
        ) {
            setErrorMessage(
                `You can add a maximum of ${MAX_IMAGES} images.`
            );
            return;
        }

        const validFiles = imageFiles.filter(
            (file) => file.size <= MAX_IMAGE_SIZE
        );

        if (validFiles.length !== imageFiles.length) {
            setErrorMessage(
                "Each image must be smaller than 10 MB."
            );
        }

        const newImages: ImageItem[] =
            validFiles.map((file) => ({
                id: crypto.randomUUID(),
                file,
                preview: URL.createObjectURL(file),
            }));

        setImages((current) => [
            ...current,
            ...newImages,
        ]);
    };

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files) {
            addImages(event.target.files);
        }

        event.target.value = "";
    };

    const removeImage = (id: string) => {
        setImages((current) => {
            const image = current.find(
                (item) => item.id === id
            );

            if (image) {
                URL.revokeObjectURL(image.preview);
            }

            return current.filter(
                (item) => item.id !== id
            );
        });
    };

    const moveImage = (
        index: number,
        direction: "up" | "down"
    ) => {
        setImages((current) => {
            const newImages = [...current];

            const targetIndex =
                direction === "up"
                    ? index - 1
                    : index + 1;

            if (
                targetIndex < 0 ||
                targetIndex >= newImages.length
            ) {
                return current;
            }

            [
                newImages[index],
                newImages[targetIndex],
            ] = [
                    newImages[targetIndex],
                    newImages[index],
                ];

            return newImages;
        });
    };

    const clearImages = () => {
        images.forEach((image) => {
            URL.revokeObjectURL(image.preview);
        });

        setImages([]);
    };

    const getImageDimensions = (
        src: string
    ): Promise<{
        width: number;
        height: number;
    }> => {
        return new Promise((resolve, reject) => {
            const image = new Image();

            image.onload = () => {
                resolve({
                    width: image.naturalWidth,
                    height: image.naturalHeight,
                });
            };

            image.onerror = () => {
                reject(
                    new Error("Failed to read image.")
                );
            };

            image.src = src;
        });
    };

    const generatePdf = async (): Promise<File> => {
        if (images.length === 0) {
            throw new Error(
                "Please add at least one image."
            );
        }

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
            compress: true,
        });

        const pageWidth =
            pdf.internal.pageSize.getWidth();

        const pageHeight =
            pdf.internal.pageSize.getHeight();

        const margin = 8;

        const maxWidth =
            pageWidth - margin * 2;

        const maxHeight =
            pageHeight - margin * 2;

        for (let index = 0; index < images.length; index++) {
            if (index > 0) {
                pdf.addPage();
            }

            const image = images[index];

            const preview =
                image.preview;

            const dimensions =
                await getImageDimensions(preview);

            const imageRatio =
                dimensions.width /
                dimensions.height;

            let renderWidth = maxWidth;
            let renderHeight =
                renderWidth / imageRatio;

            if (renderHeight > maxHeight) {
                renderHeight = maxHeight;
                renderWidth =
                    renderHeight * imageRatio;
            }

            const x =
                (pageWidth - renderWidth) / 2;

            const y =
                (pageHeight - renderHeight) / 2;

            pdf.addImage(
                preview,
                "JPEG",
                x,
                y,
                renderWidth,
                renderHeight,
                undefined,
                "FAST"
            );
        }

        const pdfBlob =
            pdf.output("blob");

        const safeTitle =
            title.trim()
                .replace(/[^a-zA-Z0-9-_ ]/g, "")
                .replace(/\s+/g, "-")
                .toLowerCase() ||
            "notesroom-images";

        return new File(
            [pdfBlob],
            `${safeTitle}.pdf`,
            {
                type: "application/pdf",
            }
        );
    };

    const handleDownload = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        if (images.length === 0) {
            setErrorMessage(
                "Please add at least one image."
            );
            return;
        }

        try {
            setIsGenerating(true);

            const pdfFile =
                await generatePdf();

            const url =
                URL.createObjectURL(pdfFile);

            const anchor =
                document.createElement("a");

            anchor.href = url;
            anchor.download = pdfFile.name;

            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();

            URL.revokeObjectURL(url);

            setSuccessMessage(
                "PDF generated successfully."
            );
        } catch (error) {
            console.error(
                "PDF generation failed:",
                error
            );

            setErrorMessage(
                "Failed to generate the PDF."
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUpload = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        const user = auth.currentUser;

        if (!user) {
            setErrorMessage(
                "You must be logged in as an admin."
            );
            return;
        }

        if (images.length === 0) {
            setErrorMessage(
                "Please add at least one image."
            );
            return;
        }

        if (!title.trim()) {
            setErrorMessage(
                "Please enter a PDF title."
            );
            return;
        }

        try {
            setIsUploading(true);

            const pdfFile =
                await generatePdf();

            const cloudinaryFile =
                await uploadFileToCloudinary(
                    pdfFile
                );

            await createStudyFile({
                title: title.trim(),
                description:
                    description.trim(),
                category,
                subjectId: "",
                fileUrl:
                    cloudinaryFile.secure_url,
                cloudinaryPublicId:
                    cloudinaryFile.public_id,
                fileType:
                    "application/pdf",
                fileSize:
                    pdfFile.size,
                uploadedBy: user.uid,
            });

            setSuccessMessage(
                "PDF uploaded successfully to NotesRoom."
            );
        } catch (error) {
            console.error(
                "PDF upload failed:",
                error
            );

            setErrorMessage(
                "Failed to upload the PDF."
            );
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F7F7F5]">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 pb-12 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="mb-8">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
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
                        Back
                    </button>

                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div
                                className="
                  mb-3
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

                            <h1
                                className="
                  text-3xl
                  font-semibold
                  tracking-tight
                  text-[#111111]
                  sm:text-4xl
                "
                            >
                                Image → PDF
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-[#777B7D]">
                                Convert multiple images into a
                                single PDF for your NotesRoom
                                study material.
                            </p>
                        </div>

                        {images.length > 0 && (
                            <button
                                type="button"
                                onClick={clearImages}
                                className="
                  hidden
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#E5E5E5]
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-[#777B7D]
                  transition
                  hover:border-red-200
                  hover:text-red-500
                  sm:flex
                "
                            >
                                <Trash2 size={16} />
                                Clear all
                            </button>
                        )}
                    </div>
                </header>

                {/* Messages */}
                {errorMessage && (
                    <div
                        className="
              mb-5
              rounded-2xl
              border
              border-red-100
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
            "
                    >
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div
                        className="
              mb-5
              rounded-2xl
              border
              border-green-100
              bg-green-50
              px-4
              py-3
              text-sm
              text-green-700
            "
                    >
                        {successMessage}
                    </div>
                )}

                <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
                    {/* Left */}
                    <section className="space-y-5">
                        {/* Upload */}
                        <div
                            className="
                rounded-[28px]
                bg-white
                p-5
                shadow-[0_2px_12px_rgba(15,23,42,0.04)]
                sm:p-6
              "
                        >
                            <div
                                className="
                  rounded-[22px]
                  border-2
                  border-dashed
                  border-[#D9E5F7]
                  bg-[#FAFCFF]
                  px-5
                  py-12
                  text-center
                "
                                onDragOver={(event) => {
                                    event.preventDefault();
                                }}
                                onDrop={(event) => {
                                    event.preventDefault();

                                    if (
                                        event.dataTransfer.files
                                    ) {
                                        addImages(
                                            event.dataTransfer.files
                                        );
                                    }
                                }}
                            >
                                <div
                                    className="
                    mx-auto
                    mb-4
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
                                    <Upload
                                        size={24}
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <h2 className="text-lg font-semibold text-[#111111]">
                                    Add your images
                                </h2>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777B7D]">
                                    Select multiple images or
                                    drag and drop them here.
                                    Images will become individual
                                    PDF pages.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        inputRef.current?.click()
                                    }
                                    className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-black
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#242424]
                    active:scale-95
                  "
                                >
                                    <Upload size={17} />
                                    Select Images
                                </button>

                                <input
                                    ref={inputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
                                    onChange={handleFileChange}
                                />

                                <p className="mt-4 text-xs text-[#9CA3AF]">
                                    Maximum {MAX_IMAGES} images ·
                                    10 MB per image
                                </p>
                            </div>
                        </div>

                        {/* Images */}
                        {images.length > 0 && (
                            <div
                                className="
                  rounded-[28px]
                  bg-white
                  p-5
                  shadow-[0_2px_12px_rgba(15,23,42,0.04)]
                  sm:p-6
                "
                            >
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <h2 className="font-semibold text-[#111111]">
                                            Selected Images
                                        </h2>

                                        <p className="mt-1 text-xs text-[#777B7D]">
                                            {images.length}{" "}
                                            {images.length === 1
                                                ? "image"
                                                : "images"}{" "}
                                            · Drag order is controlled
                                            with the arrows
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={clearImages}
                                        className="
                      flex
                      items-center
                      gap-1.5
                      text-xs
                      font-semibold
                      text-[#9CA3AF]
                      hover:text-red-500
                      sm:hidden
                    "
                                    >
                                        <X size={14} />
                                        Clear
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                    {images.map(
                                        (image, index) => (
                                            <div
                                                key={image.id}
                                                className="
                          group
                          overflow-hidden
                          rounded-2xl
                          border
                          border-[#EEEEEE]
                          bg-[#F7F7F5]
                        "
                                            >
                                                <div className="relative aspect-[3/4] overflow-hidden bg-[#EEEEEE]">
                                                    <img
                                                        src={image.preview}
                                                        alt={`Page ${index + 1
                                                            }`}
                                                        className="
                              h-full
                              w-full
                              object-cover
                            "
                                                    />

                                                    <div
                                                        className="
                              absolute
                              left-2
                              top-2
                              flex
                              h-7
                              min-w-7
                              items-center
                              justify-center
                              rounded-full
                              bg-black/75
                              px-2
                              text-xs
                              font-semibold
                              text-white
                            "
                                                    >
                                                        {index + 1}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeImage(
                                                                image.id
                                                            )
                                                        }
                                                        className="
                              absolute
                              right-2
                              top-2
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              rounded-full
                              bg-white/90
                              text-red-500
                              opacity-0
                              shadow-sm
                              transition
                              group-hover:opacity-100
                            "
                                                        aria-label="Remove image"
                                                    >
                                                        <X size={15} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between px-2 py-2">
                                                    <GripVertical
                                                        size={16}
                                                        className="text-[#B0B0B0]"
                                                    />

                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                index === 0
                                                            }
                                                            onClick={() =>
                                                                moveImage(
                                                                    index,
                                                                    "up"
                                                                )
                                                            }
                                                            className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-full
                                text-[#777B7D]
                                transition
                                hover:bg-[#F0F0F0]
                                disabled:cursor-not-allowed
                                disabled:opacity-30
                              "
                                                            aria-label="Move image up"
                                                        >
                                                            <ChevronUp
                                                                size={15}
                                                            />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                index ===
                                                                images.length -
                                                                1
                                                            }
                                                            onClick={() =>
                                                                moveImage(
                                                                    index,
                                                                    "down"
                                                                )
                                                            }
                                                            className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-full
                                text-[#777B7D]
                                transition
                                hover:bg-[#F0F0F0]
                                disabled:cursor-not-allowed
                                disabled:opacity-30
                              "
                                                            aria-label="Move image down"
                                                        >
                                                            <ChevronDown
                                                                size={15}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Right */}
                    <aside>
                        <div
                            className="
                sticky
                top-6
                rounded-[28px]
                bg-white
                p-5
                shadow-[0_2px_12px_rgba(15,23,42,0.04)]
                sm:p-6
              "
                        >
                            <h2 className="text-lg font-semibold text-[#111111]">
                                PDF Details
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-[#777B7D]">
                                Add basic information before
                                generating your PDF.
                            </p>

                            <div className="mt-6 space-y-5">
                                <div>
                                    <label
                                        htmlFor="pdf-title"
                                        className="mb-2 block text-sm font-medium text-[#111111]"
                                    >
                                        PDF Title
                                    </label>

                                    <input
                                        id="pdf-title"
                                        type="text"
                                        value={title}
                                        onChange={(event) =>
                                            setTitle(
                                                event.target.value
                                            )
                                        }
                                        placeholder="e.g. OS Unit 3 Notes"
                                        className="
                      h-12
                      w-full
                      rounded-2xl
                      border
                      border-[#E7E7E7]
                      bg-[#FAFAFA]
                      px-4
                      text-sm
                      text-[#111111]
                      outline-none
                      transition
                      placeholder:text-[#A0A0A0]
                      focus:border-[#4F7FC7]
                      focus:bg-white
                    "
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="pdf-description"
                                        className="mb-2 block text-sm font-medium text-[#111111]"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="pdf-description"
                                        value={description}
                                        onChange={(event) =>
                                            setDescription(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Optional description"
                                        rows={4}
                                        className="
                      w-full
                      resize-none
                      rounded-2xl
                      border
                      border-[#E7E7E7]
                      bg-[#FAFAFA]
                      px-4
                      py-3
                      text-sm
                      text-[#111111]
                      outline-none
                      transition
                      placeholder:text-[#A0A0A0]
                      focus:border-[#4F7FC7]
                      focus:bg-white
                    "
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="pdf-category"
                                        className="mb-2 block text-sm font-medium text-[#111111]"
                                    >
                                        Category
                                    </label>

                                    <select
                                        id="pdf-category"
                                        value={category}
                                        onChange={(event) =>
                                            setCategory(
                                                event.target
                                                    .value as FileCategory
                                            )
                                        }
                                        className="
                      h-12
                      w-full
                      rounded-2xl
                      border
                      border-[#E7E7E7]
                      bg-[#FAFAFA]
                      px-4
                      text-sm
                      text-[#111111]
                      outline-none
                      focus:border-[#4F7FC7]
                    "
                                    >
                                        {categories.map(
                                            (item) => (
                                                <option
                                                    key={item.value}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div
                                    className="
                    rounded-2xl
                    bg-[#F7F7F5]
                    p-4
                  "
                                >
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#777B7D]">
                                            Images
                                        </span>

                                        <span className="font-semibold text-[#111111]">
                                            {images.length}
                                        </span>
                                    </div>

                                    <div className="mt-2 flex justify-between text-sm">
                                        <span className="text-[#777B7D]">
                                            Page size
                                        </span>

                                        <span className="font-semibold text-[#111111]">
                                            A4
                                        </span>
                                    </div>

                                    <div className="mt-2 flex justify-between text-sm">
                                        <span className="text-[#777B7D]">
                                            Layout
                                        </span>

                                        <span className="font-semibold text-[#111111]">
                                            Fit to page
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled={
                                        images.length === 0 ||
                                        isGenerating ||
                                        isUploading
                                    }
                                    onClick={handleDownload}
                                    className="
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-black
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#242424]
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <FileImage size={17} />
                                            Generate & Download
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        images.length === 0 ||
                                        isGenerating ||
                                        isUploading ||
                                        !title.trim()
                                    }
                                    onClick={handleUpload}
                                    className="
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#4F7FC7]
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#3D6DAF]
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={17} />
                                            Upload to NotesRoom
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}