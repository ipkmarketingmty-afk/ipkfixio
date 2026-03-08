import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertMachineSchema } from "@shared/schema";
import { useCreateMachine } from "@/hooks/use-machines";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Factory, Plus } from "lucide-react";

export function CreateMachineDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createMachine = useCreateMachine();

  const form = useForm<z.infer<typeof insertMachineSchema>>({
    resolver: zodResolver(insertMachineSchema),
    defaultValues: {
      name: "",
      type: "",
      brand: "",
      model: "",
      location: "",
    },
  });

  function onSubmit(values: z.infer<typeof insertMachineSchema>) {
    createMachine.mutate(values, {
      onSuccess: () => {
        toast({ title: "Máquina agregada exitosamente" });
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
          Agregar Máquina
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-8">
        <DialogHeader className="mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
            <Factory className="w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl font-black">Nueva Máquina</DialogTitle>
          <DialogDescription className="text-base">
            Registra una nueva máquina en el sistema para programar su mantenimiento.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#1B263B] font-bold">Nombre o ID interno</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Torno CNC 1" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1B263B] font-bold">Tipo de máquina</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Torno, Fresa" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1B263B] font-bold">Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Haas" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1B263B] font-bold">Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. ST-20" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#1B263B] font-bold">Ubicación</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Nave 1, Pasillo B" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={createMachine.isPending} className="w-full h-14 rounded-xl text-lg font-bold mt-4 shadow-lg shadow-primary/25">
              {createMachine.isPending ? "Guardando..." : "Guardar Máquina"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
