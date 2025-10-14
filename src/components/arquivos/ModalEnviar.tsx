"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/modal"; // seu modal genérico
import { Button } from "../ui/button";
import { useRotinaStore } from "@/store/arquivosStore";
import { toast } from "sonner";
import InputText from "../ui/inputText";
import InputFile, { UploadedFile } from "../ui/inputFile";
import FileBadge from "../ui/fileBadge";

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
  const { uploadRotina, fetchRotinas } = useRotinaStore();
  const [observacao, setObservacao] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]); // <-- array
  const [loading, setLoading] = useState(false);

  console.log(rotina);

  const handleUpload = async () => {
    setLoading(true);
    console.log(uploadedFiles);
    try {
      await uploadRotina({
        mes: mes.toString(),
        ano: ano.toString(),
        rotina_id: rotina.id,
        conglomerado_id: conglomeradoId,
        empresa_id: empresaId,
        arquivo_id: uploadedFiles[0]?.id,  
        observacao: observacao,
      });
      toast.success("Arquivo enviado com sucesso!");
      await fetchRotinas(mes, ano);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar o arquivo.");
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

        {/* Upload de arquivos */}
        <InputFile
          multiple={false}
          onUpload={(files) => setUploadedFiles(files)}
        />

        <div className="flex flex-wrap gap-2">
          {uploadedFiles.map((file) => (
            <FileBadge fileIcon={<span>📎</span>} key={file.id} file={file} />
          ))}
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
            {loading ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
