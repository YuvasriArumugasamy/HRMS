import {
  AlertCircle,
  CheckCircle,
  File,
  FileSpreadsheet,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

export type UploadStatus = "pending" | "uploading" | "done" | "error";

export interface NewUploadedFile {
  kind: "new";
  file: File;
  status: UploadStatus;
  url?: string;
  error?: string;
}

export interface ExistingUploadedFile {
  kind: "existing";
  filename: string;
  fileType: string;
  fileUrl: string;
  status: "done";
}

export type UploadedFile = NewUploadedFile | ExistingUploadedFile;

export const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf")
    return <FileText className="text-red-500 w-5 h-5 shrink-0" />;
  if (ext === "xls" || ext === "xlsx")
    return <FileSpreadsheet className="text-green-600 w-5 h-5 shrink-0" />;
  if (ext === "doc" || ext === "docx")
    return <FileText className="text-blue-600 w-5 h-5 shrink-0" />;
  return <File className="text-gray-500 w-5 h-5 shrink-0" />;
};

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export interface UploadZoneProps {
  uploadedFiles: UploadedFile[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
}

export default function UploadZone({
  uploadedFiles,
  onAdd,
  onRemove,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    onAdd(Array.from(files));
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">Attachments</label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`
          flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl
          py-7 cursor-pointer transition-all select-none
          ${isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40"
          }
        `}
      >
        <Upload size={22} className="text-gray-400" />
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-blue-600">Click to upload</span>{" "}
          or drag & drop
        </p>
        <p className="text-xs text-gray-400">
          PDF, DOC, DOCX, XLS, XLSX, PNG, JPG
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          onClick={(e) => ((e.target as HTMLInputElement).value = "")}
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((uf, idx) => {
            const name = uf.kind === "existing" ? uf.filename : uf.file.name;
            const size = uf.kind === "existing" ? null : uf.file.size;
            const status = uf.status;
            const error = uf.kind === "new" ? uf.error : undefined;

            return (
              <div
                key={idx}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 bg-white shadow-sm"
              >
                {getFileIcon(name)}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {name}
                  </p>
                  {size !== null && (
                    <p className="text-xs text-gray-400">
                      {formatFileSize(size)}
                    </p>
                  )}
                </div>

                <div className="shrink-0">
                  {status === "uploading" && (
                    <Loader2 size={16} className="animate-spin text-blue-500" />
                  )}
                  {status === "done" && (
                    <CheckCircle size={16} className="text-green-500" />
                  )}
                  {status === "error" && (
                    <span title={error}>
                      <AlertCircle size={16} className="text-red-500" />
                    </span>
                  )}
                  {status === "pending" && (
                    <span className="text-xs text-gray-400 italic">queued</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  disabled={status === "uploading"}
                  className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                  title="Remove"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
