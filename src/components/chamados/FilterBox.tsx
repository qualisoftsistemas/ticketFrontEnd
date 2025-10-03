import React, { useState, useEffect } from "react";

interface Props {
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

const FilterBox = ({ onFilterChange }: Props) => {
  const [selected, setSelected] = useState<string[]>(defaultStatuses);

  // Atualiza callback sempre que selected muda
  useEffect(() => {
    onFilterChange(selected);
  }, [selected, onFilterChange]);

  const handleClick = (status: string) => {
    let updated: string[];
    if (selected.includes(status)) {
      // desmarca se já estava selecionado
      updated = selected.filter((s) => s !== status);
    } else {
      // adiciona ao selecionado
      updated = [...selected, status];
    }
    setSelected(updated);
  };

  return (
    <div className="flex gap-4 p-4 rounded-lg mb-4 w-full flex-wrap">
      {statuses.map((status) => {
        const isSelected = selected.includes(status);
        const config = statusConfig[status];

        return (
          <button
            key={status}
            className={`
              flex-1 cursor-pointer transition-all duration-200 ease-in-out
              p-3 rounded-lg border border-gray-300 font-medium text-center
              hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${isSelected ? config.text + " font-semibold bg-gray-100" : "text-gray-700 bg-white"}
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
