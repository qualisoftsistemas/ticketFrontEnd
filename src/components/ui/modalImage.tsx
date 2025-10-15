"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import { Button } from "./button";
import InputFile, { UploadedFile } from "./inputFile";
import FileBadge from "./fileBadge";
import { showRequestToast } from "./toast";

interface ModalImageProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  setId: (id: number) => void;
}

export default function ModalImage({
  open,
  onClose,
  onConfirm,
  setId,
}: ModalImageProps) { 
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleConfirm = () => {
    if (!uploadedFiles.length) {
      showRequestToast("error", "Selecione uma foto antes de confirmar!");
      return;
    }

    const file = uploadedFiles[0];
    if (file?.id) {
      setId(file.id);
      showRequestToast("success", "Foto adicionada com sucesso!");
      onConfirm();
      onClose();
    } else {
      showRequestToast("error", "Erro ao processar a foto.");
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Enviar Foto</h2>

        <InputFile
          multiple={false}
          accept="image/*"
          label="Selecionar Foto"
          onUpload={(files) => setUploadedFiles(files.slice(0, 1))} // garante 1 arquivo
        />

        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file) => (
              <FileBadge key={file.id} file={file} fileIcon={<span>📷</span>} />
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </div>
      </div>
    </Modal>
  );
}
