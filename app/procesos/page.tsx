import type { Metadata } from "next";
import Link from "next/link";
import GlassCard from "@/components/weather/GlassCard";
import WeatherIcon from "@/components/weather/WeatherIcon";
import { processCategories, processes } from "@/data/processes";
import { processStatusWeather } from "@/data/weather";

export const metadata: Metadata = {
  title: "Procesos — Kata Iturriaga",
  description:
    "El mapa del laboratorio: herramientas, decisiones y rituales de la idea a la entrega.",
};

export default function ProcesosPage() {
  return (
    <main className="weather-shell">
      <h1 className="city-list__title">Procesos</h1>
      <p className="map-intro">
        Las herramientas, decisiones y rituales que utilizo para llevar cada
        proyecto de la idea a la entrega.
      </p>
      <div className="card-stack">
        {processCategories.map((category) => (
          <GlassCard
            key={category.number}
            icon="mapa"
            title={`Frente ${category.number} · ${category.shortName}`}
            className="span-2"
          >
            <p className="map-category-desc">{category.description}</p>
            {processes
              .filter((process) => process.category === category.name)
              .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
              .map((process) => {
                const status = processStatusWeather[process.status];
                return (
                  <Link
                    key={process.slug}
                    href={`/procesos/${process.slug}`}
                    className="forecast-row"
                  >
                    <span className="forecast-row__client">{process.number}</span>
                    <WeatherIcon name={status.icon} size={20} />
                    <span className="forecast-row__title">{process.title}</span>
                    <span className="forecast-row__year">{status.label}</span>
                  </Link>
                );
              })}
          </GlassCard>
        ))}
      </div>
    </main>
  );
}
