import type { Metadata } from "next";
import Link from "next/link";
import WeatherIcon from "@/components/weather/WeatherIcon";
import { projects } from "@/data/home";

export const metadata: Metadata = {
  title: "Casos — Kata Iturriaga",
  description: "Todos los proyectos y casos de estudio, como una lista de ciudades.",
};

export default function CasosPage() {
  return (
    <main className="weather-shell city-list">
      <h1 className="city-list__title">Casos</h1>
      {projects.map((project) => {
        const card = (
          <>
            <div>
              <strong>{project.client}</strong>
              <p>{project.title}</p>
              <small>
                {project.domain} · {project.role}
              </small>
            </div>
            <div className="city-list__side">
              <WeatherIcon name={project.weather} size={26} />
              <span>
                {project.status} · {project.year}
              </span>
            </div>
          </>
        );
        return project.href ? (
          <Link key={project.number} href={project.href} className="glass-card city-list__card">
            {card}
          </Link>
        ) : (
          <div key={project.number} className="glass-card city-list__card is-static">
            {card}
          </div>
        );
      })}
    </main>
  );
}
