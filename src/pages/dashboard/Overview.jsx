import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { HiOutlineBookOpen, HiOutlineBadgeCheck, HiOutlineDocumentText } from "react-icons/hi";
import axiosInstance from "../../api/axiosInstance";

const Overview = () => {
  const { user } = useSelector((state) => state.auth);

  const [enrolledCount, setEnrolledCount] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      axiosInstance.get("/enrollments/mine"),
      axiosInstance.get("/certificates/mine"),
    ])
      .then(([enrollmentsRes, certificatesRes]) => {
        if (!isMounted) return;
        const enrollments = enrollmentsRes.data.data?.items || [];
        const certificates = certificatesRes.data.data?.items || [];
        setEnrolledCount(enrollments.length);
        setCertificateCount(certificates.length);
      })
      .catch(() => {
        if (!isMounted) return;
        setEnrolledCount(0);
        setCertificateCount(0);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    { label: "Enrolled Courses", value: loading ? "..." : enrolledCount, icon: HiOutlineBookOpen },
    { label: "Certificates Earned", value: loading ? "..." : certificateCount, icon: HiOutlineBadgeCheck },
    { label: "Job Applications", value: 0, icon: HiOutlineDocumentText },
  ];

  return (
    <>
      <Helmet><title>Dashboard | American FutureTech</title></Helmet>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back{user?.fullName ? `, ${user.fullName}` : ""}</h1>
      <p className="mt-1 text-sm text-slate-500">Here's a snapshot of your learning journey.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <div className="rounded-lg bg-primary-50 p-3 text-primary-600 dark:bg-primary-950">
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Overview;