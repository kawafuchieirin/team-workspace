import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isToday, addMonths, subMonths,
} from "date-fns";
import { ja } from "date-fns/locale";
import Button from "@/components/common/Button";
import type { CalendarDay } from "@/types/study";

interface Props {
  data: CalendarDay[];
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  onDayClick: (date: string) => void;
}

function getHeatColor(minutes: number): string {
  if (minutes === 0) return "bg-gray-100";
  if (minutes < 30) return "bg-green-100";
  if (minutes < 60) return "bg-green-200";
  if (minutes < 120) return "bg-green-400";
  return "bg-green-600";
}

export default function CalendarView({ data, currentDate, onMonthChange, onDayClick }: Props) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const dayMap = new Map(data.map((d) => [d.date, d]));
  const weekDays = ["月", "火", "水", "木", "金", "土", "日"];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button variant="secondary" size="sm" onClick={() => onMonthChange(subMonths(currentDate, 1))}>
          &larr; 前月
        </Button>
        <h2 className="text-lg font-semibold text-gray-800">
          {format(currentDate, "yyyy年M月", { locale: ja })}
        </h2>
        <Button variant="secondary" size="sm" onClick={() => onMonthChange(addMonths(currentDate, 1))}>
          翌月 &rarr;
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>
        ))}
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayData = dayMap.get(dateStr);
          const inMonth = isSameMonth(day, currentDate);
          const today = isToday(day);

          return (
            <button
              key={dateStr}
              onClick={() => onDayClick(dateStr)}
              className={`aspect-square p-1 rounded-lg text-xs flex flex-col items-center justify-center transition-colors
                ${inMonth ? "" : "opacity-30"}
                ${today ? "ring-2 ring-indigo-500" : ""}
                ${dayData ? getHeatColor(dayData.total_minutes) : "bg-gray-50"}
                hover:ring-2 hover:ring-indigo-300`}
            >
              <span className={`font-medium ${dayData && dayData.total_minutes >= 120 ? "text-white" : "text-gray-700"}`}>
                {format(day, "d")}
              </span>
              {dayData && (
                <span className={`text-[10px] ${dayData.total_minutes >= 120 ? "text-green-100" : "text-gray-500"}`}>
                  {dayData.total_minutes}分
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <span>少</span>
        {["bg-gray-100", "bg-green-100", "bg-green-200", "bg-green-400", "bg-green-600"].map((c) => (
          <div key={c} className={`w-4 h-4 rounded ${c}`} />
        ))}
        <span>多</span>
      </div>
    </div>
  );
}
