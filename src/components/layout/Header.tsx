import React from "react";
import Link from "next/link";

type HeaderProps = {
  toggleSidebar: () => void;
  isOpen: boolean;
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isOpen }) => {
  return (
    <header className="relative flex justify-center items-center w-full bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-md z-50">
      <div className="flex items-center justify-center border-r px-12 py-3 border-[var(--secondary-foreground)]">
        <button onClick={toggleSidebar} className="cursor-pointer">
          {isOpen ? (
            <img src="/icons/close.svg" alt="menu" className="w-10 h-10" />
          ) : (
            <img src="/icons/open.svg" alt="menu" className="w-10 h-10" />
          )}
        </button>
      </div>

      <div className="w-full mx-auto flex items-center justify-between px-8">
        <div className="flex gap-2 items-center">
          <img src="/icons/config.svg" alt="config" className="w-8 h-8" />
          <div>
            <h1 className="font-bold">Empresa</h1>
            <p className="text-xs">CNPJ: 00</p>
          </div>
          <img src="/icons/config.svg" alt="config" className="ml-4 w-4 h-4" />
        </div>

        <div className="flex items-center gap-6">
          <Link href="/sobre">
            <img src="/icons/config.svg" alt="config" className="w-6 h-6" />
          </Link>
          <Link href="/notificacoes">
            <img src="/icons/bell.svg" alt="bell" className="w-6 h-6" />
          </Link>
        </div>

        <Link
          href="/perfil"
          className="flex items-center gap-2 hover:text-[var(--secondary)] transition"
        >
          <img src="/icons/userIcon.svg" alt="user" className="w-10 h-10" />
          <h1 className="font-bold">Eu sou o Usuário</h1>
          <img src="/icons/userIcon.svg" alt="user" className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
