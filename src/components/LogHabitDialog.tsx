import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Habit } from "@shared/types";
import { Loader2 } from "lucide-react";
const logSchema = z.object({
  value: z.coerce.number().min(0, "Value must be positive."),
});
type LogFormData = z.infer<typeof logSchema>;
interface LogHabitDialogProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { habitId: string; value: number }) => void;
  isPending: boolean;
}
export function LogHabitDialog({ habit, isOpen, onClose, onSubmit, isPending }: LogHabitDialogProps) {
  const form = useForm<LogFormData>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      value: 1,
    },
  });
  useEffect(() => {
    if (habit) {
      const defaultValue = habit.goal?.target ? undefined : 1;
      form.reset({ value: defaultValue });
    }
  }, [habit, form]);
  const handleFormSubmit = (data: LogFormData) => {
    if (habit) {
      onSubmit({ habitId: habit.id, value: data.value });
    }
  };
  if (!habit) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Progress for "{habit.name}"</DialogTitle>
          <DialogDescription>
            Record your progress for today. Every step counts!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 pt-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {habit.goal?.unit ? `Amount (${habit.goal.unit})` : "Value"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={habit.goal?.unit ? `e.g., ${habit.goal.target}` : "e.g., 1 for completion"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Logging..." : "Log Progress"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}