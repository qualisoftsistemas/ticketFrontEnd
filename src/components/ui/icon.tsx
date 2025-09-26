import React from "react";

interface IconProps {
  icon: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ icon, className = "" }) => {
  return (
    <div
      className={`w-6 h-6 bg-[var(--secondary-foreground)] cursor-pointer ${className}`}
      style={{
        WebkitMask: `url('${icon}') no-repeat center / contain`,
      }}
    ></div>
  );
};

export default Icon;
