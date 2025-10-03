"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Role } from "@/hooks/useUserRole";
import Icon from "../ui/icon";
import { useEmpresaStore } from "@/store/empresaStore";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type HeaderProps = {
  toggleSidebar: () => void;
  isOpen: boolean;
  role: Role;
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isOpen, role }) => {
  const [open, setOpen] = useState(false);
  const {
    empresas,
    fetchEmpresas,
    empresaSelecionada,
    setEmpresaSelecionadaAndReload,
  } = useEmpresaStore();

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  return (
    <header className="relative flex justify-center items-center w-full bg-[var(--secondary)] text-[var(--secondary-foreground)] z-50">
      <div className="flex items-center justify-center border-r-2 min-w-44 py-3 border-[var(--secondary-foreground)]">
        <button onClick={toggleSidebar} className="cursor-pointer">
          {isOpen ? (
            <img
              src="/Icons/CloseSidebar.svg"
              alt="menu"
              className="w-10 h-10"
            />
          ) : (
            <img
              src="/icons/OpenSidebar.svg"
              alt="menu"
              className="w-10 h-10"
            />
          )}
        </button>
      </div>

      <div className="w-full mx-auto flex items-center justify-between px-4">
        {role !== "Master" && role !== "Operador" && (
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2 items-center cursor-pointer">
                <img
                  src="/Icons/BuildingFill.svg"
                  alt="empresa"
                  className="w-8 h-8"
                />
                <div>
                  <h1 className="font-bold">
                    {empresaSelecionada ? empresaSelecionada.nome : "Empresa"}
                  </h1>
                  <p className="text-xs">
                    CNPJ: {empresaSelecionada?.cnpj ?? "--"}
                  </p>
                </div>
                {open ? (
                  <Icon icon="/Icons/ArrowUp.svg" className="w-4 h-4 ml-2 bg-[var(--secondary-foreground)]" />
                ) : (
                  <Icon icon="/Icons/ArrowDown.svg" className="w-4 h-4 ml-2 bg-[var(--secondary-foreground)]" />
                )}
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="bg-[var(--secondary)] text-[var(--extra)] mt-1"
            >
              {empresas.map((empresa) => (
                <DropdownMenuItem
                  key={empresa.id}
                  onClick={() => setEmpresaSelecionadaAndReload(empresa)}
                >
                  <div className="flex flex-col">
                    <span className="font-bold">{empresa.nome}</span>
                    <span className="text-xs text-muted-foreground">
                      CNPJ: {empresa.cnpj}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className="flex items-center gap-6">
          <Link href="/sobre">
            <img src="/Icons/Settings.svg" alt="config" className="w-6 h-6" />
          </Link>
          <Link href="/notificacoes">
            <img src="/Icons/Bell.svg" alt="bell" className="w-6 h-6" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <img src="/Icons/UserCircle.svg" alt="user" className="w-10 h-10" />
          <h1 className="font-bold">Eu sou o Usuário</h1>
          <Icon icon="/Icons/ArrowDown.svg" className="w-4 h-4 ml-2 bg-[var(--secondary-foreground)]" />
        </div>
      </div>
    </header>
  );
};

export default Header;
