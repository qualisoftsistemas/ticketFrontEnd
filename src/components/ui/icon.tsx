import React from "react";

interface IconProps {
  icon: string;
  className?: string;
  onClick?: () => void
}

const Icon: React.FC<IconProps> = ({ icon, className = "w-6 h-6", onClick }) => {
  return (
    <div
      className={`cursor-pointer ${className}`}
      style={{
        WebkitMask: `url('${icon}') no-repeat center / contain`,
      }}
      onClick={onClick}
    ></div>
  );
};

export default Icon;
