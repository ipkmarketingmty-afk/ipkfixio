import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Activity, Factory, Wrench, Clock, Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: Activity },
  { title: "Máquinas", url: "/machines", icon: Factory },
  { title: "Mantenimiento", url: "/maintenance", icon: Wrench },
  { title: "Historial", url: "/history", icon: Clock },
];

function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar className="border-r-0 shadow-2xl z-50">
      <SidebarHeader className="p-6 bg-[#1B263B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F28482] flex items-center justify-center shadow-lg shadow-[#F28482]/30">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white m-0 leading-none">IPK</h2>
            <p className="text-xs text-white/60 uppercase tracking-widest font-semibold">Fixio</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-[#1B263B] px-3 pt-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/40 mb-2 font-bold tracking-wider text-xs uppercase">Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location === item.url || (item.url !== "/" && location.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`mb-2 py-6 px-4 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? "bg-[#F28482] text-white shadow-lg shadow-[#F28482]/20 hover:bg-[#F28482]/90" 
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 text-base font-semibold">
                        <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#F28482]"}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const style = {
    "--sidebar-width": "18rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-[#F28482] selection:text-white">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border/50 flex items-center px-6 sticky top-0 z-30 shrink-0">
            <SidebarTrigger className="hover:bg-[#1B263B]/5 text-[#1B263B]" />
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
            <div className="max-w-6xl mx-auto pb-12">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
