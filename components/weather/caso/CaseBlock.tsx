import Link from "next/link";
import GlassCard from "../GlassCard";
import GlassIcon from "../GlassIcon";
import type { CaseBlock as Block, Decision } from "@/data/casos";

/** Un bloque solo decide cuántas columnas ocupa; el resto lo fija el sistema. */
const WIDTH_CLASS = {
  third: "col-third",
  half: "col-half",
  "two-thirds": "col-two-thirds",
  full: "col-full",
} as const;

function DecisionBody({ decision }: { decision: Decision }) {
  return (
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
          {decision.media.caption ? <figcaption>{decision.media.caption}</figcaption> : null}
        </figure>
      ) : null}
      {decision.comparison ? (
        <div className="decision-compare">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={decision.comparison.before.src} alt={decision.comparison.before.alt} />
            <figcaption>{decision.comparison.beforeLabel ?? "Antes"}</figcaption>
          </figure>
          <figure>
            <video src={decision.comparison.after.src} autoPlay muted loop playsInline />
            <figcaption>{decision.comparison.afterLabel ?? "Después"}</figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  );
}

export default function CaseBlock({ block }: { block: Block }) {
  const width = WIDTH_CLASS[block.width ?? "full"];

  switch (block.type) {
    case "alert":
      return (
        <GlassCard
          icon="campana"
          title={block.title ?? "Aviso destacado"}
          className={`glass-card--alert ${width}`}
        >
          <div className="thesis-split">
            {block.glassIcon ? (
              <GlassIcon
                name={block.glassIcon}
                size={72}
                className="thesis-split__icon"
              />
            ) : null}
            <p className="thesis-split__teaser">{block.teaser}</p>
            <p className="thesis-split__body">{block.body}</p>
          </div>
        </GlassCard>
      );

    case "fact":
      return (
        <GlassCard icon={block.icon ?? "ojo"} title={block.label} className={width}>
          <p className="small-card__note glance-value">{block.text}</p>
        </GlassCard>
      );

    case "metrics":
      return (
        <GlassCard icon="termometro" title={block.title ?? "Impacto"} className={width}>
          <div className="impact-grid">
            {block.items.map((metric) => (
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
      );

    case "prose":
      return (
        <GlassCard icon={block.icon} title={block.title} className={width}>
          <div className="card-prose">
            {block.lead ? <p className="card-lead">{block.lead}</p> : null}
            {block.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </GlassCard>
      );

    case "decision":
      return (
        <GlassCard
          icon="nube-sol"
          title={`Decisión ${block.number} · ${block.area}`}
          className={width}
        >
          <DecisionBody decision={block} />
        </GlassCard>
      );

    case "list":
      return (
        <GlassCard icon={block.icon ?? "lista"} title={block.title} className={width}>
          {block.items.map((item) => (
            <div key={item.title} className="forecast-row forecast-row--compact">
              <span className="forecast-row__client">{item.title}</span>
              <span className="forecast-row__year">{item.summary}</span>
            </div>
          ))}
        </GlassCard>
      );

    case "notes":
      return (
        <GlassCard icon={block.icon ?? "luna"} title={block.title} className={width}>
          <div className="card-prose">
            {block.items.map((item) => (
              <p key={item.slice(0, 40)}>{item}</p>
            ))}
          </div>
        </GlassCard>
      );

    case "next":
      return (
        <GlassCard icon="flecha" title="Siguiente ciudad" className={width}>
          <p className="card-archive-link">
            <Link href={`/casos/${block.slug}`}>{block.title} →</Link>
          </p>
        </GlassCard>
      );
  }
}
