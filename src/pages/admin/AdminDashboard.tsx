import {
    useEffect,
    useState,
    type ChangeEvent,
} from "react";

import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    ChevronRight,
    FileImage,
    FileText,
    GraduationCap,
    Layers3,
    Loader2,
    Plus,
    Trash2,
    Upload,
    X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase/config";

import {
    getThakurCollege,
    type College,
} from "../../services/collegeService";

import {
    createCourse,
    getCoursesByCollege,
    type Course,
} from "../../services/courseService";

import {
    createSemester,
    getSemestersByCourse,
    type Semester,
} from "../../services/semesterService";

import {
    createSubject,
    deleteSubject,
    getSubjectsBySemester,
    type Subject,
} from "../../services/subjectService";

import {
    createStudyFile,
    type FileCategory,
} from "../../services/studyfileService";

import {
    uploadFileToCloudinary,
} from "../../services/cloudinaryService";
// ======================================================
// Categories
// ======================================================

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

// ======================================================
// Admin Dashboard
// ======================================================

export default function AdminDashboard() {
    const navigate = useNavigate();

    // ====================================================
    // College
    // ====================================================

    const [college, setCollege] =
        useState<College | null>(null);

    const [loadingCollege, setLoadingCollege] =
        useState(true);

    // ====================================================
    // Academic hierarchy
    // ====================================================

    const [courses, setCourses] =
        useState<Course[]>([]);

    const [semesters, setSemesters] =
        useState<Semester[]>([]);

    const [subjects, setSubjects] =
        useState<Subject[]>([]);

    const [courseId, setCourseId] =
        useState("");

    const [semesterId, setSemesterId] =
        useState("");

    const [subjectId, setSubjectId] =
        useState("");

    // ====================================================
    // Academic loading
    // ====================================================

    const [loadingCourses, setLoadingCourses] =
        useState(false);

    const [loadingSemesters, setLoadingSemesters] =
        useState(false);

    const [loadingSubjects, setLoadingSubjects] =
        useState(false);

    // ====================================================
    // Modal
    // ====================================================

    const [modal, setModal] = useState<
        "course" | "semester" | "subject" | null
    >(null);

    // ====================================================
    // Create form
    // ====================================================

    const [courseName, setCourseName] =
        useState("");

    const [semesterNumber, setSemesterNumber] =
        useState("");

    const [subjectName, setSubjectName] =
        useState("");

    const [subjectCode, setSubjectCode] =
        useState("");

    const [creating, setCreating] =
        useState(false);

    // ====================================================
    // Study file
    // ====================================================

    const [category, setCategory] =
        useState<FileCategory>("NOTES");

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [selectedFile, setSelectedFile] =
        useState<File | null>(null);

    const [uploading, setUploading] =
        useState(false);

    // ====================================================
    // Messages
    // ====================================================

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // ====================================================
    // Load Thakur College
    // ====================================================

    useEffect(() => {
        loadCollege();
    }, []);

    const loadCollege = async () => {
        try {
            setLoadingCollege(true);
            setErrorMessage("");

            const data = await getThakurCollege();

            setCollege(data);
        } catch (error) {
            console.error(
                "Failed to load college:",
                error
            );

            setErrorMessage(
                "Failed to load Thakur College."
            );
        } finally {
            setLoadingCollege(false);
        }
    };

    // ====================================================
    // Load courses
    // ====================================================

    useEffect(() => {
        if (!college) {
            setCourses([]);
            return;
        }

        loadCourses();
    }, [college]);

    const loadCourses = async () => {
        if (!college) return;

        try {
            setLoadingCourses(true);

            const data =
                await getCoursesByCollege(
                    college.id
                );

            setCourses(data);
        } catch (error) {
            console.error(
                "Failed to load courses:",
                error
            );

            setErrorMessage(
                "Failed to load courses."
            );
        } finally {
            setLoadingCourses(false);
        }
    };

    // ====================================================
    // Load semesters
    // ====================================================

    useEffect(() => {
        if (!courseId) {
            setSemesters([]);
            setSemesterId("");
            setSubjects([]);
            setSubjectId("");

            return;
        }

        loadSemesters();
    }, [courseId]);

    const loadSemesters = async () => {
        if (!courseId) return;

        try {
            setLoadingSemesters(true);

            const data =
                await getSemestersByCourse(
                    courseId
                );

            setSemesters(data);
        } catch (error) {
            console.error(
                "Failed to load semesters:",
                error
            );

            setErrorMessage(
                "Failed to load semesters."
            );
        } finally {
            setLoadingSemesters(false);
        }
    };

    // ====================================================
    // Load subjects
    // ====================================================

    useEffect(() => {
        if (!semesterId) {
            setSubjects([]);
            setSubjectId("");

            return;
        }

        loadSubjects();
    }, [semesterId]);

    const loadSubjects = async () => {
        if (!semesterId) return;

        try {
            setLoadingSubjects(true);

            const data =
                await getSubjectsBySemester(
                    semesterId
                );

            setSubjects(data);
        } catch (error) {
            console.error(
                "Failed to load subjects:",
                error
            );

            setErrorMessage(
                "Failed to load subjects."
            );
        } finally {
            setLoadingSubjects(false);
        }
    };

    // ====================================================
    // Helpers
    // ====================================================

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    // ====================================================
    // Open modal
    // ====================================================

    const openModal = (
        type:
            | "course"
            | "semester"
            | "subject"
    ) => {
        clearMessages();

        setCourseName("");
        setSemesterNumber("");
        setSubjectName("");
        setSubjectCode("");

        setModal(type);
    };

    const closeModal = () => {
        if (creating) return;

        setModal(null);
    };

    // ====================================================
    // Create course
    // ====================================================

    const handleCreateCourse = async () => {
        if (!college) {
            setErrorMessage(
                "Thakur College is not available."
            );

            return;
        }

        const name = courseName.trim();

        if (!name) {
            setErrorMessage(
                "Please enter a course name."
            );

            return;
        }

        try {
            setCreating(true);
            clearMessages();

            await createCourse(
                name,
                college.id
            );

            await loadCourses();

            setSuccessMessage(
                "Course created successfully."
            );

            setModal(null);
            setCourseName("");
        } catch (error) {
            console.error(
                "Failed to create course:",
                error
            );

            setErrorMessage(
                "Failed to create course."
            );
        } finally {
            setCreating(false);
        }
    };

    // ====================================================
    // Create semester
    // ====================================================

    const handleCreateSemester = async () => {
        if (!courseId) {
            setErrorMessage(
                "Please select a course first."
            );

            return;
        }

        const number =
            Number(semesterNumber);

        if (
            !semesterNumber ||
            !Number.isInteger(number) ||
            number <= 0
        ) {
            setErrorMessage(
                "Please enter a valid semester number."
            );

            return;
        }

        try {
            setCreating(true);
            clearMessages();

            await createSemester(
                number,
                courseId
            );

            await loadSemesters();

            setSuccessMessage(
                "Semester created successfully."
            );

            setModal(null);
            setSemesterNumber("");
        } catch (error) {
            console.error(
                "Failed to create semester:",
                error
            );

            setErrorMessage(
                "Failed to create semester."
            );
        } finally {
            setCreating(false);
        }
    };

    // ====================================================
    // Create subject
    // ====================================================

    const handleCreateSubject = async () => {
        if (!semesterId) {
            setErrorMessage(
                "Please select a semester first."
            );

            return;
        }

        const name = subjectName.trim();
        const code = subjectCode.trim();

        if (!name) {
            setErrorMessage(
                "Please enter a subject name."
            );

            return;
        }

        try {
            setCreating(true);
            clearMessages();

            await createSubject(
                name,
                code,
                semesterId
            );

            await loadSubjects();

            setSuccessMessage(
                "Subject created successfully."
            );

            setModal(null);

            setSubjectName("");
            setSubjectCode("");
        } catch (error) {
            console.error(
                "Failed to create subject:",
                error
            );

            setErrorMessage(
                "Failed to create subject."
            );
        } finally {
            setCreating(false);
        }
    };

    // ====================================================
    // Delete course
    // ====================================================

    // const handleDeleteCourse = async (
    //     course: Course
    // ) => {
    //     const confirmed =
    //         window.confirm(
    //             `Delete "${course.name}"?`
    //         );

    //     if (!confirmed) return;

    //     try {
    //         clearMessages();

    //         await deleteCourse(course.id);

    //         if (courseId === course.id) {
    //             setCourseId("");
    //             setSemesterId("");
    //             setSubjectId("");
    //         }

    //         await loadCourses();

    //         setSuccessMessage(
    //             "Course deleted successfully."
    //         );
    //     } catch (error) {
    //         console.error(
    //             "Failed to delete course:",
    //             error
    //         );

    //         setErrorMessage(
    //             "Could not delete this course."
    //         );
    //     }
    // };

    // ====================================================
    // Delete semester
    // ====================================================

    // const handleDeleteSemester = async (
    //     semester: Semester
    // ) => {
    //     const confirmed =
    //         window.confirm(
    //             `Delete Semester ${semester.number}?`
    //         );

    //     if (!confirmed) return;

    //     try {
    //         clearMessages();

    //         await deleteSemester(
    //             semester.id
    //         );

    //         if (
    //             semesterId === semester.id
    //         ) {
    //             setSemesterId("");
    //             setSubjectId("");
    //         }

    //         await loadSemesters();

    //         setSuccessMessage(
    //             "Semester deleted successfully."
    //         );
    //     } catch (error) {
    //         console.error(
    //             "Failed to delete semester:",
    //             error
    //         );

    //         setErrorMessage(
    //             "Could not delete this semester."
    //         );
    //     }
    // };

    // ====================================================
    // Delete subject
    // ====================================================

    const handleDeleteSubject = async (
        subject: Subject
    ) => {
        const confirmed =
            window.confirm(
                `Delete "${subject.name}"?`
            );

        if (!confirmed) return;

        try {
            clearMessages();

            await deleteSubject(
                subject.id
            );

            if (
                subjectId === subject.id
            ) {
                setSubjectId("");
            }

            await loadSubjects();

            setSuccessMessage(
                "Subject deleted successfully."
            );
        } catch (error) {
            console.error(
                "Failed to delete subject:",
                error
            );

            setErrorMessage(
                "Could not delete this subject."
            );
        }
    };

    // ====================================================
    // File selection
    // ====================================================

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        clearMessages();

        const file =
            event.target.files?.[0];

        if (!file) {
            setSelectedFile(null);
            return;
        }

        if (
            file.type !==
            "application/pdf"
        ) {
            event.target.value = "";

            setSelectedFile(null);

            setErrorMessage(
                "Only PDF files are allowed."
            );

            return;
        }

        const maxSize =
            20 * 1024 * 1024;

        if (file.size > maxSize) {
            event.target.value = "";

            setSelectedFile(null);

            setErrorMessage(
                "PDF must be smaller than 20 MB."
            );

            return;
        }

        setSelectedFile(file);
    };

    // ====================================================
    // Upload study material
    // ====================================================

    const handleUpload = async () => {
        clearMessages();

        if (!subjectId) {
            setErrorMessage(
                "Please select a subject."
            );

            return;
        }

        if (!title.trim()) {
            setErrorMessage(
                "Please enter a title."
            );

            return;
        }

        if (!selectedFile) {
            setErrorMessage(
                "Please select a PDF file."
            );

            return;
        }

        const user =
            auth.currentUser;

        if (!user) {
            setErrorMessage(
                "You must be logged in to upload study material."
            );

            return;
        }

        try {
            setUploading(true);

            // ==================================================
            // 1. Upload PDF to Cloudinary
            // ==================================================

            const cloudinaryFile =
                await uploadFileToCloudinary(
                    selectedFile
                );

            // ==================================================
            // 2. Save metadata to Firestore
            // ==================================================

            await createStudyFile({
                title: title.trim(),

                description:
                    description.trim(),

                category,

                subjectId,

                fileUrl:
                    cloudinaryFile.secure_url,

                cloudinaryPublicId:
                    cloudinaryFile.public_id,

                fileType:
                    selectedFile.type,

                fileSize:
                    selectedFile.size,

                uploadedBy:
                    user.uid,
            });

            // ==================================================
            // Success
            // ==================================================

            setSuccessMessage(
                "Study material uploaded successfully."
            );

            setTitle("");
            setDescription("");
            setSelectedFile(null);
            setCategory("NOTES");

            const fileInput =
                document.getElementById(
                    "pdf-upload"
                ) as HTMLInputElement | null;

            if (fileInput) {
                fileInput.value = "";
            }
        } catch (error) {
            console.error(
                "Upload failed:",
                error
            );

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Upload failed. Please try again."
            );
        } finally {
            setUploading(false);
        }
    };

    // ====================================================
    // Render
    // ====================================================

    return (
        <main className="min-h-screen bg-[#F7F7F5] text-[#111111]">
            <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6">

                {/* HEADER */}

                <header className="mb-8">

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
                        <ArrowLeft size={17} />
                        Back
                    </button>

                    <div className="flex items-start justify-between gap-4">

                        <div>
                            <p className="text-sm font-medium text-[#4F7FC7]">
                                NotesRoom
                            </p>

                            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                                Admin Dashboard
                            </h1>

                            <p className="mt-2 text-sm text-[#777B7D]">
                                Manage your academic structure
                                and study material.
                            </p>
                        </div>

                        <div
                            className="
                hidden
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-[#E8F1FF]
                text-[#4F7FC7]
                sm:flex
              "
                        >
                            <GraduationCap size={23} />
                        </div>

                    </div>
                </header>

                <button
                    type="button"
                    onClick={() => navigate("/admin/pdf-maker")}
                    className="
    group
    flex
    w-full
    items-center
    gap-4
    rounded-[24px]
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
                        <FileImage
                            size={22}
                            strokeWidth={1.8}
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-[#111111]">
                            Image → PDF
                        </h3>

                        <p className="mt-1 text-sm text-[#777B7D]">
                            Convert images into a PDF
                        </p>
                    </div>
                </button>

                {/* SUCCESS */}

                {successMessage && (
                    <div
                        className="
              mb-5
              flex
              items-center
              gap-3
              rounded-2xl
              bg-white
              px-4
              py-3
              text-sm
              shadow-[0_2px_12px_rgba(15,23,42,0.04)]
            "
                    >
                        <CheckCircle2
                            size={19}
                            className="shrink-0 text-[#4F7FC7]"
                        />

                        <span>
                            {successMessage}
                        </span>
                    </div>
                )}

                {/* ERROR */}

                {errorMessage && (
                    <div
                        className="
              mb-5
              rounded-2xl
              bg-white
              px-4
              py-3
              text-sm
              text-red-600
              shadow-[0_2px_12px_rgba(15,23,42,0.04)]
            "
                    >
                        {errorMessage}
                    </div>
                )}

                {/* ==================================================
            ACADEMIC STRUCTURE
        ================================================== */}

                <section
                    className="
                    mt-3
            rounded-[28px]
            bg-white
            p-5
            shadow-[0_2px_16px_rgba(15,23,42,0.05)]
            sm:p-7
          "
                >

                    <div className="mb-6">

                        <div className="flex items-start justify-between gap-4">

                            <div>

                                <div
                                    className="
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
                                    <Layers3
                                        size={21}
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <h2 className="mt-4 text-xl font-semibold">
                                    Academic Structure
                                </h2>

                                <p className="mt-1 text-sm text-[#777B7D]">
                                    Create and manage courses,
                                    semesters and subjects.
                                </p>

                            </div>

                            <div
                                className="
                  hidden
                  items-center
                  gap-2
                  rounded-full
                  bg-[#F4F7FC]
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-[#4F7FC7]
                  sm:flex
                "
                            >
                                <GraduationCap size={15} />

                                {loadingCollege
                                    ? "Loading..."
                                    : college?.name ??
                                    "Thakur College"}
                            </div>

                        </div>

                    </div>

                    {/* MANAGEMENT GRID */}

                    <div className="grid gap-4 md:grid-cols-3">

                        <ManagementCard
                            icon={
                                <GraduationCap
                                    size={20}
                                    strokeWidth={1.8}
                                />
                            }
                            title="Courses"
                            description="Manage courses under Thakur College."
                            count={courses.length}
                            loading={loadingCourses}
                            onAdd={() =>
                                openModal("course")
                            }
                        />

                        <ManagementCard
                            icon={
                                <BookOpen
                                    size={20}
                                    strokeWidth={1.8}
                                />
                            }
                            title="Semesters"
                            description="Add semesters to the selected course."
                            count={semesters.length}
                            loading={loadingSemesters}
                            disabled={!courseId}
                            onAdd={() =>
                                openModal("semester")
                            }
                        />

                        <ManagementCard
                            icon={
                                <FileText
                                    size={20}
                                    strokeWidth={1.8}
                                />
                            }
                            title="Subjects"
                            description="Add subjects to the selected semester."
                            count={subjects.length}
                            loading={loadingSubjects}
                            disabled={!semesterId}
                            onAdd={() =>
                                openModal("subject")
                            }
                        />

                    </div>

                    {/* COURSE */}

                    <div className="mt-6">

                        <SelectField
                            label="Select Course"
                            value={courseId}
                            onChange={(value) => {
                                setCourseId(value);
                                setSemesterId("");
                                setSubjectId("");
                            }}
                            disabled={
                                loadingCourses ||
                                !college
                            }
                            placeholder={
                                loadingCourses
                                    ? "Loading courses..."
                                    : courses.length === 0
                                        ? "No courses available"
                                        : "Select course"
                            }
                            options={courses.map(
                                (course) => ({
                                    value: course.id,
                                    label: course.name,
                                })
                            )}
                        />

                    </div>

                    {/* SEMESTER */}

                    {courseId && (
                        <div className="mt-4">

                            <SelectField
                                label="Select Semester"
                                value={semesterId}
                                onChange={(value) => {
                                    setSemesterId(value);
                                    setSubjectId("");
                                }}
                                disabled={
                                    loadingSemesters
                                }
                                placeholder={
                                    loadingSemesters
                                        ? "Loading semesters..."
                                        : semesters.length === 0
                                            ? "No semesters available"
                                            : "Select semester"
                                }
                                options={semesters.map(
                                    (semester) => ({
                                        value: semester.id,
                                        label: `Semester ${semester.number}`,
                                    })
                                )}
                            />

                        </div>
                    )}

                    {/* SUBJECT LIST */}

                    {semesterId && (
                        <div className="mt-6">

                            <div className="mb-3 flex items-center justify-between">

                                <div>
                                    <h3 className="text-sm font-semibold">
                                        Subjects
                                    </h3>

                                    <p className="mt-0.5 text-xs text-[#777B7D]">
                                        Subjects inside the selected semester.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        openModal("subject")
                                    }
                                    className="
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-[#E8F1FF]
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    text-[#4F7FC7]
                    transition
                    hover:bg-[#DCEBFF]
                  "
                                >
                                    <Plus size={14} />
                                    Add Subject
                                </button>

                            </div>

                            {loadingSubjects ? (
                                <div
                                    className="
                    flex
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#FAFAF9]
                    py-8
                  "
                                >
                                    <Loader2
                                        size={20}
                                        className="animate-spin text-[#4F7FC7]"
                                    />
                                </div>
                            ) : subjects.length === 0 ? (
                                <div
                                    className="
                    rounded-2xl
                    bg-[#FAFAF9]
                    px-4
                    py-8
                    text-center
                  "
                                >
                                    <FileText
                                        size={24}
                                        className="mx-auto text-[#9CA3AF]"
                                    />

                                    <p className="mt-2 text-sm font-medium">
                                        No subjects yet
                                    </p>

                                    <p className="mt-1 text-xs text-[#777B7D]">
                                        Add the first subject for this semester.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">

                                    {subjects.map(
                                        (subject) => (
                                            <div
                                                key={subject.id}
                                                className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          rounded-2xl
                          border
                          border-[#EEF0F2]
                          bg-[#FAFAF9]
                          px-4
                          py-3
                        "
                                            >

                                                <div className="flex min-w-0 items-center gap-3">

                                                    <div
                                                        className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-[#E8F1FF]
                              text-[#4F7FC7]
                            "
                                                    >
                                                        <FileText size={17} />
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="truncate text-sm font-semibold">
                                                            {subject.name}
                                                        </p>

                                                        {subject.code && (
                                                            <p className="mt-0.5 text-xs text-[#777B7D]">
                                                                {subject.code}
                                                            </p>
                                                        )}

                                                    </div>

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteSubject(
                                                            subject
                                                        )
                                                    }
                                                    className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            text-[#9CA3AF]
                            transition
                            hover:bg-red-50
                            hover:text-red-500
                          "
                                                    aria-label={`Delete ${subject.name}`}
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                        </div>
                    )}

                </section>

                {/* ==================================================
            UPLOAD STUDY MATERIAL
        ================================================== */}

                <section
                    className="
            mt-6
            rounded-[28px]
            bg-white
            p-5
            shadow-[0_2px_16px_rgba(15,23,42,0.05)]
            sm:p-7
          "
                >

                    <div className="mb-7">

                        <div
                            className="
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
                            <Upload
                                size={21}
                                strokeWidth={1.8}
                            />
                        </div>

                        <h2 className="mt-4 text-xl font-semibold">
                            Upload Study Material
                        </h2>

                        <p className="mt-1 text-sm text-[#777B7D]">
                            Add study material for Thakur College.
                        </p>

                    </div>

                    {/* COLLEGE */}

                    <div>

                        <label className="mb-2 block text-sm font-medium">
                            College
                        </label>

                        <div
                            className="
                flex
                h-12
                items-center
                gap-3
                rounded-2xl
                border
                border-[#E5E7EB]
                bg-[#F4F7FC]
                px-4
              "
                        >
                            <GraduationCap
                                size={17}
                                className="text-[#4F7FC7]"
                            />

                            <span className="text-sm font-medium">
                                {loadingCollege
                                    ? "Loading..."
                                    : college?.name ??
                                    "Thakur College"}
                            </span>
                        </div>

                    </div>

                    {/* COURSE */}

                    <div className="mt-5">

                        <SelectField
                            label="Course"
                            value={courseId}
                            onChange={(value) => {
                                setCourseId(value);
                                setSemesterId("");
                                setSubjectId("");
                            }}
                            disabled={
                                loadingCourses ||
                                !college
                            }
                            placeholder={
                                loadingCourses
                                    ? "Loading courses..."
                                    : "Select course"
                            }
                            options={courses.map(
                                (course) => ({
                                    value: course.id,
                                    label: course.name,
                                })
                            )}
                        />

                    </div>

                    {/* SEMESTER */}

                    <div className="mt-5">

                        <SelectField
                            label="Semester"
                            value={semesterId}
                            onChange={(value) => {
                                setSemesterId(value);
                                setSubjectId("");
                            }}
                            disabled={
                                !courseId ||
                                loadingSemesters
                            }
                            placeholder={
                                loadingSemesters
                                    ? "Loading semesters..."
                                    : "Select semester"
                            }
                            options={semesters.map(
                                (semester) => ({
                                    value: semester.id,
                                    label: `Semester ${semester.number}`,
                                })
                            )}
                        />

                    </div>

                    {/* SUBJECT */}

                    <div className="mt-5">

                        <SelectField
                            label="Subject"
                            value={subjectId}
                            onChange={setSubjectId}
                            disabled={
                                !semesterId ||
                                loadingSubjects
                            }
                            placeholder={
                                loadingSubjects
                                    ? "Loading subjects..."
                                    : "Select subject"
                            }
                            options={subjects.map(
                                (subject) => ({
                                    value: subject.id,
                                    label: subject.code
                                        ? `${subject.name} (${subject.code})`
                                        : subject.name,
                                })
                            )}
                        />

                    </div>

                    {/* CATEGORY */}

                    <div className="mt-5">

                        <label className="mb-2 block text-sm font-medium">
                            Category
                        </label>

                        <select
                            value={category}
                            onChange={(event) =>
                                setCategory(
                                    event.target.value as FileCategory
                                )
                            }
                            disabled={uploading}
                            className="
                h-12
                w-full
                rounded-2xl
                border
                border-[#E5E7EB]
                bg-[#FAFAF9]
                px-4
                text-sm
                outline-none
                transition
                focus:border-[#4F7FC7]
                focus:ring-2
                focus:ring-[#E8F1FF]
                disabled:cursor-not-allowed
                disabled:opacity-60
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

                    {/* TITLE */}

                    <div className="mt-5">

                        <label className="mb-2 block text-sm font-medium">
                            Title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            disabled={uploading}
                            placeholder="e.g. Operating System Unit 1 Notes"
                            className="
                h-12
                w-full
                rounded-2xl
                border
                border-[#E5E7EB]
                bg-[#FAFAF9]
                px-4
                text-sm
                outline-none
                transition
                placeholder:text-[#9CA3AF]
                focus:border-[#4F7FC7]
                focus:ring-2
                focus:ring-[#E8F1FF]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
                        />

                    </div>

                    {/* DESCRIPTION */}

                    <div className="mt-5">

                        <label className="mb-2 block text-sm font-medium">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            disabled={uploading}
                            rows={4}
                            placeholder="Add a short description..."
                            className="
                w-full
                resize-none
                rounded-2xl
                border
                border-[#E5E7EB]
                bg-[#FAFAF9]
                px-4
                py-3
                text-sm
                outline-none
                transition
                placeholder:text-[#9CA3AF]
                focus:border-[#4F7FC7]
                focus:ring-2
                focus:ring-[#E8F1FF]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
                        />

                    </div>

                    {/* PDF */}

                    <div className="mt-5">

                        <label className="mb-2 block text-sm font-medium">
                            PDF File
                        </label>

                        <label
                            htmlFor="pdf-upload"
                            className="
                flex
                cursor-pointer
                flex-col
                items-center
                justify-center
                rounded-[22px]
                border
                border-dashed
                border-[#D7DCE2]
                bg-[#FAFAF9]
                px-5
                py-8
                text-center
                transition
                hover:border-[#4F7FC7]
                hover:bg-[#F8FBFF]
              "
                        >

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
                                <FileText size={22} />
                            </div>

                            {selectedFile ? (
                                <>
                                    <p className="mt-3 max-w-full truncate px-2 text-sm font-semibold">
                                        {selectedFile.name}
                                    </p>

                                    <p className="mt-1 text-xs text-[#777B7D]">
                                        {(
                                            selectedFile.size /
                                            (1024 * 1024)
                                        ).toFixed(2)}{" "}
                                        MB
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="mt-3 text-sm font-semibold">
                                        Choose a PDF file
                                    </p>

                                    <p className="mt-1 text-xs text-[#777B7D]">
                                        PDF files only • Maximum 20 MB
                                    </p>
                                </>
                            )}

                            <input
                                id="pdf-upload"
                                type="file"
                                accept="application/pdf,.pdf"
                                className="hidden"
                                disabled={uploading}
                                onChange={
                                    handleFileChange
                                }
                            />

                        </label>

                    </div>

                    {/* UPLOAD BUTTON */}

                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={
                            uploading ||
                            !subjectId ||
                            !college
                        }
                        className="
              mt-6
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-[#111111]
              px-5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#242424]
              active:scale-[0.99]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
                    >

                        {uploading ? (
                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />

                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload size={18} />

                                Upload Study Material
                            </>
                        )}

                    </button>

                </section>

            </div>

            {/* ====================================================
          MODAL
      ==================================================== */}

            {modal && (
                <div
                    className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/40
            px-4
            backdrop-blur-sm
          "
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeModal();
                        }
                    }}
                >

                    <div
                        className="
              w-full
              max-w-md
              rounded-[28px]
              bg-white
              p-6
              shadow-[0_20px_60px_rgba(0,0,0,0.18)]
            "
                    >

                        {/* MODAL HEADER */}

                        <div className="flex items-start justify-between gap-4">

                            <div>

                                <div
                                    className="
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

                                    {modal === "course" && (
                                        <GraduationCap size={21} />
                                    )}

                                    {modal === "semester" && (
                                        <BookOpen size={21} />
                                    )}

                                    {modal === "subject" && (
                                        <FileText size={21} />
                                    )}

                                </div>

                                <h2 className="mt-4 text-xl font-semibold">

                                    {modal === "course" &&
                                        "Add Course"}

                                    {modal === "semester" &&
                                        "Add Semester"}

                                    {modal === "subject" &&
                                        "Add Subject"}

                                </h2>

                                <p className="mt-1 text-sm text-[#777B7D]">

                                    {modal === "course" &&
                                        "Create a new course for Thakur College."}

                                    {modal === "semester" &&
                                        "Add a semester to the selected course."}

                                    {modal === "subject" &&
                                        "Add a subject to the selected semester."}

                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={creating}
                                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-[#777B7D]
                  transition
                  hover:bg-[#F4F4F2]
                  hover:text-[#111111]
                "
                            >
                                <X size={18} />
                            </button>

                        </div>

                        {/* COURSE FORM */}

                        {modal === "course" && (
                            <div className="mt-6">

                                <label className="mb-2 block text-sm font-medium">
                                    Course Name
                                </label>

                                <input
                                    autoFocus
                                    type="text"
                                    value={courseName}
                                    onChange={(event) =>
                                        setCourseName(
                                            event.target.value
                                        )
                                    }
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter"
                                        ) {
                                            handleCreateCourse();
                                        }
                                    }}
                                    placeholder="e.g. B.Sc Computer Science"
                                    className="
                    h-12
                    w-full
                    rounded-2xl
                    border
                    border-[#E5E7EB]
                    bg-[#FAFAF9]
                    px-4
                    text-sm
                    outline-none
                    focus:border-[#4F7FC7]
                    focus:ring-2
                    focus:ring-[#E8F1FF]
                  "
                                />

                                <div className="mt-4 flex gap-3">

                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={creating}
                                        className="
                      h-11
                      flex-1
                      rounded-2xl
                      border
                      border-[#E5E7EB]
                      text-sm
                      font-semibold
                    "
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleCreateCourse
                                        }
                                        disabled={creating}
                                        className="
                      flex
                      h-11
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      bg-[#111111]
                      text-sm
                      font-semibold
                      text-white
                      disabled:opacity-50
                    "
                                    >

                                        {creating && (
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                        )}

                                        Create Course

                                    </button>

                                </div>

                            </div>
                        )}

                        {/* SEMESTER FORM */}

                        {modal === "semester" && (
                            <div className="mt-6">

                                <div
                                    className="
                    mb-4
                    rounded-2xl
                    bg-[#F4F7FC]
                    px-4
                    py-3
                    text-sm
                  "
                                >
                                    <span className="text-[#777B7D]">
                                        Course
                                    </span>

                                    <p className="mt-1 font-semibold">
                                        {courses.find(
                                            (course) =>
                                                course.id ===
                                                courseId
                                        )?.name ??
                                            "Selected course"}
                                    </p>
                                </div>

                                <label className="mb-2 block text-sm font-medium">
                                    Semester Number
                                </label>

                                <input
                                    autoFocus
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={semesterNumber}
                                    onChange={(event) =>
                                        setSemesterNumber(
                                            event.target.value
                                        )
                                    }
                                    placeholder="e.g. 1"
                                    className="
                    h-12
                    w-full
                    rounded-2xl
                    border
                    border-[#E5E7EB]
                    bg-[#FAFAF9]
                    px-4
                    text-sm
                    outline-none
                    focus:border-[#4F7FC7]
                    focus:ring-2
                    focus:ring-[#E8F1FF]
                  "
                                />

                                <div className="mt-4 flex gap-3">

                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={creating}
                                        className="
                      h-11
                      flex-1
                      rounded-2xl
                      border
                      border-[#E5E7EB]
                      text-sm
                      font-semibold
                    "
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleCreateSemester
                                        }
                                        disabled={creating}
                                        className="
                      flex
                      h-11
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      bg-[#111111]
                      text-sm
                      font-semibold
                      text-white
                      disabled:opacity-50
                    "
                                    >

                                        {creating && (
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                        )}

                                        Create Semester

                                    </button>

                                </div>

                            </div>
                        )}

                        {/* SUBJECT FORM */}

                        {modal === "subject" && (
                            <div className="mt-6">

                                <div
                                    className="
                    mb-4
                    rounded-2xl
                    bg-[#F4F7FC]
                    px-4
                    py-3
                    text-sm
                  "
                                >
                                    <span className="text-[#777B7D]">
                                        Semester
                                    </span>

                                    <p className="mt-1 font-semibold">
                                        {semesters.find(
                                            (semester) =>
                                                semester.id ===
                                                semesterId
                                        )
                                            ? `Semester ${semesters.find(
                                                (semester) =>
                                                    semester.id ===
                                                    semesterId
                                            )?.number
                                            }`
                                            : "Selected semester"}
                                    </p>
                                </div>

                                <label className="mb-2 block text-sm font-medium">
                                    Subject Name
                                </label>

                                <input
                                    autoFocus
                                    type="text"
                                    value={subjectName}
                                    onChange={(event) =>
                                        setSubjectName(
                                            event.target.value
                                        )
                                    }
                                    placeholder="e.g. Operating Systems"
                                    className="
                    h-12
                    w-full
                    rounded-2xl
                    border
                    border-[#E5E7EB]
                    bg-[#FAFAF9]
                    px-4
                    text-sm
                    outline-none
                    focus:border-[#4F7FC7]
                    focus:ring-2
                    focus:ring-[#E8F1FF]
                  "
                                />

                                <label className="mb-2 mt-4 block text-sm font-medium">
                                    Subject Code
                                    <span className="ml-1 text-[#9CA3AF]">
                                        (optional)
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    value={subjectCode}
                                    onChange={(event) =>
                                        setSubjectCode(
                                            event.target.value
                                        )
                                    }
                                    placeholder="e.g. CS401"
                                    className="
                    h-12
                    w-full
                    rounded-2xl
                    border
                    border-[#E5E7EB]
                    bg-[#FAFAF9]
                    px-4
                    text-sm
                    uppercase
                    outline-none
                    focus:border-[#4F7FC7]
                    focus:ring-2
                    focus:ring-[#E8F1FF]
                  "
                                />

                                <div className="mt-4 flex gap-3">

                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={creating}
                                        className="
                      h-11
                      flex-1
                      rounded-2xl
                      border
                      border-[#E5E7EB]
                      text-sm
                      font-semibold
                    "
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleCreateSubject
                                        }
                                        disabled={creating}
                                        className="
                      flex
                      h-11
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      bg-[#111111]
                      text-sm
                      font-semibold
                      text-white
                      disabled:opacity-50
                    "
                                    >

                                        {creating && (
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                        )}

                                        Create Subject

                                    </button>

                                </div>

                            </div>
                        )}

                    </div>

                </div>
            )}

        </main>
    );
}

// ======================================================
// Management Card
// ======================================================

interface ManagementCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    count: number;
    loading?: boolean;
    disabled?: boolean;
    onAdd: () => void;
}

function ManagementCard({
    icon,
    title,
    description,
    count,
    loading = false,
    disabled = false,
    onAdd,
}: ManagementCardProps) {
    return (
        <div
            className={`
        rounded-[24px]
        border
        border-[#EEF0F2]
        bg-[#FAFAF9]
        p-4
        transition
        ${disabled
                    ? "opacity-50"
                    : "hover:border-[#DDE7F5]"
                }
      `}
        >

            <div className="flex items-start justify-between">

                <div
                    className="
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
                    {icon}
                </div>

                <span
                    className="
            rounded-full
            bg-white
            px-2.5
            py-1
            text-xs
            font-semibold
            text-[#777B7D]
          "
                >
                    {loading ? "..." : count}
                </span>

            </div>

            <h3 className="mt-4 text-sm font-semibold">
                {title}
            </h3>

            <p className="mt-1 min-h-[40px] text-xs leading-5 text-[#777B7D]">
                {description}
            </p>

            <button
                type="button"
                onClick={onAdd}
                disabled={disabled}
                className="
          mt-4
          flex
          w-full
          items-center
          justify-center
          gap-1.5
          rounded-xl
          bg-[#111111]
          px-3
          py-2.5
          text-xs
          font-semibold
          text-white
          transition
          hover:bg-[#242424]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
            >
                <Plus size={14} />
                Add {title.slice(0, -1)}
            </button>

        </div>
    );
}

// ======================================================
// Select Field
// ======================================================

interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder: string;
    options: {
        value: string;
        label: string;
    }[];
}

function SelectField({
    label,
    value,
    onChange,
    disabled = false,
    placeholder,
    options,
}: SelectFieldProps) {
    return (
        <div>

            <label className="mb-2 block text-sm font-medium">
                {label}
            </label>

            <div className="relative">

                <select
                    value={value}
                    onChange={(event) =>
                        onChange(
                            event.target.value
                        )
                    }
                    disabled={disabled}
                    className="
            h-12
            w-full
            appearance-none
            rounded-2xl
            border
            border-[#E5E7EB]
            bg-[#FAFAF9]
            px-4
            pr-10
            text-sm
            outline-none
            transition
            focus:border-[#4F7FC7]
            focus:ring-2
            focus:ring-[#E8F1FF]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
                >

                    <option value="">
                        {placeholder}
                    </option>

                    {options.map(
                        (option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        )
                    )}

                </select>

                <ChevronRight
                    size={16}
                    className="
            pointer-events-none
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            rotate-90
            text-[#9CA3AF]
          "
                />

            </div>

        </div>
    );
}