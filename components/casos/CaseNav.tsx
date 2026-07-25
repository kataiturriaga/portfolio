import Link from "next/link";

export default function CaseNav({
  nextCase,
}: {
  nextCase?: { slug: string; title: string };
}) {
  return (
    <nav className="paper-shell case-nav" aria-label="Navegación de casos">
      <div className="case-nav__cta">
        <p className="eyebrow">✶ ¿Hablamos?</p>
        <Link href="/#contacto">Escríbeme sobre este proyecto →</Link>
      </div>
      {nextCase ? (
        <Link href={`/casos/${nextCase.slug}`} className="case-nav__next">
          <span>Siguiente caso →</span>
          <strong>{nextCase.title}</strong>
        </Link>
      ) : null}
    </nav>
  );
}
