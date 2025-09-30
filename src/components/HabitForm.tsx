import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Habit } from "@shared/types";
import { ChevronDown, Loader2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { habitSchema, type HabitFormData } from "@/lib/validators";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
interface HabitFormProps {
  onSubmit: (data: HabitFormData) => void;
  defaultValues?: Partial<Habit>;
  isPending: boolean;
}
export function HabitForm({ onSubmit, defaultValues, isPending }: HabitFormProps) {
  const [isGoalOpen, setGoalOpen] = useState(!!defaultValues?.goal);
  const form = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      color: defaultValues?.color || "#3b82f6",
      frequency: defaultValues?.frequency || { type: 'daily' },
      goal: defaultValues?.goal || undefined,
    },
  });
  const frequencyType = form.watch("frequency.type");
  return (
    <DialogContent className="sm:max-w-[480px]">
      <DialogHeader>
        <DialogTitle>{defaultValues?.id ? "Edit Habit" : "Add New Habit"}</DialogTitle>
        <DialogDescription>
          {defaultValues?.id ? "Update your habit details." : "Define a new habit you want to track."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Read for 15 minutes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input type="color" className="p-1 h-10 w-14" {...field} />
                    <Input
                      className="flex-1"
                      placeholder="#3b82f6"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="frequency.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  if (value === 'daily') form.setValue('frequency', { type: 'daily' });
                  if (value === 'weekly_days') form.setValue('frequency', { type: 'weekly_days', days: [] });
                  if (value === 'weekly_target') form.setValue('frequency', { type: 'weekly_target', count: 3 });
                  if (value === 'monthly_target') form.setValue('frequency', { type: 'monthly_target', count: 10 });
                }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly_days">Specific days of the week</SelectItem>
                    <SelectItem value="weekly_target">Times per week</SelectItem>
                    <SelectItem value="monthly_target">Times per month</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {frequencyType === 'weekly_days' && (
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Days</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      variant="outline"
                      value={field.value.type === 'weekly_days' ? field.value.days.map(String) : []}
                      onValueChange={(value) => field.onChange({ type: 'weekly_days', days: value.map(Number) })}
                      className="grid grid-cols-7 gap-1"
                    >
                      {daysOfWeek.map((day, index) => (
                        <ToggleGroupItem key={day} value={String(index)} aria-label={day}>
                          {day.charAt(0)}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {frequencyType === 'weekly_target' && (
            <FormField
              control={form.control}
              name="frequency.count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weekly Target</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {frequencyType === 'monthly_target' && (
            <FormField
              control={form.control}
              name="frequency.count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Target</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Collapsible open={isGoalOpen} onOpenChange={setGoalOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center justify-between w-full p-2">
                <span className="font-semibold">Set a Goal (Optional)</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isGoalOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="goal.unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., minutes, pages, reps" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goal.target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goal.timeframe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeframe</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a timeframe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CollapsibleContent>
          </Collapsible>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Saving..." : "Save Habit"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}