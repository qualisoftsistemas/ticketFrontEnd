import React, { useEffect } from "react";
import { useUserRole } from "@/hooks/useUserRole";
const page = () => {
  const role = useUserRole();

  if (!role) return null;

  useEffect(() => {
    if (role !== "Operador" && role !== "Master") window.location.href = "/";
  }, [role]);

  return (
    <div>
      <form></form>
    </div>
  );
};

export default page;
