import { useQuery, useMutation, useQueryClient, queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Habit } from "@shared/types";
import { toast } from "sonner";
import { HabitFormData } from "@/lib/validators";
import { useAuthStore } from "./use-auth-store";
import { useHydration } from "./use-hydration";
const habitsQueryOptions = queryOptions({
  queryKey: ["habits"],
  queryFn: () => api<{ items: Habit[] }>("/api/habits"),
});
export function useHabits() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useHydration();
  const { data, isLoading, isError } = useQuery({
    ...habitsQueryOptions,
    enabled: isAuthenticated && hasHydrated,
  });
  const habits = data?.items || [];
  const createHabitMutation = useMutation({
    mutationFn: (newHabit: HabitFormData) => {
      return api<Habit>("/api/habits", {
        method: "POST",
        body: JSON.stringify(newHabit),
      });
    },
    onSuccess: () => {
      toast.success("Habit created successfully!");
      return queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
    onError: (error) => {
      toast.error(`Failed to create habit: ${error.message}`);
    },
  });
  const updateHabitMutation = useMutation({
    mutationFn: ({ id, ...updatedHabit }: { id: string } & Partial<HabitFormData>) => {
      return api<Habit>(`/api/habits/${id}`, {
        method: "PUT",
        body: JSON.stringify(updatedHabit),
      });
    },
    onSuccess: () => {
      toast.success("Habit updated successfully!");
      return queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
    onError: (error) => {
      toast.error(`Failed to update habit: ${error.message}`);
    },
  });
  const deleteHabitMutation = useMutation({
    mutationFn: (id: string) => {
      return api<{ id: string; deleted: boolean }>(`/api/habits/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("Habit deleted successfully!");
      return queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
    onError: (error) => {
      toast.error(`Failed to delete habit: ${error.message}`);
    },
  });
  const logHabitMutation = useMutation({
    mutationFn: ({ habitId, date, value }: { habitId: string; date: string; value: number }) => {
      return api<Habit>(`/api/habits/${habitId}/log`, {
        method: "POST",
        body: JSON.stringify({ date, value }),
      });
    },
    onSuccess: () => {
      toast.success("Progress logged!");
      return queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
    onError: (error) => {
      toast.error(`Failed to log progress: ${error.message}`);
    },
  });
  return {
    habits,
    isLoading,
    isError,
    createHabit: createHabitMutation.mutate,
    isCreating: createHabitMutation.isPending,
    updateHabit: updateHabitMutation.mutate,
    isUpdating: updateHabitMutation.isPending,
    deleteHabit: deleteHabitMutation.mutate,
    isDeleting: deleteHabitMutation.isPending,
    logHabit: logHabitMutation.mutate,
    isLogging: logHabitMutation.isPending,
  };
}