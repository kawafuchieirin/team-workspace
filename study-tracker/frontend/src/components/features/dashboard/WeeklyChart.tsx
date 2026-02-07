import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "@/components/common/Card";
import type { CalendarDay } from "@/types/study";

interface Props {
  data: CalendarDay[];
}

export default function WeeklyChart({ data }: Props) {
  const chartData = data.map((d) => ({
    date: d.date.slice(5),
    minutes: d.total_minutes,
    hours: +(d.total_minutes / 60).toFixed(1),
  }));

  return (
    <Card title="学習時間推移">
      {chartData.length === 0 ? (
        <p className="text-gray-500 text-sm py-8 text-center">データなし</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis fontSize={12} unit="h" />
            <Tooltip
              formatter={(value: number) => [`${value}時間`, "学習時間"]}
              labelFormatter={(label: string) => label}
            />
            <Bar dataKey="hours" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
