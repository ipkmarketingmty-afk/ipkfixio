import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.dashboard.stats.path, async (req, res) => {
    try {
      const machinesList = await storage.getMachines();
      const tasksList = await storage.getTasks();
      
      const now = new Date();
      let upcoming = 0;
      let overdue = 0;
      
      tasksList.forEach(task => {
        const lastCompleted = new Date(task.lastCompletedDate);
        const nextDue = new Date(lastCompleted);
        nextDue.setDate(lastCompleted.getDate() + task.frequencyDays);
        
        const diffTime = nextDue.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          overdue++;
        } else if (diffDays <= 7) {
          upcoming++;
        }
      });
      
      res.json({
        totalMachines: machinesList.length,
        upcomingMaintenance: upcoming,
        overdueMaintenance: overdue
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.machines.list.path, async (req, res) => {
    const machines = await storage.getMachines();
    res.json(machines);
  });

  app.get(api.machines.get.path, async (req, res) => {
    const machine = await storage.getMachine(Number(req.params.id));
    if (!machine) {
      return res.status(404).json({ message: 'Machine not found' });
    }
    res.json(machine);
  });

  app.post(api.machines.create.path, async (req, res) => {
    try {
      const input = api.machines.create.input.parse(req.body);
      const machine = await storage.createMachine(input);
      res.status(201).json(machine);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.tasks.list.path, async (req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post(api.tasks.create.path, async (req, res) => {
    try {
      // Coerce inputs if necessary
      const bodySchema = api.tasks.create.input.extend({
        machineId: z.coerce.number(),
        frequencyDays: z.coerce.number(),
      });
      const input = bodySchema.parse(req.body);
      const task = await storage.createTask(input);
      res.status(201).json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.logs.list.path, async (req, res) => {
    const logs = await storage.getLogs();
    res.json(logs);
  });

  app.post(api.logs.create.path, async (req, res) => {
    try {
      const bodySchema = api.logs.create.input.extend({
        machineId: z.coerce.number(),
        taskId: z.coerce.number(),
      });
      const input = bodySchema.parse(req.body);
      const log = await storage.createLog(input);
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
