import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import CaseHero from "@/components/casos/CaseHero";
import CaseGlance from "@/components/casos/CaseGlance";
import CaseSection from "@/components/casos/CaseSection";
import CaseDecision from "@/components/casos/CaseDecision";
import CaseRest from "@/components/casos/CaseRest";
import CaseReflection from "@/components/casos/CaseReflection";
import CaseNav from "@/components/casos/CaseNav";
import { casos, getCaso } from "@/data/casos";

type CasoPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return casos.map((caso) => ({ slug: caso.slug }));
}

export async function generateMetadata({
  params,
}: CasoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caso = getCaso(slug);
  if (!caso) return {};
  return { title: `${caso.title} — El Diario de Kata`, description: caso.thesis };
}

export default async function CasoDetailPage({ params }: CasoPageProps) {
  const { slug } = await params;
  const caso = getCaso(slug);
  if (!caso) notFound();

  return (
    <>
      <SiteHeader />
      <main id="contenido" className="case-detail">
        <article>
          <CaseHero caso={caso} />
          <CaseGlance glance={caso.glance} />
          <CaseSection prose={caso.problem} />
          <CaseSection prose={caso.howWeWorked} />
          <div className="case-decisions">
            {caso.decisions.map((decision) => (
              <CaseDecision key={decision.number} decision={decision} />
            ))}
          </div>
          <CaseRest items={caso.rest} />
          <CaseReflection items={caso.reflection} />
        </article>
        <CaseNav nextCase={caso.nextCase} />
      </main>
      <SiteFooter />
    </>
  );
}
