import React from "react";
import { useSetorStore } from "@/store/setorStore";

const tableSelect = () => {
  const {
    setores,
    fetchSetores,
    loading,
    error,
    pagination,
    setorSelecionado,
  } = useSetorStore();

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Setor</th>
          </tr>
        </thead>
        <tbody>
          {setores.map((setor) => (
            <tr key={setor.id}>
              <td>{setor.nome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default tableSelect;
