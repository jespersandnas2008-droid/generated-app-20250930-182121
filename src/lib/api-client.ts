import { ApiResponse } from "../../shared/types"
import { QueryClient } from '@tanstack/react-query'
import { useAuthStore } from "@/hooks/use-auth-store";
export const queryClient = new QueryClient()
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().token;
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const res = await fetch(path, { ...init, headers });
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !json.success || json.data === undefined) {
    if (res.status === 401) {
      useAuthStore.getState().logout();
    }
    throw new Error(json.error || 'Request failed');
  }
  return json.data;
}