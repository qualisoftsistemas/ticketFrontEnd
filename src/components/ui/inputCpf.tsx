"use client";

import React from "react";
import InputText from "./inputText";
import { maskCPF } from "@/utils/mask";

type Props = {
  label?: string;
  value?: string;  
  onChange?: (value: string) => void;  
  placeholder?: string;
  labelColor?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
};

const InputCPF: React.FC<Props> = ({
  label,
  value,
  onChange,
  placeholder = "000.000.000-00",
  name,
  id,
  labelColor = "text-[var(--extra)]",
  disabled,
}) => {
  const handleChange = (val: string) => {
    const raw = val.replace(/\D/g, "");
    if (onChange) onChange(raw);
  };

  const displayValue = value ? maskCPF(value) : "";

  return (
    <InputText
      label={label}
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      name={name}
      id={id}
      labelColor={labelColor}
      disabled={disabled}
    />
  );
};

export default InputCPF;
