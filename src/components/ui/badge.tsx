import React from "react";

interface BadgeProps {
  label: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  bgColor = "bg-[var(--secondary)]",
  textColor = "text-[var(--extra)]",
  className,
}) => {
  return (
    <span
      className={`inline-block px-2 py-1 rounded-full font-semibold 
                  ${bgColor ? bgColor : "bg-[var(--primary)]"} 
                  ${textColor ? textColor : "text-[var(--extra)]"} 
                  ${className ? className : ""}`}
    >
      {label}
    </span>
  );
};

export default Badge;
