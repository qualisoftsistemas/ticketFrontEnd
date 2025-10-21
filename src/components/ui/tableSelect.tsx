import React, { useEffect, useState } from "react";
import { useSetorStore } from "@/store/setorStore";
import { useOperadorStore } from "@/store/operadorStore";
import { useMasterStore } from "@/store/masterStore";
import Modal from "./modal";
import { Button } from "../ui/button";

interface TableSelectSetoresProps {
  isOpen: boolean;
  onClose: () => void;
  prestadorId?: number;
  masterId?: number | null;
  title: string;
  onConfirm: (selectedSetores: number[]) => void;
}

const ITEMS_PER_PAGE = 20;

const TableSelectSetores = ({
  isOpen,
  onClose,
  prestadorId,
  masterId,
  title,
  onConfirm,
}: TableSelectSetoresProps) => {
  const { setores, fetchSetores } = useSetorStore();
  const { operadorSelecionado, fetchOperadorById } = useOperadorStore();
  const { masterSelecionado, fetchMasterById } = useMasterStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSetores, setSelectedSetores] = useState<number[]>([]);

  // Busca operador ou master
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (prestadorId) {
          await fetchOperadorById(prestadorId);
        } else if (masterId) {
          await fetchMasterById(masterId);
        }
      } catch (error) {
        console.error("Erro ao buscar operador/master:", error);
      }
    };
    fetchData();
  }, [prestadorId, masterId, fetchOperadorById, fetchMasterById]);

  useEffect(() => {
    if (operadorSelecionado?.setores) {
      setSelectedSetores(operadorSelecionado.setores.map((s) => s.id));
    } else if (masterSelecionado?.setores) {
      setSelectedSetores(masterSelecionado.setores.map((s) => s.id));
    } else {
      setSelectedSetores([]);
    }
  }, [operadorSelecionado, masterSelecionado]);

  useEffect(() => {
    fetchSetores();
  }, [fetchSetores]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSetores = setores.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(setores.length / ITEMS_PER_PAGE);

  // Toggle de seleção individual
  const toggleSelect = (setorId: number) => {
    const current = selectedSetores || [];
    if (current.includes(setorId)) {
      setSelectedSetores(current.filter((id) => id !== setorId));
    } else {
      setSelectedSetores([...current, setorId]);
    }
  };

  // Toggle de seleção de todos
  const toggleSelectAll = () => {
    const current = selectedSetores || [];
    if (current.length === setores.length) {
      setSelectedSetores([]);
    } else {
      setSelectedSetores(setores.map((s) => s.id));
    }
  };

  const removeSelected = (id: number) => {
    setSelectedSetores((current) => current.filter((s) => s !== id));
  };

  const handleConfirm = () => {
    onConfirm(selectedSetores || []);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex gap-4">
        {/* Lista de setores */}
        <div className="flex-1">
          <h2 className="font-semibold font-lg mb-2">{title}</h2>
          <div className="flex justify-between mb-2">
            <Button variant="default" size="sm" onClick={toggleSelectAll}>
              {selectedSetores?.length === setores.length
                ? "Desmarcar Todos"
                : "Selecionar Todos"}
            </Button>
            <span>{selectedSetores?.length || 0} selecionados</span>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2 text-left">Setor</th>
              </tr>
            </thead>
            <tbody>
              {currentSetores.map((setor) => (
                <tr
                  key={setor.id}
                  className={`cursor-pointer text-xs ${
                    selectedSetores?.includes(setor.id)
                      ? "bg-[var(--secondary)]/60 text-[var(--secondary-foreground)]"
                      : ""
                  }`}
                  onClick={() => toggleSelect(setor.id)}
                >
                  <td className="border-b p-1">{setor.nome}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-2">
            <Button
              variant="default"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="self-center">
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="default"
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Próximo
            </Button>
          </div>
        </div>

        {/* Setores selecionados */}
        <div className="flex-1 flex flex-col gap-2">
          <h4 className="font-semibold">Selecionados:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSetores?.map((id) => {
              const setor = setores.find((s) => s.id === id);
              if (!setor) return null;
              return (
                <div
                  key={setor.id}
                  className="flex items-center gap-3 text-sm bg-[var(--secondary)] text-[var-(--secondary-foreground)] px-2 py-1 rounded-md"
                >
                  <span>{setor.nome}</span>
                  <button
                    type="button"
                    className="font-bold text-[var(--destructive)] text-xs cursor-pointer"
                    onClick={() => removeSelected(setor.id)}
                  >
                    X
                  </button>
                </div>
              );
            })}
          </div>
          <Button
            variant="confirm"
            className="mt-auto"
            onClick={handleConfirm}
            disabled={selectedSetores?.length === 0}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TableSelectSetores;
