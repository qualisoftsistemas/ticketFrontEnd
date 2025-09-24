"use client";
import React, { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useUserRole } from "@/hooks/useUserRole";

interface NavbarProps {
  children: ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const role = useUserRole();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  if (!role) return null;
  return (
    <div className="flex h-screen w-full">
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[var(--primary)] text-[var(--extra)] shadow-lg
          transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar role={role} />
      </aside>

      <div className="flex flex-col flex-1">
        <Header toggleSidebar={toggleSidebar} isOpen={isOpen} />

        <main
          className={`flex-1 p-6 bg-gray-50 overflow-y-auto transition-all duration-300 ${
            isOpen ? "ml-64" : "ml-0"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Navbar;
