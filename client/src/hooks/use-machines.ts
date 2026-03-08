import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertMachineSchema } from "@shared/schema";

export function useMachines() {
  return useQuery({
    queryKey: [api.machines.list.path],
    queryFn: async () => {
      const res = await fetch(api.machines.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch machines");
      return api.machines.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateMachine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof insertMachineSchema>) => {
      const res = await fetch(api.machines.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create machine");
      return api.machines.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.machines.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.dashboard.stats.path] });
    },
  });
}
