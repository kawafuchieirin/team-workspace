interface Props {
  percent: number;
  color?: string;
  className?: string;
}

export default function ProgressBar({ percent, color = "bg-indigo-600", className = "" }: Props) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className={`h-2.5 rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
