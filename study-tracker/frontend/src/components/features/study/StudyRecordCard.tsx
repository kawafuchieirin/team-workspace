import { formatMinutes } from "@/utils/format";
import { formatDateDisplay } from "@/utils/date";
import Button from "@/components/common/Button";
import type { StudyRecord } from "@/types/study";

interface Props {
  record: StudyRecord;
  onDelete?: (recordId: string) => void;
}

export default function StudyRecordCard({ record, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {record.subject}
          </span>
          <span className="text-sm text-gray-500">{formatDateDisplay(record.study_date)}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-gray-900">
            {formatMinutes(record.duration_minutes)}
          </span>
          {record.memo && (
            <span className="text-sm text-gray-500 truncate">{record.memo}</span>
          )}
        </div>
      </div>
      {onDelete && (
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(record.record_id)}
        >
          削除
        </Button>
      )}
    </div>
  );
}
