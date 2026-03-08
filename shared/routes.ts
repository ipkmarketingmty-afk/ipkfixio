import { z } from 'zod';
import { insertMachineSchema, insertTaskSchema, insertLogSchema, machines, maintenanceTasks, maintenanceLogs } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  dashboard: {
    stats: {
      method: 'GET' as const,
      path: '/api/dashboard/stats' as const,
      responses: {
        200: z.object({
          totalMachines: z.number(),
          upcomingMaintenance: z.number(),
          overdueMaintenance: z.number(),
        }),
      }
    }
  },
  machines: {
    list: {
      method: 'GET' as const,
      path: '/api/machines' as const,
      responses: {
        200: z.array(z.custom<typeof machines.$inferSelect>()),
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/machines/:id' as const,
      responses: {
        200: z.custom<typeof machines.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/machines' as const,
      input: insertMachineSchema,
      responses: {
        201: z.custom<typeof machines.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  delete: {
  method: 'DELETE' as const,
  path: '/api/machines/:id' as const,
  responses: {
    200: z.custom<typeof machines.$inferSelect>(),
    404: errorSchemas.notFound,
  }
},
  delete: {
  method: 'DELETE' as const,
  path: '/api/tasks/:id' as const,
  responses: {
    200: z.custom<typeof maintenanceTasks.$inferSelect>(),
    404: errorSchemas.notFound,
  }
},
  tasks: {
    list: {
      method: 'GET' as const,
      path: '/api/tasks' as const,
      responses: {
        200: z.array(z.custom<typeof maintenanceTasks.$inferSelect & { machine?: typeof machines.$inferSelect }>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/tasks' as const,
      input: insertTaskSchema,
      responses: {
        201: z.custom<typeof maintenanceTasks.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  logs: {
    list: {
      method: 'GET' as const,
      path: '/api/logs' as const,
      responses: {
        200: z.array(z.custom<typeof maintenanceLogs.$inferSelect & { machine?: typeof machines.$inferSelect, task?: typeof maintenanceTasks.$inferSelect }>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/logs' as const,
      input: insertLogSchema,
      responses: {
        201: z.custom<typeof maintenanceLogs.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
