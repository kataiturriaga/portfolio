import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseCity from "@/components/weather/caso/CaseCity";
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
  return {
    title: `${caso.title} — Kata Iturriaga`,
    description: caso.summary,
  };
}

export default async function CasoDetailPage({ params }: CasoPageProps) {
  const { slug } = await params;
  const caso = getCaso(slug);
  if (!caso) notFound();

  return <CaseCity caso={caso} />;
}
