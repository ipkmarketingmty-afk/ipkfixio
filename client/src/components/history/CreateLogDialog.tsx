import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateLog } from "@/hooks/use-logs";
import { useMachines } from "@/hooks/use-machines";
import { useTasks } from "@/hooks/use-tasks";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Plus, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  machineId: z.coerce.number().min(1, "Selecciona una máquina"),
  taskId: z.coerce.number().min(1, "Selecciona una tarea"),
  notes: z.string().optional(),
});

export function CreateLogDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createLog = useCreateLog();
  
  const { data: machines } = useMachines();
  const { data: tasks } = useTasks();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      machineId: 0,
      taskId: 0,
      notes: "",
    },
  });

  const selectedMachineId = form.watch("machineId");
  const filteredTasks = tasks?.filter(t => t.machineId === Number(selectedMachineId)) || [];

  function onSubmit(values: z.infer<typeof formSchema>) {
    createLog.mutate(values, {
      onSuccess: () => {
        toast({ title: "Mantenimiento registrado con éxito", description: "El estado de la máquina ha sido actualizado." });
        form.reset();
        setOpen(false);
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl px-6 h-12 text-base font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Registrar Trabajo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-8">
        <DialogHeader className="mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
            <Clock className="w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl font-black">Registrar Mantenimiento</DialogTitle>
          <DialogDescription className="text-base">
            Marca una tarea como completada y guarda un registro en el historial.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            <FormField
              control={form.control}
              name="machineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1B263B] font-bold">Máquina</FormLabel>
                  <Select onValueChange={(val) => { field.onChange(val); form.setValue("taskId", 0); }} defaultValue={field.value ? String(field.value) : undefined}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-white focus:ring-primary/20">
                        <SelectValue placeholder="Selecciona la máquina intervenida" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {machines?.map(m => (
                        <SelectItem key={m.id} value={String(m.id)}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taskId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1B263B] font-bold">Tarea completada</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ? String(field.value) : undefined} disabled={!selectedMachineId || filteredTasks.length === 0}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-white focus:ring-primary/20">
                        <SelectValue placeholder={!selectedMachineId ? "Primero selecciona una máquina" : (filteredTasks.length === 0 ? "Sin tareas programadas" : "Selecciona la tarea")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredTasks.map(t => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {t.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1B263B] font-bold">Notas u observaciones (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ej. Se encontraron rebabas metálicas en el filtro, se sugiere revisión la próxima semana." 
                      className="resize-none h-24 rounded-xl bg-muted/50 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={createLog.isPending} className="w-full h-14 rounded-xl text-lg font-bold mt-4 shadow-lg shadow-primary/25">
              {createLog.isPending ? "Registrando..." : "Confirmar Registro"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
