// src/utils/toastService.ts
import { toast } from "sonner";

export const toastSuccess = (message: string, title?: string) =>
  toast.success(message, { description: title });

export const toastError = (message: string, title?: string) =>
  toast.error(message, { description: title });

export const toastInfo = (message: string, title?: string) =>
  toast(message, { description: title });
