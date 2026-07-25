import type { Decision } from "@/data/casos";

export default function CaseDecisionsBrief({
  decisions,
}: {
  decisions: Decision[];
}) {
  return (
    <section className="paper-shell case-brief" aria-label="Decisiones clave">
      <p className="eyebrow">✶ Decisiones clave</p>
      <ol className="case-brief__list">
        {decisions.map((decision) => (
          <li key={decision.number} className="case-brief__item">
            <span className="case-brief__number">/ {decision.number}</span>
            <div className="case-brief__text">
              <h3>{decision.title}</h3>
              <p>{decision.summary}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
