import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Habit, HabitFrequency } from "@shared/types";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getProgressForPeriod(habit: Habit, period: 'week' | 'month'): number {
  const now = new Date();
  const interval = period === 'week'
    ? { start: startOfWeek(now, { weekStartsOn: 0 }), end: endOfWeek(now, { weekStartsOn: 0 }) }
    : { start: startOfMonth(now), end: endOfMonth(now) };
  return habit.logs
    .filter(log => {
      const date = parseISO(log.date);
      return isWithinInterval(date, interval);
    })
    .reduce((sum, log) => sum + log.value, 0);
}
export function formatHabitFrequency(frequency: HabitFrequency): string {
  switch (frequency.type) {
    case 'daily':
      return 'Daily';
    case 'weekly_days': {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return frequency.days.map(d => daysOfWeek[d]).join(', ');
    }
    case 'weekly_target':
      return `${frequency.count} time${frequency.count > 1 ? 's' : ''} a week`;
    case 'monthly_target':
      return `${frequency.count} time${frequency.count > 1 ? 's' : ''} a month`;
    default:
      return 'Custom';
  }
}