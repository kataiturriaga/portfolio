import type { CaseBlock, CaseStudy } from "@/data/casos";

export type CaseSection = {
  id: string;
  label: string;
  sub: string;
  /** Dato corto a la derecha del índice ("85%", "1→3") */
  metric?: string;
  /** Las secciones ocultas no aparecen en el índice (p. ej. "Siguiente ciudad") */
  hidden?: boolean;
  blocks: CaseBlock[];
};

/**
 * Agrupa los bloques del caso en las "ciudades" del índice. Algunos bloques
 * abren sección (tesis, impacto, cada decisión…) y otros se suman a la que
 * está abierta (los hechos se quedan con la tesis, la segunda prosa con la
 * primera).
 */
export function buildSections(caso: CaseStudy): CaseSection[] {
  const sections: CaseSection[] = [];
  const open = (section: Omit<CaseSection, "blocks">, block: CaseBlock) =>
    sections.push({ ...section, blocks: [block] });
  const append = (block: CaseBlock) => {
    const last = sections[sections.length - 1];
    if (last) last.blocks.push(block);
    else open({ id: "inicio", label: "Inicio", sub: "" }, block);
  };

  for (const block of caso.blocks) {
    switch (block.type) {
      case "alert":
        open({ id: "tesis", label: "Tesis", sub: block.title ?? "La idea del caso" }, block);
        break;
      case "fact":
        append(block);
        break;
      case "metrics":
        open(
          {
            id: "impacto",
            label: block.title ?? "Impacto",
            sub: `${block.items.length} métricas`,
            metric: caso.heroMetric
              ? `${caso.heroMetric.value}${caso.heroMetric.unit ?? ""}`
              : undefined,
          },
          block,
        );
        break;
      case "prose": {
        const last = sections[sections.length - 1];
        if (last?.id === "contexto") last.blocks.push(block);
        else open({ id: "contexto", label: "Contexto", sub: "Problema y equipo" }, block);
        break;
      }
      case "decision":
        open(
          {
            id: `decision-${block.number}`,
            label: `${block.number} ${block.shortLabel}`,
            sub: block.area.split(" / ")[0],
            metric: block.depth,
          },
          block,
        );
        break;
      case "list":
        open({ id: "el-resto", label: block.title, sub: `${block.items.length} mejoras más` }, block);
        break;
      case "notes":
        open({ id: "reflexion", label: block.title, sub: `${block.items.length} aprendizajes` }, block);
        break;
      case "next":
        open({ id: "siguiente", label: "Siguiente", sub: "", hidden: true }, block);
        break;
    }
  }

  return sections;
}
