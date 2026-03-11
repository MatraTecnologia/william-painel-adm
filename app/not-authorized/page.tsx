"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

export default function NotAuthorizedPage() {
  const { signOut } = useClerk();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <ShieldX className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Acesso Negado</h1>
        <p className="text-muted-foreground max-w-md">
          Voce nao tem permissao de administrador para acessar este painel.
          Entre em contato com um administrador.
        </p>
        <Button
          variant="outline"
          onClick={() => signOut({ redirectUrl: "/sign-in" })}
        >
          Sair e trocar de conta
        </Button>
      </div>
    </div>
  );
}
