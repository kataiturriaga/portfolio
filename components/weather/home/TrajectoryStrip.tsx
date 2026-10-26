"use client";

import WeatherIcon from "../WeatherIcon";
import { useSky } from "../SkyProvider";
import { trajectoryIcon } from "@/data/weather";
import type { timeline } from "@/data/home";

/** Trayectoria como previsión por horas: de la formación a hoy, sin desplegables. */
export default function TrajectoryStrip({ items }: { items: typeof timeline }) {
  // items llega en orden cronológico inverso; la franja se lee de pasado a presente
  const stages = [...items].reverse();
  const { condition } = useSky();

  return (
    <ol className="trajectory">
      {stages.map((item, i) => (
        <li key={item.period} title={`${item.role} · ${item.period}`}>
          <span>{item.status === "Actual" ? "Hoy" : item.period.split(" ")[0]}</span>
          <WeatherIcon name={trajectoryIcon(i, stages.length, condition)} size={26} />
          <strong>{item.company}</strong>
        </li>
      ))}
    </ol>
  );
}
