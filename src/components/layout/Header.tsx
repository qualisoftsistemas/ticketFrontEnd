import React from "react";
import Link from "next/link";

type HeaderProps = {
  toggleSidebar: () => void;
  isOpen: boolean;
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isOpen }) => {
  return (
    <header className="w-full py-2 bg-[var(--secondary)] text-[var(--extra)] shadow-md z-50 relative ">
      <button
        onClick={toggleSidebar}
        className="absolute left-0 top-1/2 -translate-y-1/2 px-4 cursor-pointer "
      >
        {isOpen ? (
          <img src="/icons/close.svg" alt="menu" className="  w-8 h-8" />
        ) : (
          <img src="/icons/open.svg" alt="menu" className="  w-7 h-7" />
        )}
      </button>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 pl-16">
        <Link href="/" className="hover:text-[var(--secondary)] transition">
          Início
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/sobre">
            <img src="/icons/config.svg" alt="config" className="w-7 h-7" />
          </Link>
          <Link href="/notificacoes">
            <img src="/icons/bell.svg" alt="bell" className="w-7 h-7" />
          </Link>
        </div>

        <Link
          href="/perfil"
          className="flex items-center gap-2 hover:text-[var(--secondary)] transition"
        >
          <img src="/icons/userIcon.svg" alt="user" className="w-6 h-6" />
          Perfil
        </Link>
      </div>
    </header>
  );
};

export default Header;
