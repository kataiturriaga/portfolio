"use client";

import Link from "next/link";
import WeatherIcon from "../WeatherIcon";
import { useSky } from "../SkyProvider";
import { conditionTempRange, projectSky, tempColor } from "@/data/weather";
import type { Project } from "@/data/home";

/**
 * Previsión a N proyectos: una fila grande por proyecto. Cada uno lleva una
 * ficha con el cielo de su propio tiempo, que no cambia con el cielo global.
 */
export default function ProjectForecast({
  items,
  readCase,
}: {
  items: Project[];
  readCase: string;
}) {
  const { condition } = useSky();
  const [lo, hi] = conditionTempRange[condition];

  return (
    <ul className="project-forecast">
      {items.map((project) => {
        const [from, to] = project.tempBand;
        const tMin = lo + (hi - lo) * from;
        const tMax = lo + (hi - lo) * to;

        const row = (
          <>
            <span
              className="project-forecast__sky"
              style={{ background: projectSky(project.weather) }}
              aria-hidden="true"
            >
              <WeatherIcon name={project.weather} size={22} />
            </span>
            <span className="project-forecast__name">
              <strong>{project.client}</strong>
              <span>{project.title}</span>
            </span>
            <span className="project-forecast__year">{project.year}</span>
            <span className="project-forecast__range" aria-hidden="true">
              <i
                style={{
                  left: `${from * 100}%`,
                  width: `${(to - from) * 100}%`,
                  background: `linear-gradient(90deg, ${tempColor(tMin)}, ${tempColor(tMax)})`,
                }}
              />
            </span>
            {project.href ? (
              <span className="project-forecast__cta">{readCase} ›</span>
            ) : (
              <span className="project-forecast__status">{project.status}</span>
            )}
          </>
        );

        return (
          <li key={project.number}>
            {project.href ? (
              <Link href={project.href} className="project-forecast__row is-link">
                {row}
              </Link>
            ) : (
              <div className="project-forecast__row">{row}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
