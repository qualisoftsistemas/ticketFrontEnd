import React from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const toastStyles = {
  primary: { color: "#E53E3E", icon: <FaCheckCircle /> },
  warning: { color: "#E53E3E", icon: <FaExclamationTriangle /> },
  success: { color: "#48BB78", icon: <FaCheckCircle /> },
};

type ToastType = "primary" | "warning" | "success";

interface CustomToastContentProps {
  type: ToastType;
  title: string;
  message: string;
}

const CustomToastContent: React.FC<CustomToastContentProps> = ({ type, title, message }) => {
  const style = toastStyles[type] || toastStyles.primary;

  return (
    <div className="custom-toast-content">
      <div
        className="custom-toast-border"
        style={{ backgroundColor: style.color }}
      ></div>
      <div className="custom-toast-text-area">
        <div className="custom-toast-header">
          <span className="custom-toast-title" style={{ color: style.color }}>
            {title}
          </span>
          <span className="custom-toast-icon" style={{ color: style.color }}>
            {style.icon}
          </span>
        </div>
        <p className="custom-toast-message">{message}</p>
      </div>
    </div>
  );
};

export default CustomToastContent;
