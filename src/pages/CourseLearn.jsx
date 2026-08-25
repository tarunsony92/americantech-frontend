import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  HiChevronDown,
  HiChevronRight,
  HiDownload,
  HiDocumentText,
  HiOutlineArrowLeft,
  HiCheckCircle,
  HiPlay,
  HiPause,
  HiVolumeUp,
  HiVolumeOff,
  HiArrowsExpand,
  HiOutlineBookOpen,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

import courseService from "../services/courseService";
import lessonNoteService from "../services/lessonNoteService";
import { buildFileUrl } from "../utils/fileUrl";

/* =========================================================
   YOUTUBE ID EXTRACTOR
========================================================= */

const getYouTubeVideoId = (url) => {
  if (!url) return null;

  const regex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?/\s]{11})/i;

  const match = url.match(regex);

  return match ? match[1] : null;
};

/* =========================================================
   SELF HOSTED VIDEO MIME TYPE
========================================================= */

const getVideoMimeType = (url) => {
  if (!url) return "video/mp4";

  const ext = url
    .split("?")[0]
    .split("#")[0]
    .split(".")
    .pop()
    ?.toLowerCase();

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

/* =========================================================
   TIME FORMATTER
========================================================= */

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(secs).padStart(2, "0")}`;
};

/* =========================================================
   LOAD YOUTUBE IFRAME API
========================================================= */

const loadYouTubeAPI = () => {
  return new Promise((resolve, reject) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }

    if (window.__youtubeApiPromise) {
      window.__youtubeApiPromise.then(resolve).catch(reject);
      return;
    }

    window.__youtubeApiPromise = new Promise((resolveAPI, rejectAPI) => {
      const prevCallback = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === "function") prevCallback();

        if (window.YT?.Player) {
          resolveAPI(window.YT);
        } else {
          rejectAPI(new Error("YouTube API failed to load."));
        }
      };

      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");

        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;

        script.onerror = () =>
          rejectAPI(new Error("Failed to inject YouTube API script."));

        document.head.appendChild(script);
      }
    });

    window.__youtubeApiPromise.then(resolve).catch(reject);
  });
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const CourseLearn = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedLessonId = searchParams.get("lesson");

  /* =======================================================
     COURSE STATE
  ======================================================== */

  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [openModuleId, setOpenModuleId] = useState(null);

  const [completedLessonIds, setCompletedLessonIds] = useState(() => {
    try {
      const stored = localStorage.getItem(`course-progress-${id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  /* =======================================================
     NOTES STATE
  ======================================================== */

  const [lessonNotes, setLessonNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);

  /* =======================================================
     PLAYER REFS
  ======================================================== */

  const playerWrapperRef = useRef(null);
  const youtubeContainerRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const youtubeProgressTimerRef = useRef(null);
  const controlsHideTimerRef = useRef(null);
  const isSeekingRef = useRef(false);

  /* =======================================================
     CUSTOM CONTROLS STATE
  ======================================================== */

  const [youtubeReady, setYoutubeReady] = useState(false);
  const [youtubePlaying, setYoutubePlaying] = useState(false);
  const [youtubeCurrentTime, setYoutubeCurrentTime] = useState(0);
  const [youtubeDuration, setYoutubeDuration] = useState(0);
  const [youtubeVolume, setYoutubeVolume] = useState(100);
  const [youtubeMuted, setYoutubeMuted] = useState(false);
  const [youtubeSpeed, setYoutubeSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const youtubeVideoId = useMemo(
    () => getYouTubeVideoId(activeLesson?.videoUrl),
    [activeLesson?.videoUrl]
  );

  /* =======================================================
     FETCH COURSE CONTENT
  ======================================================== */

  useEffect(() => {
    if (!id) {
      setError("Course ID missing.");
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

        if (!courseData) throw new Error("Course content not found.");

        setCourse(courseData);

        const modules = courseData.modules || [];

        let currentLesson = null;
        let currentModule = null;

        if (selectedLessonId) {
          for (const mod of modules) {
            const lesson = mod.lessons?.find(
              (item) => String(item.id) === String(selectedLessonId)
            );

            if (lesson) {
              currentLesson = lesson;
              currentModule = mod;
              break;
            }
          }
        }

        if (!currentLesson) {
          currentModule = modules[0] || null;
          currentLesson = currentModule?.lessons?.[0] || null;
        }

        setActiveLesson(currentLesson);
        setActiveModule(currentModule);
        setOpenModuleId(currentModule?.id || null);

        setStatus("success");
      })
      .catch((err) => {
        if (!isMounted) return;

        console.error("Course fetch error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load course materials."
        );

        setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, [id, selectedLessonId]);

  /* =======================================================
     FETCH LESSON NOTES
  ======================================================== */

  useEffect(() => {
    if (!activeLesson?.id) {
      setLessonNotes([]);
      setNotesLoading(false);
      return;
    }

    let isMounted = true;

    setNotesLoading(true);

    lessonNoteService
      .list(activeLesson.id)
      .then(({ data }) => {
        if (isMounted) setLessonNotes(data?.data || []);
      })
      .catch((err) => {
        console.error("Notes error:", err);

        if (isMounted) setLessonNotes([]);
      })
      .finally(() => {
        if (isMounted) setNotesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeLesson?.id]);

  /* =======================================================
     PROGRESS HANDLER
  ======================================================== */

  const markLessonComplete = useCallback(
    (lessonId) => {
      setCompletedLessonIds((prev) => {
        if (prev.includes(lessonId)) return prev;

        const next = [...prev, lessonId];

        try {
          localStorage.setItem(
            `course-progress-${id}`,
            JSON.stringify(next)
          );
        } catch (e) {
          console.warn("Local storage write failed", e);
        }

        return next;
      });
    },
    [id]
  );

  /* =======================================================
     CLEANUP YOUTUBE PLAYER
  ======================================================== */

  const destroyYouTubePlayer = useCallback(() => {
    if (youtubeProgressTimerRef.current) {
      clearInterval(youtubeProgressTimerRef.current);
      youtubeProgressTimerRef.current = null;
    }

    if (youtubePlayerRef.current) {
      try {
        youtubePlayerRef.current.destroy();
      } catch (err) {
        console.warn("Player destroy error:", err);
      }

      youtubePlayerRef.current = null;
    }

    if (youtubeContainerRef.current) {
      youtubeContainerRef.current.innerHTML = "";
    }

    setYoutubeReady(false);
    setYoutubePlaying(false);
    setYoutubeCurrentTime(0);
    setYoutubeDuration(0);
  }, []);

  /* =======================================================
     BOOT YOUTUBE INSTANCE
  ======================================================== */

  useEffect(() => {
    if (!youtubeVideoId) {
      destroyYouTubePlayer();
      return;
    }

    let cancelled = false;

    const init = async () => {
      try {
        destroyYouTubePlayer();

        const YT = await loadYouTubeAPI();

        if (cancelled || !youtubeContainerRef.current) return;

        const player = new YT.Player(youtubeContainerRef.current, {
          videoId: youtubeVideoId,

          width: "100%",
          height: "100%",

          playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            showinfo: 0,
            iv_load_policy: 3,
            playsinline: 1,
            fs: 0,
            disablekb: 1,
            origin: window.location.origin,
          },

          events: {
            onReady: (event) => {
              if (cancelled) return;

              youtubePlayerRef.current = event.target;

              const duration = event.target.getDuration();
              const volume = event.target.getVolume();

              setYoutubeDuration(duration || 0);
              setYoutubeVolume(volume ?? 100);
              setYoutubeMuted(event.target.isMuted());
              setYoutubeSpeed(event.target.getPlaybackRate() || 1);
              setYoutubeReady(true);

              if (youtubeProgressTimerRef.current) {
                clearInterval(youtubeProgressTimerRef.current);
              }

              youtubeProgressTimerRef.current = setInterval(() => {
                const currentPlayer = youtubePlayerRef.current;

                if (!currentPlayer || isSeekingRef.current) return;

                try {
                  const current = currentPlayer.getCurrentTime();
                  const total = currentPlayer.getDuration();

                  setYoutubeCurrentTime(
                    Number.isFinite(current) ? current : 0
                  );

                  setYoutubeDuration(Number.isFinite(total) ? total : 0);
                } catch {
                  // Ignore state transitions.
                }
              }, 400);
            },

            onStateChange: (event) => {
              if (cancelled) return;

              if (event.data === window.YT.PlayerState.PLAYING) {
                setYoutubePlaying(true);
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setYoutubePlaying(false);
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setYoutubePlaying(false);

                if (activeLesson?.id) {
                  markLessonComplete(activeLesson.id);
                }
              }
            },

            onError: (err) => console.error("YouTube Player Error:", err),
          },
        });

        youtubePlayerRef.current = player;
      } catch (err) {
        console.error("YouTube init error:", err);
      }
    };

    init();

    return () => {
      cancelled = true;
      destroyYouTubePlayer();
    };
  }, [
    youtubeVideoId,
    markLessonComplete,
    destroyYouTubePlayer,
    activeLesson?.id,
  ]);

  /* =======================================================
     AUTO-HIDE CONTROLS ON IDLE
  ======================================================== */

  const wakeControls = useCallback(() => {
    setControlsVisible(true);

    if (controlsHideTimerRef.current) {
      clearTimeout(controlsHideTimerRef.current);
    }

    if (youtubePlaying) {
      controlsHideTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
        setShowSpeedMenu(false);
      }, 2600);
    }
  }, [youtubePlaying]);

  useEffect(() => {
    wakeControls();

    return () => {
      if (controlsHideTimerRef.current) {
        clearTimeout(controlsHideTimerRef.current);
      }
    };
  }, [wakeControls]);

  /* =======================================================
     CUSTOM PLAYER ACTIONS
  ======================================================== */

  const togglePlay = () => {
    const player = youtubePlayerRef.current;

    if (!player || !youtubeReady) return;

    if (youtubePlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const handleSeekChange = (event) => {
    setYoutubeCurrentTime(Number(event.target.value));
  };

  const handleSeekStart = () => {
    isSeekingRef.current = true;
  };

  const handleSeekEnd = (event) => {
    isSeekingRef.current = false;

    const value = Number(event.target.value);
    const player = youtubePlayerRef.current;

    if (player && youtubeReady) {
      player.seekTo(value, true);
    }
  };

  const handleVolumeChange = (event) => {
    const value = Number(event.target.value);
    const player = youtubePlayerRef.current;

    if (!player || !youtubeReady) return;

    player.setVolume(value);

    if (value === 0) {
      player.mute();
      setYoutubeMuted(true);
    } else {
      player.unMute();
      setYoutubeMuted(false);
    }

    setYoutubeVolume(value);
  };

  const toggleMute = () => {
    const player = youtubePlayerRef.current;

    if (!player || !youtubeReady) return;

    if (player.isMuted()) {
      player.unMute();
      player.setVolume(youtubeVolume || 100);
      setYoutubeMuted(false);
    } else {
      player.mute();
      setYoutubeMuted(true);
    }
  };

  const changeSpeed = (speed) => {
    const player = youtubePlayerRef.current;

    if (!player || !youtubeReady) return;

    player.setPlaybackRate(speed);
    setYoutubeSpeed(speed);
    setShowSpeedMenu(false);
  };

  const handleFullscreen = () => {
    const target = playerWrapperRef.current;

    if (!target) return;

    if (!document.fullscreenElement) {
      if (target.requestFullscreen) {
        target.requestFullscreen();
      } else if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  /* =======================================================
     SELECT LESSON / MODULE
  ======================================================== */

  const selectLesson = (module, lesson) => {
    setOpenModuleId(module.id);
    setActiveModule(module);
    setActiveLesson(lesson);
    setShowSpeedMenu(false);
    setSearchParams({ lesson: lesson.id });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleModule = (moduleId) => {
    setOpenModuleId((prev) => (prev === moduleId ? null : moduleId));
  };

  /* =======================================================
     DERIVED STATS
  ======================================================== */

  const { totalLessons, completedCount, progressPercent } = useMemo(() => {
    const mods = course?.modules || [];
    const allLessons = mods.flatMap((mod) => mod.lessons || []);
    const total = allLessons.length;

    const completed = allLessons.filter((lesson) =>
      completedLessonIds.includes(lesson.id)
    ).length;

    return {
      totalLessons: total,
      completedCount: completed,
      progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [course, completedLessonIds]);

  /* =======================================================
     LOADING STATE
  ======================================================== */

  if (status === "loading") {
    return (
      <div className="mt-6 flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white py-16 text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <span className="relative flex h-10 w-10 items-center justify-center">
          <span className="absolute h-full w-full animate-ping rounded-full bg-primary-400/40" />

          <span className="relative h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-primary-600 dark:border-slate-700 dark:border-t-primary-500" />
        </span>

        <p className="text-sm font-medium">Loading your course…</p>
      </div>
    );
  }

  /* =======================================================
     ERROR STATE
  ======================================================== */

  if (status === "error" || !course) {
    return (
      <div className="mt-6">
        <Link
          to="/my-courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition hover:gap-3 dark:text-primary-400"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to My Courses
        </Link>

        <div className="mt-6 flex flex-col items-center gap-3 rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm dark:border-red-950 dark:bg-slate-900">
          <HiOutlineExclamationCircle className="h-10 w-10 text-red-500" />

          <p className="text-sm font-medium text-red-600 dark:text-red-300">
            {error || "Could not load course."}
          </p>
        </div>
      </div>
    );
  }

  const modules = course.modules || [];

  return (
    <>
      <Helmet>
        <title>{course.title} | Learning Hub</title>
      </Helmet>

      {/* =====================================================
          BACK TO MODULES
      ====================================================== */}

      <Link
        to={`/dashboard/courses/${course.id}/modules`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition hover:gap-3 dark:text-primary-400"
      >
        <HiOutlineArrowLeft className="h-4 w-4" />
        Back to Modules
      </Link>

      {/* =====================================================
          COURSE HEADER + PROGRESS
      ====================================================== */}

      <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-[#141E32] dark:text-white sm:text-3xl">
            {course.title}
          </h1>

          {activeModule && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {activeModule.title}

              {activeLesson && (
                <>
                  <span className="mx-2 text-slate-300 dark:text-slate-600">
                    /
                  </span>

                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {activeLesson.title}
                  </span>
                </>
              )}
            </p>
          )}
        </div>

        {totalLessons > 0 && (
          <div className="w-full shrink-0 rounded-xl bg-slate-50 p-3.5 sm:w-64 dark:bg-slate-800/60">
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Course progress</span>

              <span className="text-slate-800 dark:text-slate-200">
                {completedCount}/{totalLessons} ({progressPercent}%)
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ===================================================
            LEFT COLUMN — PLAYER & LESSON DETAILS
        ==================================================== */}

        <div className="min-w-0">
          {/* =================================================
              YOUTUBE VIDEO
          ================================================== */}

          {youtubeVideoId ? (
            <div
              ref={playerWrapperRef}
              className="group relative aspect-video w-full select-none overflow-hidden rounded-2xl bg-black shadow-[0_18px_50px_-20px_rgba(15,23,42,0.45)] ring-1 ring-black/5"
              onMouseMove={wakeControls}
              onMouseLeave={() =>
                youtubePlaying && setControlsVisible(false)
              }
            >
              {/* Loader */}
              {!youtubeReady && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950">
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                </div>
              )}

              {/* YouTube iframe (click-blocked, driven entirely by custom controls) */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                <div ref={youtubeContainerRef} className="h-full w-full" />
              </div>

              {/* Transparent click-to-play shield */}
              <div
                onClick={togglePlay}
                className="absolute inset-0 z-10 cursor-pointer"
                aria-hidden="true"
              />

              {/* Center play / pause button */}
              {youtubeReady && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className={`pointer-events-auto absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-primary-600 ${
                    !youtubePlaying || controlsVisible
                      ? "scale-100 opacity-100"
                      : "pointer-events-none scale-90 opacity-0"
                  }`}
                  aria-label={youtubePlaying ? "Pause video" : "Play video"}
                >
                  {youtubePlaying ? (
                    <HiPause className="h-8 w-8" />
                  ) : (
                    <HiPlay className="ml-1 h-8 w-8" />
                  )}
                </button>
              )}

              {/* Bottom custom overlay controls */}
              <div
                className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-12 transition-opacity duration-300 ${
                  youtubeReady && controlsVisible
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                {/* Timeline */}
                <div className="mb-3 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max={youtubeDuration || 0}
                    step="0.1"
                    value={youtubeCurrentTime}
                    onMouseDown={handleSeekStart}
                    onTouchStart={handleSeekStart}
                    onChange={handleSeekChange}
                    onMouseUp={handleSeekEnd}
                    onTouchEnd={handleSeekEnd}
                    disabled={!youtubeReady}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-primary-500"
                    aria-label="Seek timeline"
                  />
                </div>

                {/* Control row */}
                <div className="flex items-center justify-between">
                  {/* Left controls */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      disabled={!youtubeReady}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/20 disabled:opacity-50"
                      aria-label={youtubePlaying ? "Pause" : "Play"}
                    >
                      {youtubePlaying ? (
                        <HiPause className="h-5 w-5" />
                      ) : (
                        <HiPlay className="ml-1 h-5 w-5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      disabled={!youtubeReady}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/20 disabled:opacity-50"
                      aria-label={youtubeMuted ? "Unmute" : "Mute"}
                    >
                      {youtubeMuted || youtubeVolume === 0 ? (
                        <HiVolumeOff className="h-5 w-5" />
                      ) : (
                        <HiVolumeUp className="h-5 w-5" />
                      )}
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={youtubeMuted ? 0 : youtubeVolume}
                      onChange={handleVolumeChange}
                      disabled={!youtubeReady}
                      className="hidden h-1 w-20 cursor-pointer bg-white/30 accent-primary-500 sm:block"
                      aria-label="Volume slider"
                    />

                    <span className="text-xs font-medium tabular-nums text-white/90">
                      {formatTime(youtubeCurrentTime)} /{" "}
                      {formatTime(youtubeDuration)}
                    </span>
                  </div>

                  {/* Right controls */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setShowSpeedMenu((prev) => !prev);
                        }}
                        disabled={!youtubeReady}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 disabled:opacity-50"
                      >
                        {youtubeSpeed}x
                      </button>

                      {showSpeedMenu && (
                        <div
                          onClick={(event) => event.stopPropagation()}
                          className="absolute bottom-10 right-0 z-50 min-w-[85px] overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 p-1 shadow-2xl backdrop-blur-md"
                        >
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                            <button
                              key={speed}
                              type="button"
                              onClick={() => changeSpeed(speed)}
                              className={`block w-full rounded-md px-3 py-1.5 text-left text-xs transition ${
                                youtubeSpeed === speed
                                  ? "bg-primary-600 font-semibold text-white"
                                  : "text-slate-300 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleFullscreen}
                      disabled={!youtubeReady}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/20 disabled:opacity-50"
                      aria-label="Fullscreen toggle"
                    >
                      <HiArrowsExpand className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeLesson?.videoUrl ? (
            /* =================================================
               SELF-HOSTED VIDEO
            ================================================== */

            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-[0_18px_50px_-20px_rgba(15,23,42,0.45)] ring-1 ring-black/5">
              <video
                key={activeLesson.id}
                controls
                playsInline
                preload="metadata"
                onEnded={() => markLessonComplete(activeLesson.id)}
                className="absolute inset-0 h-full w-full object-contain"
              >
                <source
                  src={activeLesson.videoUrl}
                  type={getVideoMimeType(activeLesson.videoUrl)}
                />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            /* =================================================
               NO VIDEO
            ================================================== */

            <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              <HiOutlineBookOpen className="h-8 w-8 text-slate-300 dark:text-slate-600" />

              <p className="text-sm text-slate-500 dark:text-slate-400">
                No video available for this lesson.
              </p>
            </div>
          )}

          {/* =================================================
              ACTIVE LESSON DETAILS
          ================================================== */}

          {activeLesson ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_35px_-24px_rgba(15,23,42,0.35)] sm:p-7 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {activeLesson.title}
                </h2>

                {completedLessonIds.includes(activeLesson.id) ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <HiCheckCircle className="h-4 w-4" />
                    Completed
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => markLessonComplete(activeLesson.id)}
                    className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-primary-500 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-primary-400 dark:hover:text-primary-400"
                  >
                    Mark as complete
                  </button>
                )}
              </div>

              {activeLesson.content && (
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {activeLesson.content}
                </p>
              )}

              {/* =============================================
                  NOTES & RESOURCES
              ============================================== */}

              <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
                <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Notes & Resources
                </h3>

                {notesLoading ? (
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-10 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800"
                      />
                    ))}
                  </div>
                ) : lessonNotes.length > 0 ? (
                  <div className="space-y-2">
                    {lessonNotes.map((note) => (
                      <a
                        key={note.id}
                        href={buildFileUrl(note.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50/40 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-primary-800 dark:hover:bg-slate-800"
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          <HiDocumentText className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />

                          <span className="truncate font-medium text-slate-700 dark:text-slate-200">
                            {note.originalName}
                          </span>
                        </span>

                        <HiDownload className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    No downloadable resources attached to this lesson.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              Select a lesson from the course outline to begin.
            </div>
          )}
        </div>

        {/* ===================================================
            RIGHT COLUMN — CURRICULUM
        ==================================================== */}

        <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_35px_-24px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900 lg:self-start">
          <div className="border-b border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-600 dark:text-primary-400">
              Learning Path
            </div>

            <h2 className="font-bold text-slate-900 dark:text-white">
              Course Content
            </h2>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {modules.length} {modules.length === 1 ? "module" : "modules"}{" "}
              &bull; {completedCount}/{totalLessons} completed
            </p>
          </div>

          <div className="max-h-[70vh] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
            {modules.length === 0 ? (
              <p className="p-5 text-sm text-slate-500">
                No modules available.
              </p>
            ) : (
              modules.map((module, index) => {
                const isOpen = openModuleId === module.id;
                const lessons = module.lessons || [];

                const moduleCompleted = lessons.filter((lesson) =>
                  completedLessonIds.includes(lesson.id)
                ).length;

                return (
                  <div key={module.id}>
                    {/* Module header */}
                    <button
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      className="flex w-full items-center justify-between px-4 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                          Module {index + 1}
                        </p>

                        <p className="mt-0.5 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {module.title}
                        </p>

                        <p className="text-xs text-slate-400">
                          {moduleCompleted}/{lessons.length} lessons
                        </p>
                      </div>

                      {isOpen ? (
                        <HiChevronDown className="h-5 w-5 shrink-0 text-slate-400" />
                      ) : (
                        <HiChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
                      )}
                    </button>

                    {/* Lessons */}
                    {isOpen && (
                      <div className="bg-[#F8FAFC] px-2 pb-2 dark:bg-slate-950/40">
                        {lessons.length === 0 ? (
                          <p className="px-3 py-2 text-xs text-slate-400">
                            No lessons in this module.
                          </p>
                        ) : (
                          lessons.map((lesson, lessonIndex) => {
                            const isActive = activeLesson?.id === lesson.id;
                            const isDone = completedLessonIds.includes(
                              lesson.id
                            );

                            return (
                              <button
                                key={lesson.id}
                                type="button"
                                onClick={() => selectLesson(module, lesson)}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                                  isActive
                                    ? "bg-[#141E32] text-white shadow-md shadow-slate-900/10"
                                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70"
                                }`}
                              >
                                <div
                                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                    isActive
                                      ? "bg-white/20 text-white"
                                      : isDone
                                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300"
                                      : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                  }`}
                                >
                                  {isActive ? (
                                    <HiPlay className="h-3 w-3" />
                                  ) : isDone ? (
                                    <HiCheckCircle className="h-3.5 w-3.5" />
                                  ) : (
                                    lessonIndex + 1
                                  )}
                                </div>

                                <span className="min-w-0 flex-1">
                                  <span className="block truncate font-medium">
                                    {lesson.title}
                                  </span>

                                  {lesson.duration && (
                                    <span
                                      className={`text-[11px] ${
                                        isActive
                                          ? "text-white/80"
                                          : "text-slate-400"
                                      }`}
                                    >
                                      {lesson.duration}
                                    </span>
                                  )}
                                </span>
                              </button>
                            );
                          })
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
