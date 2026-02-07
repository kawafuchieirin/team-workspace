import Card from "@/components/common/Card";
import { formatMinutes } from "@/utils/format";
import type { StudyStatsSummary } from "@/types/study";

interface Props {
  stats: StudyStatsSummary | null;
  loading: boolean;
}

export default function StatsSummary({ stats, loading }: Props) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}><div className="h-16 animate-pulse bg-gray-100 rounded" /></Card>
        ))}
      </div>
    );
  }

  const items = [
    { label: "合計学習時間", value: formatMinutes(stats.total_minutes) },
    { label: "学習記録数", value: `${stats.total_records}件` },
    { label: "学習日数", value: `${stats.study_days}日` },
    { label: "日平均", value: formatMinutes(Math.round(stats.daily_average_minutes)) },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
