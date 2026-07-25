import Image from "next/image";
import type { CaseStudy } from "@/data/casos";

export default function CaseHero({ caso }: { caso: CaseStudy }) {
  return (
    <header className="case-hero">
      <p className="eyebrow">✶ {caso.kicker}</p>
      <h1 className="case-hero__title">{caso.heroTitle}</h1>
      <p className="case-hero__subtitle">{caso.heroSubtitle}</p>
      <div className="case-hero__deck">
        <p>{caso.thesis}</p>
        <p>{caso.subthesis}</p>
      </div>
      {caso.heroMedia ? (
        <figure className="case-hero__media">
          <Image
            src={caso.heroMedia.src}
            alt={caso.heroMedia.alt}
            width={1600}
            height={700}
            priority
          />
          {caso.heroMedia.caption ? (
            <figcaption>{caso.heroMedia.caption}</figcaption>
          ) : null}
        </figure>
      ) : null}
    </header>
  );
}
