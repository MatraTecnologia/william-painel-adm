"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";
import type { UsersResponse, UserResponse, ApiResponse } from "@/types/user";

function useAuthHeaders() {
  const { getToken } = useAuth();
  return async () => {
    const token = await getToken();
    return { Authorization: `Bearer ${token}` };
  };
}

export function useUsers(page = 1, limit = 20, query = "") {
  const getHeaders = useAuthHeaders();

  return useQuery({
    queryKey: ["users", page, limit, query],
    queryFn: async () => {
      const headers = await getHeaders();
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (query) params.set("query", query);
      const { data } = await api.get<UsersResponse>(`/users?${params}`, {
        headers,
      });
      return data;
    },
  });
}

export function useUser(id: string) {
  const getHeaders = useAuthHeaders();

  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const headers = await getHeaders();
      const { data } = await api.get<UserResponse>(`/users/${id}`, {
        headers,
      });
      return data;
    },
    enabled: !!id,
  });
}

export function useInviteUser() {
  const queryClient = useQueryClient();
  const getHeaders = useAuthHeaders();

  return useMutation({
    mutationFn: async (body: {
      emailAddress: string;
      publicMetadata?: Record<string, unknown>;
      redirectUrl?: string;
    }) => {
      const headers = await getHeaders();
      const { data } = await api.post<ApiResponse>("/users/invite", body, {
        headers,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const getHeaders = useAuthHeaders();

  return useMutation({
    mutationFn: async ({
      id,
      ...body
    }: {
      id: string;
      firstName?: string;
      lastName?: string;
      publicMetadata?: Record<string, unknown>;
      privateMetadata?: Record<string, unknown>;
    }) => {
      const headers = await getHeaders();
      const { data } = await api.patch<UserResponse>(`/users/${id}`, body, {
        headers,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const getHeaders = useAuthHeaders();

  return useMutation({
    mutationFn: async (id: string) => {
      const headers = await getHeaders();
      const { data } = await api.delete<ApiResponse>(`/users/${id}`, {
        headers,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();
  const getHeaders = useAuthHeaders();

  return useMutation({
    mutationFn: async (id: string) => {
      const headers = await getHeaders();
      const { data } = await api.post<UserResponse>(
        `/users/${id}/ban`,
        {},
        { headers }
      );
      return data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", id] });
    },
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();
  const getHeaders = useAuthHeaders();

  return useMutation({
    mutationFn: async (id: string) => {
      const headers = await getHeaders();
      const { data } = await api.post<UserResponse>(
        `/users/${id}/unban`,
        {},
        { headers }
      );
      return data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", id] });
    },
  });
}

export function useUpdateMetadata() {
  const queryClient = useQueryClient();
  const getHeaders = useAuthHeaders();

  return useMutation({
    mutationFn: async ({
      id,
      type,
      metadata,
    }: {
      id: string;
      type: "public" | "private";
      metadata: Record<string, unknown>;
    }) => {
      const headers = await getHeaders();
      const { data } = await api.patch<UserResponse>(
        `/users/${id}/metadata/${type}`,
        { metadata },
        { headers }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
    },
  });
}
