import Image from "next/image";
import type { Decision } from "@/data/casos";

export default function CaseDecision({ decision }: { decision: Decision }) {
  return (
    <section className="paper-shell case-decision">
      <div className="case-decision__head">
        <span className="case-decision__number">/ {decision.number}</span>
        <p className="eyebrow">{decision.area}</p>
      </div>
      <h2 className="case-decision__title">{decision.title}</h2>

      <div className="case-decision__block">
        <h3>De dónde veníamos</h3>
        <p>{decision.from}</p>
      </div>

      <div className="case-decision__block">
        <h3>Qué decidimos y por qué</h3>
        {decision.decided.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      {decision.alternatives?.length ? (
        <div className="case-decision__block">
          <h3>Alternativas descartadas</h3>
          <ul className="case-decision__alts">
            {decision.alternatives.map((alt) => (
              <li key={alt}>{alt}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {decision.finalStructure ? (
        <pre className="case-decision__structure">{decision.finalStructure}</pre>
      ) : null}

      {decision.media ? (
        <figure className="case-decision__media">
          <Image
            src={decision.media.src}
            alt={decision.media.alt}
            width={1600}
            height={1000}
          />
          {decision.media.caption ? (
            <figcaption>{decision.media.caption}</figcaption>
          ) : null}
        </figure>
      ) : null}
    </section>
  );
}
