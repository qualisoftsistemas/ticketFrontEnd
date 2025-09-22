// app/setor/page.tsx
import React from "react";
import Table from "@/components/table/Table";
import apiFetch from "@/service/api";

type Setor = {
  id: number;
  nome: string;
  descricao?: string;
};

interface SetorPageProps {
  setores: Setor[];
}

const SetorPage = async ({
  searchParams,
}: {
  searchParams?: { q?: string };
}) => {
  const query = searchParams?.q
    ? `?q=${encodeURIComponent(searchParams.q)}`
    : "";

  const setores: Setor[] = await apiFetch<Setor[]>({
    method: "GET",
    endpoint: `setor${query}`,
  });

  const columns = [
    { header: "ID", render: (row: Setor) => row.id },
    { header: "Nome", render: (row: Setor) => row.nome },
    { header: "Descrição", render: (row: Setor) => row.descricao },
    {
      header: "Ações",
      render: (row: Setor) => (
        <select className="bg-gray-200 text-black p-1 rounded">
          <option>Editar</option>
          <option>Deletar</option>
        </select>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Table nomeCadastro="Setor" columns={columns} data={setores} />
    </div>
  );
};

export default SetorPage;
