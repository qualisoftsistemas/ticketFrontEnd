import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <div>
      <div className="relative min-h-screen flex flex-col items-center justify-center gap-8">
        <img
          src="Images/landing_page.webp"
          alt="Imagem de Fundo"
          className="absolute inset-0 w-full h-full -z-50"
        />
        <div className="rounded-md bg-[var(--primary)]">
          <div className="p-3 rounded-t-md bg-[var(--secondary)]">
            <h1 className="text-[var(--secondary-foreground)] text-3xl text-center">
              Acesso Credenciado
            </h1>
          </div>

          <div className="py-6 px-8 flex flex-col items-center">
            <h2 className="text-[var(--primary-foreground)] text-lg mb-4">
              Seu Acesso
            </h2>

            <Link href="/login">
              <Button className="text-lg" size={"lg"}>
                Sou usuário do sistema
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant={"link"}
                className="text-[var(--primary-foreground)] text-xs p-0"
              >
                Sou prestador de serviços
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
