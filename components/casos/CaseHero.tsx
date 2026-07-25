import Link from "next/link";
import Image from "next/image";
import type { CaseStudy } from "@/data/casos";

export default function CaseHero({ caso }: { caso: CaseStudy }) {
  return (
    <header className="paper-shell case-hero">
      <Link href="/casos" className="case-hero__back">
        ← Volver a los casos
      </Link>
      <p className="eyebrow">✶ {caso.kicker}</p>
      <h1 className="case-hero__thesis">{caso.thesis}</h1>
      <p className="case-hero__subthesis">{caso.subthesis}</p>
      {caso.heroMedia ? (
        <div className="case-hero__media">
          <Image
            src={caso.heroMedia.src}
            alt={caso.heroMedia.alt}
            width={1600}
            height={900}
            priority
          />
        </div>
      ) : null}
    </header>
  );
}
