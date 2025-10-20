// src/components/table/ActionBox.tsx
import React from "react";

type Props = {
  onToggleFilter?: () => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
};

const ActionBox: React.FC<Props> = ({
  onToggleFilter,
  onExportPDF,
  onExportExcel,
}) => {
  return (
    <div className="flex gap-6 rounded-t-md px-4 py-1 bg-[var(--secondary)]">
      <img
        src="/icons/filter.svg"
        alt="Filtrar"
        className="w-5 h-5 cursor-pointer hover:scale-105"
        onClick={onToggleFilter}
      />
      <img
        src="/icons/FilePDF.svg"
        alt="Exportar PDF"
        className="w-5 h-5 cursor-pointer hover:scale-105"
        onClick={onExportPDF}
      />
      <img
        src="/icons/FileCSV.svg"
        alt="Exportar CSV"
        className="w-5 h-5 cursor-pointer hover:scale-105"
        onClick={onExportExcel}
      />
    </div>
  );
};

export default ActionBox;
