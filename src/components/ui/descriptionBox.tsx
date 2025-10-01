import { cn } from "@/lib/utils";
import React from "react";

interface DescriptionBoxProps {
  label: string;
  type: string;
  textColor?: string;
  className?: string;
}

const DescriptionBox: React.FC<DescriptionBoxProps> = ({
  type,
  label,
  className,
}) => {
  return (
    <div className="flex w-full">
      <span
        className={cn(
          "flex h-9 items-center justify-center rounded-l-md px-3 py-1 bg-[var(--secondary)] text-[var(--extra)]"
        )}
      >
        {type}
      </span>

      <span
        className={cn(
          "h-9 w-full min-w-0 border-none px-3 py-1 text-base outline-none transition-colors rounded-r bg-[var(--extra)] text-[var(--primary)]",

          className
        )}
      >
        {label}
      </span>
    </div>
  );
};

export default DescriptionBox;
