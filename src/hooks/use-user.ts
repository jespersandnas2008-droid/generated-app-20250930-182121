import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { User } from "@shared/types";
import { toast } from "sonner";
import { useAuthStore } from "./use-auth-store";
export function useUser() {
  const { user, updateUser: updateUserInStore } = useAuthStore();
  const updateUserMutation = useMutation({
    mutationFn: (data: Partial<Pick<User, 'name'>>) => {
      return api<User>('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (updatedUser) => {
      toast.success("Profile updated successfully!");
      updateUserInStore(updatedUser);
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
  return {
    user,
    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
  };
}