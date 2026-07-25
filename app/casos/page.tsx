import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { casos } from "@/data/casos";

export const metadata: Metadata = {
  title: "Casos — El Diario de Kata",
  description:
    "Case studies de producto: decisiones de diseño con contexto, tensión y criterio.",
};

export default function CasosPage() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="casos-index">
        <section className="paper-shell casos-index__hero">
          <p className="eyebrow">✶ Portada de casos</p>
          <h1>Casos</h1>
          <p className="casos-index__deck">
            Historias de producto contadas por sus decisiones: de dónde veníamos,
            qué elegimos y por qué.
          </p>
        </section>
        <section className="paper-shell casos-index__grid">
          {casos.map((caso) => (
            <Link
              key={caso.slug}
              href={`/casos/${caso.slug}`}
              className="casos-index__card"
            >
              <p className="eyebrow">{caso.kicker}</p>
              <h2>{caso.title}</h2>
              <p>{caso.thesis}</p>
              <span aria-hidden="true">Leer el caso ↗</span>
            </Link>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
