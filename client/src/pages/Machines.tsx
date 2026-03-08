import { useMachines } from "@/hooks/use-machines";
import { CreateMachineDialog } from "@/components/machines/CreateMachineDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Factory, MapPin, Trash2 } from "lucide-react";
import { useMachines, useDeleteMachine } from "@/hooks/use-machines";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Machines() {
  const { mutate: deleteMachine } = useDeleteMachine();
  const { data: machines, isLoading } = useMachines();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1B263B]">Máquinas</h1>
          <p className="text-muted-foreground mt-2 text-lg">Inventario de equipos de la fábrica.</p>
        </div>
        <CreateMachineDialog />
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-border/50 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : !machines || machines.length === 0 ? (
          <div className="p-16 text-center">
            <Factory className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1B263B]">Sin máquinas registradas</h3>
            <p className="text-muted-foreground mt-2">Agrega tu primera máquina para comenzar a programar su mantenimiento.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="py-5 font-bold text-[#1B263B] pl-8">Nombre</TableHead>
                  <TableHead className="py-5 font-bold text-[#1B263B]">Tipo</TableHead>
                  <TableHead className="py-5 font-bold text-[#1B263B]">Marca / Modelo</TableHead>
                  <TableHead className="py-5 font-bold text-[#1B263B] pr-8">Ubicación</TableHead>
                  <TableHead className="py-5 pr-8"></TableHead>
                  <TableCell className="py-4 pr-8">
  <Button
    variant="ghost"
    size="icon"
    className="text-red-500 hover:text-red-700 hover:bg-red-50"
    onClick={() => deleteMachine(machine.id)}
  >
    <Trash2 className="w-4 h-4" />
  </Button>
</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.map((machine) => (
                  <TableRow key={machine.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="py-4 pl-8 font-bold text-[#1B263B]">{machine.name}</TableCell>
                    <TableCell className="py-4 text-muted-foreground">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#1B263B]/5 text-[#1B263B] font-medium text-sm">
                        {machine.type}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{machine.brand}</span>
                        <span className="text-xs text-muted-foreground">{machine.model}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 pr-8">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2 opacity-50" />
                        {machine.location}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 pr-8">
  <Button
    variant="ghost"
    size="icon"
    className="text-red-500 hover:text-red-700 hover:bg-red-50"
    onClick={() => deleteMachine(machine.id)}
  >
    <Trash2 className="w-4 h-4" />
  </Button>
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
