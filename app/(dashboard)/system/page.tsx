"use client";

import { toast } from "sonner";
import {
  useCronStatus,
  useFollowUpMetrics,
  useStaleLeads,
  useRDStationStatus,
  useRunFollowUp,
  useRunRDRefresh,
  useRunAllCrons,
} from "@/lib/queries/system";
import { CronStatusCard } from "@/components/cron-status-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";

export default function SystemPage() {
  const { data: cronData, isLoading } = useCronStatus();
  const { data: metricsData } = useFollowUpMetrics();
  const { data: staleData } = useStaleLeads(7);
  const { data: rdData } = useRDStationStatus();

  const runFollowUp = useRunFollowUp();
  const runRDRefresh = useRunRDRefresh();
  const runAll = useRunAllCrons();

  const cronJobs = (cronData?.data as Record<string, unknown>)?.cronJobs as
    | Record<string, { name: string; schedule: string; description: string }>
    | undefined;

  async function handleRunAll() {
    try {
      await runAll.mutateAsync();
      toast.success("Todos os cron jobs executados");
    } catch {
      toast.error("Erro ao executar cron jobs");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sistema</h1>
          <p className="text-sm text-muted-foreground">
            Monitoramento de cron jobs e servicos
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRunAll}
          disabled={runAll.isPending}
        >
          <Play className="mr-2 h-4 w-4" />
          {runAll.isPending ? "Executando..." : "Executar todos"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cronJobs?.followUpFlow && (
          <CronStatusCard
            name={cronJobs.followUpFlow.name}
            schedule={cronJobs.followUpFlow.schedule}
            description={cronJobs.followUpFlow.description}
            onRun={() => runFollowUp.mutateAsync()}
            isRunning={runFollowUp.isPending}
          />
        )}
        {cronJobs?.rdstationTokenRefresh && (
          <CronStatusCard
            name={cronJobs.rdstationTokenRefresh.name}
            schedule={cronJobs.rdstationTokenRefresh.schedule}
            description={cronJobs.rdstationTokenRefresh.description}
            onRun={() => runRDRefresh.mutateAsync()}
            isRunning={runRDRefresh.isPending}
          />
        )}
        {cronJobs?.userSync && (
          <CronStatusCard
            name={cronJobs.userSync.name}
            schedule={cronJobs.userSync.schedule}
            description={cronJobs.userSync.description}
          />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Metricas Follow-up
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metricsData?.data ? (
              <pre className="text-sm bg-muted p-3 rounded-md overflow-auto max-h-48">
                {JSON.stringify(metricsData.data, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">Sem dados</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Leads Inativos (7 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {staleData?.data ? (
              <div className="text-3xl font-bold">
                {(staleData.data as Record<string, unknown>)?.staleLeadsCount?.toString() ?? "0"}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sem dados</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              RD Station Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rdData?.data ? (
              <pre className="text-sm bg-muted p-3 rounded-md overflow-auto max-h-48">
                {JSON.stringify(rdData.data, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">Sem dados</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
