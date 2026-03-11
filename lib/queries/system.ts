"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/user";

function useAuthHeaders() {
  const { getToken } = useAuth();
  return async () => {
    const token = await getToken();
    return { Authorization: `Bearer ${token}` };
  };
}

export function useCronStatus() {
  const getHeaders = useAuthHeaders();

  return useQuery({
    queryKey: ["cron-status"],
    queryFn: async () => {
      const headers = await getHeaders();
      const { data } = await api.get<ApiResponse>("/admin/cron/status", {
        headers,
      });
      return data;
    },
    refetchInterval: 30000,
  });
}

export function useFollowUpMetrics() {
  const getHeaders = useAuthHeaders();

  return useQuery({
    queryKey: ["follow-up-metrics"],
    queryFn: async () => {
      const headers = await getHeaders();
      const { data } = await api.get<ApiResponse>(
        "/admin/cron/follow-up-flow/metrics",
        { headers }
      );
      return data;
    },
  });
}

export function useStaleLeads(days = 7) {
  const getHeaders = useAuthHeaders();

  return useQuery({
    queryKey: ["stale-leads", days],
    queryFn: async () => {
      const headers = await getHeaders();
      const { data } = await api.get<ApiResponse>(
        `/admin/cron/follow-up-flow/stale-leads?days=${days}`,
        { headers }
      );
      return data;
    },
  });
}

export function useRDStationStatus() {
  const getHeaders = useAuthHeaders();

  return useQuery({
    queryKey: ["rdstation-status"],
    queryFn: async () => {
      const headers = await getHeaders();
      const { data } = await api.get<ApiResponse>(
        "/admin/cron/rdstation-token-refresh/connection-status",
        { headers }
      );
      return data;
    },
  });
}

export function useRunFollowUp() {
  const getHeaders = useAuthHeaders();

  return useMutation({
    mutationFn: async () => {
      const headers = await getHeaders();
      const { data } = await api.post<ApiResponse>(
        "/admin/cron/follow-up-flow/run",
        {},
        { headers }
      );
      return data;
    },
  });
}

export function useRunRDRefresh() {
  const getHeaders = useAuthHeaders();

  return useMutation({
    mutationFn: async () => {
      const headers = await getHeaders();
      const { data } = await api.post<ApiResponse>(
        "/admin/cron/rdstation-token-refresh/run",
        {},
        { headers }
      );
      return data;
    },
  });
}

export function useRunAllCrons() {
  const getHeaders = useAuthHeaders();

  return useMutation({
    mutationFn: async () => {
      const headers = await getHeaders();
      const { data } = await api.post<ApiResponse>(
        "/admin/cron/run-all",
        {},
        { headers }
      );
      return data;
    },
  });
}
