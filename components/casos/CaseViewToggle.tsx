"use client";

export type CaseView = "corta" | "extensa";

const OPTIONS: { value: CaseView; label: string; hint: string }[] = [
  { value: "corta", label: "Vista reclutador", hint: "Resumen 30 seg" },
  { value: "extensa", label: "Vista design lead", hint: "Caso completo" },
];

export default function CaseViewToggle({
  view,
  onChange,
}: {
  view: CaseView;
  onChange: (v: CaseView) => void;
}) {
  return (
    <div className="paper-shell case-toggle" role="group" aria-label="Modo de lectura">
      {OPTIONS.map((opt) => {
        const selected = view === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected}
            className={`case-toggle__option ${selected ? "is-active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            <span className="case-toggle__label">{opt.label}</span>
            <span className="case-toggle__sep" aria-hidden="true"> · </span>
            <span className="case-toggle__hint">{opt.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
