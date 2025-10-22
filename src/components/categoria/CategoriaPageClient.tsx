"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useCategoriaStore } from "@/store/categoriaStore";
import { Column } from "@/components/table/TableGeneric";
import { Categoria } from "@/types/Categoria";
import ModalCadastroCategoria from "./CadastroCategoria";
import { useSetorStore } from "@/store/setorStore";
import ModalDeletar from "@/components/ui/modalDelete";
import Table from "../table/Table";
import Icon from "../ui/icon";
import { useSearchParams } from "next/navigation";
import Select, { SelectOption } from "../ui/select";
import { Button } from "../ui/button";

export default function CategoriaPageClient() {
  const {
    categorias,
    fetchCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    toggleCategoria,
    loading,
    error,
    pagination,
  } = useCategoriaStore();

  const { setores, fetchSetores } = useSetorStore();

  const searchParams = useSearchParams();
  const setorIdFromUrl = searchParams.get("setor_id");

  const [showModal, setShowModal] = useState(false);
  const [editCategoria, setEditCategoria] = useState<Categoria | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategoriaId, setDeleteCategoriaId] = useState<number | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedSetor, setSelectedSetor] = useState<SelectOption | null>(null);
  const setorIdNumber = setorIdFromUrl ? Number(setorIdFromUrl) : undefined;

  // 🔹 Monta as opções de setores para o Select
  const setorOptions: SelectOption[] = setores.map((s) => ({
    label: s.nome,
    id: s.id,
  }));

  useEffect(() => {
    fetchSetores();
  }, [fetchSetores]);

  // 🔹 Busca categorias conforme o setor_id da URL
  useEffect(() => {
    const setorId = setorIdFromUrl ? Number(setorIdFromUrl) : undefined;

    fetchCategorias({
      page: 1,
      nome: searchTerm,
      setor_id: setorId,
    });

    if (setorId && setores.length > 0) {
      const setor = setores.find((s) => s.id === setorId);
      if (setor) {
        setSelectedSetor({ id: setor.id, label: setor.nome });
      } else {
        setSelectedSetor({ id: setorId, label: `Setor ${setorId}` });
      }
    }
  }, [fetchCategorias, setorIdFromUrl, setores]);

  const fetchTableData = useCallback(
    (page: number, nome = "") =>
      fetchCategorias({
        page,
        nome,
        setor_id:
          selectedSetor?.id !== undefined
            ? Number(selectedSetor.id)
            : setorIdNumber,
      }),
    [fetchCategorias, selectedSetor, setorIdNumber]
  );

  // 🔹 Excluir
  const handleDeleteClick = (id: number) => {
    setDeleteCategoriaId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteCategoriaId !== null) {
      await deleteCategoria(deleteCategoriaId);
      setShowDeleteModal(false);
      setDeleteCategoriaId(null);
      await fetchTableData(pagination?.current_page || 1, searchTerm);
    }
  };

  // 🔹 Paginação
  const handlePageChange = (page: number) => {
    fetchTableData(page, searchTerm);
  };

  // 🔹 Pesquisa
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    fetchTableData(1, term);
  };

  // 🔹 Criar / Editar
  const handleSubmit = async (data: Partial<Categoria>) => {
    setIsSubmitting(true);
    try {
      if (data?.id) {
        await updateCategoria(data);
      } else {
        await createCategoria(data);
      }
      await fetchTableData(pagination?.current_page || 1, searchTerm);
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
      setEditCategoria(null);
    }
  };

  // 🔹 Alternar ativo
  const handleToggleAtivo = (categoria: Categoria) => {
    const newAtivo = categoria.ativo ? 0 : 1;

    useCategoriaStore.setState((state) => ({
      categorias: state.categorias.map((s) =>
        s.id === categoria.id ? { ...s, ativo: newAtivo } : s
      ),
    }));

    toggleCategoria(categoria.id ?? 0).catch(() => {
      useCategoriaStore.setState((state) => ({
        categorias: state.categorias.map((s) =>
          s.id === categoria.id ? { ...s, ativo: categoria.ativo } : s
        ),
      }));
    });
  };

  const handleEdit = (categoria: Categoria) => {
    setEditCategoria(categoria);
    setShowModal(true);
  };

  // 🔹 Colunas da tabela
  const columns: Column<Categoria>[] = [
    { header: "ID", key: "incremental" },
    { header: "Setor", key: "setor", render: (c) => c.setor?.nome ?? "-" },
    { header: "Nome", key: "nome" },
    {
      header: "Ações",
      key: "actions" as keyof Categoria,
      render: (categoria: Categoria) => (
        <div className="flex justify-start gap-4 py-1">
          <Icon
            icon="/icons/Edit.svg"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleEdit(categoria)}
          />
          <Icon
            icon="/icons/Trash.svg"
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleDeleteClick(categoria.id)}
          />
          <Icon
            icon={
              categoria.ativo ? "/icons/LightOn.svg" : "/icons/LightOff.svg"
            }
            className="w-5 h-5 cursor-pointer hover:brightness-200 hover:scale-105 bg-[var(--primary-foreground)]"
            onClick={() => handleToggleAtivo(categoria)}
          />
        </div>
      ),
    },
  ];

  const legendas = [
    { icon: "/icons/Edit.svg", label: "Editar" },
    { icon: "/icons/LightOff.svg", label: "Ativar (Desativado)" },
    { icon: "/icons/LightOn.svg", label: "Desativar (Ativado)" },
    { icon: "/icons/Trash.svg", label: "Excluir" },
  ];

  // 🔹 Filtros
  const onApplyFilters = () => {
    fetchCategorias({
      page: 1,
      nome: searchTerm,
      setor_id: selectedSetor?.id
        ? Number(selectedSetor.id)
        : setorIdFromUrl
        ? Number(setorIdFromUrl)
        : undefined,
    });
  };

  const onClearFilters = () => {
    setSelectedSetor(null);
    setSearchTerm("");
    fetchCategorias({ page: 1, nome: "", setor_id: undefined });
  };
  
  if (loading && categorias.length === 0)
    return <p className="text-[var(--primary)]">Carregando categorias...</p>;
  if (error) return <p className="text-[var(--destructive)]">{error}</p>;

  return (
    <>
      <Table
        columns={columns}
        data={categorias}
        showCadastro={() => {
          setEditCategoria(null);
          setShowModal(true);
        }}
        setSearchTerm={setSearchTerm}
        loading={loading || isSubmitting}
        pagination={pagination}
        onPageChange={handlePageChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        legendasAcoes={legendas}
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
        renderFilters={({ onApply, onClear }) => (
          <div className="flex flex-col gap-4 w-full">
            <div className="flex w-full gap-2 flex-wrap">
              <div className="flex-1">
                <Select
                  label="Setor"
                  options={setorOptions}
                  placeholder="Selecione o setor"
                  selectedOption={selectedSetor}
                  onSelect={(option) => setSelectedSetor(option)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={onApply}>Aplicar Filtros</Button>
              <Button onClick={onClear}>Limpar Tudo</Button>
            </div>
          </div>
        )}
      />

      {showModal && (
        <ModalCadastroCategoria
          isOpen={showModal}
          initialData={editCategoria}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}

      {showDeleteModal && (
        <ModalDeletar
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          itemName={categorias.find((c) => c.id === deleteCategoriaId)?.nome}
        />
      )}
    </>
  );
}
