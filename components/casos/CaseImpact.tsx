import type { ImpactMetric } from "@/data/casos";

export default function CaseImpact({ items }: { items: ImpactMetric[] }) {
  return (
    <section className="paper-shell case-impact" aria-label="Impacto">
      <p className="eyebrow">✶ Impacto</p>
      <div className="case-impact__grid">
        {items.map((item) => (
          <div
            key={item.label}
            className={`case-impact__item ${item.pending ? "is-pending" : ""}`}
          >
            <strong className="case-impact__value">{item.value}</strong>
            <span className="case-impact__label">{item.label}</span>
            {item.note ? (
              <span className="case-impact__note">{item.note}</span>
            ) : null}
            {item.pending ? (
              <span className="case-impact__tag">Por medir</span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
