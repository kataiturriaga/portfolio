"use client";

import Link from "next/link";
import WeatherIcon from "../WeatherIcon";
import { useSky } from "../SkyProvider";
import { conditionTempRange, tempColor } from "@/data/weather";
import type { projects as projectList } from "@/data/home";

export default function ForecastList({ items }: { items: typeof projectList }) {
  const { condition } = useSky();
  const [lo, hi] = conditionTempRange[condition];

  return (
    <>
      {items.map((project) => {
        const [from, to] = project.tempBand;
        // La franja es relativa (0-1); los grados salen del rango de la condición
        const tMin = lo + (hi - lo) * from;
        const tMax = lo + (hi - lo) * to;

        const row = (
          <>
            <span className="forecast-row__client">{project.client}</span>
            {project.video ? (
              <video
                className="forecast-row__thumb"
                src={project.video}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <span className="forecast-row__thumb forecast-row__thumb--icon">
                <WeatherIcon name={project.weather} size={22} />
              </span>
            )}
            <span className="forecast-row__title">{project.shortTitle}</span>
            <span className="forecast-row__yr">{project.year}</span>
            <span className="forecast-row__range">
              <i
                style={{
                  left: `${from * 100}%`,
                  width: `${(to - from) * 100}%`,
                  background: `linear-gradient(90deg, ${tempColor(tMin)}, ${tempColor(tMax)})`,
                }}
              />
            </span>
            <span className="forecast-row__status">{project.status}</span>
          </>
        );

        return project.href ? (
          <Link
            key={project.number}
            href={project.href}
            className="forecast-row forecast-row--project"
          >
            {row}
          </Link>
        ) : (
          <div key={project.number} className="forecast-row forecast-row--project">
            {row}
          </div>
        );
      })}
    </>
  );
}
