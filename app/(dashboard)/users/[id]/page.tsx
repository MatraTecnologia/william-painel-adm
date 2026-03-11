"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Pencil, Ban, Trash2 } from "lucide-react";
import { useUser } from "@/lib/queries/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, getUserStatus } from "@/components/status-badge";
import { UserEditDialog } from "@/components/user-edit-dialog";
import { UserBanDialog } from "@/components/user-ban-dialog";
import { UserDeleteDialog } from "@/components/user-delete-dialog";

function formatTs(ts: number | null) {
  if (!ts) return "—";
  return format(new Date(ts), "dd/MM/yyyy HH:mm", { locale: ptBR });
}

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = useUser(id);
  const user = data?.data;

  const [showEdit, setShowEdit] = useState(false);
  const [showBan, setShowBan] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <p className="text-muted-foreground">Usuario nao encontrado</p>
      </div>
    );
  }

  const email = user.emailAddresses?.[0]?.emailAddress ?? "—";
  const phone = user.phoneNumbers?.[0]?.phoneNumber ?? "—";
  const role =
    user.publicMetadata?.is_admin === true || user.publicMetadata?.role === "admin"
      ? "admin"
      : ((user.publicMetadata?.role as string) ?? "user");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <Card>
        <CardContent className="flex items-start gap-6 pt-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.imageUrl ?? undefined} />
            <AvatarFallback className="text-lg">
              {((user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">
                {user.firstName ?? ""} {user.lastName ?? ""}
              </h2>
              <Badge variant={role === "admin" ? "secondary" : "outline"}>
                {role}
              </Badge>
              <StatusBadge status={getUserStatus(user)} />
            </div>
            <p className="text-sm text-muted-foreground">{email}</p>
            {phone !== "—" && (
              <p className="text-sm text-muted-foreground">{phone}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBan(true)}
            >
              <Ban className="mr-2 h-4 w-4" />
              {user.banned ? "Desbloquear" : "Bloquear"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={() => setShowDelete(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Criado em
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{formatTs(user.createdAt)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Ultimo login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{formatTs(user.lastSignInAt)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Ultima atividade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{formatTs(user.lastActiveAt)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs font-mono text-muted-foreground truncate">
              {user.id}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="public">
        <TabsList>
          <TabsTrigger value="public">Public Metadata</TabsTrigger>
          <TabsTrigger value="private">Private Metadata</TabsTrigger>
          <TabsTrigger value="unsafe">Unsafe Metadata</TabsTrigger>
        </TabsList>
        <TabsContent value="public">
          <Card>
            <CardContent className="pt-6">
              <pre className="text-sm bg-muted p-4 rounded-md overflow-auto max-h-64">
                {JSON.stringify(user.publicMetadata, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="private">
          <Card>
            <CardContent className="pt-6">
              <pre className="text-sm bg-muted p-4 rounded-md overflow-auto max-h-64">
                {JSON.stringify(user.privateMetadata, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="unsafe">
          <Card>
            <CardContent className="pt-6">
              <pre className="text-sm bg-muted p-4 rounded-md overflow-auto max-h-64">
                {JSON.stringify(user.unsafeMetadata, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showEdit && (
        <UserEditDialog user={user} open={showEdit} onOpenChange={setShowEdit} />
      )}
      {showBan && (
        <UserBanDialog user={user} open={showBan} onOpenChange={setShowBan} />
      )}
      {showDelete && (
        <UserDeleteDialog
          user={user}
          open={showDelete}
          onOpenChange={setShowDelete}
          onDeleted={() => router.push("/users")}
        />
      )}
    </div>
  );
}
