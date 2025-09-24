import React, { useState } from "react";
import Link from "next/link";

type Role = "Funcionario" | "Admin" | "Operador" | "Master";

interface SidebarProps {
  role: Role;
}

interface NavItem {
  label: string;
  href: string;
  icon?: string;
  subItems?: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ role = "Master" }) => {
  const [masterOpen, setMasterOpen] = useState(false);

  const links: NavItem[] = [
    {
      label: "Chamados",
      href: "/chamados",
      icon: "/Icons/Message.svg",
    },
    {
      label: "Arquivos",
      href: "/arquivos",
      icon: "/Icons/FileAnalytics.svg",
    },
  ];

  const adminLinks: NavItem[] = [
    ...links,
    {
      label: "Funcionários",
      href: "/funcionarios",
      icon: "/Icons/User.svg",
    },
  ];

  const masterLinks: NavItem[] = [
    ...adminLinks,
    {
      label: "Master",
      href: "#",
      icon: "/Icons/Master.svg",
      subItems: [
        { label: "Setor", href: "/setor" },
        { label: "Categoria", href: "/categoria" },
        { label: "Empresa", href: "/empresa" },
        { label: "Admin", href: "/admin" },
        { label: "Funcionário", href: "/funcionario" },
        { label: "Operador", href: "/operador" },
        { label: "Conglomerado", href: "/conglomerado" },
      ],
    },
  ];

  let navItems: NavItem[] = [];
  if (role === "Funcionario" || role === "Operador") navItems = links;
  if (role === "Admin") navItems = adminLinks;
  if (role === "Master") navItems = masterLinks;

  return (
    <aside className="h-screen w-64 bg-[var(--primary)] text-[var(--primary-foreground)] flex flex-col shadow-lg items-center">
      <nav className="flex flex-col gap-2 w-full mt-18 p-1">
        {/* Renderiza Master no topo, se houver */}
        {role === "Master" && (
          <div className="w-full">
            <button
              onClick={() => setMasterOpen(!masterOpen)}
              className="w-full px-4 py-2 flex items-center justify-between hover:-translate-y-0.5 hover:brightness-200 transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src="/Icons/Master.svg"
                  alt="Master"
                  className="w-7 h-7 cursor-pointer"
                />
                <p className="text-lg">Master</p>
              </div>
              <img
                src={masterOpen ? "/Icons/ArrowUp.svg" : "/Icons/ArrowDown.svg"}
                alt="Dropdown Arrow"
                className="w-4 h-4"
              />
            </button>
            {masterOpen && (
              <div className="pl-10 flex flex-col gap-1">
                {[
                  { label: "Setor", href: "/Setores" },
                  { label: "Categoria", href: "/Categorias" },
                  { label: "Empresa", href: "/Empresas" },
                  { label: "Admin", href: "/Admins" },
                  { label: "Funcionário", href: "/Funcionarios" },
                  { label: "Operador", href: "/Operadores" },
                  { label: "Conglomerado", href: "/Conglomerados" },
                ].map((subItem, idx) => (
                  <Link
                    key={idx}
                    href={subItem.href}
                    className="px-4 py-2 hover:-translate-y-0.5 hover:brightness-200 transition"
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Renderiza o resto dos links normalmente */}
        {navItems
          .filter((item) => item.label !== "Master")
          .map((item, idx) => (
            <div key={idx} className="w-full">
              <Link
                href={item.href}
                className="px-4 py-2 hover:-translate-y-0.5 hover:brightness-200 transition flex items-center gap-3"
              >
                {item.icon && (
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-7 h-7 cursor-pointer"
                  />
                )}
                <p className="text-lg">{item.label}</p>
              </Link>
            </div>
          ))}
      </nav>

      <div className="w-full py-3 text-center border-t border-[var(--primary-foreground)]/50 text-sm">
        &copy; {new Date().getFullYear()} - By{" "}
        <a
          href="https://www.qualisoftsistemas.com.br/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Qualisoft
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
