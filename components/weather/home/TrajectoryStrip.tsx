"use client";

import { useState } from "react";
import WeatherIcon from "../WeatherIcon";
import { useSky } from "../SkyProvider";
import { trajectoryIcon } from "@/data/weather";
import type { timeline } from "@/data/home";

export default function TrajectoryStrip({ items }: { items: typeof timeline }) {
  // items llega en orden cronológico inverso; la franja se lee de pasado a presente
  const stages = [...items].reverse();
  const [selected, setSelected] = useState(stages.length - 1);
  const stage = stages[selected];
  const { condition } = useSky();

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
            <WeatherIcon
              name={trajectoryIcon(i, stages.length, condition)}
              size={26}
            />
            <strong>{item.company}</strong>
          </button>
        ))}
      </div>
      <div className="stage-detail">
        <div className="chip-row">
          {stage.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
        <div className="stage-detail__role">
          <strong>{stage.role.split("·")[0].trim()}</strong>
          <span>{stage.status}</span>
        </div>
        <p className="stage-detail__notes">
          {stage.bullets
            .map((bullet) => bullet.replace(/\.$/, ""))
            .join(". ")}
          .
        </p>
      </div>
    </div>
  );
}
