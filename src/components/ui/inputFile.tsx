"use client";
import React, { ChangeEvent, useState } from "react";

type InputFileProps = {
  onChange?: (file: File | File[] | null) => void;
  accept?: string;
  multiple?: boolean;
  id?: string;
  label?: string;
};

const InputFile: React.FC<InputFileProps> = ({
  onChange,
  accept,
  multiple = false,
  id = "fileUpload",
  label = "Escolher arquivo",
}) => {
  const [fileName, setFileName] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
      ? multiple
        ? Array.from(e.target.files)
        : e.target.files[0]
      : null;

    if (!multiple && files instanceof File) {
      setFileName(files.name);
    } else {
      setFileName(
        multiple && Array.isArray(files) ? `${files.length} arquivos` : ""
      );
    }

    if (onChange) onChange(files);
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
        className="flex items-center gap-2 cursor-pointer bg-[var(--primary)] text-[var(--extra)] px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
      >
        <img src="/icons/fileUpload.svg" alt="" className="w-6 h-6" />
        {label}
      </label>

      {fileName && (
        <span className="text-xs text-[var(--primary)]">{fileName}</span>
      )}
    </div>
  );
};

export default InputFile;
