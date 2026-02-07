import StudyRecordCard from "./StudyRecordCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import type { StudyRecord } from "@/types/study";

interface Props {
  records: StudyRecord[];
  loading: boolean;
  onDelete?: (recordId: string) => void;
}

export default function StudyRecordList({ records, loading, onDelete }: Props) {
  if (loading) return <LoadingSpinner />;

  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        学習記録がありません。最初の記録を追加しましょう！
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <StudyRecordCard key={record.record_id} record={record} onDelete={onDelete} />
      ))}
    </div>
  );
}
