import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { ja } from "date-fns/locale";

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "yyyy-MM-dd");
}

export function formatDateDisplay(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "M月d日(E)", { locale: ja });
}

export function getWeekRange(date: Date = new Date()) {
  return {
    from: formatDate(startOfWeek(date, { weekStartsOn: 1 })),
    to: formatDate(endOfWeek(date, { weekStartsOn: 1 })),
  };
}

export function getMonthRange(date: Date = new Date()) {
  return {
    from: formatDate(startOfMonth(date)),
    to: formatDate(endOfMonth(date)),
  };
}
