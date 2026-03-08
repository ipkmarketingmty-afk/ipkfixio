import { db } from "./db";
import { machines, maintenanceTasks, maintenanceLogs } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");
  
  // Check if we already have machines
  const existingMachines = await db.select().from(machines);
  if (existingMachines.length > 0) {
    console.log("Database already seeded!");
    process.exit(0);
  }

  const m1 = await db.insert(machines).values({
    name: "Torno CNC 01",
    type: "Torno",
    brand: "Haas",
    model: "ST-10",
    location: "Planta Principal - Sector A"
  }).returning();

  const m2 = await db.insert(machines).values({
    name: "Fresadora 02",
    type: "Fresadora",
    brand: "Mazak",
    model: "VCN-530C",
    location: "Planta Principal - Sector B"
  }).returning();

  const m3 = await db.insert(machines).values({
    name: "Compresor de Aire",
    type: "Compresor",
    brand: "Atlas Copco",
    model: "GA 30+",
    location: "Sala de Máquinas"
  }).returning();

  // Create tasks
  // Task 1: Overdue
  const t1Date = new Date();
  t1Date.setDate(t1Date.getDate() - 40); // 40 days ago
  const t1 = await db.insert(maintenanceTasks).values({
    machineId: m1[0].id,
    title: "Cambio de aceite hidráulico",
    frequencyDays: 30, // Every 30 days. Last done 40 days ago -> Overdue by 10 days
    lastCompletedDate: t1Date
  }).returning();

  // Task 2: Upcoming
  const t2Date = new Date();
  t2Date.setDate(t2Date.getDate() - 175); // 175 days ago
  const t2 = await db.insert(maintenanceTasks).values({
    machineId: m2[0].id,
    title: "Calibración de ejes",
    frequencyDays: 180, // Every 180 days. Due in 5 days -> Upcoming
    lastCompletedDate: t2Date
  }).returning();

  // Task 3: OK
  const t3Date = new Date();
  t3Date.setDate(t3Date.getDate() - 10); // 10 days ago
  const t3 = await db.insert(maintenanceTasks).values({
    machineId: m3[0].id,
    title: "Revisión de filtros",
    frequencyDays: 90, // Every 90 days. Due in 80 days -> OK
    lastCompletedDate: t3Date
  }).returning();

  // Add some logs
  await db.insert(maintenanceLogs).values({
    machineId: m1[0].id,
    taskId: t1[0].id,
    completedDate: t1Date,
    notes: "Cambio realizado con éxito. Se usó aceite Mobil DTE 24."
  });

  await db.insert(maintenanceLogs).values({
    machineId: m2[0].id,
    taskId: t2[0].id,
    completedDate: t2Date,
    notes: "Calibración rutinaria. Todo en los parámetros normales."
  });

  await db.insert(maintenanceLogs).values({
    machineId: m3[0].id,
    taskId: t3[0].id,
    completedDate: t3Date,
    notes: "Filtros limpios, aún no requieren reemplazo completo."
  });

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
