import CityHeader from "../CityHeader";
import CaseBlock from "./CaseBlock";
import type { CaseStudy } from "@/data/casos";

export default function CaseCity({ caso }: { caso: CaseStudy }) {
  return (
    <main className="weather-shell">
      <CityHeader
        name={caso.client}
        big={caso.heroTitle}
        hiLo={
          <>
            <span>{caso.period}</span>
            <span>{caso.role}</span>
          </>
        }
      />

      <div className="case-grid">
        {caso.blocks.map((block, i) => (
          <CaseBlock key={`${block.type}-${i}`} block={block} />
        ))}
      </div>
    </main>
  );
}
