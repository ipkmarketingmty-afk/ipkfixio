import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const machines = pgTable("machines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  location: text("location").notNull(),
});

export const maintenanceTasks = pgTable("maintenance_tasks", {
  id: serial("id").primaryKey(),
  machineId: integer("machine_id").notNull(),
  title: text("title").notNull(),
  frequencyDays: integer("frequency_days").notNull(),
  lastCompletedDate: timestamp("last_completed_date").defaultNow().notNull(),
});

export const maintenanceLogs = pgTable("maintenance_logs", {
  id: serial("id").primaryKey(),
  machineId: integer("machine_id").notNull(),
  taskId: integer("task_id").notNull(),
  completedDate: timestamp("completed_date").defaultNow().notNull(),
  notes: text("notes"),
});

export const machinesRelations = relations(machines, ({ many }) => ({
  tasks: many(maintenanceTasks),
  logs: many(maintenanceLogs),
}));

export const tasksRelations = relations(maintenanceTasks, ({ one, many }) => ({
  machine: one(machines, {
    fields: [maintenanceTasks.machineId],
    references: [machines.id],
  }),
  logs: many(maintenanceLogs),
}));

export const logsRelations = relations(maintenanceLogs, ({ one }) => ({
  machine: one(machines, {
    fields: [maintenanceLogs.machineId],
    references: [machines.id],
  }),
  task: one(maintenanceTasks, {
    fields: [maintenanceLogs.taskId],
    references: [maintenanceTasks.id],
  }),
}));

export const insertMachineSchema = createInsertSchema(machines).omit({ id: true });
export const insertTaskSchema = createInsertSchema(maintenanceTasks).omit({ id: true, lastCompletedDate: true });
export const insertLogSchema = createInsertSchema(maintenanceLogs).omit({ id: true, completedDate: true });

export type Machine = typeof machines.$inferSelect;
export type InsertMachine = z.infer<typeof insertMachineSchema>;

export type MaintenanceTask = typeof maintenanceTasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type MaintenanceLog = typeof maintenanceLogs.$inferSelect;
export type InsertLog = z.infer<typeof insertLogSchema>;

export type DashboardStats = {
  totalMachines: number;
  upcomingMaintenance: number;
  overdueMaintenance: number;
};
