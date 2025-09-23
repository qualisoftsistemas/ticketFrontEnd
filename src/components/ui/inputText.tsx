// components/ui/inputText.tsx
import React, { ChangeEvent } from "react";
import { Label } from "./label";
import { Input } from "./input";

type InputTextProps = {
  label?: string;
  value?: string; // Propriedade opcional para inputs controlados
  onChange?: (value: string) => void; // Propriedade opcional para inputs controlados
  placeholder?: string;
  name?: string;
  id?: string;
  type?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  bgIcon?: string;
  textColor?: string;
  labelColor?: string;
};

const InputText: React.FC<InputTextProps> = ({
  label,
  value, // Recebe o valor opcional
  onChange, // Recebe a função opcional
  placeholder = "",
  name,
  id,
  type = "text",
  disabled = false,
  icon,
  iconPosition = "left",
  bgIcon = "bg-[var(--extra)]",
  textColor = "text-[var(--primary)]",
  labelColor= ""
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <Label htmlFor={id} className={`${labelColor}`}>{label}</Label>}
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        name={name}
        {...(value !== undefined && { value })}
        {...(onChange && { onChange: handleChange })}
        disabled={disabled}
        icon={icon}
        iconPosition={iconPosition}
        bgInput={bgIcon}
        textColor={textColor}
      />
    </div>
  );
};

export default InputText;
