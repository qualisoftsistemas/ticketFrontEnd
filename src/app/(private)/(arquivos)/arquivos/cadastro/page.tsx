"use client";
import React, { useEffect } from "react";
import { useUserRole } from "@/hooks/useUserRole";
const page = () => {
  const role = useUserRole();
  useEffect(() => {
    if (role !== "Operador" && role !== "Master") window.location.href = "/";
  }, [role]);

  if (!role) return null;

  return (
    <div>
      <form></form>
    </div>
  );
};

export default page;
