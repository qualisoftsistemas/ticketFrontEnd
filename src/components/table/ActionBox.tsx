import React from "react";
import { Button } from "../ui/button";

type Props = {
  onToggleFilter?: () => void;
};

const ActionBox: React.FC<Props> = ({ onToggleFilter }) => {
  return (
    <div className="flex rounded gap-2 bg-[var(--secondary)] p-0.5">
      <Button variant="ghost" onClick={onToggleFilter}>
        <img src="/icons/filter.svg" alt="Filtrar" className="w-6 h-6" />
      </Button>
      <Button variant="ghost">
        <img src="/icons/pdf.svg" alt="Exportar PDF" className="w-6 h-6" />
      </Button>
      <Button variant="ghost">
        <img src="/icons/sheet.svg" alt="Exportar XLS" className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default ActionBox;
