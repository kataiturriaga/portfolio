import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CityHeader from "@/components/weather/CityHeader";
import GlassCard from "@/components/weather/GlassCard";
import { getProcess, getProcessNeighbors, processes } from "@/data/processes";
import { processStatusWeather } from "@/data/weather";

type ProcessPageProps = { params: Promise<{ slug: string }> };

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
    title: `${process.title} — Procesos — Kata Iturriaga`,
    description: process.purpose,
  };
}

export default async function ProcessDetailPage({ params }: ProcessPageProps) {
  const { slug } = await params;
  const process = getProcess(slug);
  if (!process) notFound();

  const status = processStatusWeather[process.status];
  const { previous, next } = getProcessNeighbors(slug);

  return (
    <main className="weather-shell">
      <CityHeader
        over={`${process.category} · ${status.label}`}
        name={process.title}
        big={process.number}
        condition={process.purpose}
      />

      <div className="card-stack">
        <GlassCard icon="sol" title="Cuándo usarlo">
          <div className="card-prose">
            <p>{process.when}</p>
            {process.whenNot ? (
              <p className="decision-from">Cuándo no: {process.whenNot}</p>
            ) : null}
          </div>
        </GlassCard>

        <GlassCard icon="viento" title="Entrada → Salida">
          <div className="card-prose">
            <p>
              <strong>Entrada:</strong> {process.input}
            </p>
            <p>
              <strong>Salida:</strong> {process.output}
            </p>
          </div>
        </GlassCard>

        <GlassCard icon="lista" title="Pasos" className="span-2">
          <ol className="process-steps-list">
            {process.steps.map((step) => (
              <li key={step.slice(0, 40)}>{step}</li>
            ))}
          </ol>
        </GlassCard>

        {process.checklist?.length ? (
          <GlassCard icon="ojo" title="Checklist">
            <ul className="decision-list">
              {process.checklist.map((item) => (
                <li key={item.slice(0, 40)}>{item}</li>
              ))}
            </ul>
          </GlassCard>
        ) : null}

        <GlassCard icon="brujula" title="Herramientas">
          <div className="chip-row">
            {process.tools.map((tool) => (
              <span key={tool} className="chip">
                {tool}
              </span>
            ))}
          </div>
        </GlassCard>

        <GlassCard icon="niebla" title="Esquema" className="span-2">
          <pre className="decision-schema">{process.schema}</pre>
        </GlassCard>

        <GlassCard icon="flecha" title="Más procesos" className="span-2">
          <div className="process-pager">
            {previous ? (
              <Link href={`/procesos/${previous.slug}`}>← {previous.title}</Link>
            ) : (
              <span />
            )}
            {next ? <Link href={`/procesos/${next.slug}`}>{next.title} →</Link> : <span />}
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
