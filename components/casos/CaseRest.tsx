import type { RestItem } from "@/data/casos";

export default function CaseRest({ items }: { items: RestItem[] }) {
  return (
    <section className="paper-shell case-rest">
      <p className="eyebrow">✶ El resto del trabajo</p>
      <h2>Otras piezas de la v2</h2>
      <div className="case-rest__grid">
        {items.map((item) => (
          <article key={item.title} className="case-rest__item">
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
