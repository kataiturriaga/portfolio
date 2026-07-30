"use client";

import { dayMoments, skyConditions } from "@/data/weather";
import { useSky } from "./SkyProvider";

export default function SkyControls() {
  const { moment, condition, setMoment, setCondition } = useSky();

  return (
    <div className="sky-controls">
      <div className="seg" role="group" aria-label="Momento del día">
        {dayMoments.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={moment === m.id}
            className={moment === m.id ? "is-active" : undefined}
            onClick={() => setMoment(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="seg" role="group" aria-label="Condición meteorológica">
        {skyConditions.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={condition === c.id}
            className={condition === c.id ? "is-active" : undefined}
            onClick={() => setCondition(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
