import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Toaster } from "@/components/ui/sonner";
export function Layout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="min-h-screen w-full bg-muted/40">
      <Sidebar />
      <main className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 md:pl-64 transition-[margin-left] ease-in-out duration-300">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
}