"use client";

import { formatDate } from "@/utils/formatDate";
import React, { useState } from "react";
import FileBadge from "../ui/fileBadge";
import { UploadedFile } from "../ui/inputFile";
import { downloadAnexo } from "@/utils/downloadAnexo";
import { useRotinaStore } from "@/store/arquivosStore";
import Modal from "@/components/ui/modal";
import { Button } from "../ui/button";

export interface User {
  id: number;
  nome: string;
  foto?: { url: string } | null;
}

export interface Anexo {
  id: number;
  arquivo: UploadedFile;
  dispensado?: boolean; // flag para indicar dispensado
}

export interface MensagemType {
  id: number;
  data_envio: string;
  mensagem: string;
  user: User;
  reacoes: [];
  ordenacao: number;
  anexos: Anexo[];
}

interface MensagemProps {
  mensagem: MensagemType;
  numero: number;
  showRespostaInput?: boolean;
}

const Mensagem: React.FC<MensagemProps> = ({
  mensagem,
  numero,
  showRespostaInput,
}) => {
  const { desconsiderarArquivo } = useRotinaStore();
  const [selectedAnexo, setSelectedAnexo] = useState<Anexo | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [anexos, setAnexos] = useState<Anexo[]>(mensagem.anexos);

  const handleDispensarClick = (anexo: Anexo) => {
    setSelectedAnexo(anexo);
    setShowConfirmModal(true);
  };

  const handleConfirmDispensar = async () => {
    if (!selectedAnexo) return;

    await desconsiderarArquivo(selectedAnexo.arquivo.id);

    // marca o anexo como dispensado localmente
    setAnexos((prev) =>
      prev.map((a) =>
        a.id === selectedAnexo.id ? { ...a, dispensado: true } : a
      )
    );

    setShowConfirmModal(false);
    setSelectedAnexo(null);
  };

  const handleCancelDispensar = () => {
    setShowConfirmModal(false);
    setSelectedAnexo(null);
  };

  return (
    <div className="bg-[var(--extra)] p-2 rounded space-y-2 text-[var(--primary)]">
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground flex items-center gap-2">
          <span className="text-lg w-7 h-7 flex justify-center items-center rounded-md bg-[var(--secondary)] text-[var(--secondary-foreground)]">
            {numero}
          </span>
          <p className="text-sm">{formatDate(mensagem.data_envio)}</p>
        </div>

        <div className="flex items-center gap-2">
          {mensagem.user.foto ? (
            <img
              src={mensagem.user.foto.url}
              alt={mensagem.user.nome}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[var(--neutral)] flex items-center justify-center text-[var(--primary)] font-bold">
              {mensagem.user.nome[0]}
            </div>
          )}
          <span className="font-semibold text-sm">{mensagem.user.nome}</span>
        </div>
      </div>

      <div
        className="p-2 rounded text-[var(--primary)] [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1"
        dangerouslySetInnerHTML={{ __html: mensagem.mensagem }}
      />

      {anexos.map((anexo) => {
        const isDispensado =
          anexo.dispensado === true || anexo.arquivo.desconsiderado === 1;

        return (
          <div key={anexo.id} className="relative group">
            <FileBadge
              file={anexo.arquivo}
              onClick={() => !isDispensado && downloadAnexo(anexo)}
              fileIcon={
                anexo.arquivo.extension?.match(
                  /(jpg|jpeg|png|gif|bmp|webp)$/i
                ) ? (
                  <img
                    src="/Icons/Eye.svg"
                    alt="Eye"
                    className={`w-6 h-6 object-contain ${
                      isDispensado ? "opacity-40" : ""
                    }`}
                  />
                ) : (
                  <img
                    src="/Icons/Download.svg"
                    alt="Download"
                    className={`w-6 h-6 object-contain ${
                      isDispensado ? "opacity-40" : ""
                    }`}
                  />
                )
              }
              className={`${
                isDispensado ? "line-through opacity-50 cursor-not-allowed" : ""
              }`}
            />

            {!isDispensado && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                <button
                  className="bg-red-600 text-white px-2 py-1 cursor-pointer rounded text-sm"
                  onClick={() => handleDispensarClick(anexo)}
                >
                  Dispensar
                </button>
              </div>
            )}

            {isDispensado && (
              <div className="absolute top-0 right-0 p-1">
                <img
                  src="/Icons/Lock.svg"
                  alt="Bloqueado"
                  className="w-4 h-4 opacity-60"
                />
              </div>
            )}
          </div>
        );
      })}

      <hr />

      {showConfirmModal && selectedAnexo && (
        <Modal isOpen={showConfirmModal} onClose={handleCancelDispensar}>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              Confirmar remoção do arquivo?
            </h2>
            <div className="flex justify-end gap-2">
              <Button variant="default" onClick={handleCancelDispensar}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleConfirmDispensar}>
                Dispensar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Mensagem;
