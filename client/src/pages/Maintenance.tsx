import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { CreateTaskDialog } from "@/components/maintenance/CreateTaskDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Wrench, Calendar, AlertCircle } from "lucide-react";
import { getTaskStatusInfo } from "@/lib/date-utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { useDeleteTask } from "@/hooks/use-tasks";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Maintenance() {
  const { data: tasks, isLoading } = useTasks();
  const { mutate: deleteTask } = useDeleteTask();
  const [filters, setFilters] = useState({ machine: "", task: "", status: "" });
  
  
  
  const filtered = tasks?.filter(t =>
    (t.machine?.name ?? "").toLowerCase().includes(filters.machine.toLowerCase()) &&
    t.title.toLowerCase().includes(filters.task.toLowerCase()) &&
    (() => {
  if (!filters.status) return true;
  const statusInfo = getTaskStatusInfo(t.lastCompletedDate, t.frequencyDays);
  const fechaFormateada = format(statusInfo.nextDate, "d 'de' MMMM, yyyy", { locale: es });
  return (
    statusInfo.label.toLowerCase().includes(filters.status.toLowerCase()) ||
    fechaFormateada.toLowerCase().includes(filters.status.toLowerCase())
  );
})()
  ) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1B263B]">Plan de Mantenimiento</h1>
          <p className="text-muted-foreground mt-2 text-lg">Rutinas preventivas programadas para tus máquinas.</p>
        </div>
        <CreateTaskDialog />
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-border/50 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : !tasks || tasks.length === 0 ? (
          <div className="p-16 text-center">
            <Wrench className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1B263B]">Sin tareas programadas</h3>
            <p className="text-muted-foreground mt-2">Crea rutinas de mantenimiento para mantener tus máquinas en óptimo estado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="py-3 pl-8">
                    <p className="font-bold text-[#1B263B] mb-1">Máquina</p>
                    <Input placeholder="Filtrar..." className="h-7 text-xs" value={filters.machine} onChange={e => setFilters(f => ({ ...f, machine: e.target.value }))} />
                  </TableHead>
                  <TableHead className="py-3">
                    <p className="font-bold text-[#1B263B] mb-1">Tarea</p>
                    <Input placeholder="Filtrar..." className="h-7 text-xs" value={filters.task} onChange={e => setFilters(f => ({ ...f, task: e.target.value }))} />
                  </TableHead>
                  <TableHead className="py-3 font-bold text-[#1B263B]">
                    <p className="font-bold text-[#1B263B] mb-1">Frecuencia</p>
                    <Input placeholder="Filtrar..." className="h-7 text-xs" disabled/>
                  </TableHead>
                  <TableHead className="py-3 pr-8">
                    <p className="font-bold text-[#1B263B] mb-1">Próximo Mantenimiento</p>
                    <Input placeholder="Filtrar estado..." className="h-7 text-xs" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} />
                  </TableHead>
                  <TableHead className="py-3 pr-8">
                    <p className="font-bold text-[#1B263B] mb-1">Acción</p>
                    </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((task) => {
                  const statusInfo = getTaskStatusInfo(task.lastCompletedDate, task.frequencyDays);
                  return (
                    <TableRow key={task.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="py-5 pl-8">
                        <div className="font-bold text-[#1B263B]">{task.machine?.name}</div>
                        <div className="text-xs text-muted-foreground">{task.machine?.type}</div>
                      </TableCell>
                      <TableCell className="py-5">
                        <span className="font-medium text-foreground">{task.title}</span>
                      </TableCell>
                      <TableCell className="py-5 text-muted-foreground font-medium">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 opacity-50" />
                          Cada {task.frequencyDays} días
                        </div>
                      </TableCell>
                      <TableCell className="py-5 pr-8">
                        <div className="flex flex-col items-start gap-1">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border ${statusInfo.bgClass} ${statusInfo.colorClass} ${statusInfo.borderClass}`}>
                            {statusInfo.status === 'overdue' && <AlertCircle className="w-4 h-4 mr-1.5" />}
                            {statusInfo.label}
                          </span>
                          <span className="text-sm text-muted-foreground font-medium pl-1">
                            {format(statusInfo.nextDate, "d 'de' MMMM, yyyy", { locale: es })}
                          </span>
                        </div>
                      </TableCell>
                       <TableCell className="py-5 pr-8">
                      <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteTask(task.id)}>
                      <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
