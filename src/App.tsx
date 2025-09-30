import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/api-client";
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="ritual-ui-theme">
        <Outlet />
        <Toaster richColors closeButton />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
export default App;