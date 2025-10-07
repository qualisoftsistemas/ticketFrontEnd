// src/utils/toastService.ts
import { toast } from "react-toastify";
import CustomToastContent from "@/components/ui/customToast";

type ToastType = "primary" | "warning" | "success" | "error" | "info";

/**
 * Exibe um toast customizado com estilo global.
 */
export const showToast = (
  type: ToastType,
  title: string,
  message: string,
  options?: Record<string, any>
) => {
  toast(<CustomToastContent>   {
    type: "default", 
    ...options,
  });
};

// Atalhos práticos:
export const toastSuccess = (message: string, title = "Sucesso!") =>
  showToast("success", title, message);

export const toastError = (message: string, title = "Erro!") =>
  showToast("error", title, message);

export const toastWarning = (message: string, title = "Atenção!") =>
  showToast("warning", title, message);

export const toastInfo = (message: string, title = "Informação") =>
  showToast("primary", title, message);
