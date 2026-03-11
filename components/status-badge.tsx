import { Badge } from "@/components/ui/badge";

type StatusType = "active" | "banned" | "locked" | "admin";

const statusConfig: Record<
  StatusType,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  active: { label: "Ativo", variant: "default" },
  banned: { label: "Banido", variant: "destructive" },
  locked: { label: "Bloqueado", variant: "outline" },
  admin: { label: "Admin", variant: "secondary" },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function getUserStatus(user: {
  banned: boolean;
  locked: boolean;
}): StatusType {
  if (user.banned) return "banned";
  if (user.locked) return "locked";
  return "active";
}
