import LoginForm from "@/components/login/LoginForm";
import React from "react";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-screen p-2 bg-[var(--neutral)]">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
