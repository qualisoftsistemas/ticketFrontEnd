// hooks/useUserRole.ts
import { useEffect, useState } from "react";

export type Role = "Funcionario" | "Admin" | "Operador" | "Master" | "Sistema";

export const useUserRole = (): Role | null => {
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          switch (user.tipo) {
            case "MASTER":
              setRole("Master");
              break;
            case "ADMIN":
              setRole("Admin");
              break;
            case "OPERADOR":
              setRole("Operador");
              break;
            case "FUNCIONÁRIO":
              setRole("Funcionario");
              break;
            case "SISTEMA":
              setRole("Sistema");
              break;
            default:
              setRole(null);
          }
        } catch (e) {
          console.error("Erro ao parsear user do localStorage", e);
          setRole(null);
        }
      }
    }
  }, []);

  return role;
};
