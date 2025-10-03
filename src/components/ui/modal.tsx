"use client";

import { useEffect, ReactNode } from "react";
import ModalPortal from "./modalPortal";
import { X } from "lucide-react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  isOpen?: boolean;
  maxWidth?: string;
  bgColor?: string;
  closeButtonColor?: string;
  textColor?: string;
}

export default function Modal({
  children,
  onClose,
  isOpen = false,
  maxWidth = "max-w-xl",
  bgColor = "bg-[var(--primary)]",
  textColor = "text-[var(--extra)]",
  closeButtonColor,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="font2 fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div
          className={`relative w-full ${maxWidth} ${bgColor} ${textColor} rounded-2xl p-6 max-h-[90vh] overflow-y-auto`}
        >
          <button
            onClick={onClose}
            className={`sticky flex items-center justify-end w-full ${
              closeButtonColor ?? "text-[var(--destructive)]"
            } hover:opacity-80 cursor-pointer`}
          >
            <X className="w-6 h-6 text-[var(--destructive)]" />
          </button>

          {children}
        </div>
      </div>
    </ModalPortal>
  );
}
