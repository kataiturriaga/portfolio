import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProcessCard from "@/components/processes/ProcessCard";
import StatusBadge from "@/components/processes/StatusBadge";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import {
  getProcess,
  getProcessNeighbors,
  getRelatedProcesses,
  processes,
} from "@/data/processes";

type ProcessPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return processes.map((process) => ({ slug: process.slug }));
}

export async function generateMetadata({
  params,
}: ProcessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const process = getProcess(slug);
  if (!process) return {};

  return {
    title: `${process.title} — Procesos de Kata`,
    description: process.purpose,
  };
}

export default async function ProcessDetailPage({ params }: ProcessPageProps) {
  const { slug } = await params;
  const process = getProcess(slug);
  if (!process) notFound();

  const related = getRelatedProcesses(process);
  const { previous, next } = getProcessNeighbors(process.slug);

  return (
    <>
      <SiteHeader />
      <main id="contenido" className="process-detail">
        <article>
          <header className="paper-shell process-detail__hero">
            <Link href="/procesos" className="process-detail__back">
              ← Volver al archivo
            </Link>
            <div className="process-detail__meta">
              <span>/ {process.number}</span>
              <span>{process.category}</span>
              <StatusBadge status={process.status} />
            </div>
            <h1>{process.title}</h1>
            <p>{process.purpose}</p>
          </header>

          <div className="paper-shell process-detail__body">
            <aside className="process-detail__aside">
              <div>
                <span>Input</span>
                <p>{process.input}</p>
              </div>
              <div>
                <span>Output</span>
                <p>{process.output}</p>
              </div>
              <div>
                <span>Herramientas</span>
                <ul>
                  {process.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </div>
            </aside>

            <div className="process-detail__content">
              <section>
                <p className="eyebrow">✶ Contexto de uso</p>
                <h2>Cuándo usarlo</h2>
                <p>{process.when}</p>
                {process.whenNot ? (
                  <div className="process-warning">
                    <strong>Cuándo no</strong>
                    <p>{process.whenNot}</p>
                  </div>
                ) : null}
              </section>

              <section>
                <p className="eyebrow">✶ La secuencia</p>
                <h2>Pasos</h2>
                <ol className="process-steps">
                  {process.steps.map((step, index) => (
                    <li key={step}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <p className="eyebrow">✶ Vista rápida</p>
                <h2>El flujo</h2>
                <p className="process-schema">{process.schema}</p>
              </section>

              {process.checklist ? (
                <section>
                  <p className="eyebrow">✶ Control de calidad</p>
                  <h2>Checklist</h2>
                  <ul className="process-checklist">
                    {process.checklist.map((item) => (
                      <li key={item}>
                        <span aria-hidden="true">□</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </div>
        </article>

        <section className="paper-shell process-related">
          <div className="process-related__heading">
            <p className="eyebrow">✶ Sigue leyendo</p>
            <h2>Procesos relacionados</h2>
          </div>
          <div className="process-related__grid">
            {related.map((relatedProcess) => (
              <ProcessCard key={relatedProcess.slug} process={relatedProcess} />
            ))}
          </div>
        </section>

        <nav className="paper-shell process-pagination" aria-label="Procesos">
          {previous ? (
            <Link href={`/procesos/${previous.slug}`}>
              <span>← Anterior</span>
              <strong>{previous.title}</strong>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/procesos/${next.slug}`}>
              <span>Siguiente →</span>
              <strong>{next.title}</strong>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
