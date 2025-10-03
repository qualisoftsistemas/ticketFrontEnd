"use client";

import React from "react";
import InputText from "./inputText";
import { maskCNPJ } from "@/utils/mask";

type Props = {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  labelColor?: string;
  id?: string;
  disabled?: boolean;
};

const InputCNPJ: React.FC<Props> = ({
  label,
  value,
  onChange,
  placeholder = "00.000.000/0000-00",
  name,
  id,
  disabled,
}) => {
  const handleChange = (val: string) => {
    const raw = val.replace(/\D/g, "");
    if (onChange) onChange(raw);
  };

  const displayValue = value ? maskCNPJ(value) : "";

  return (
    <InputText
      label={label}
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      name={name}
      id={id}
      labelColor="text-[var(--extra)]"
      disabled={disabled}
    />
  );
};

export default InputCNPJ;
