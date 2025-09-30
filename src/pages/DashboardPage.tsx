import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Flame, Target, TrendingUp, Loader2, CalendarDays, Download, CheckCircle2 } from "lucide-react";
import { useHabits } from "@/hooks/use-habits";
import { format, subDays, getDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { useMemo, useState } from "react";
import { Habit } from "@shared/types";
import { Button } from "@/components/ui/button";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuthStore } from "@/hooks/use-auth-store";
import { motion, Variants } from "framer-motion";
import { getProgressForPeriod, cn } from "@/lib/utils";
import { LogHabitDialog } from "@/components/LogHabitDialog";
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};
export function DashboardPage() {
  const { habits, isLoading, logHabit, isLogging } = useHabits();
  const user = useAuthStore((state) => state.user);
  const [isExporting, setIsExporting] = useState(false);
  const [loggingHabit, setLoggingHabit] = useState<Habit | null>(null);
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todaysHabits = useMemo(() => {
    const todayDayOfWeek = getDay(new Date());
    return habits.filter(habit => {
      const { frequency } = habit;
      switch (frequency.type) {
        case 'daily':
          return true;
        case 'weekly_days':
          return frequency.days.includes(todayDayOfWeek);
        case 'weekly_target':
        case 'monthly_target':
          return true;
        default:
          return false;
      }
    });
  }, [habits]);
  const todayCompletion = useMemo(() => {
    if (todaysHabits.length === 0) return 0;
    const completedCount = todaysHabits.filter(h => h.logs.some(log => log.date === todayStr)).length;
    return (completedCount / todaysHabits.length) * 100;
  }, [todaysHabits, todayStr]);
  const weeklyData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, "yyyy-MM-dd");
      const completed = habits.filter(h => h.logs.some(log => log.date === dateStr)).length;
      return {
        day: format(date, 'EEE'),
        completed,
      };
    });
  }, [habits]);
  const stats = useMemo(() => {
    let totalCompletions = 0;
    let currentStreak = 0;
    habits.forEach(h => {
      totalCompletions += h.logs.length;
    });
    const allCompletionDates = [...new Set(habits.flatMap(h => h.logs.map(log => log.date)))].sort().reverse();
    if (allCompletionDates.length > 0) {
      let currentDate = new Date();
      if (allCompletionDates[0] === format(currentDate, "yyyy-MM-dd")) {
        currentStreak = 1;
        for (let i = 1; i < allCompletionDates.length; i++) {
          const prevDate = subDays(currentDate, 1);
          if (allCompletionDates[i] === format(prevDate, "yyyy-MM-dd")) {
            currentStreak++;
            currentDate = prevDate;
          } else {
            break;
          }
        }
      } else if (allCompletionDates[0] === format(subDays(currentDate, 1), "yyyy-MM-dd")) {
        currentStreak = 0;
      }
    }
    return { totalCompletions, currentStreak };
  }, [habits]);
  const monthlyStats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const completionByDay: { [key: string]: number } = {};
    daysInMonth.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const completedCount = habits.filter(h => h.logs.some(log => log.date === dateStr)).length;
        completionByDay[format(day, 'EEE')] = (completionByDay[format(day, 'EEE')] || 0) + completedCount;
    });
    let bestDay = 'N/A';
    let maxCompletions = -1;
    Object.entries(completionByDay).forEach(([day, count]) => {
        if (count > maxCompletions) {
            maxCompletions = count;
            bestDay = day;
        }
    });
    return { bestDay, totalHabits: habits.length };
  }, [habits]);
  const handleExportPDF = async () => {
    setIsExporting(true);
    const input = document.getElementById('dashboard-content');
    if (input) {
      try {
        const canvas = await html2canvas(input, { scale: 2, useCORS: true, backgroundColor: document.documentElement.classList.contains('dark') ? '#09090b' : '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`ritual-dashboard-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      } catch (error) {
        console.error("Error exporting PDF:", error);
      }
    }
    setIsExporting(false);
  };
  const handleLogSubmit = ({ habitId, value }: { habitId: string; value: number }) => {
    logHabit({ habitId, date: todayStr, value }, {
      onSuccess: () => setLoggingHabit(null)
    });
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <>
      <LogHabitDialog
        habit={loggingHabit}
        isOpen={!!loggingHabit}
        onClose={() => setLoggingHabit(null)}
        onSubmit={handleLogSubmit}
        isPending={isLogging}
      />
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}! Here's your progress for today.</p>
          </div>
          <Button onClick={handleExportPDF} disabled={isExporting}>
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Export as PDF
          </Button>
        </div>
        <div id="dashboard-content" className="space-y-8">
          <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                  <Flame className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.currentStreak} days</div>
                  <p className="text-xs text-muted-foreground">Keep it up!</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(todayCompletion)}%</div>
                  <p className="text-xs text-muted-foreground">{todaysHabits.filter(h => h.logs.some(l => l.date === todayStr)).length} of {todaysHabits.length} completed</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Completions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCompletions}</div>
                  <p className="text-xs text-muted-foreground">Across all habits</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Overview</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{monthlyStats.bestDay}</div>
                  <p className="text-xs text-muted-foreground">Your most active day this month</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Today's Habits</CardTitle>
                <CardDescription>What will you accomplish today?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {todaysHabits.length > 0 ? todaysHabits.map(habit => {
                    const todaysLog = habit.logs.find(log => log.date === todayStr);
                    const isLoggedToday = !!todaysLog;
                    let progressText = "";
                    if (habit.goal?.timeframe === 'weekly') {
                      const progress = getProgressForPeriod(habit, 'week');
                      progressText = `(${progress} / ${habit.goal.target} ${habit.goal.unit}) this week`;
                    } else if (habit.goal?.timeframe === 'monthly') {
                      const progress = getProgressForPeriod(habit, 'month');
                      progressText = `(${progress} / ${habit.goal.target} ${habit.goal.unit}) this month`;
                    }
                    return (
                      <div key={habit.id} className={cn("flex items-center gap-3 p-3 rounded-md bg-muted/50 transition-opacity", isLoggedToday && "opacity-60")}>
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-none">{habit.name}</p>
                          {progressText && <p className="text-xs text-muted-foreground">{progressText}</p>}
                        </div>
                        <Button size="sm" variant={isLoggedToday ? "secondary" : "outline"} onClick={() => setLoggingHabit(habit)} disabled={isLoggedToday}>
                          {isLoggedToday ? (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                              Logged: {todaysLog.value} {habit.goal?.unit || ''}
                            </>
                          ) : "Log"}
                        </Button>
                      </div>
                    );
                  }) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No habits available for today.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Weekly Completion</CardTitle>
                <CardDescription>Your habit completion over the last 7 days.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip cursor={{ fill: 'hsl(var(--accent))', radius: 4 }} contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="completed" fill="hsl(var(--chart-1))" name="Completed Habits" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}