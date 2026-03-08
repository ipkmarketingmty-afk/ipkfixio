import { addDays, differenceInDays } from "date-fns";

export function getTaskStatusInfo(lastCompletedDate: string | Date, frequencyDays: number) {
  const nextDate = addDays(new Date(lastCompletedDate), frequencyDays);
  const diff = differenceInDays(nextDate, new Date());
  
  if (diff < 0) {
    return {
      status: 'overdue' as const,
      colorClass: 'text-red-600',
      bgClass: 'bg-red-100',
      borderClass: 'border-red-200',
      label: 'Vencido',
      nextDate
    };
  }
  if (diff <= 7) {
    return {
      status: 'upcoming' as const,
      colorClass: 'text-yellow-600',
      bgClass: 'bg-yellow-100',
      borderClass: 'border-yellow-200',
      label: 'Próximo',
      nextDate
    };
  }
  
  return {
    status: 'ok' as const,
    colorClass: 'text-green-600',
    bgClass: 'bg-green-100',
    borderClass: 'border-green-200',
    label: 'Al día',
    nextDate
  };
}
