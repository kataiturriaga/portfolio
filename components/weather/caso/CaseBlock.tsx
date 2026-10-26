import Link from "next/link";
import GlassCard from "../GlassCard";
import GlassIcon from "../GlassIcon";
import { casos, type CaseBlock as Block, type Decision } from "@/data/casos";

/** Un bloque solo decide cuántas columnas ocupa; el resto lo fija el sistema. */
const WIDTH_CLASS = {
  third: "col-third",
  half: "col-half",
  "two-thirds": "col-two-thirds",
  full: "col-full",
} as const;

/** Columna corta de la decisión: título en versalitas y una lista breve. */
function BriefColumn({
  title,
  items,
  marker,
}: {
  title: string;
  items: string[];
  marker?: "dot" | "dash";
}) {
  return (
    <div className="decision-brief__col">
      <h4>{title}</h4>
      <ul className={marker ? `is-${marker}` : undefined}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/** El texto completo de siempre, plegado bajo la versión corta. */
function DecisionDetail({ decision }: { decision: Decision }) {
  return (
    <details className="decision-detail">
      <summary>Leer el detalle completo</summary>
      <div className="card-prose">
        <h4>De dónde veníamos</h4>
        <p>{decision.from}</p>
        <h4>Qué decidimos y por qué</h4>
        <ul className="decision-list">
          {decision.decided.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {decision.alternatives?.length ? (
          <>
            <h4>Alternativas descartadas</h4>
            <ul className="decision-list">
              {decision.alternatives.map((alt) => (
                <li key={alt}>{alt}</li>
              ))}
            </ul>
          </>
        ) : null}
        {decision.finalStructure ? (
          <pre className="decision-schema">{decision.finalStructure}</pre>
        ) : null}
      </div>
    </details>
  );
}

function DecisionBody({ decision }: { decision: Decision }) {
  const { brief, comparison, media, flow } = decision;
  const hasMedia = Boolean(comparison || media);

  return (
    <div className="decision">
      <p className="decision__kicker">
        {decision.number} · {decision.shortLabel}
      </p>
      <h3 className="decision__title">{decision.title}</h3>
      <p className="decision__lead">{decision.summary}</p>

      {hasMedia ? (
        <div className="decision-stage">
          {comparison ? (
            <>
              <figure className="decision-phone">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={comparison.before.src} alt={comparison.before.alt} loading="lazy" />
                <figcaption>{comparison.beforeLabel ?? "Antes · v1"}</figcaption>
              </figure>
              <figure className="decision-phone">
                <video src={comparison.after.src} autoPlay muted loop playsInline aria-label={comparison.after.alt} />
                <figcaption>{comparison.afterLabel ?? "Después · v2"}</figcaption>
              </figure>
            </>
          ) : null}
          {media ? (
            <figure className="decision-wide">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media.src} alt={media.alt} loading="lazy" />
              {media.caption ? <figcaption>{media.caption}</figcaption> : null}
            </figure>
          ) : null}
        </div>
      ) : null}

      {brief ? (
        <div className="decision-brief">
          <BriefColumn title="De dónde veníamos" items={[brief.from]} />
          <BriefColumn title="Qué decidimos" items={brief.decided} marker="dot" />
          {brief.alternatives?.length ? (
            <BriefColumn title="Qué descartamos" items={brief.alternatives} marker="dash" />
          ) : null}
        </div>
      ) : null}

      {flow?.length ? (
        <div className="decision-flow">
          <h4>Estructura final</h4>
          <ol>
            {flow.map((step) => (
              <li key={step}>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <DecisionDetail decision={decision} />
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

    case "next": {
      // Solo enlaza si el caso ya existe; si no, se anuncia sin enlace roto
      const exists = casos.some((caso) => caso.slug === block.slug);
      return (
        <GlassCard icon="flecha" title="Siguiente ciudad" className={width}>
          <p className="card-archive-link">
            {exists ? (
              <Link href={`/casos/${block.slug}`}>{block.title} →</Link>
            ) : (
              <span className="next-soon">
                {block.title} <em>Próximamente</em>
              </span>
            )}
          </p>
        </GlassCard>
      );
    }
  }
}
