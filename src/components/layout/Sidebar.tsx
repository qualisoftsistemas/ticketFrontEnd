import React from "react";
import Link from "next/link";

const Sidebar: React.FC = () => {
  return (
    <aside className="h-screen w-64 bg-[var(--primary)] text-[var(--primary-foreground)] flex flex-col shadow-lg   items-center ">
      <nav className="flex flex-col gap-2 w-full mt-18 p-1">
        <Link
          href="/Setores"
          className="px-4 py-2 hover:-translate-y-0.5 hover:brightness-200 transition flex gap-2"
        >
          <p>Setor</p>
        </Link>
        <Link
          href="/Setores"
          className="px-4 py-2 hover:-translate-y-0.5 hover:brightness-200 transition flex items-center gap-3"
        >
          <img
            src="/Icons/Message.svg"
            alt="Página de Chamados"
            className="w-7 h-7 cursor-pointer"
          />
          <p className="text-lg">Chamados</p>
        </Link>
      </nav>

      {/* Footer da sidebar */}
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
