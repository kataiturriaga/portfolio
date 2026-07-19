import { processCategories } from "@/data/processes";

export default function ProcessFlow() {
  return (
    <ol className="process-flow" aria-label="Flujo general de trabajo">
      {processCategories.map((category, index) => (
        <li key={category.name}>
          <span>{category.number}</span>
          <strong>{category.name}</strong>
          <p>{category.description}</p>
          {index < processCategories.length - 1 ? (
            <i aria-hidden="true">→</i>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
