import Link from "next/link";
import type { Process } from "@/data/processes";
import StatusBadge from "./StatusBadge";

export default function ProcessCard({
  process,
  featured = false,
}: {
  process: Process;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/procesos/${process.slug}`}
      className={`process-card ${featured ? "process-card--featured" : ""}`}
    >
      <div className="process-card__meta">
        <span>/ {process.number}</span>
        <StatusBadge status={process.status} />
      </div>
      <h3>{process.title}</h3>
      <p>{process.purpose}</p>
      <div className="process-card__footer">
        <span>{process.category}</span>
        <span aria-hidden="true">↗</span>
      </div>
    </Link>
  );
}
