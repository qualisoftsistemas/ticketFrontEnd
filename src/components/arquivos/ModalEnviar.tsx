// components/modals/ModalEnviarArquivo.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRotinaStore } from "@/store/arquivosStore";
import { toast } from "sonner";

interface ModalEnviarArquivoProps {
  open: boolean;
  onClose: () => void;
  rotina: any | null;
  mes: number;
  ano: number;
}

export default function ModalEnviarArquivo({
  open,
  onClose,
  rotina,
  mes,
  ano,
}: ModalEnviarArquivoProps) {
  const { uploadRotina, fetchRotinas } = useRotinaStore(); // <-- precisa existir na store
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !rotina) {
      toast.error("Selecione um arquivo antes de enviar.");
      return;
    }

    setLoading(true);
    try {
      await uploadRotina({
        mes: mes.toString(),
        ano: ano.toString(),
        conglomerado_id: rotina.conglomerado_id,
        empresa_id: rotina.empresa_id,
        rotina_id: rotina.id,
        arquivo_id: rotina.arquivo_id,
        observacao: rotina.observacao,
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar arquivo para {rotina?.nome}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border p-2 rounded"
          />

          {file && (
            <p className="text-sm text-gray-600 truncate">
              Arquivo selecionado: {file.name}
            </p>
          )}
        </div>

        

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
