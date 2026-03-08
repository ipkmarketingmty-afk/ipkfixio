import { db } from "./db";
import { 
  machines, maintenanceTasks, maintenanceLogs,
  type InsertMachine, type Machine,
  type InsertTask, type MaintenanceTask,
  type InsertLog, type MaintenanceLog
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getMachines(): Promise<Machine[]>;
  getMachine(id: number): Promise<Machine | undefined>;
  createMachine(machine: InsertMachine): Promise<Machine>;
  deleteMachine(id: number): Promise<void>;
  
  getTask(id: number): Promise<MaintenanceTask | undefined>;
  deleteTask(id: number): Promise<void>;
  getTasks(): Promise<(MaintenanceTask & { machine?: Machine })[]>;
  createTask(task: InsertTask): Promise<MaintenanceTask>;
  

  getLogs(): Promise<(MaintenanceLog & { machine?: Machine; task?: MaintenanceTask })[]>;
  createLog(log: InsertLog): Promise<MaintenanceLog>;
  
  updateTaskLastCompleted(taskId: number, date: Date): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getMachines(): Promise<Machine[]> {
    return await db.select().from(machines);
  }

  async getMachine(id: number): Promise<Machine | undefined> {
    const [machine] = await db.select().from(machines).where(eq(machines.id, id));
    return machine;
  }

  async createMachine(insertMachine: InsertMachine): Promise<Machine> {
    const [machine] = await db.insert(machines).values(insertMachine).returning();
    return machine;
  }

  async deleteMachine(id: number): Promise<void> {
  await db.delete(machines).where(eq(machines.id, id));
}
  
  async getTasks(): Promise<(MaintenanceTask & { machine?: Machine })[]> {
    const tasks = await db.select().from(maintenanceTasks);
    const machinesList = await this.getMachines();
    const machineMap = new Map(machinesList.map(m => [m.id, m]));
    return tasks.map(t => ({
      ...t,
      machine: machineMap.get(t.machineId)
    }));
  }

  async createTask(insertTask: InsertTask): Promise<MaintenanceTask> {
  const { startDate, ...rest } = insertTask as any;
  
  let lastCompleted = new Date();
  
  if (startDate) {
    const inputDate = new Date(startDate);
    const now = new Date();
    const freqDays = rest.frequencyDays;
    
    if (inputDate >= now) {
      // Fecha futura: restar un ciclo para que el próximo sea exactamente esa fecha
      const base = new Date(inputDate);
      base.setDate(base.getDate() - freqDays+1);
      lastCompleted = base;
    } else {
      // Fecha pasada: avanzar ciclos hasta llegar al anterior a hoy
      let next = new Date(inputDate);
      while (next < now) {
        next.setDate(next.getDate() + freqDays+1);
      }
      next.setDate(next.getDate() - freqDays);
      lastCompleted = next;
    }
  }

  const [task] = await db.insert(maintenanceTasks).values({
    ...rest,
    startDate: lastCompleted,
    lastCompletedDate: lastCompleted,
  }).returning();
  return task;
}

async getTask(id: number): Promise<MaintenanceTask | undefined> {
  const [task] = await db.select().from(maintenanceTasks).where(eq(maintenanceTasks.id, id));
  return task;
}

async deleteTask(id: number): Promise<void> {
  await db.delete(maintenanceTasks).where(eq(maintenanceTasks.id, id));
}
  
  
  async getLogs(): Promise<(MaintenanceLog & { machine?: Machine; task?: MaintenanceTask })[]> {
    const logs = await db.select().from(maintenanceLogs);
    const machinesList = await this.getMachines();
    const tasksList = await db.select().from(maintenanceTasks);
    
    const machineMap = new Map(machinesList.map(m => [m.id, m]));
    const taskMap = new Map(tasksList.map(t => [t.id, t]));
    
    return logs.map(l => ({
      ...l,
      machine: machineMap.get(l.machineId),
      task: taskMap.get(l.taskId)
    }));
  }

  async createLog(insertLog: InsertLog): Promise<MaintenanceLog> {
    const [log] = await db.insert(maintenanceLogs).values({
      ...insertLog,
      completedDate: new Date()
    }).returning();
    // When a log is created, we should also update the lastCompletedDate of the task
    if (log.taskId) {
      await this.updateTaskLastCompleted(log.taskId, log.completedDate);
    }
    return log;
  }

  async updateTaskLastCompleted(taskId: number, date: Date): Promise<void> {
    await db.update(maintenanceTasks)
      .set({ lastCompletedDate: date })
      .where(eq(maintenanceTasks.id, taskId));
  }
}

export const storage = new DatabaseStorage();
