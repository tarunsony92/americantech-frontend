import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  HiChevronDown,
  HiChevronRight,
} from "react-icons/hi";
import courseService from "../services/courseService";

/**
 * Convert different YouTube URL formats into a YouTube embed URL,
 * with params that minimize YouTube branding as much as YouTube allows:
 * - modestbranding: smaller YouTube logo
 * - rel=0: don't show related videos from other channels at the end
 * - iv_load_policy=3: hide video annotations
 * - controls=1: keep native controls (needed, since YT blocks custom overlays)
 *
 * Note: YouTube's own ToS does not allow fully hiding their branding —
 * this is the closest a plain iframe embed can get.
 *
 * Supported:
 * https://www.youtube.com/watch?v=VIDEO_ID
 * https://youtu.be/VIDEO_ID
 * https://www.youtube.com/embed/VIDEO_ID
 * https://www.youtube.com/shorts/VIDEO_ID
 */
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    const hostname = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname;

    let videoId = null;

    // youtube.com/watch?v=VIDEO_ID
    if (
      (hostname === "youtube.com" ||
        hostname === "www.youtube.com" ||
        hostname === "m.youtube.com") &&
      pathname === "/watch"
    ) {
      videoId = parsedUrl.searchParams.get("v");
    }

    // youtu.be/VIDEO_ID
    if (
      hostname === "youtu.be" ||
      hostname === "www.youtu.be"
    ) {
      videoId = pathname.substring(1).split("/")[0];
    }

    // youtube.com/embed/VIDEO_ID
    if (
      (hostname === "youtube.com" ||
        hostname === "www.youtube.com") &&
      pathname.startsWith("/embed/")
    ) {
      videoId = pathname
        .split("/embed/")[1]
        ?.split("/")[0];
    }

    // youtube.com/shorts/VIDEO_ID
    if (
      (hostname === "youtube.com" ||
        hostname === "www.youtube.com") &&
      pathname.startsWith("/shorts/")
    ) {
      videoId = pathname
        .split("/shorts/")[1]
        ?.split("/")[0];
    }

    if (!videoId) {
      return null;
    }

    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      iv_load_policy: "3",
      controls: "1",
      playsinline: "1",
    });

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  } catch (error) {
    // Not a valid absolute URL (e.g. relative path to an uploaded file) —
    // expected for self-hosted videos, not an error.
    return null;
  }
};

/**
 * Guess the video MIME type from a file extension so the <source>
 * tag doesn't always assume mp4 (which breaks webm/ogg/mov files).
 */
const getVideoMimeType = (url) => {
  if (!url) return "video/mp4";

  const cleanUrl = url.split("?")[0].toLowerCase();
  const ext = cleanUrl.split(".").pop();

  const mimeMap = {
    mp4: "video/mp4",
    webm: "video/webm",
    ogg: "video/ogg",
    ogv: "video/ogg",
    mov: "video/quicktime",
    m4v: "video/mp4",
  };

  return mimeMap[ext] || "video/mp4";
};

const CourseLearn = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const selectedLessonId = searchParams.get("lesson");

  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [openModuleId, setOpenModuleId] = useState(null);

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  /*
   * Load course content
   */
  useEffect(() => {
    if (!id) {
      setError("Course ID is missing.");
      setStatus("error");
      return;
    }

    let isMounted = true;

    setStatus("loading");
    setError(null);

    courseService
      .getContent(id)
      .then(({ data }) => {
        if (!isMounted) return;

        const courseData = data?.data;

        if (!courseData) {
          throw new Error("Course data not found.");
        }

        setCourse(courseData);

        const modules = courseData.modules || [];

        let selectedLesson = null;
        let selectedModule = null;

        /*
         * If URL contains:
         *
         * ?lesson=LESSON_ID
         *
         * find that exact lesson.
         */
        if (selectedLessonId) {
          for (const module of modules) {
            const lesson = module.lessons?.find(
              (item) =>
                String(item.id) ===
                String(selectedLessonId)
            );

            if (lesson) {
              selectedLesson = lesson;
              selectedModule = module;
              break;
            }
          }
        }

        /*
         * If no lesson was selected (either no ?lesson param,
         * or the given lesson id no longer exists), fall back
         * to the first lesson of the first module.
         */
        if (!selectedLesson) {
          selectedModule = modules[0] || null;
          selectedLesson =
            selectedModule?.lessons?.[0] || null;
        }

        setActiveLesson(selectedLesson);
        setOpenModuleId(selectedModule?.id || null);
        setStatus("success");
      })
      .catch((err) => {
        if (!isMounted) return;

        console.error("Course content error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Couldn't load course content."
        );

        setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, [id, selectedLessonId]);

  /*
   * Open / close module
   */
  const toggleModule = (module) => {
    setOpenModuleId((prev) =>
      prev === module.id ? null : module.id
    );
  };

  /*
   * Select lesson
   */
  const selectLesson = (module, lesson) => {
    setOpenModuleId(module.id);
    setActiveLesson(lesson);
  };

  /*
   * Loading
   */
  if (status === "loading") {
    return (
      <div className="mt-6">
        <p className="text-slate-500">
          Loading course...
        </p>
      </div>
    );
  }

  /*
   * Error
   */
  if (status === "error") {
    return (
      <div className="mt-6">
        <Link
          to="/my-courses"
          className="text-sm text-primary-600 hover:underline"
        >
          ← Back to My Courses
        </Link>

        <p className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const modules = course.modules || [];

  const youtubeEmbedUrl = getYouTubeEmbedUrl(
    activeLesson?.videoUrl
  );

  // TEMP DEBUG — remove once video issue is confirmed fixed
  console.log("activeLesson.videoUrl:", activeLesson?.videoUrl);
  console.log("computed youtubeEmbedUrl:", youtubeEmbedUrl);

  return (
    <>
      <Helmet>
        <title>
          {course.title} | American FutureTech
        </title>
      </Helmet>

      {/* Back to Modules */}
      <Link
        to={`/dashboard/courses/${course.id}/modules`}
        className="text-sm text-primary-600 hover:underline"
      >
        ← Back to Modules
      </Link>

      {/* Course Title */}
      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
        {course.title}
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* =====================================================
            VIDEO + LESSON CONTENT
        ====================================================== */}
        <div className="lg:col-span-2">
          {/* =========================
              VIDEO
          ========================== */}
          {youtubeEmbedUrl ? (
            /*
             * YouTube video — branding minimized as much as
             * YouTube's embed API allows (no related videos,
             * smaller logo, no annotations).
             */
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe
                key={youtubeEmbedUrl}
                src={youtubeEmbedUrl}
                title={
                  activeLesson?.title ||
                  "Course video"
                }
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : activeLesson?.videoUrl ? (
            /*
             * Self-hosted video file — fully custom player.
             */
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <video
                key={activeLesson.id}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full"
              >
                <source
                  src={activeLesson.videoUrl}
                  type={getVideoMimeType(
                    activeLesson.videoUrl
                  )}
                />
                Your browser does not support
                the video tag.
              </video>
            </div>
          ) : (
            /*
             * No video
             */
            <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              <p className="text-slate-500">
                No video available for this lesson.
              </p>
            </div>
          )}

          {/* =========================
              ACTIVE LESSON CONTENT
          ========================== */}
          {activeLesson && (
            <div className="card mt-4 p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {activeLesson.title}
              </h2>

              {activeLesson.content && (
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {activeLesson.content}
                </p>
              )}
            </div>
          )}

          {/* No lesson */}
          {!activeLesson && (
            <div className="card mt-4 p-5">
              <p className="text-sm text-slate-500">
                Select a lesson to start learning.
              </p>
            </div>
          )}
        </div>

        {/* =====================================================
            MODULES + LESSONS
        ====================================================== */}
        <div className="card overflow-hidden p-0">
          {/* Sidebar Header */}
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Course Content
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {modules.length}{" "}
              {modules.length === 1
                ? "module"
                : "modules"}
            </p>
          </div>

          {/* Modules */}
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {modules.length === 0 ? (
              <p className="p-5 text-sm text-slate-500">
                No modules available.
              </p>
            ) : (
              modules.map((module, index) => {
                const isOpen =
                  openModuleId === module.id;

                const lessons =
                  module.lessons || [];

                return (
                  <div key={module.id}>
                    {/* =========================
                        MODULE HEADER
                    ========================== */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleModule(module)
                      }
                      className="flex w-full items-center justify-between px-4 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-primary-600">
                          Module {index + 1}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {module.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {lessons.length}{" "}
                          {lessons.length === 1
                            ? "lesson"
                            : "lessons"}
                        </p>
                      </div>

                      {isOpen ? (
                        <HiChevronDown className="ml-3 h-5 w-5 flex-shrink-0 text-slate-400" />
                      ) : (
                        <HiChevronRight className="ml-3 h-5 w-5 flex-shrink-0 text-slate-400" />
                      )}
                    </button>

                    {/* =========================
                        LESSON LIST
                    ========================== */}
                    {isOpen && (
                      <div className="bg-slate-50 px-2 pb-2 dark:bg-slate-900/50">
                        {lessons.length === 0 ? (
                          <p className="px-3 py-3 text-sm text-slate-500">
                            No lessons available.
                          </p>
                        ) : (
                          lessons.map(
                            (
                              lesson,
                              lessonIndex
                            ) => {
                              const isActive =
                                activeLesson?.id ===
                                lesson.id;

                              return (
                                <button
                                  key={lesson.id}
                                  type="button"
                                  onClick={() =>
                                    selectLesson(
                                      module,
                                      lesson
                                    )
                                  }
                                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                                    isActive
                                      ? "bg-primary-600 text-white"
                                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                  }`}
                                >
                                  {/* Play icon */}
                                  <div
                                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                                      isActive
                                        ? "bg-white/20 text-white"
                                        : "bg-primary-100 text-primary-600 dark:bg-primary-950"
                                    }`}
                                  >
                                    <span className="text-[10px]">
                                      ▶
                                    </span>
                                  </div>

                                  {/* Lesson title */}
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate">
                                      {lessonIndex +
                                        1}
                                      .{" "}
                                      {
                                        lesson.title
                                      }
                                    </span>

                                    {lesson.duration && (
                                      <span
                                        className={`mt-1 block text-xs ${
                                          isActive
                                            ? "text-white/70"
                                            : "text-slate-500"
                                        }`}
                                      >
                                        {
                                          lesson.duration
                                        }
                                      </span>
                                    )}
                                  </span>
                                </button>
                              );
                            }
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseLearn;