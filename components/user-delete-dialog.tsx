"use client";

import { toast } from "sonner";
import { useDeleteUser } from "@/lib/queries/users";
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

interface UserDeleteDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function UserDeleteDialog({
  user,
  open,
  onOpenChange,
  onDeleted,
}: UserDeleteDialogProps) {
  const deleteUser = useDeleteUser();

  async function handleConfirm() {
    try {
      await deleteUser.mutateAsync(user.id);
      toast.success("Usuario excluido");
      onOpenChange(false);
      onDeleted?.();
    } catch {
      toast.error("Erro ao excluir usuario");
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir usuario?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acao e irreversivel. O usuario{" "}
            <strong>
              {user.firstName ?? ""} {user.lastName ?? ""}
            </strong>{" "}
            sera excluido permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
