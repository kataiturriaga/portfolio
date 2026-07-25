export default function CaseReflection({ items }: { items: string[] }) {
  return (
    <section className="paper-shell case-reflection">
      <p className="eyebrow">✶ Con perspectiva</p>
      <h2>Qué haría diferente / qué quedó pendiente</h2>
      <ul className="case-reflection__list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
