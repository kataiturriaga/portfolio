import type { Metadata } from "next";
import Link from "next/link";
import ProcessCard from "@/components/processes/ProcessCard";
import ProcessFlow from "@/components/processes/ProcessFlow";
import SectionHeading from "@/components/site/SectionHeading";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import {
  featuredProcesses,
  processCategories,
  processes,
} from "@/data/processes";

export const metadata: Metadata = {
  title: "Procesos — El Diario de Kata",
  description:
    "Una biblioteca viva de los métodos que uso para investigar, diseñar, construir y entregar productos digitales.",
};

export default function ProcessesPage() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="processes-page">
        <section className="paper-shell processes-hero">
          <div className="processes-hero__meta">
            <span>✶ El archivo de la redacción</span>
            <span>22 playbooks · 4 fases</span>
          </div>
          <h1>Procesos</h1>
          <div className="processes-hero__deck">
            <p>
              Una biblioteca viva de métodos, prompts, flujos y aprendizajes
              que uso para pensar, investigar, diseñar y construir mejor.
            </p>
            <blockquote>
              “Documentar menos cosas, pero que las importantes sean
              ejecutables.”
            </blockquote>
          </div>
        </section>

        <section className="paper-shell processes-map">
          <SectionHeading
            eyebrow="Del problema a la entrega"
            title="Un mapa para no diseñar a ciegas"
          />
          <p className="section-intro">
            Cada playbook pertenece a una fase, pero el trabajo real se mueve
            entre ellas. El mapa sirve para elegir qué pregunta toca responder.
          </p>
          <ProcessFlow />
        </section>

        <section className="processes-featured">
          <div className="paper-shell">
            <SectionHeading
              light
              eyebrow="Selección de la editora"
              title="Tres procesos, de la evidencia al producto"
            />
            <div className="processes-featured__grid">
              {featuredProcesses.map((process) => (
                <ProcessCard key={process.slug} process={process} featured />
              ))}
            </div>
          </div>
        </section>

        <section className="paper-shell processes-catalogue" id="archivo">
          <SectionHeading
            eyebrow="El catálogo completo"
            title="22 formas de hacer explícito el criterio"
          />
          <p className="section-intro">
            Los estados indican madurez, no importancia: estable significa
            repetible; probado, usado en trabajo real; borrador, todavía en
            aprendizaje.
          </p>
          {processCategories.map((category) => {
            const categoryProcesses = processes.filter(
              (process) => process.category === category.name,
            );
            return (
              <section className="process-category" key={category.name}>
                <div className="process-category__heading">
                  <span>/ {category.number}</span>
                  <h2>{category.name}</h2>
                  <p>{category.description}</p>
                  <small>{categoryProcesses.length} procesos</small>
                </div>
                <div className="process-category__grid">
                  {categoryProcesses.map((process) => (
                    <ProcessCard key={process.slug} process={process} />
                  ))}
                </div>
              </section>
            );
          })}
        </section>

        <section className="process-decision">
          <div className="paper-shell process-decision__grid">
            <SectionHeading
              light
              eyebrow="Árbol de decisión"
              title="¿Qué proceso usar?"
            />
            <div className="decision-tree">
              <p>¿Tengo claridad sobre el problema?</p>
              <ul>
                <li>
                  <strong>No → Discovery</strong>
                  <ul>
                    <li>Mercado o competencia → Research con reseñas</li>
                    <li>Estructura o navegación → Arquitectura de información</li>
                    <li>Audio o notas → Módulos + referencias</li>
                  </ul>
                </li>
                <li>
                  <strong>Sí → Diseñar o construir</strong>
                  <ul>
                    <li>Explorar UI → Prototipado HTML</li>
                    <li>Construir → Plan + edge cases</li>
                    <li>Entregar → Review + release</li>
                  </ul>
                </li>
              </ul>
              <Link href="/procesos/implementar-funcionalidad-edge-cases">
                Ver un proceso de principio a fin ↗
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
