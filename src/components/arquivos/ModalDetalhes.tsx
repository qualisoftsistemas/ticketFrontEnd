import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Upload } from "@/types/Arquivo";
import { Button } from "../ui/button";
import Badge from "../ui/badge";
import { API_BASE_URL } from "@/service/api";

interface ModalDataProps {
  modalData: Upload | null;
  setModalData: React.Dispatch<React.SetStateAction<Upload | null>>;
  mes: number;
  ano: number;
}

export const downloadArquivo = async (arquivo: {
  id: number;
  name: string;
  url: string;
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

const ModalDetalhes = ({ modalData, setModalData }: ModalDataProps) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      aprovado: "text-green-600 bg-green-50 border-green-200",
      rejeitado: "text-red-600 bg-red-50 border-red-200",
      pendente: "text-yellow-600 bg-yellow-50 border-yellow-200",
      processando: "text-blue-600 bg-blue-50 border-blue-200",
    };
    return colors[status] || "text-gray-600 bg-gray-50 border-gray-200";
  };

  if (!modalData) return null;

  const { arquivo } = modalData;
  const fileName = arquivo.name;
  const extension = fileName.split(".").pop()?.toLowerCase();
  const imageExtensions = ["png", "jpg", "jpeg", "gif", "bmp", "webp"];
  const isImage = imageExtensions.includes(extension || "");

  return (
    <Dialog open={!!modalData} onOpenChange={() => setModalData(null)}>
      <DialogContent className="max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-2 h-6 bg-primary rounded-full"></div>
            Detalhes do Envio
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Arquivo
              </label>
              <p className="font-medium truncate" title={arquivo.name}>
                {arquivo.name}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Empresa
              </label>
              <p className="font-medium">{modalData.empresa.nome}</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Usuário
              </label>
              <p className="font-medium">{modalData.user.nome}</p>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Status
            </label>
            <Badge
              label={modalData.status}
              bgColor={getStatusColor(modalData.status)}
              textColor={getStatusColor(modalData.status)}
            />
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-3">
            <Button
              size="sm"
              onClick={() => downloadArquivo(arquivo)}
              className="flex items-center gap-2"
            >
              <img src="/Icons/Download.svg" alt="Baixar" className="w-4 h-4" />
              Baixar Arquivo
            </Button>

            {isImage && arquivo.url && (
              <Button
                size="sm"
                onClick={() => window.open(arquivo.url, "_blank")}
                className="flex items-center gap-2"
              >
                <img
                  src="/Icons/Eye.svg"
                  alt="Visualizar"
                  className="w-4 h-4"
                />
                Visualizar
              </Button>
            )}
          </div>

          {/* Preview imagem */}
          {isImage && arquivo.url && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Preview
              </label>
              <div className="border rounded-lg p-2 bg-muted/20">
                <img
                  src={arquivo.url}
                  alt="Preview"
                  className="max-h-48 w-auto mx-auto rounded object-contain"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).style.display = "none")
                  }
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetalhes;
