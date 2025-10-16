import React, { useState, useEffect, useRef } from "react";

export interface StatusQtde {
  [key: string]: number;
}

interface Props {
  loading?: boolean;
  onFilterChange: (status: string[]) => void;
  statusQtde?: StatusQtde | null;
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

const statusConfig: Record<
  string,
  {
    label: string;
    icon: string;
  }
> = {
  pendente_pelo_operador: {
    label: "Pendente Operador",
    icon: "🕵️‍♀️",
  },
  pendente_pelo_usuario: {
    label: "Pendente Usuário",
    icon: "👨‍💼",
  },
  aguardando_avaliacao: {
    label: "Aguardando Avaliação",
    icon: "⭐",
  },
  concluido: {
    label: "Concluído",
    icon: "✅",
  },
};

const FilterBox = ({ onFilterChange, loading, statusQtde = {} }: Props) => {
  const [selected, setSelected] = useState<string[]>(defaultStatuses);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  console.log(statusQtde);

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
        const qtde = statusQtde?.[status] ?? 0;

        return (
          <button
            key={status}
            className={`
        flex-1 sm:flex-auto cursor-pointer transition-all duration-200 ease-in-out
        p-2 md:p-3 rounded-lg border font-medium text-center
        hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${
          isSelected
            ? `bg-[var(--secondary)] text-[var(--secondary-foreground)]`
            : "bg-[var(--primary)] text-[var(--primary-foreground)] border-gray-300"
        }
        min-w-[140px]
      `}
            onClick={() => handleClick(status)}
          >
            <div className="flex flex-wrap justify-center items-center md:justify-between gap-1">
              <div className="flex flex-wrap items-center justify-center gap-1">
                <span className="text-lg">{config.icon}</span>
                <span className="text-xs md:text-sm whitespace-nowrap">
                  {config.label}
                </span>
              </div>

              <span className="text-xs font-bold">{qtde}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default FilterBox;
