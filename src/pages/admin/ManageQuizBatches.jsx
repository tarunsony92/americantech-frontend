    import { useEffect, useState } from "react";
    import { Helmet } from "react-helmet-async";
    import { useNavigate } from "react-router-dom";

    import courseService from "../../services/courseService";
    import batchService from "../../services/batchService";

    const ManageQuizBatches = () => {
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    const [selectedCourse, setSelectedCourse] = useState(null);

    const [batches, setBatches] = useState([]);
    const [loadingBatches, setLoadingBatches] = useState(false);

    const [error, setError] = useState("");

    // =========================================================
    // STEP 1: LOAD COURSES
    // =========================================================

    useEffect(() => {
        setLoadingCourses(true);
        setError("");

        courseService
        .list({
            page: 1,
            limit: 1000,
        })
        .then(({ data }) => {
            const items =
            data.data?.items ||
            data.items ||
            [];

            setCourses(items);
        })
        .catch((err) => {
            console.error(
            "Failed to load courses:",
            err
            );

            setCourses([]);

            setError(
            err?.response?.data?.message ||
                "Failed to load courses."
            );
        })
        .finally(() => {
            setLoadingCourses(false);
        });
    }, []);

    // =========================================================
    // STEP 2: LOAD BATCHES OF SELECTED COURSE
    // =========================================================

    useEffect(() => {
        if (!selectedCourse) {
        setBatches([]);
        return;
        }

        setLoadingBatches(true);
        setError("");

        batchService
        .list({
            page: 1,
            limit: 1000,
            courseId: selectedCourse.id,
        })
        .then(({ data }) => {
            const items =
            data.data?.items ||
            data.items ||
            [];

            setBatches(items);
        })
        .catch((err) => {
            console.error(
            "Failed to load batches:",
            err
            );

            setBatches([]);

            setError(
            err?.response?.data?.message ||
                "Failed to load batches."
            );
        })
        .finally(() => {
            setLoadingBatches(false);
        });
    }, [selectedCourse]);

    // =========================================================
    // SELECT COURSE
    // =========================================================

    const handleSelectCourse = (course) => {
        setError("");
        setSelectedCourse(course);
        setBatches([]);
    };

    // =========================================================
    // BACK TO COURSES
    // =========================================================

    const handleBackToCourses = () => {
        setSelectedCourse(null);
        setBatches([]);
        setError("");
    };

    // =========================================================
    // OPEN BATCH QUIZZES
    // =========================================================

    const handleOpenBatchQuizzes = (batch) => {
       navigate(`/admin/quizzes/${batch.id}`)
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <>
        <Helmet>
            <title>
            {selectedCourse
                ? `${selectedCourse.title} - Quiz Batches | Admin`
                : "Manage Quizzes | Admin"}
            </title>
        </Helmet>

        <div className="max-w-6xl mx-auto">
            {/* =================================================
                STEP 1 — COURSE SELECTION
            ================================================= */}

            {!selectedCourse && (
            <>
                <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Manage Quizzes
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Select a course to view its batches
                    and manage quizzes.
                </p>
                </div>

                {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
                )}

                {loadingCourses ? (
                <div className="py-10 text-center text-sm text-slate-500">
                    Loading courses...
                </div>
                ) : courses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                    <p className="text-sm text-slate-500">
                    No courses found.
                    </p>
                </div>
                ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                    <button
                        key={course.id}
                        type="button"
                        onClick={() =>
                        handleSelectCourse(course)
                        }
                        className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md"
                    >
                        <h2 className="line-clamp-2 font-semibold text-slate-800">
                        {course.title}
                        </h2>

                        <p className="mt-2 text-xs text-slate-500">
                        Course ID: {course.id}
                        </p>

                        <div className="mt-4 text-sm font-semibold text-primary-600">
                        View Batches →
                        </div>
                    </button>
                    ))}
                </div>
                )}
            </>
            )}

            {/* =================================================
                STEP 2 — BATCH SELECTION
            ================================================= */}

            {selectedCourse && (
            <>
                <button
                type="button"
                onClick={handleBackToCourses}
                className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-primary"
                >
                ← Back to Courses
                </button>

                <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Select Batch
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Course:{" "}
                    <span className="font-medium text-slate-700">
                    {selectedCourse.title}
                    </span>
                </p>
                </div>

                {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
                )}

                {loadingBatches ? (
                <div className="py-10 text-center text-sm text-slate-500">
                    Loading batches...
                </div>
                ) : batches.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                    <p className="text-sm text-slate-500">
                    No batches found for this course.
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                    Create a batch first.
                    </p>
                </div>
                ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {batches.map((batch) => (
                    <div
                        key={batch.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
                    >
                        <h2 className="line-clamp-2 font-semibold text-slate-800">
                        {batch.name}
                        </h2>

                        <div className="mt-2 space-y-1">
                        <p className="text-xs text-slate-500">
                            Batch ID: {batch.id}
                        </p>

                        <p className="text-xs text-slate-500">
                            Status:{" "}
                            <span className="font-medium text-slate-700">
                            {batch.status}
                            </span>
                        </p>
                        </div>

                        <button
                        type="button"
                        onClick={() =>
                            handleOpenBatchQuizzes(
                            batch
                            )
                        }
                        className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                        >
                        Manage Quizzes
                        </button>
                    </div>
                    ))}
                </div>
                )}
            </>
            )}
        </div>
        </>
    );
    };

    export default ManageQuizBatches;