import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useHabits } from "@/hooks/use-habits";
import { Habit } from "@shared/types";
import { HabitForm } from "@/components/HabitForm";
import { HabitFormData } from "@/lib/validators";
import { Skeleton } from "@/components/ui/skeleton";
import { formatHabitFrequency } from "@/lib/utils";
const SkeletonLoader = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-12"></TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Frequency</TableHead>
        <TableHead>Goal</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {Array.from({ length: 3 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-4 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-8 w-8 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
export function HabitsPage() {
  const { habits, isLoading, createHabit, isCreating, updateHabit, isUpdating, deleteHabit } = useHabits();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const handleFormSubmit = (data: HabitFormData) => {
    if (editingHabit) {
      updateHabit({ id: editingHabit.id, ...data }, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingHabit(null);
        }
      });
    } else {
      createHabit(data, {
        onSuccess: () => {
          setDialogOpen(false);
        }
      });
    }
  };
  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setDialogOpen(true);
  };
  const handleAddNew = () => {
    setEditingHabit(null);
    setDialogOpen(true);
  };
  const formatGoal = (habit: Habit) => {
    if (!habit.goal || !habit.goal.target || !habit.goal.unit || !habit.goal.timeframe) {
      return "N/A";
    }
    return `${habit.goal.target} ${habit.goal.unit} / ${habit.goal.timeframe.slice(0, -2)}`;
  };
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">Habits</h1>
          <p className="text-muted-foreground">Create and manage your habits.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) setEditingHabit(null);
          setDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <HabitForm
            onSubmit={handleFormSubmit}
            defaultValues={editingHabit || undefined}
            isPending={isCreating || isUpdating}
          />
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Habits</CardTitle>
          <CardDescription>A list of all your current habits.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {habits.length > 0 ? habits.map((habit) => (
                  <TableRow key={habit.id}>
                    <TableCell>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: habit.color }}></div>
                    </TableCell>
                    <TableCell className="font-medium">{habit.name}</TableCell>
                    <TableCell>{formatHabitFrequency(habit.frequency)}</TableCell>
                    <TableCell>{formatGoal(habit)}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(habit)}>Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-500/10">Delete</DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your habit and all its data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteHabit(habit.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No habits found. Get started by adding a new one!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}