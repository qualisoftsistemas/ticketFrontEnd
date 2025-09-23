import React from "react";
import { Button } from "../ui/button";

type Props = {
  onToggleFilter?: () => void;
};

const ActionBox: React.FC<Props> = ({ onToggleFilter }) => {
  return (
    <div className="flex rounded gap-2 bg-[var(--secondary)] p-0.5">
      <Button variant="ghost" onClick={onToggleFilter}>
        <img src="/Icons/Filter.svg" alt="Filtrar" className="w-6 h-6" />
      </Button>
      <Button variant="ghost">
        <img src="/Icons/FilePDF.svg" alt="Exportar PDF" className="w-6 h-6" />
      </Button>
      <Button variant="ghost">
        <img src="/Icons/FileCSV.svg" alt="Exportar CSV" className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default ActionBox;
