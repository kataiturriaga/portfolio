import Link from "next/link";
import WeatherIcon from "../WeatherIcon";
import { projectSky } from "@/data/weather";
import type { CaseStudy } from "@/data/casos";

/**
 * El widget grande de la home. Lleva el cielo de su proyecto, no el global:
 * en la app del Tiempo cada widget muestra el tiempo de su ciudad.
 */
export default function FeaturedCase({
  caso,
  label,
  cta,
}: {
  caso: CaseStudy;
  label: string;
  cta: string;
}) {
  const metrics = caso.blocks.find((block) => block.type === "metrics");
  const hero = caso.heroMetric;
  const heroText = hero ? `${hero.value}${hero.unit ?? ""}` : null;
  // El resto de métricas acompaña al dato gigante en una sola línea
  const others =
    metrics?.type === "metrics"
      ? metrics.items.filter((m) => !m.pending && !(heroText && m.value.endsWith(heroText)))
      : [];

  return (
    <section className="featured-case" style={{ background: projectSky(caso.weather) }}>
      <div className="featured-case__text">
        <p className="featured-case__label">
          <WeatherIcon name={caso.weather} size={14} />
          {label}
        </p>
        <h2>{caso.client}</h2>
        <p className="featured-case__summary">
          {caso.heroTitle} · {caso.title.split("—")[0].trim()}
        </p>
        {hero ? (
          <p className="featured-case__metric">
            {hero.value}
            {hero.unit ? <sup>{hero.unit}</sup> : null}
          </p>
        ) : null}
        {hero ? <p className="featured-case__metric-label">{hero.label}</p> : null}
        {others.length ? (
          <p className="featured-case__others">
            {others.map((m) => `${m.label} ${m.value}`).join(" · ")}
          </p>
        ) : null}
        <Link href={`/casos/${caso.slug}`} className="pill pill--solid">
          {cta} →
        </Link>
      </div>
      {caso.video ? (
        <div className="featured-case__media">
          <video src={caso.video} autoPlay muted loop playsInline aria-hidden="true" />
        </div>
      ) : null}
    </section>
  );
}
