"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Role } from "@/hooks/useUserRole";
import Icon from "../ui/icon";

interface SidebarProps {
  role: Role;
}

interface NavItem {
  label: string;
  href?: string;
  icon?: string;
  subItems?: NavItem[];
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
        className="px-4 py-2 hover:-translate-y-0.5 hover:brightness-200 transition flex items-center gap-3"
      >
        {item.icon && <Icon icon={item.icon} />}
        <p className="text-lg">{item.label}</p>
      </Link>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 flex items-center justify-between hover:-translate-y-0.5 hover:brightness-200 transition"
      >
        <div className="flex items-center gap-3">
          {item.icon && <Icon icon={item.icon} />}
          <p className="text-lg">{item.label}</p>
        </div>
        <img
          src={open ? "/Icons/ArrowUp.svg" : "/Icons/ArrowDown.svg"}
          alt="Dropdown Arrow"
          className="w-4 h-4"
        />
      </button>
      {open && (
        <div className="pl-10 flex flex-col gap-1">
          {item.subItems.map((subItem, idx) => (
            <Link
              key={idx}
              href={subItem.href ?? "#"}
              className="px-4 py-2 hover:-translate-y-0.5 hover:brightness-200 transition"
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const links: NavItem[] = [
    { label: "Chamados", href: "/chamados", icon: "/Icons/Message.svg" },
    { label: "Arquivos", href: "/arquivos", icon: "/Icons/FileAnalytics.svg" },
  ];

  const adminLinks: NavItem[] = [
    ...links,
    {
      label: "Funcionários",
      href: "/funcionario",
      icon: "/Icons/Employee.svg",
    },
  ];

  const masterLinks: NavItem[] = [
    ...links,
    {
      label: "Master",
      icon: "/Icons/Master.svg",
      subItems: [
        { label: "Setor", href: "/setor" },
        { label: "Categoria", href: "/categoria" },
        { label: "Empresa", href: "/empresa" },
        { label: "Admin", href: "/admin" },
        { label: "Operador", href: "/operador" },
        { label: "Conglomerado", href: "/conglomerado" },
      ],
    },
  ];

  const sistemaLinks: NavItem[] = [
    {
      label: "Sistema",
      icon: "/Icons/Master.svg",
      subItems: [
        { label: "Prestadores", href: "/prestador" },
        { label: "Master", href: "/master" },
      ],
    },
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
    <aside className="h-screen w-64 bg-[var(--primary)] text-[var(--primary-foreground)] flex flex-col shadow-lg">
      <nav className="flex flex-col gap-2 w-full mt-18 p-1">
        {navItems.map((item, idx) => (
          <DropdownNavItem key={idx} item={item} />
        ))}
      </nav>

      <div className="mt-auto w-full py-3 text-center border-t border-[var(--primary-foreground)]/50 text-sm">
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
