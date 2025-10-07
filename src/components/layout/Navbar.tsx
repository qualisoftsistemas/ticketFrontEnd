"use client";
import React, { ReactNode, useState } from "react";
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
    <div className="bg-[var(--foreground)] h-screen w-full">
      <Sidebar role={role} isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col transition-all duration-300">
        <Header role={role} toggleSidebar={toggleSidebar} isOpen={isOpen} />

        {/* Main */}
        <main className="flex-1 p-4 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Navbar;
