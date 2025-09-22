// page.tsx
import Table from "@/components/table/Table";
import { Column } from "@/components/table/TableGeneric";
import apiFetchServer from "@/service/api";
import { Setor, SetorApiResponse } from "@/types/Setor";

const SetorPage = async ({
  searchParams,
}: {
  searchParams?: { q?: string };
}) => {
  const query = searchParams?.q
    ? `?q=${encodeURIComponent(searchParams.q)}`
    : "";

  let setores: Setor[] = [];

  try {
    const response = await apiFetchServer<SetorApiResponse>({
      method: "GET",
      endpoint: `/setor${query}`,
    });

    setores = response.setores || [];
  } catch (err) {
    console.error("API fetch error:", err);
  }

  const columns: Column<Setor>[] = [
    { header: "ID", key: "id" },
    { header: "Nome", key: "nome" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-[var(--primary)]">Setores</h1>
      <Table columns={columns} data={setores} nomeCadastro="Setor" />
    </div>
  );
};

export default SetorPage;
