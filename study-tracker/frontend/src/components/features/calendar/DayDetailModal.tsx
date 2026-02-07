import Modal from "@/components/common/Modal";
import { formatMinutes } from "@/utils/format";
import { formatDateDisplay } from "@/utils/date";
import type { StudyRecord } from "@/types/study";

interface Props {
  open: boolean;
  onClose: () => void;
  date: string;
  records: StudyRecord[];
}

export default function DayDetailModal({ open, onClose, date, records }: Props) {
  const total = records.reduce((sum, r) => sum + r.duration_minutes, 0);

  return (
    <Modal open={open} onClose={onClose} title={formatDateDisplay(date)}>
      {records.length === 0 ? (
        <p className="text-gray-500 text-sm">この日の学習記録はありません。</p>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4">
            合計: <span className="font-semibold">{formatMinutes(total)}</span>
            ({records.length}件)
          </p>
          <div className="space-y-3">
            {records.map((r) => (
              <div key={r.record_id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-indigo-700">{r.subject}</span>
                  <span className="text-sm font-semibold">{formatMinutes(r.duration_minutes)}</span>
                </div>
                {r.memo && <p className="text-xs text-gray-500 mt-1">{r.memo}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}
