import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTask } from "@/hooks/use-tasks";
import { useMachines } from "@/hooks/use-machines";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Plus } from "lucide-react";

const formSchema = z.object({
  machineId: z.coerce.number().min(1, "Debe seleccionar una máquina"),
  title: z.string().min(2, "El nombre de la tarea es muy corto"),
  frequencyDays: z.coerce.number().min(1, "La frecuencia debe ser al menos 1 día"),
  startDate: z.string().optional(),
});

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createTask = useCreateTask();
  const { data: machines } = useMachines();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      machineId: 0,
      title: "",
      frequencyDays: 30,
      startDate: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createTask.mutate(values, {
      onSuccess: () => {
        toast({ title: "Tarea programada exitosamente" });
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
          <Plus className="w-5 h-5 mr-2" />
          Nueva Tarea
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-8">
        <DialogHeader className="mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
            <Wrench className="w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl font-black">Programar Mantenimiento</DialogTitle>
          <DialogDescription className="text-base">
            Crea una rutina de mantenimiento preventivo para una máquina.
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
                  <Select onValueChange={field.onChange} defaultValue={field.value ? String(field.value) : undefined}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-white focus:ring-primary/20">
                        <SelectValue placeholder="Selecciona una máquina" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {machines?.map(m => (
                        <SelectItem key={m.id} value={String(m.id)}>
                          {m.name} - {m.type}
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1B263B] font-bold">Tarea a realizar</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Cambio de aceite, Lubricación general" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequencyDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1B263B] font-bold">Frecuencia (en días)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="number" min="1" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20 pl-4 pr-16" {...field} />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground font-medium">
                        días
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1B263B] font-bold">Fecha de inicio <span className="text-muted-foreground font-normal">(Opcional)</span></FormLabel>
                  <FormControl>
                    <Input type="date" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={createTask.isPending} className="w-full h-14 rounded-xl text-lg font-bold mt-4 shadow-lg shadow-primary/25">
              {createTask.isPending ? "Guardando..." : "Programar Tarea"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
