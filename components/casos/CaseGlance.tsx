import type { CaseGlanceData } from "@/data/casos";

const ROWS: { label: string; key: keyof CaseGlanceData }[] = [
  { label: "Rol", key: "role" },
  { label: "Periodo", key: "period" },
  { label: "Equipo", key: "team" },
  { label: "Producto", key: "product" },
  { label: "Problema", key: "problem" },
  { label: "Solución", key: "solution" },
];

export default function CaseGlance({ glance }: { glance: CaseGlanceData }) {
  return (
    <section className="paper-shell case-glance" aria-label="Resumen del proyecto">
      <p className="eyebrow">✶ En breve</p>
      <dl className="case-glance__grid">
        {ROWS.map((row) => (
          <div key={row.key} className="case-glance__row">
            <dt>{row.label}</dt>
            <dd>{glance[row.key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
