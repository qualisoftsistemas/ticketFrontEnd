import { toast } from "sonner";
import CustomSonnerToast from "./customToast";

export const showRequestToast = (
  type: "success" | "error" = "success",
  message: string,
  title?: string
) => {
  const t = toast.custom((t) => (
    <CustomSonnerToast
      t={t}
      type={type}
      title={title || (type === "success" ? "Sucesso" : "Erro")}
      message={message}
    />
  ));

  setTimeout(() => toast.dismiss(t), 5000);

  return t;
};
