"use client";
import apiFetchClient from "@/service/api";
import React, { ChangeEvent, useState } from "react";

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
  label = "Escolher arquivo",
}) => {
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false); // 👈 novo estado

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    setLoading(true);
    setUploaded(false);

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

      setUploaded(true);

      setTimeout(() => setUploaded(false), 1500);
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
        <div className="bg-[var(--secondary)] text-[var(--extra)] p-1 rounded">
          {loading ? (
            <img
              src="/Icons/UploadFile.svg"
              alt=""
              className="w-9 h-9 animate-pulse"
            />
          ) : uploaded ? (
            <video
              src="/Videos/FileUploaded.webm"
              autoPlay
              muted
              playsInline
              className="w-9 h-9"
            />
          ) : (
            <img src="/Icons/UploadFile.svg" alt="" className="w-9 h-9" />
          )}
        </div>
        {loading ? "Enviando..." : label}
      </label>
    </div>
  );
};

export default InputFile;
