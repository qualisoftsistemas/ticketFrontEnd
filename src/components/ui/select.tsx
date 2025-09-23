// src/components/Select/Select.tsx

import React, { useState, useRef, useEffect } from "react";
import { Portal } from "./portal";

export interface SelectOption {
  id: string | number;
  label: string;
}

export interface SelectProps {
  label: string;
  options: SelectOption[];
  onSelect: (option: SelectOption) => void;
  placeholder?: string;
  selectedOption?: SelectOption | null;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  onSelect,
  placeholder = "Selecione",
  selectedOption: propSelectedOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calcula a posição do dropdown quando ele abre
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelectOption = (option: SelectOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  const displayValue = propSelectedOption
    ? propSelectedOption.label
    : placeholder;

  return (
    <div className="relative  text-white" ref={dropdownRef}>
      <label className="block text-sm font-medium mb-1">{label}</label>

      {/* Botão do Select */}
      <div
        className="relative flex items-center justify-between p-3 cursor-pointer rounded-lg transition-colors duration-200 bg-[var(--extra)]  text-[var(--primary)]     "
        onClick={handleToggle}
      >
        <span className="truncate">{displayValue}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {isOpen && (
        <Portal>
          <div
            className="absolute z-50 rounded-lg shadow-lg overflow-hidden bg-[var(--secondary)] text-[var(--extra)]"
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
            }}
          >
            {options.map((option) => (
              <div
                key={option.id}
                className="p-3 cursor-pointer hover:bg-opacity-80 transition-colors duration-200"
                style={{
                  backgroundColor:
                    propSelectedOption?.id === option.id ? "#e5533d" : "",
                }}
                onClick={() => handleSelectOption(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </Portal>
      )}
    </div>
  );
};

export default Select;
