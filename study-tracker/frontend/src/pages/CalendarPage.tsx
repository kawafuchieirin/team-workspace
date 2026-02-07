import { useState, useEffect } from "react";
import Card from "@/components/common/Card";
import CalendarView from "@/components/features/calendar/CalendarView";
import DayDetailModal from "@/components/features/calendar/DayDetailModal";
import { studyService } from "@/services/studyService";
import type { CalendarDay, StudyRecord } from "@/types/study";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayRecords, setDayRecords] = useState<StudyRecord[]>([]);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    studyService.getCalendarData(year, month).then(setCalendarData).catch(() => {});
  }, [currentDate]);

  const handleDayClick = async (date: string) => {
    setSelectedDate(date);
    try {
      const records = await studyService.list({ date_from: date, date_to: date });
      setDayRecords(records);
    } catch {
      setDayRecords([]);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">カレンダー</h1>

      <Card>
        <CalendarView
          data={calendarData}
          currentDate={currentDate}
          onMonthChange={setCurrentDate}
          onDayClick={handleDayClick}
        />
      </Card>

      {selectedDate && (
        <DayDetailModal
          open={!!selectedDate}
          onClose={() => setSelectedDate(null)}
          date={selectedDate}
          records={dayRecords}
        />
      )}
    </div>
  );
}
