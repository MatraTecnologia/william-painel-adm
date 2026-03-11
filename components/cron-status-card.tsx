"use client";

import { toast } from "sonner";
import { Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CronStatusCardProps {
  name: string;
  schedule: string;
  description: string;
  onRun?: () => Promise<unknown>;
  isRunning?: boolean;
}

export function CronStatusCard({
  name,
  schedule,
  description,
  onRun,
  isRunning,
}: CronStatusCardProps) {
  async function handleRun() {
    if (!onRun) return;
    try {
      await onRun();
      toast.success(`${name} executado com sucesso`);
    } catch {
      toast.error(`Erro ao executar ${name}`);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        <Badge variant="outline" className="text-xs">
          <Clock className="mr-1 h-3 w-3" />
          {schedule}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{description}</p>
        {onRun && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
          >
            <Play className="mr-2 h-3 w-3" />
            {isRunning ? "Executando..." : "Executar agora"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
