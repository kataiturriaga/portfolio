import type { CaseProse } from "@/data/casos";

export default function CaseSection({ prose }: { prose: CaseProse }) {
  return (
    <section className="paper-shell case-section">
      <p className="eyebrow">✶ {prose.eyebrow}</p>
      <h2>{prose.title}</h2>
      <div className="case-section__body">
        {prose.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  );
}
