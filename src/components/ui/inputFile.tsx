"use client";
import apiFetchClient from "@/service/api";
import React, { ChangeEvent, useState, useRef } from "react";

export type UploadedFile = {
  id: number;
  url?: string;
  name?: string;
  extension?: string;
  mimeType?: string;
};

type InputFileProps = {
  onUpload?: (files: UploadedFile[]) => void;
  accept?: string;
  multiple?: boolean;
  id?: string;
  label?: string;
};

const InputFile: React.FC<InputFileProps> = ({
  onUpload,
  accept,
  multiple = false,
  id = "fileUpload",
  label = "Anexar Arquivo",
}) => {
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    setLoading(true);

    try {
      const uploadedFiles: UploadedFile[] = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await apiFetchClient<{
          id: number;
          url?: string;
          name?: string;
          extension?: string;
          mime_type?: string;
        }>({
          method: "POST",
          endpoint: "/arquivo/upload",
          data: formData,
        });

        uploadedFiles.push({
          id: res.id,
          url: res?.url,
          name: res?.name,
          extension: res?.extension,
          mimeType: res?.mime_type,
        });
      }

      if (onUpload) onUpload(uploadedFiles);

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        id={id}
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />

      <label
        htmlFor={id}
        className="flex items-center gap-2 cursor-pointer bg-[var(--primary)] text-[var(--extra)] px-4 py-2 rounded-md text-lg hover:opacity-90 transition"
      >
        <div className="bg-[var(--secondary)] text-[var(--extra)] p-1 rounded w-12 h-12 flex items-center justify-center">
          <video
            ref={videoRef}
            src="/Videos/FileUploaded.webm"
            muted
            playsInline
            className={`w-12 h-12 ${loading ? "animate-pulse" : ""}`}
          />
        </div>
        {loading ? "Enviando..." : label}
      </label>
    </div>
  );
};

export default InputFile;
