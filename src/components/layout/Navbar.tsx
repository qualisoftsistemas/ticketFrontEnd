"use client";
import React, { ReactNode, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useUserRole } from "@/hooks/useUserRole";
import TableSelectSetores from "../ui/tableSelect";
import apiFetchClient from "@/service/api";
import { UserLogin } from "@/types/UserLogin";

interface NavbarProps {
  children: ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const role = useUserRole();
  const [isOpen, setIsOpen] = useState(true);
  const [showTableSetores, setShowTableSetores] = useState(false);
  const [masterId, setMasterId] = useState<number | null>(null);
  const [user, setUser] = useState<UserLogin | null>(null);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (window !== undefined) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user.tipo === "MASTER") {
        setMasterId(user.id);
      }

      setUser(user);
    }
  }, []);

  if (!role) return null;

  const handleSetSetores = async (setores: number[]) => {
    try {
      await apiFetchClient({
        method: "PATCH",
        endpoint: `/atribuir_setores/master`,
        data: {
          setores: setores,
        },
      });

      setShowTableSetores(false);
    } catch (error) {
      console.error("Erro ao atribuir setores:", error);
    }
  };

  const handleShowSectorTree = () => {
    setShowTableSetores(true);
  };

  return (
    <div className="bg-gray-50 h-screen w-full">
      <Sidebar
        user={user}
        role={role}
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-1 flex flex-col transition-all duration-300">
        <Header
          handleShowSectorTree={handleShowSectorTree}
          role={role}
          toggleSidebar={toggleSidebar}
          isOpen={isOpen}
          user={user}
        />

        <main
          className={`
                flex-1 p-4 bg-gray-50 overflow-y-auto
                transition-all duration-300 ease-in-out   mt-16 
                ${isOpen ? "md:ml-64" : "md:ml-0"}       
            `}
        >
          {showTableSetores && (
            <TableSelectSetores
              isOpen={showTableSetores}
              masterId={masterId}
              onClose={() => setShowTableSetores(false)}
              onConfirm={(setores) => handleSetSetores(setores)}
              title="Atribuir Setores a mim"
            />
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Navbar;
