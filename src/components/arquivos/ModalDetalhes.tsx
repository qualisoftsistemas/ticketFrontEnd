"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import { Arquivo, Upload } from "@/types/Arquivo";
import { Button } from "../ui/button";
import Badge from "../ui/badge";
import { API_BASE_URL } from "@/service/api";
import {downloadAnexo} from "@/utils/downloadAnexo";

import {
  Download,
  Eye,
  File,
  Image,
  FileText,
  X,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";

interface ModalDataProps {
  modalData: Upload | null;
  setModalData: React.Dispatch<React.SetStateAction<Upload | null>>;
  mes: number;
  ano: number;
  open: boolean;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    aprovado: "text-green-600 bg-green-50 border-green-200",
    rejeitado: "text-red-600 bg-red-50 border-red-200",
    pendente: "text-yellow-600 bg-yellow-50 border-yellow-200",
    processando: "text-blue-600 bg-blue-50 border-blue-200",
  };
  return colors[status] || "text-gray-600 bg-gray-50 border-gray-200";
};

export const downloadArquivo = async (arquivo: {
  id: number;
  name: string;
  url?: string;
}) => {
  if (!arquivo) throw new Error("Arquivo inválido");

  const token = localStorage.getItem("token");

  try {
    if (arquivo.url) {
      window.open(arquivo.url, "_blank");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/arquivo/download/${arquivo.id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Falha ao baixar o arquivo");

    const blob = await res.blob();
    const fileUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = arquivo.name || "arquivo";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(fileUrl);
  } catch (error) {
    console.error("Erro ao baixar arquivo:", error);
  }
};

const ModalDetalhes = ({
  open,
  onClose,
  modalData,
  setModalData,
}: ModalDataProps) => {
  const [imageViewer, setImageViewer] = useState<{
    isOpen: boolean;
    imageUrl: string;
    imageName: string;
  } | null>(null);
  const [downloadingFile, setDownloadingFile] = useState<number | null>(null);

  if (!modalData) return null;

  const arquivos = modalData.arquivos || [];

  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; icon: React.ReactNode }> = {
      aprovado: {
        color: "text-green-600 bg-green-50 border-green-200",
        icon: <CheckCircle className="w-4 h-4" />,
      },
      rejeitado: {
        color: "text-red-600 bg-red-50 border-red-200",
        icon: <XCircle className="w-4 h-4" />,
      },
      pendente: {
        color: "text-yellow-600 bg-yellow-50 border-yellow-200",
        icon: <Clock className="w-4 h-4" />,
      },
      processando: {
        color: "text-blue-600 bg-blue-50 border-blue-200",
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
      },
    };
    return (
      config[status] || {
        color: "text-gray-600 bg-gray-50 border-gray-200",
        icon: <File className="w-4 h-4" />,
      }
    );
  };

  const getFileIcon = (filename: string) => {
    const extension = filename?.split(".").pop()?.toLowerCase();
    const imageExtensions = ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg"];
    const docExtensions = ["pdf", "doc", "docx", "txt", "rtf"];

    if (imageExtensions.includes(extension || "")) {
      return <Image className="w-5 h-5 text-blue-500" />;
    } else if (docExtensions.includes(extension || "")) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const handleDownload = async (arquivo: Arquivo) => {
    setDownloadingFile(arquivo.id);
    try {
      await downloadArquivo(arquivo);
    } finally {
      setDownloadingFile(null);
    }
  };

  const statusConfig = getStatusConfig(modalData.status);

  return (
    <>
      <Modal isOpen={open} onClose={onClose} maxWidth="max-w-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--extra)]">
                Detalhes do Upload
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {modalData.mes}/{modalData.ano}
              </p>
            </div>
          </div>

          {/* Informações principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[var(--extra)] rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Empresa
              </label>
              <p className="font-medium text-[var(--primary)]">
                {modalData.empresa.nome}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Usuário
              </label>
              <p className="font-medium text-[var(--primary)]">
                {modalData.user.nome}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 p-4 bg-[var(--extra)] rounded-lg">
            <label className="text-sm font-medium text-gray-600">Status:</label>
            <Badge
              label={modalData.status}
              bgColor={getStatusColor(modalData.status)}
              textColor={getStatusColor(modalData.status)}
            />
          </div>

          {/* Arquivos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-[var(--extra)]">
                Arquivos ({arquivos.length})
              </h3>
            </div>

            <div className="grid gap-3">
              {arquivos.map((arquivo: Arquivo) => {
                const extension = arquivo.name?.split(".").pop()?.toLowerCase();
                const imageExtensions = [
                  "png",
                  "jpg",
                  "jpeg",
                  "gif",
                  "bmp",
                  "webp",
                ];
                const isImage = imageExtensions.includes(extension || "");

                return (
                  <div
                    key={arquivo.id}
                    className="flex items-center text-[var(--primary)] justify-between p-4 border border-gray-200  rounded-lg hover:border-gray-300 transition-colors bg-[var(--extra)]"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(arquivo.name)}
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-medium text-[var(--primary)] truncate"
                          title={arquivo.name}
                        >
                          {arquivo.name}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {extension || "arquivo"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isImage && arquivo.url && (
                        <Button
                          size="sm"
                          onClick={() =>
                            setImageViewer({
                              isOpen: true,
                              imageUrl: arquivo.url!,
                              imageName: arquivo.name,
                            })
                          }
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Visualizar
                        </Button>
                      )}

                      <Button
                        size="sm"
                        onClick={() => downloadAnexo(arquivo)}
                        disabled={downloadingFile === arquivo.id}
                        className="flex items-center gap-2"
                      >
                        {downloadingFile === arquivo.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        {downloadingFile === arquivo.id
                          ? "Baixando..."
                          : "Baixar"}
                      </Button>

                      {arquivo.url && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(arquivo.url, "_blank")}
                          className="p-2"
                          title="Abrir em nova aba"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>

      {/* Image Viewer Modal */}
      {imageViewer?.isOpen && (
        <Modal
          isOpen={true}
          onClose={() => setImageViewer(null)}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-[var(--extra)]">
                {imageViewer.imageName}
              </h3>
            </div>

            <div className="flex justify-center bg-gray-100 rounded-lg p-4 max-h-[70vh] overflow-auto">
              <img
                src={imageViewer.imageUrl}
                alt={imageViewer.imageName}
                className="max-w-full max-h-full object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  // You could show an error state here
                }}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => window.open(imageViewer.imageUrl, "_blank")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir em nova aba
              </Button>
              <Button onClick={() => setImageViewer(null)}>Fechar</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ModalDetalhes;
