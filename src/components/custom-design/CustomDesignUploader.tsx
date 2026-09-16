"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
const MAX_SIZE_MB = 10;

export function CustomDesignUploader({
  file,
  onFileChange,
}: {
  file: File | null;
  onFileChange: (file: File | null) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function validateAndSet(candidate: File | undefined) {
    if (!candidate) return;
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      setError("Please upload a JPG, PNG, WEBP or PDF file.");
      return;
    }
    if (candidate.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_SIZE_MB}MB.`);
      return;
    }
    setError(null);
    onFileChange(candidate);
  }

  const previewUrl = file && file.type !== "application/pdf" ? URL.createObjectURL(file) : null;

  return (
    <div>
      <label className="text-xs font-medium text-ink-700 mb-2 block">
        Upload Your Design (JPG, PNG, WEBP or PDF)
      </label>

      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            validateAndSet(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors",
            dragOver ? "border-gold-500 bg-gold-100/30" : "border-ink-300/50 hover:border-gold-500"
          )}
        >
          <UploadCloud size={28} className="text-gold-600" />
          <p className="text-sm text-ink-700">
            <span className="font-medium text-maroon-800">Click to upload</span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-ink-500">JPG, JPEG, PNG, WEBP or PDF — up to {MAX_SIZE_MB}MB</p>
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            className="sr-only"
            onChange={(e) => validateAndSet(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 border border-ink-300/40 bg-cream-100 p-3">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Uploaded design preview" className="h-14 w-14 object-cover shrink-0" />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center bg-cream-300 text-maroon-800 shrink-0">
              <FileText size={22} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink-900 truncate">{file.name}</p>
            <p className="text-xs text-ink-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button
            type="button"
            onClick={() => onFileChange(null)}
            aria-label="Remove uploaded file"
            className="text-ink-500 hover:text-maroon-700 shrink-0"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-maroon-600">{error}</p>}
      <p className="mt-2 text-xs text-ink-500 flex items-center gap-1.5">
        <ImageIcon size={12} /> Your file will be reviewed by our design team.
      </p>
    </div>
  );
}
