import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  bgInput?: string;
  bgIcon?: string;
  textColor?: string;
};

function Input({
  className,
  type,
  icon,
  iconPosition = "left",
  bgInput = "bg-zinc-800", // Cor de fundo do input (exemplo)
  bgIcon = "bg-red-600", // Cor de fundo do ícone (exemplo)
  textColor = "text-white", // Cor do texto e ícone (exemplo)
  ...props
}: InputProps) {
  return (
    <div className="flex w-full">
      {icon && iconPosition === "left" && (
        <span
          className={cn(
            "flex h-9 items-center justify-center rounded-l-md px-3 py-1",
            bgIcon,
            textColor
          )}
        >
          {icon}
        </span>
      )}

      <input
        type={type}
        data-slot="input"
        className={cn(
          "h-9 w-full min-w-0 border-none px-3 py-1 text-base shadow-xs outline-none transition-colors",
          iconPosition === "left" ? "rounded-r-md" : "rounded-l-md",
          "placeholder:text-gray-400 focus:outline-none",
          bgInput,
          textColor,
          className
        )}
        {...props}
      />

      {icon && iconPosition === "right" && (
        <span
          className={cn(
            "flex h-9 items-center justify-center rounded-r-md px-3 py-1",
            bgIcon,
            textColor
          )}
        >
          {icon}
        </span>
      )}
    </div>
  );
}

export { Input };
