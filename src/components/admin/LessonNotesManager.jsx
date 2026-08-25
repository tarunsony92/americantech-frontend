import { useEffect, useState } from "react";
import lessonNoteService from "../../services/lessonNoteService";
import { buildFileUrl } from "../../utils/fileUrl";

const LessonNotesManager = ({ lessonId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchNotes = async () => {
    if (!lessonId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await lessonNoteService.list(lessonId);
      setNotes(data?.data || []);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setNotes([]);
      setError("Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();

    // fetchNotes intentionally only depends on lessonId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length || !lessonId) return;

    setUploading(true);
    setError("");

    try {
      // Upload sequentially to avoid unnecessary server load
      // and possible multer/disk-write race conditions.
      for (const file of files) {
        await lessonNoteService.upload(lessonId, file);
      }

      await fetchNotes();
    } catch (err) {
      console.error("Upload failed:", err);

      setError(
        err?.response?.data?.message ||
          "Upload failed. Check file type and file size."
      );
    } finally {
      setUploading(false);

      // Allow selecting the same file again
      e.target.value = "";
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this note?");

    if (!confirmed) return;

    setError("");

    try {
      await lessonNoteService.remove(id);

      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      console.error("Failed to delete note:", err);

      setError(
        err?.response?.data?.message || "Failed to delete note."
      );
    }
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes <= 0) return "";

    const kb = bytes / 1024;

    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    const mb = kb / 1024;

    if (mb < 1024) {
      return `${mb.toFixed(1)} MB`;
    }

    const gb = mb / 1024;

    return `${gb.toFixed(1)} GB`;
  };

  const getFileType = (fileName = "") => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return "PDF";

      case "doc":
        return "DOC";

      case "docx":
        return "DOCX";

      case "jpg":
      case "jpeg":
        return "JPG";

      case "png":
        return "PNG";

      default:
        return extension?.toUpperCase() || "FILE";
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-slate-700">
          Notes / Files
        </h3>

        <label
          className={`cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black shadow-sm transition-all ${
            uploading
              ? "cursor-not-allowed opacity-60"
              : "hover:shadow-md"
          }`}
        >
          {uploading ? "Uploading..." : "Upload Files"}

          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            disabled={uploading || !lessonId}
            className="hidden"
          />
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-center">
          <p className="text-sm text-slate-500">
            Loading notes...
          </p>
        </div>
      ) : notes.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
          <p className="text-sm font-medium text-slate-600">
            No notes uploaded yet.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Upload PDF, DOC, DOCX, JPG or PNG files.
          </p>
        </div>
      ) : (
        /* Notes list */
        <div className="space-y-2">
          {notes.map((note) => {
            const fileUrl = buildFileUrl(note.fileUrl);
            const fileType = getFileType(note.originalName);

            return (
              <div
                key={note.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:shadow-sm"
              >
                {/* File information */}
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  {/* File icon */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                    {fileType}
                  </div>

                  {/* File name */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700 hover:text-primary">
                      {note.originalName}
                    </p>

                    {note.fileSize ? (
                      <p className="mt-0.5 text-xs text-slate-400">
                        {formatSize(note.fileSize)}
                      </p>
                    ) : null}
                  </div>
                </a>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-3">
                  {note.fileSize ? (
                    <span className="hidden text-xs text-slate-400 sm:block">
                      {formatSize(note.fileSize)}
                    </span>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => handleDelete(note.id)}
                    className="text-xs font-semibold text-red-500 transition hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LessonNotesManager;