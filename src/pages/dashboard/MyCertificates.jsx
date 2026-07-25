import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { HiOutlineBadgeCheck, HiOutlineDownload } from "react-icons/hi";
import certificateService from "../../services/certificateService";

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    certificateService
      .listMine()
      .then(({ data }) => {
        setCertificates(data.data?.items || []);
        setStatus("success");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Couldn't load your certificates.");
        setStatus("error");
      });
  }, []);

  return (
    <>
      <Helmet><title>My Certificates | American FutureTech</title></Helmet>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Certificates</h1>

      {status === "loading" && <p className="mt-6 text-slate-500">Loading your certificates...</p>}
      {error && <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>}

      {status === "success" && certificates.length === 0 && (
        <div className="mt-6 card p-8 text-center">
          <p className="text-slate-600 dark:text-slate-300">You haven't earned any certificates yet.</p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {certificates.map((c) => (
          <div key={c.id} className="card flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <HiOutlineBadgeCheck className="h-8 w-8 text-primary-600" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{c.course?.title}</p>
                <p className="text-sm text-slate-500">
                  {c.issuedAt ? `Issued ${new Date(c.issuedAt).toLocaleDateString()}` : "Issue date pending"} · {c.certificateNumber}
                </p>
              </div>
            </div>
            {c.fileUrl && (
              <a href={c.fileUrl} target="_blank" rel="noreferrer" className="btn-outline">
                <HiOutlineDownload className="h-4 w-4" /> Download
              </a>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default MyCertificates;
