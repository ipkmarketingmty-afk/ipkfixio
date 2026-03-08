import { useLogs } from "@/hooks/use-logs";
import { CreateLogDialog } from "@/components/history/CreateLogDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function History() {
  const { data: logs, isLoading } = useLogs();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1B263B]">Historial</h1>
          <p className="text-muted-foreground mt-2 text-lg">Registro histórico de mantenimientos realizados.</p>
        </div>
        <CreateLogDialog />
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-border/50 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="p-16 text-center">
            <Clock className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1B263B]">Aún no hay registros</h3>
            <p className="text-muted-foreground mt-2">Los mantenimientos completados aparecerán aquí.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="py-5 font-bold text-[#1B263B] pl-8">Fecha</TableHead>
                  <TableHead className="py-5 font-bold text-[#1B263B]">Máquina</TableHead>
                  <TableHead className="py-5 font-bold text-[#1B263B]">Tarea Realizada</TableHead>
                  <TableHead className="py-5 font-bold text-[#1B263B] pr-8 w-1/3">Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Sort logs descending (newest first) by completedDate */}
                {[...logs].sort((a, b) => new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime()).map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="py-5 pl-8">
                      <div className="font-bold text-[#1B263B]">
                        {format(new Date(log.completedDate), "dd MMM, yyyy", { locale: es })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(log.completedDate), "hh:mm a", { locale: es })}
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <span className="font-semibold text-foreground">{log.machine?.name}</span>
                    </TableCell>
                    <TableCell className="py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 font-bold text-sm border border-green-200">
                        {log.task?.title}
                      </span>
                    </TableCell>
                    <TableCell className="py-5 pr-8">
                      {log.notes ? (
                        <p className="text-sm text-muted-foreground italic flex items-start gap-2">
                          <FileText className="w-4 h-4 mt-0.5 shrink-0 opacity-50" />
                          <span>{log.notes}</span>
                        </p>
                      ) : (
                        <span className="text-sm text-muted-foreground/50">Sin observaciones</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
