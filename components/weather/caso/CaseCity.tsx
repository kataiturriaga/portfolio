import CityHeader from "../CityHeader";
import CaseBlock from "./CaseBlock";
import CaseIndex from "./CaseIndex";
import { buildSections } from "./sections";
import type { CaseStudy } from "@/data/casos";

export default function CaseCity({ caso }: { caso: CaseStudy }) {
  const sections = buildSections(caso);
  const indexItems = sections
    .filter((section) => !section.hidden)
    .map(({ id, label, sub, metric }) => ({ id, label, sub, metric }));
  const hero = caso.heroMetric;

  return (
    <main className="weather-shell case-page">
      <CityHeader
        over={`${caso.client} · ${caso.title.split("—")[0].trim()}`}
        name={caso.heroTitle}
        big={hero ? hero.value : caso.heroTitle}
        unit={hero?.unit}
        condition={hero?.label}
        hiLo={
          <>
            <span>{caso.period}</span>
            <span>{caso.role}</span>
          </>
        }
      />

      <div className="case-layout">
        <CaseIndex items={indexItems} flowId="case-flow" />
        <div className="case-flow" id="case-flow">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="case-section case-grid"
              aria-label={section.hidden ? undefined : section.label}
            >
              {section.blocks.map((block, i) => (
                <CaseBlock key={`${block.type}-${i}`} block={block} />
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
