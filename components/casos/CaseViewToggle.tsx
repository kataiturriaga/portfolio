"use client";

export type CaseView = "corta" | "extensa";

const OPTIONS: { value: CaseView; label: string; hint: string }[] = [
  { value: "corta", label: "Para reclutadores", hint: "Rápido y al grano" },
  { value: "extensa", label: "Para design leads", hint: "El caso a fondo" },
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
            <span className="case-toggle__hint">{opt.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
