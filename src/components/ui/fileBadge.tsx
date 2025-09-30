import React from "react";
import { UploadedFile } from "./inputFile";

interface FileBadgeProps {
  fileIcon: React.ReactNode;
  file: UploadedFile;
  onClick?: () => void;
}

const FileBadge: React.FC<FileBadgeProps> = ({ fileIcon, file, onClick }) => {
  const isImage =
    file.mimeType?.split("/")[0] === "image" ||
    file.extension?.match(/(jpg|jpeg|png|gif|bmp|webp)$/i);

  console.log("FileBadge - file:", file);

  return (
    <div onClick={onClick} className={onClick ? "cursor-pointer" : ""}>
      {isImage && file.url ? (
        <div className="w-22 h-22 rounded-lg overflow-hidden border border-gray-300">
          <img
            src={file.url}
            alt={file.nome || "Imagem"}
            className="w-full h-full object-cover"
          />
          <div className="w-full bg-[var(--extra)] text-sm text-[var(--primary)] text-center rounded-b-lg py-1">
            {file.nome}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-lg w-[8ch] shadow-sm bg-[var(--secondary)]">
          <div className="flex h-12 w-12 items-center justify-center mt-2">
            {fileIcon}
          </div>

          {file.nome && (
            <div className="w-full bg-[var(--extra)] text-[var(--primary)] text-center rounded-b-lg py-1 truncate  ">
              <span>{file.nome}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileBadge;
