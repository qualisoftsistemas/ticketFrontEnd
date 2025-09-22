import React, { ChangeEvent } from "react";
import { Label } from "./label";
import { Input } from "./input";

type InputTextProps = {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  id?: string;
  type?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  bgIcon?: string;
};

const InputText: React.FC<InputTextProps> = ({
  label,
  value = "",
  onChange,
  placeholder = "",
  id,
  type = "text",
  disabled = false,
  icon,
  iconPosition = "left",
  bgIcon = "bg-[var(--extra)]",
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        icon={icon}
        iconPosition={iconPosition}
        bgInput={bgIcon}
      />
    </div>
  );
};

export default InputText;
