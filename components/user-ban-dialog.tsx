"use client";

import { toast } from "sonner";
import { useBanUser, useUnbanUser } from "@/lib/queries/users";
import type { User } from "@/types/user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserBanDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserBanDialog({ user, open, onOpenChange }: UserBanDialogProps) {
  const ban = useBanUser();
  const unban = useUnbanUser();
  const isBanned = user.banned;

  async function handleConfirm() {
    try {
      if (isBanned) {
        await unban.mutateAsync(user.id);
        toast.success("Usuario desbloqueado");
      } else {
        await ban.mutateAsync(user.id);
        toast.success("Usuario bloqueado");
      }
      onOpenChange(false);
    } catch {
      toast.error(isBanned ? "Erro ao desbloquear" : "Erro ao bloquear");
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBanned ? "Desbloquear" : "Bloquear"} usuario?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBanned
              ? `Desbloquear ${user.firstName ?? ""} ${user.lastName ?? ""}? O usuario podera acessar a plataforma novamente.`
              : `Bloquear ${user.firstName ?? ""} ${user.lastName ?? ""}? O usuario nao podera mais acessar a plataforma.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={!isBanned ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            {isBanned ? "Desbloquear" : "Bloquear"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
