import React, { useState, useEffect, useRef } from "react";

interface Props {
  loading?: boolean;
  onFilterChange: (status: string[]) => void;
}

const statuses = [
  "pendente_pelo_operador",
  "pendente_pelo_usuario",
  "aguardando_avaliacao",
  "concluido",
];

const defaultStatuses = [
  "pendente_pelo_operador",
  "pendente_pelo_usuario",
  "aguardando_avaliacao",
];

const statusConfig: {
  [key: string]: {
    label: string;
    icon: string;
    text: string;
  };
} = {
  pendente_pelo_operador: {
    label: "Pendente Operador",
    icon: "👤",
    text: "text-orange-700 dark:text-orange-300",
  },
  pendente_pelo_usuario: {
    label: "Pendente Usuário",
    icon: "👤",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  aguardando_avaliacao: {
    label: "Aguardando Avaliação",
    icon: "📋",
    text: "text-blue-700 dark:text-blue-300",
  },
  concluido: {
    label: "Concluído",
    icon: "✅",
    text: "text-green-700 dark:text-green-300",
  },
};

const FilterBox = ({ onFilterChange, loading }: Props) => {
  const [selected, setSelected] = useState<string[]>(defaultStatuses);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    onFilterChange(selected);
  }, []);

  const handleClick = (status: string) => {
    if (loading) return;

    const updated = selected.includes(status)
      ? selected.filter((s) => s !== status)
      : [...selected, status];

    setSelected(updated);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFilterChange(updated);
    }, 200);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 rounded-lg mb-4 w-full">
      {statuses.map((status) => {
        const isSelected = selected.includes(status);
        const config = statusConfig[status];

        return (
          <button
            key={status}
            className={`
          flex-1 sm:flex-auto cursor-pointer transition-all duration-200 ease-in-out
          p-2 md:p-3 rounded-lg border font-medium text-center
          hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${
            isSelected
              ? `${config.text} font-semibold bg-gray-100 dark:bg-gray-800 border-blue-500`
              : "text-gray-700 bg-white border-gray-300"
          }
          min-w-[140px]
        `}
            onClick={() => handleClick(status)}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">{config.icon}</span>
              <span className="text-xs md:text-sm whitespace-nowrap">
                {config.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default FilterBox;
