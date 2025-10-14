"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Role } from "@/hooks/useUserRole";
import Icon from "../ui/icon";
import { useEmpresaStore } from "@/store/empresaStore";
import { useConglomeradoStore } from "@/store/conglomeradoStore";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import apiFetchClient from "@/service/api";

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
    setEmpresaSelecionada
  } = useEmpresaStore();

  const {
    conglomerados,
    conglomeradoSelecionado,
    fetchConglomerados,
    loadConglomeradoFromStorage,
    setConglomeradoSelecionado,
  } = useConglomeradoStore();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchConglomerados();
    loadConglomeradoFromStorage();
  }, []);

  const handleLogout = () => {
    try {
      apiFetchClient({
        method: "POST",
        endpoint: "/logout",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("empresa-store");
      localStorage.removeItem("conglomeradoSelecionado");
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, [conglomeradoSelecionado]);

  return (
    <header className="fixed flex justify-center items-center w-full bg-[var(--secondary)] text-[var(--secondary-foreground)] z-50">
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
        {role !== "Sistema" && role !== "Master" && role !== "Operador" && (
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
                  <Icon
                    icon="/Icons/ArrowUp.svg"
                    className="w-4 h-4 ml-2 bg-[var(--secondary-foreground)]"
                  />
                ) : (
                  <Icon
                    icon="/Icons/ArrowDown.svg"
                    className="w-4 h-4 ml-2 bg-[var(--secondary-foreground)]"
                  />
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
        {role !== "Sistema" && role !== "Admin" && role !== "Funcionario" && (
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
                    {conglomeradoSelecionado
                      ? `${conglomeradoSelecionado.nome} - ${
                          empresaSelecionada?.nome ?? "Selecione a empresa"
                        }`
                      : "Conglomerado - Empresa"}
                  </h1>
                </div>
                <Icon
                  icon={open ? "/Icons/ArrowUp.svg" : "/Icons/ArrowDown.svg"}
                  className="w-4 h-4 ml-2 bg-[var(--secondary-foreground)]"
                />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="bg-[var(--secondary)] text-[var(--extra)] mt-1"
            >
              {conglomerados.map((conglomerado) => (
                <DropdownMenuItem
                  key={conglomerado.id}
                  onSelect={(e) => {
                    e.preventDefault();
                    setConglomeradoSelecionado(conglomerado);
                  }}
                >
                  <span className="font-bold">{conglomerado.nome}</span>
                </DropdownMenuItem>
              ))}

              <div className="border-t border-[var(--secondary-foreground)] my-1" />

              {conglomeradoSelecionado &&
                empresas
                  .filter(
                    (e) => e.conglomerado?.id === conglomeradoSelecionado.id
                  )
                  .map((empresa) => (
                    <DropdownMenuItem
                      key={empresa.id}
                      onClick={() => setEmpresaSelecionadaAndReload(empresa)}
                    >
                      <span>{empresa.nome}</span>
                    </DropdownMenuItem>
                  ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className="hidden md:flex items-center gap-6">
          <Link href="/sobre">
            <img src="/Icons/Settings.svg" alt="config" className="w-6 h-6" />
          </Link>
          <Link href="/notificacoes">
            <img src="/Icons/Bell.svg" alt="bell" className="w-6 h-6" />
          </Link>
        </div>

        <div className="hidden md:flex  items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <img
                  src="/Icons/UserCircle.svg"
                  alt="user"
                  className="w-10 h-10"
                />
                <h1 className="font-bold">{user.nome}</h1>
                <Icon
                  icon="/Icons/ArrowDown.svg"
                  className="w-4 h-4 ml-2 bg-[var(--secondary-foreground)]"
                />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-[var(--secondary)] text-[var(--extra)] mt-1"
            >
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
