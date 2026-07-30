"use client";

import { useState } from "react";
import WeatherIcon, { WeatherIconName } from "../WeatherIcon";
import type { timeline } from "@/data/home";

const STAGE_ICONS: WeatherIconName[] = ["amanecer", "nube-sol", "sol", "sol"];

export default function TrajectoryStrip({ items }: { items: typeof timeline }) {
  // items llega en orden cronológico inverso; la franja se lee de pasado a presente
  const stages = [...items].reverse();
  const [selected, setSelected] = useState(stages.length - 1);
  const stage = stages[selected];

  return (
    <div>
      <div className="hour-strip">
        {stages.map((item, i) => (
          <button
            key={item.period}
            type="button"
            className={i === selected ? "is-active" : undefined}
            onClick={() => setSelected(i)}
          >
            <span>{item.period}</span>
            <WeatherIcon name={STAGE_ICONS[i] ?? "sol"} size={22} />
            <strong>{item.company}</strong>
          </button>
        ))}
      </div>
      <div className="hour-detail">
        <p>
          {stage.role} · {stage.status}
        </p>
        <ul>
          {stage.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <div className="chip-row">
          {stage.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
