import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2, RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

// Cache de sessão em módulo: evita spinner em navegações internas após o 1º check.
let cachedUser: User | null = null;
let sessionChecked = false;

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(cachedUser);
  const [isReady, setIsReady] = useState(sessionChecked);

  useEffect(() => {
    let mounted = true;

    if (!sessionChecked) {
      supabase.auth.getSession().then(({ data }) => {
        if (!mounted) return;
        cachedUser = data.session?.user ?? null;
        sessionChecked = true;
        setUser(cachedUser);
        setIsReady(true);
        if (!data.session) navigate({ to: "/login" });
      });
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      cachedUser = session?.user ?? null;
      setUser(cachedUser);
      if (!session) navigate({ to: "/login" });
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    cachedUser = null;
    sessionChecked = false;
    toast.success("Sessão encerrada");
    navigate({ to: "/login" });
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b bg-card flex items-center justify-between px-4 gap-2">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
              <Button
                variant="ghost"
                size="sm"
                title="Atualizar dados da página"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
