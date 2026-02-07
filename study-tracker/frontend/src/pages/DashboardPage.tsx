import { useState, useEffect } from "react";
import StatsSummary from "@/components/features/dashboard/StatsSummary";
import SubjectBreakdown from "@/components/features/dashboard/SubjectBreakdown";
import WeeklyChart from "@/components/features/dashboard/WeeklyChart";
import StudyRecordList from "@/components/features/study/StudyRecordList";
import Card from "@/components/common/Card";
import { studyService } from "@/services/studyService";
import { getMonthRange } from "@/utils/date";
import type { StudyStatsSummary, CalendarDay, StudyRecord } from "@/types/study";

export default function DashboardPage() {
  const [stats, setStats] = useState<StudyStatsSummary | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [recentRecords, setRecentRecords] = useState<StudyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { from, to } = getMonthRange();
    const now = new Date();

    Promise.all([
      studyService.getStatsSummary(from, to),
      studyService.getCalendarData(now.getFullYear(), now.getMonth() + 1),
      studyService.list(),
    ]).then(([statsData, calData, records]) => {
      setStats(statsData);
      setCalendarData(calData);
      setRecentRecords(records.slice(0, 5));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>

      <StatsSummary stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyChart data={calendarData} />
        {stats && <SubjectBreakdown subjects={stats.subjects} />}
      </div>

      <Card title="最近の学習記録">
        <StudyRecordList records={recentRecords} loading={loading} />
      </Card>
    </div>
  );
}
