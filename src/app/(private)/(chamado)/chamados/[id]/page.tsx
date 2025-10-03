"use client";
import VisualizarChamado from "@/components/chamados/VisualizarChamado";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useChamadoStore } from "@/store/chamadoStore";

 
const ChamadoIdPage = () => {
  const { chamadoSelecionado, fetchChamadoById } = useChamadoStore();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  useEffect(() => {
    if (id) {
      fetchChamadoById(Number(id));
    }
  }, [id]);

  return (
    <div>
      <VisualizarChamado chamado={chamadoSelecionado } />
    </div>
  );
};

export default ChamadoIdPage;
