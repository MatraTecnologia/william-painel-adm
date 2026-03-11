"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/user";
import type {
  SystemConfig,
  SystemConfigUpdate,
  FileUploadData,
} from "@/types/system-config";

function useAuthHeaders() {
  const { getToken } = useAuth();
  return async () => {
    const token = await getToken();
    return { Authorization: `Bearer ${token}` };
  };
}

export function useSystemConfig() {
  const getHeaders = useAuthHeaders();

  return useQuery({
    queryKey: ["system-config"],
    queryFn: async () => {
      const headers = await getHeaders();
      const { data } = await api.get<ApiResponse<SystemConfig>>(
        "/system-config",
        { headers }
      );
      return data;
    },
  });
}

export function useUpdateSystemConfig() {
  const queryClient = useQueryClient();
  const getHeaders = useAuthHeaders();

  return useMutation({
    mutationFn: async (body: SystemConfigUpdate) => {
      const headers = await getHeaders();
      const { data } = await api.put<ApiResponse<SystemConfig>>(
        "/system-config",
        body,
        { headers }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-config"] });
    },
  });
}

export function useUploadSystemImage() {
  const queryClient = useQueryClient();
  const getHeaders = useAuthHeaders();

  return useMutation({
    mutationFn: async (body: FileUploadData) => {
      const headers = await getHeaders();
      const { data } = await api.put<ApiResponse<Record<string, string>>>(
        "/system-config/upload",
        body,
        { headers }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-config"] });
    },
  });
}
