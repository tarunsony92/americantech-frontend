import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  HiOutlineBadgeCheck,
  HiOutlineDownload,
  HiOutlineAcademicCap,
  HiOutlineSparkles,
  HiOutlineExternalLink,
  HiOutlineCalendar,
  HiOutlineShieldCheck,
} from "react-icons/hi";

import certificateService from "../../services/certificateService";

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  // =====================================================
  // LOAD MY CERTIFICATES
  // =====================================================
  useEffect(() => {
    let isMounted = true;

    certificateService
      .listMine()
      .then(({ data }) => {
        if (!isMounted) return;

        const items = data?.data?.items || [];

        setCertificates(items);
        setStatus("success");
      })
      .catch((err) => {
        if (!isMounted) return;

        setError(
          err.response?.data?.message ||
            "Couldn't load your certificates."
        );

        setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // =====================================================
  // LOADING
  // =====================================================
  if (status === "loading") {
    return (
      <>
        <Helmet>
          <title>My Certificates | American FutureTech</title>
        </Helmet>

        <div className="space-y-6">

          {/* Header skeleton */}
          <div className="overflow-hidden rounded-3xl bg-[#141E32] p-6 shadow-xl sm:p-8">
            <div className="animate-pulse">
              <div className="h-7 w-32 rounded bg-white/10" />
              <div className="mt-4 h-9 w-72 rounded bg-white/10" />
              <div className="mt-3 h-4 w-full max-w-xl rounded bg-white/10" />
            </div>
          </div>

          {/* Certificate skeletons */}
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-col sm:flex-row">

                  <div className="h-36 animate-pulse bg-[#141E32] sm:w-44" />

                  <div className="flex-1 space-y-4 p-6">
                    <div className="h-3 w-40 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-6 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />

                    <div className="flex gap-3">
                      <div className="h-10 w-40 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                      <div className="h-10 w-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================
  if (status === "error") {
    return (
      <>
        <Helmet>
          <title>My Certificates | American FutureTech</title>
        </Helmet>

        <div className="space-y-6">

          {/* Header */}
          <section className="relative overflow-hidden rounded-3xl bg-[#141E32] p-6 text-white shadow-xl sm:p-8">

            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary-600/20" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
                <HiOutlineSparkles className="h-4 w-4 text-primary-300" />
                Achievements
              </div>

              <h1 className="text-2xl font-extrabold sm:text-3xl">
                My Certificates
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                View and manage your earned certificates.
              </p>
            </div>

          </section>

          {/* Error */}
          <div className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm dark:border-red-900 dark:bg-slate-900">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-xl font-bold text-red-500 dark:bg-red-950/40">
              !
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              Unable to load certificates
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-red-500">
              {error}
            </p>

          </div>

        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Certificates | American FutureTech</title>
      </Helmet>

      <div className="space-y-6">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <section className="relative overflow-hidden rounded-3xl bg-[#141E32] p-6 text-white shadow-xl shadow-slate-900/15 sm:p-8">

          {/* Decorative elements */}
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary-600/20" />

          <div className="absolute -bottom-28 right-28 h-56 w-56 rounded-full bg-primary-500/5" />

          <div className="absolute right-20 top-12 h-2 w-2 rounded-full bg-primary-300/50" />

          <div className="absolute right-40 top-24 h-1.5 w-1.5 rounded-full bg-white/20" />

          <div className="relative z-10 flex items-center justify-between gap-6">

            <div className="max-w-2xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur-sm">

                <HiOutlineSparkles className="h-4 w-4 text-primary-300" />

                Achievements

              </div>

              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                My Certificates
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Your completed achievements and certifications
                are collected here for easy access.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">

                <HiOutlineBadgeCheck className="h-4 w-4 text-primary-300" />

                {certificates.length}{" "}
                {certificates.length === 1
                  ? "Certificate"
                  : "Certificates"}{" "}
                Earned

              </div>

            </div>

            <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md sm:flex">

              <HiOutlineBadgeCheck className="h-10 w-10 text-primary-300" />

            </div>

          </div>
        </section>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}
        {certificates.length === 0 && (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="flex flex-col items-center px-6 py-14 text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#141E32] text-primary-300 shadow-lg">

                <HiOutlineAcademicCap className="h-9 w-9" />

              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                Your certificates will appear here
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Complete your courses and earn certificates
                that showcase your skills and achievements.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">

                <HiOutlineSparkles className="h-4 w-4 text-primary-500" />

                Complete a course to earn your first certificate

              </div>

            </div>
          </div>
        )}

        {/* =====================================================
            CERTIFICATE SECTION
        ====================================================== */}
        {certificates.length > 0 && (
          <>

            {/* Section title */}
            <div className="flex items-end justify-between">

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Your Achievements
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {certificates.length}{" "}
                  {certificates.length === 1
                    ? "certificate"
                    : "certificates"}{" "}
                  earned
                </p>
              </div>

              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 sm:flex dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">

                <HiOutlineShieldCheck className="h-4 w-4 text-emerald-500" />

                Verified Achievements

              </div>

            </div>

            {/* Certificate cards */}
            <div className="space-y-4">

              {certificates.map((certificate) => {

                const issueDate = certificate.issuedAt
                  ? new Date(
                      certificate.issuedAt
                    ).toLocaleDateString()
                  : null;

                return (
                  <article
                    key={certificate.id}
                    className="
                      group
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      shadow-sm
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-xl
                      dark:border-slate-800
                      dark:bg-slate-900
                    "
                  >

                    <div className="flex flex-col sm:flex-row">

                      {/* =================================================
                          LEFT CERTIFICATE VISUAL
                      ================================================== */}
                      <div className="relative flex min-h-[180px] w-full shrink-0 items-center justify-center overflow-hidden bg-[#141E32] sm:w-48">

                        {/* Decorative */}
                        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary-600/20" />

                        <div className="absolute -bottom-14 -left-10 h-28 w-28 rounded-full bg-primary-500/5" />

                        <div className="absolute right-8 top-8 h-1.5 w-1.5 rounded-full bg-primary-300/50" />

                        <div className="absolute bottom-8 left-10 h-1.5 w-1.5 rounded-full bg-white/20" />

                        {/* Certificate icon */}
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-md">

                          <HiOutlineBadgeCheck className="h-10 w-10 text-primary-300" />

                        </div>

                      </div>

                      {/* =================================================
                          CERTIFICATE CONTENT
                      ================================================== */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-6">

                        <div>

                          <div className="flex flex-wrap items-start justify-between gap-4">

                            <div className="min-w-0">

                              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary-600 dark:text-primary-400">
                                Certificate of Completion
                              </p>

                              <h3 className="mt-1.5 text-lg font-bold leading-7 text-slate-900 dark:text-white">
                                {certificate.course?.title ||
                                  "Course Certificate"}
                              </h3>

                            </div>

                            {/* Verified */}
                            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">

                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                              Verified

                            </span>

                          </div>

                          {/* Metadata */}
                          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">

                            {issueDate && (
                              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">

                                <HiOutlineCalendar className="h-4 w-4 text-slate-400" />

                                Issued {issueDate}

                              </span>
                            )}

                            {certificate.certificateNumber && (
                              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">

                                <HiOutlineBadgeCheck className="h-4 w-4 text-slate-400" />

                                ID:

                                <span className="font-semibold text-slate-600 dark:text-slate-300">
                                  {certificate.certificateNumber}
                                </span>

                              </span>
                            )}

                          </div>

                        </div>

                        {/* =================================================
                            ACTIONS
                        ================================================== */}
                        {certificate.fileUrl && (
                          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                            {/* Download */}
                            <a
                              href={certificate.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-[#141E32]
                                px-4
                                py-3
                                text-xs
                                font-bold
                                text-white
                                shadow-md
                                shadow-slate-900/10
                                transition
                                duration-200
                                hover:-translate-y-0.5
                                hover:bg-[#1A2740]
                                hover:shadow-lg
                              "
                            >
                              <HiOutlineDownload className="h-4 w-4 text-primary-300" />

                              Download Certificate
                            </a>

                            {/* View */}
                            <a
                              href={certificate.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-3
                                text-xs
                                font-bold
                                text-slate-700
                                transition
                                hover:-translate-y-0.5
                                hover:border-primary-200
                                hover:text-primary-600
                                dark:border-slate-700
                                dark:bg-slate-900
                                dark:text-slate-300
                                dark:hover:border-primary-800
                                dark:hover:text-primary-400
                              "
                            >
                              <HiOutlineExternalLink className="h-4 w-4" />

                              View
                            </a>

                          </div>
                        )}

                      </div>

                    </div>
                  </article>
                );
              })}

            </div>

          </>
        )}

        {/* =====================================================
            BOTTOM INFO
        ====================================================== */}
        {certificates.length > 0 && (
          <section className="overflow-hidden rounded-2xl bg-[#141E32] p-5 text-white shadow-lg shadow-slate-900/10 sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">

                  <HiOutlineSparkles className="h-5 w-5 text-primary-300" />

                </div>

                <div>

                  <h3 className="text-sm font-bold">
                    Keep building your achievements
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Complete more courses to expand your
                    professional certification portfolio.
                  </p>

                </div>

              </div>

              <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 sm:flex">

                <HiOutlineBadgeCheck className="h-4 w-4 text-primary-300" />

                {certificates.length} Earned

              </div>

            </div>

          </section>
        )}

      </div>
    </>
  );
};

export default MyCertificates;