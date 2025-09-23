import React from "react";

type Props = {
  onToggleFilter?: () => void;
};

const ActionBox: React.FC<Props> = ({ onToggleFilter }) => {
  return (
    <div className="flex gap-6 rounded-t-md px-4 py-1 bg-[var(--secondary)] border-b border-[var(--secondary-foreground)]">
      <img
        src="/Icons/Filter.svg"
        alt="Filtrar"
        className="w-5 h-5 cursor-pointer hover:scale-105"
        onClick={onToggleFilter}
      />
      <img src="/Icons/FilePDF.svg" alt="Exportar PDF" className="w-5 h-5 cursor-pointer hover:scale-105" />
      <img src="/Icons/FileCSV.svg" alt="Exportar CSV" className="w-5 h-5 cursor-pointer hover:scale-105" />
    </div>
  );
};

export default ActionBox;
