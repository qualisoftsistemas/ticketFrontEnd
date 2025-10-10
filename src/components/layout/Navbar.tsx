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
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  if (!role) return null;

  return (
    <div className="bg-gray-50 h-screen w-full">
      <Sidebar role={role} isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col transition-all duration-300">
        <Header role={role} toggleSidebar={toggleSidebar} isOpen={isOpen} />

        <main
          className={`
                flex-1 p-4 bg-gray-50 overflow-y-auto
                transition-all duration-300 ease-in-out   mt-16 
                ${isOpen ? "md:ml-64" : "md:ml-0"}       
            `}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Navbar;
