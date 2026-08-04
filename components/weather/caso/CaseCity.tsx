import Link from "next/link";
import CityHeader from "../CityHeader";
import GlassCard from "../GlassCard";
import type { CaseStudy, Decision } from "@/data/casos";

function DecisionCard({ decision }: { decision: Decision }) {
  return (
    <GlassCard
      icon="nube-sol"
      title={`Decisión ${decision.number} · ${decision.area}`}
      className="span-2"
    >
      <div className="card-prose">
        <p className="card-lead">{decision.title}</p>
        <p className="decision-from">{decision.from}</p>
        <ul className="decision-list">
          {decision.decided.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {decision.alternatives?.length ? (
          <details className="decision-alt">
            <summary>Alternativas descartadas</summary>
            <ul className="decision-list">
              {decision.alternatives.map((alt) => (
                <li key={alt}>{alt}</li>
              ))}
            </ul>
          </details>
        ) : null}
        {decision.finalStructure ? (
          <pre className="decision-schema">{decision.finalStructure}</pre>
        ) : null}
        {decision.media ? (
          <figure className="decision-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={decision.media.src} alt={decision.media.alt} />
            {decision.media.caption ? (
              <figcaption>{decision.media.caption}</figcaption>
            ) : null}
          </figure>
        ) : null}
        {decision.comparison ? (
          <div className="decision-compare">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={decision.comparison.before.src}
                alt={decision.comparison.before.alt}
              />
              <figcaption>{decision.comparison.beforeLabel ?? "Antes"}</figcaption>
            </figure>
            <figure>
              <video src={decision.comparison.after.src} autoPlay muted loop playsInline />
              <figcaption>{decision.comparison.afterLabel ?? "Después"}</figcaption>
            </figure>
          </div>
        ) : null}
      </div>
    </GlassCard>
  );
}

export default function CaseCity({ caso }: { caso: CaseStudy }) {
  // El nombre de ciudad es la marca, no la descripción completa del producto
  const cityName = caso.glance.product.split("—")[0].trim();

  return (
    <main className="weather-shell">
      <CityHeader
        over={caso.kicker}
        name={cityName}
        big={caso.heroTitle}
        condition={caso.heroSubtitle}
        hiLo={`${caso.glance.period} · ${caso.glance.role}`}
      />

      <div className="card-stack">
        <GlassCard
          icon="campana"
          title="Aviso destacado · La tesis"
          className="glass-card--alert span-2"
        >
          <div className="card-prose">
            <p className="card-lead">{caso.thesis}</p>
            <p>{caso.subthesis}</p>
          </div>
        </GlassCard>

        <div className="small-grid span-2">
          {(
            [
              ["Rol", caso.glance.role],
              ["Periodo", caso.glance.period],
              ["Equipo", caso.glance.team],
              ["Producto", caso.glance.product],
              ["Problema", caso.glance.problem],
              ["Solución", caso.glance.solution],
            ] as const
          ).map(([label, value]) => (
            <GlassCard key={label} icon="ojo" title={label}>
              <p className="small-card__note glance-value">{value}</p>
            </GlassCard>
          ))}
        </div>

        <GlassCard icon="termometro" title="Impacto" className="span-2">
          <div className="impact-grid">
            {caso.impact.map((metric) => (
              <div key={metric.label} className={metric.pending ? "is-pending" : undefined}>
                <p className="small-card__value">{metric.pending ? "—" : metric.value}</p>
                <p className="small-card__note">
                  {metric.label}
                  {metric.note ? ` · ${metric.note}` : ""}
                  {metric.pending ? " · por medir" : ""}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard icon="nube" title={caso.problem.eyebrow}>
          <div className="card-prose">
            <p className="card-lead">{caso.problem.title}</p>
            {caso.problem.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </GlassCard>

        <GlassCard icon="viento" title={caso.howWeWorked.eyebrow}>
          <div className="card-prose">
            <p className="card-lead">{caso.howWeWorked.title}</p>
            {caso.howWeWorked.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </GlassCard>

        {caso.decisions.map((decision) => (
          <DecisionCard key={decision.number} decision={decision} />
        ))}

        <GlassCard icon="lista" title="El resto">
          {caso.rest.map((item) => (
            <div key={item.title} className="forecast-row forecast-row--compact">
              <span className="forecast-row__client">{item.title}</span>
              <span className="forecast-row__year">{item.summary}</span>
            </div>
          ))}
        </GlassCard>

        <GlassCard icon="luna" title="Reflexión">
          <div className="card-prose">
            {caso.reflection.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </GlassCard>

        {caso.nextCase ? (
          <GlassCard icon="flecha" title="Siguiente ciudad" className="span-2">
            <p className="card-archive-link">
              <Link href={`/casos/${caso.nextCase.slug}`}>{caso.nextCase.title} →</Link>
            </p>
          </GlassCard>
        ) : null}
      </div>
    </main>
  );
}
