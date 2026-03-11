"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal, Eye, Pencil, Ban, Trash2 } from "lucide-react";
import type { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge, getUserStatus } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { UserEditDialog } from "@/components/user-edit-dialog";
import { UserBanDialog } from "@/components/user-ban-dialog";
import { UserDeleteDialog } from "@/components/user-delete-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface UserTableProps {
  users: User[];
  isLoading?: boolean;
}

function getInitials(user: User) {
  const f = user.firstName?.[0] ?? "";
  const l = user.lastName?.[0] ?? "";
  return (f + l).toUpperCase() || "?";
}

function getPrimaryEmail(user: User) {
  return user.emailAddresses?.[0]?.emailAddress ?? "—";
}

function getRole(user: User) {
  const meta = user.publicMetadata;
  if (meta?.is_admin === true || meta?.role === "admin") return "admin";
  return (meta?.role as string) ?? "user";
}

function formatDate(ts: number | null) {
  if (!ts) return "—";
  return formatDistanceToNow(new Date(ts), { addSuffix: true, locale: ptBR });
}

export function UserTable({ users, isLoading }: UserTableProps) {
  const [editUser, setEditUser] = useState<User | null>(null);
  const [banUser, setBanUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        Nenhum usuario encontrado
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ultimo acesso</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.imageUrl ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={`/users/${user.id}`}
                    className="hover:underline"
                  >
                    {user.firstName ?? ""} {user.lastName ?? ""}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {getPrimaryEmail(user)}
                </TableCell>
                <TableCell>
                  <Badge variant={getRole(user) === "admin" ? "secondary" : "outline"}>
                    {getRole(user)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={getUserStatus(user)} />
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(user.lastActiveAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/users/${user.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditUser(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setBanUser(user)}>
                        <Ban className="mr-2 h-4 w-4" />
                        {user.banned ? "Desbloquear" : "Bloquear"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteUser(user)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editUser && (
        <UserEditDialog
          user={editUser}
          open={!!editUser}
          onOpenChange={(open) => !open && setEditUser(null)}
        />
      )}
      {banUser && (
        <UserBanDialog
          user={banUser}
          open={!!banUser}
          onOpenChange={(open) => !open && setBanUser(null)}
        />
      )}
      {deleteUser && (
        <UserDeleteDialog
          user={deleteUser}
          open={!!deleteUser}
          onOpenChange={(open) => !open && setDeleteUser(null)}
        />
      )}
    </>
  );
}
