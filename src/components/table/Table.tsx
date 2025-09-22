"use client";
import React, { useState, useMemo } from "react";
import TableGeneric, { Column } from "./TableGeneric";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ActionBox from "./ActionBox";
import Image from "next/image";

type User = {
  id: number;
  name: string;
  email: string;
};

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  nomeCadastro?: string;
}

const Table = ({ nomeCadastro = "Cadastro" }: ButtonProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const columns: Column<User>[] = [
    { header: "ID", render: (row) => row.id },
    { header: "Nome", render: (row) => row.name },
    { header: "Email", render: (row) => row.email },
    {
      header: "Ações",
      render: (row) => (
        <select className="bg-gray-200 text-black p-1 rounded">
          <option>Editar</option>
          <option>Deletar</option>
        </select>
      ),
    },
  ];

  const data: User[] = [
    { id: 1, name: "Rodrigo", email: "rodrigo@email.com" },
    { id: 2, name: "Maria", email: "maria@email.com" },
  ];

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  return (
    <div>
      <div className="flex justify-between items-center ">
        <div className="flex self-end">
          <ActionBox />
        </div>
        <div className="flex gap-2 pb-3">
          <Input
            icon={
              <Image
                src="/icons/search.svg"
                alt="Search"
                width={24}
                height={24}
              />
            }
            iconPosition="left"
            placeholder="Buscar por nome..."
            value={searchTerm}
            bgInput="bg-[var(--primary)]"
            bgIcon="bg-[var(--secondary)]"
            textColor="text-[var(--extra)]"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button>Novo {nomeCadastro}</Button>
        </div>
      </div>

      <TableGeneric columns={columns} data={filteredData} />
    </div>
  );
};

export default Table;
