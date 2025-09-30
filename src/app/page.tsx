import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <div>
      <div className="min-h-screen flex justify-between bg-[var(--neutral)]">
        <div className="my-auto ml-12 rounded-md bg-[var(--primary)]">
          <div className="p-3 rounded-t-md bg-[var(--secondary)]">
            <h1 className="text-[var(--secondary-foreground)] text-3xl text-center">
              Acesso Credenciado
            </h1>
          </div>

          <div className="py-6 px-8 flex flex-col items-center">
            <h2 className="text-[var(--primary-foreground)] text-lg mb-4">Seu Acesso</h2>

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
        <div className="p-8 my-auto">
          <img src="Images/qualisoft1.png" className="w-md object-cover my-8" />
          <h1 className="text-2xl text-center text-[var(--primary)]">
            Qualisoft Informática
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
