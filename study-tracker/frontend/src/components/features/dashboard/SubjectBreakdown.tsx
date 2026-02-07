import Card from "@/components/common/Card";
import { formatMinutes } from "@/utils/format";

interface Props {
  subjects: Record<string, number>;
}

const COLORS = [
  "bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500",
  "bg-sky-500", "bg-violet-500", "bg-orange-500", "bg-teal-500",
];

export default function SubjectBreakdown({ subjects }: Props) {
  const entries = Object.entries(subjects).sort(([, a], [, b]) => b - a);
  const total = entries.reduce((sum, [, mins]) => sum + mins, 0);

  if (entries.length === 0) {
    return <Card title="科目別"><p className="text-gray-500 text-sm">データなし</p></Card>;
  }

  return (
    <Card title="科目別">
      <div className="space-y-3">
        {entries.map(([subject, minutes], i) => {
          const pct = total > 0 ? Math.round((minutes / total) * 100) : 0;
          return (
            <div key={subject}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{subject}</span>
                <span className="text-gray-500">{formatMinutes(minutes)} ({pct}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${COLORS[i % COLORS.length]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
