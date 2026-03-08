import { useDashboardStats } from "@/hooks/use-dashboard";
import { Activity, Factory, Wrench } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl mt-8" />
      </div>
    );
  }

  // Determine global status
  let systemStatus: 'ok' | 'upcoming' | 'overdue' = 'ok';
  if (stats?.overdueMaintenance && stats.overdueMaintenance > 0) {
    systemStatus = 'overdue';
  } else if (stats?.upcomingMaintenance && stats.upcomingMaintenance > 0) {
    systemStatus = 'upcoming';
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-black text-[#1B263B]">Resumen de Planta</h1>
        <p className="text-muted-foreground mt-2 text-lg">Monitorea el estado de mantenimiento de tus máquinas.</p>
      </div>

      {/* Traffic Light System Status */}
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-border/50">
        <h2 className="text-xl font-bold text-center mb-8 text-[#1B263B] uppercase tracking-widest">Semáforo de Estado</h2>
        <div className="flex justify-center items-center gap-6 sm:gap-12 bg-black/5 p-6 sm:p-10 rounded-full max-w-2xl mx-auto shadow-inner border border-black/10">
          
          <div className="flex flex-col items-center gap-4">
            <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-black/20 ${systemStatus === 'ok' ? 'traffic-light-active-green' : 'traffic-light-inactive'}`} />
            <span className={`font-bold uppercase tracking-widest text-sm ${systemStatus === 'ok' ? 'text-green-600' : 'text-muted-foreground'}`}>Todo OK</span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-black/20 ${systemStatus === 'upcoming' ? 'traffic-light-active-yellow' : 'traffic-light-inactive'}`} />
            <span className={`font-bold uppercase tracking-widest text-sm ${systemStatus === 'upcoming' ? 'text-yellow-600' : 'text-muted-foreground'}`}>Próximo</span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-black/20 ${systemStatus === 'overdue' ? 'traffic-light-active-red' : 'traffic-light-inactive'}`} />
            <span className={`font-bold uppercase tracking-widest text-sm ${systemStatus === 'overdue' ? 'text-red-600' : 'text-muted-foreground'}`}>Vencido</span>
          </div>

        </div>
        
        <div className="text-center mt-8">
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {systemStatus === 'ok' && "Todas tus máquinas están al día. ¡Excelente trabajo preventivo!"}
            {systemStatus === 'upcoming' && "Tienes mantenimientos programados para los próximos días. Prepárate."}
            {systemStatus === 'overdue' && "¡Atención! Hay mantenimientos vencidos que requieren acción inmediata para evitar paros de máquina."}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Máquinas Registradas" 
          value={stats?.totalMachines || 0} 
          icon={<Factory className="w-8 h-8" />} 
          colorClass="bg-[#1B263B]"
          textColorClass="text-[#1B263B]"
        />
        <StatCard 
          title="Mantenimientos Próximos" 
          value={stats?.upcomingMaintenance || 0} 
          icon={<Wrench className="w-8 h-8" />} 
          colorClass="bg-yellow-500"
          textColorClass="text-yellow-600"
        />
        <StatCard 
          title="Mantenimientos Vencidos" 
          value={stats?.overdueMaintenance || 0} 
          icon={<Activity className="w-8 h-8" />} 
          colorClass="bg-red-500"
          textColorClass="text-red-600"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, colorClass, textColorClass }: { title: string, value: number | string, icon: React.ReactNode, colorClass: string, textColorClass: string }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-black/5 border border-border/50 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground font-medium mb-1">{title}</p>
          <h3 className={`text-5xl font-black ${textColorClass}`}>{value}</h3>
        </div>
        <div className={`w-14 h-14 rounded-2xl ${colorClass} text-white flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
