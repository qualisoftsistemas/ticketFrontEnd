import { Anexo } from "@/components/chamados/Mensagem";
import { API_BASE_URL } from "@/service/api";

export const downloadAnexo = async (anexo: Anexo) => {
  if (!anexo.arquivo && !anexo.id) {
    throw new Error("Anexo inválido");
  }

  console.log(anexo);
  const token = localStorage.getItem("token");

  try {
    // if (anexo.arquivo?.url) {
    //   window.open(anexo.arquivo.url, "_blank");
    //   return;
    // }

    if (anexo.id) {
      const res = await fetch(`${API_BASE_URL}/arquivo/download/${anexo.arquivo?.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Falha ao baixar o arquivo");

      const blob = await res.blob();
      const fileUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = anexo.arquivo?.nome || "arquivo";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(fileUrl);
    }
  } catch (error) {
    console.error("Erro ao baixar anexo:", error);
  }
};
