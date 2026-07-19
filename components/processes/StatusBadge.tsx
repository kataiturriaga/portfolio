import type { ProcessStatus } from "@/data/processes";

export default function StatusBadge({ status }: { status: ProcessStatus }) {
  return (
    <span
      className={`process-status process-status--${status.toLowerCase()}`}
      aria-label={`Estado: ${status}`}
    >
      {status}
    </span>
  );
}
