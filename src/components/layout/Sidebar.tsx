"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Role } from "@/hooks/useUserRole";
import Icon from "../ui/icon";
import { useEmpresaStore } from "@/store/empresaStore";
import { UserLogin } from "@/types/UserLogin";

interface SidebarProps {
  role: Role;
  isOpen: boolean;
  user: UserLogin;
  toggleSidebar: () => void;
}

interface NavItem {
  label: string;
  href?: string;
  icon?: string;
  subItems?: NavItem[];
  items?: NavItem[];
  type?: "section";
}

interface DropdownNavItemProps {
  item: NavItem;
}

const DropdownNavItem: React.FC<DropdownNavItemProps> = ({ item }) => {
  const [open, setOpen] = useState(false);

  if (!item.subItems) {
    return (
      <Link
        href={item.href ?? "#"}
        className="px-1 py-2 hover:-translate-y-0.5 hover:brightness-200 transition flex items-center gap-3"
      >
        {item.icon && (
          <Icon
            icon={item.icon}
            className="w-6 h-6 bg-[var(--primary-foreground)]"
          />
        )}
        <p>{item.label}</p>
      </Link>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-1 py-2 flex items-center justify-between hover:-translate-y-0.5 hover:brightness-200 transition cursor-pointer"
      >
        <div className="flex items-center gap-3">
          {item.icon && (
            <Icon
              icon={item.icon}
              className="w-6 h-6 bg-[var(--primary-foreground)]"
            />
          )}
          <p>{item.label}</p>
        </div>
        <img
          src={open ? "/Icons/ArrowUp.svg" : "/Icons/ArrowDown.svg"}
          alt="Dropdown Arrow"
          className="w-4 h-4"
        />
      </button>
      {item.subItems && (
        <div
          className={`pl-6 flex flex-col gap-1 overflow-hidden transition-all duration-500 ease-in-out ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {item.subItems.map((subItem, idx) => {
            if (subItem.type === "section") {
              return (
                <div key={idx} className="flex flex-col gap-1 my-1">
                  <p className="text-xs font-bold px-4 py-1">{subItem.label}</p>
                  {subItem.items?.map((i, iIdx) => (
                    <Link
                      key={iIdx}
                      href={i.href ?? "#"}
                      className="px-6 py-1 text-sm hover:-translate-y-0.5 hover:brightness-200 transition"
                    >
                      {i.label}
                    </Link>
                  ))}
                  <hr className="border-[var(--primary-foreground)]/20 my-1" />
                </div>
              );
            }

            return (
              <Link
                key={idx}
                href={subItem.href ?? "#"}
                className="px-4 py-1 text-sm hover:-translate-y-0.5 hover:brightness-200 transition"
              >
                {subItem.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  role,
  isOpen,
  toggleSidebar,
  user,
}) => {
  const { empresaSelecionada } = useEmpresaStore();

  const conglomeradoSelecionado =
    typeof window !== "undefined"
      ? localStorage.getItem("conglomeradoSelecionado")
      : null;

  const hasConglomerado = Boolean(conglomeradoSelecionado);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("empresa-store");
    localStorage.removeItem("conglomeradoSelecionado");

    window.location.href = "/";
  };

  const links: NavItem[] = [
    { label: "Ticket", href: "/chamados", icon: "/Icons/Message.svg" },
    { label: "DICE", href: "/arquivos", icon: "/Icons/FileAnalytics.svg" },
  ];

  const adminLinks: NavItem[] = [
    {
      label: "Funcionários",
      href: "/funcionario",
      icon: "/Icons/Employee.svg",
    },
    ...links,
  ];

  // 🟩 Filtra Empresa/Admin dependendo do conglomeradoSelecionado
  const masterClienteItems: NavItem[] = [
    ...(hasConglomerado
      ? [
          { label: "Empresa", href: "/empresa" },
          { label: "Admin", href: "/admin" },
        ]
      : []),
    { label: "Conglomerado", href: "/conglomerado" },
  ];

  const masterLinks: NavItem[] = [
    {
      label: "Master",
      icon: "/Icons/Master.svg",
      subItems: [
        {
          label: "Meu Serviço",
          type: "section",
          items: [
            { label: "Setor", href: "/setor" },
            { label: "Categoria", href: "/categoria" },
            { label: "Operadores", href: "/operador" },
          ],
        },
        {
          label: "Meus Clientes",
          type: "section",
          items: masterClienteItems,
        },
      ],
    },
    ...links,
  ];

  const sistemaLinks: NavItem[] = [
    { label: "Prestadores", href: "/prestador", icon: "/Icons/Buildings.svg" },
    { label: "Master", href: "/master", icon: "/Icons/Master.svg" },
  ];

  const navItems: NavItem[] = (() => {
    switch (role) {
      case "Master":
        return masterLinks;
      case "Admin":
        return adminLinks;
      case "Sistema":
        return sistemaLinks;
      case "Funcionario":
      case "Operador":
        return links;
      default:
        return [];
    }
  })();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-[var(--primary)] text-[var(--primary-foreground)] flex flex-col z-50 transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}  `}
    >
      <div className="mt-20">
        {role === "Operador" ||
          (role === "Master" && (
            <h2 className="mx-auto mb-2 font-bold text-center">
              {user.prestador.nome ?? ""}
            </h2>
          ))}
        <nav className="flex flex-col gap-1 w-full   p-1 overflow-y-auto">
          {navItems.map((item, idx) => (
            <DropdownNavItem key={idx} item={item} />
          ))}
        </nav>
      </div>

      <div className="mt-auto sm:hidden w-full py-2 px-2 flex flex-col gap-2 text-sm">
        <div className="w-full flex justify-center border-b border-[var(--primary-foreground)]/50 items-center gap-6 px-2 py-2">
          <Link href="/sobre">
            <img src="/Icons/Settings.svg" alt="config" className="w-6 h-6" />
          </Link>
          <Link href="/notificacoes">
            <img src="/Icons/Bell.svg" alt="bell" className="w-6 h-6" />
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <img src="/Icons/UserCircle.svg" alt="user" className="w-8 h-8" />
            <p className="font-bold">{user.nome}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-[var(--secondary)] text-[var(--secondary-foreground)] rounded hover:brightness-110 transition"
          >
            Logout
          </button>
        </div>
        <div className="text-center text-xs mt-2">
          &copy; {new Date().getFullYear()} - By{" "}
          <a
            href="https://www.qualisoftsistemas.com.br/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Qualisoft
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
