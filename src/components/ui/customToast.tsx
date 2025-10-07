import { X } from "lucide-react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const typeStyles = {
  primary: {
    barColor: "bg-red-500",
    icon: <AlertTriangle className="w-5 h-5" />,
    titleColor: "text-[var(--secondary)]",
  },
  success: {
    barColor: "bg-green-500",
    icon: <CheckCircle className="w-5 h-5" />,
    titleColor: "text-green-600",
  },
  error: {
    barColor: "bg-red-500",
    icon: <AlertTriangle className="w-5 h-5" />,
    titleColor: "text-[var(--destructive)]",
  },
};

interface ToastProps {
  t: string | number ; 
  type?: keyof typeof typeStyles;
  title: string;
  message: string;
}

const CustomSonnerToast = ({
  t,
  type = "primary",
  title,
  message,
}: ToastProps) => {
  const styles = typeStyles[type] || typeStyles.primary;

  return (
    <div className="flex w-full min-h-[80px] rounded-lg overflow-hidden">
      {/* Barra lateral */}
      <div className={`w-2 ${styles.barColor}`}></div>

      {/* Conteúdo */}
      <div className="flex flex-col bg-[var(--extra)] flex-1 p-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className={`${styles.titleColor}`}>{styles.icon}</span>
            <span className={`text-sm font-semibold ${styles.titleColor}`}>
              {title}
            </span>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-gray-700 mt-1 pl-7">{message}</p>
      </div>
    </div>
  );
};

export default CustomSonnerToast;
