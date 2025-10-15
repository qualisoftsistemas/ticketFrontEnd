"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import { Button } from "../ui/button";
import { useRotinaStore } from "@/store/arquivosStore";
import InputText from "../ui/inputText";
import InputFile, { UploadedFile } from "../ui/inputFile";
import FileBadge from "../ui/fileBadge";
import { showRequestToast } from "../ui/toast";

interface ModalEnviarArquivoProps {
  open: boolean;
  onClose: () => void;
  rotina: any | null;
  mes: number;
  conglomeradoId: number;
  empresaId: number;
  ano: number;
}

export default function ModalEnviarArquivo({
  open,
  onClose,
  rotina,
  conglomeradoId,
  empresaId,
  mes,
  ano,
}: ModalEnviarArquivoProps) {
  const { uploadRotina, fetchRotinas, dispensarMes } = useRotinaStore();
  const [observacao, setObservacao] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [dispensar, setDispensar] = useState(false);

  const handleUpload = async () => {
    if (!rotina) return;

    if (!dispensar && !uploadedFiles.length) {
      showRequestToast(
        "error",
        "Selecione ao menos um arquivo antes de enviar!"
      );
      return;
    }

    setLoading(true);
    try {
      if (dispensar) {
        await dispensarMes({
          mes: mes.toString(),
          ano: ano.toString(),
          conglomerado_id: conglomeradoId,
          empresa_id: empresaId,
          rotina_id: rotina.id,
          observacao,
        });
        showRequestToast("success", "Rotina dispensada com sucesso!");
      } else {
        const arquivo_ids = uploadedFiles.map((f) => f.id);

        await uploadRotina({
          mes: mes.toString(),
          ano: ano.toString(),
          rotina_id: rotina.id,
          conglomerado_id: conglomeradoId,
          empresa_id: empresaId,
          arquivos: arquivo_ids,
          observacao,
        });

        showRequestToast("success", "Arquivos enviados com sucesso!");
      }

      await fetchRotinas(mes, ano);
      onClose();
    } catch (err) {
      console.error(err);
      showRequestToast("error", "Erro ao processar a solicitação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Enviar arquivo para {rotina?.nome}
        </h2>

        {!dispensar && (
          <>
            <InputFile
              multiple={true}
              onUpload={(files) => setUploadedFiles(files)}
            />

            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file) => (
                <FileBadge
                  fileIcon={<span>📎</span>}
                  key={file.id}
                  file={file}
                />
              ))}
            </div>
          </>
        )}
        <div className="flex items-center gap-2 mt-2">
          <label className="flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dispensar}
              onChange={(e) => setDispensar(e.target.checked)}
              className="mr-2 accent-[var(--destructive)]"
            />
            <span className="text-sm text-[var(--extra)]">Dispensar</span>
          </label>
        </div>

        <InputText
          label="Observação"
          labelColor="text-[var(--extra)]"
          value={observacao}
          onChange={(val) => setObservacao(val)}
          placeholder="Digite uma observação"
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={loading}>
            {loading
              ? dispensar
                ? "Dispensando..."
                : "Enviando..."
              : dispensar
              ? "Dispensar"
              : "Enviar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
