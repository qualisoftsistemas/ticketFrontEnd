"use client";
import React, { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface NavbarProps {
  children: ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[var(--primary)] text-[var(--extra)] shadow-lg
          transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar />
      </aside>

      {/* Conteúdo principal */}
      <div
        className={`
          flex flex-col flex-1 transition-all duration-300
          ${isOpen ? "ml-64" : "ml-0"}
        `}
      >
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Navbar;
