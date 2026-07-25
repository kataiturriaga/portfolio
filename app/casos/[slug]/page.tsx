import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import CaseStudyView from "@/components/casos/CaseStudyView";
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
        <CaseStudyView caso={caso} />
      </main>
      <SiteFooter />
    </>
  );
}
