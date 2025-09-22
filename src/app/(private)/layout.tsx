// components/layout/Layout.tsx
"use client";
import React, { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <Navbar>{children}</Navbar>;
};

export default Layout;
