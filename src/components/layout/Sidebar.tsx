import React from "react";
import Link from "next/link";

const Sidebar: React.FC = () => {
  return (
    <aside className="h-screen w-64 bg-[var(--primary)] text-[var(--extra)] flex flex-col shadow-lg   items-center ">
      <nav className="flex-1 mt-24 p-4 space-y-2 w-full">
        <Link
          href="/Setores"
          className="block px-4 py-2 rounded-md hover:bg-[var(--secondary)] hover:text-[var(--secondary-foreground)] transition"
        >
          Setor
        </Link>
        <Link
          href="/dashboard"
          className="block px-4 py-2 rounded-md hover:bg-[var(--secondary)] hover:text-[var(--secondary-foreground)] transition"
        >
          Dashboard
        </Link>
        <Link
          href="/config"
          className="block px-4 py-2 rounded-md hover:bg-[var(--secondary)] hover:text-[var(--secondary-foreground)] transition"
        >
          Configurações
        </Link>
      </nav>

      {/* Footer da sidebar */}
      <div className="p-4 border-t border-[var(--extra)]/20 text-sm">
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
