export type ProcessStatus = "Borrador" | "Probado" | "Estable";
export type ProcessCategory =
  | "Discovery / Research"
  | "Diseño / Prototipado"
  | "Build / QA"
  | "Release / Ops";

export type Process = {
  number: string;
  slug: string;
  title: string;
  category: ProcessCategory;
  status: ProcessStatus;
  purpose: string;
  when: string;
  whenNot?: string;
  input: string;
  output: string;
  steps: string[];
  checklist?: string[];
  tools: string[];
  schema: string;
  featured?: boolean;
};

export const processCategories: {
  name: ProcessCategory;
  shortName: string;
  number: string;
  description: string;
}[] = [
  {
    name: "Discovery / Research",
    shortName: "Discovery",
    number: "01",
    description:
      "Entender el problema, el mercado, la competencia y las personas antes de diseñar.",
  },
  {
    name: "Diseño / Prototipado",
    shortName: "Diseño",
    number: "02",
    description:
      "Convertir hallazgos en estructura, direcciones visuales y prototipos comparables.",
  },
  {
    name: "Build / QA",
    shortName: "Build",
    number: "03",
    description:
      "Construir con un plan, datos reales, estados completos y una revisión exigente.",
  },
  {
    name: "Release / Ops",
    shortName: "Release",
    number: "04",
    description:
      "Revisar, publicar, documentar y operar sin perder contexto por el camino.",
  },
];

export const processes: Process[] = [
  {
    number: "1.1",
    slug: "research-profundo-fuentes-externas",
    title: "Research profundo con fuentes externas",
    category: "Discovery / Research",
    status: "Borrador",
    purpose:
      "Entender un dominio, mercado o tecnología desde cero utilizando investigación profunda.",
    when:
      "Cuando la pregunta todavía es amplia y necesitas construir contexto antes de decidir.",
    input: "Pregunta de research, fuentes iniciales y criterio de decisión.",
    output: "Resumen, hallazgos, dudas abiertas y siguiente acción.",
    steps: [
      "Formular una pregunta de research concreta.",
      "Investigar con Gemini, NotebookLM o Perplexity.",
      "Sintetizar los hallazgos relevantes.",
      "Identificar las dudas que siguen abiertas.",
      "Definir la siguiente acción.",
    ],
    tools: ["Gemini", "NotebookLM", "Perplexity"],
    schema: "Pregunta → Deep research → Síntesis → Dudas → Siguiente acción",
  },
  {
    number: "1.2",
    slug: "research-multiagente-cursor",
    title: "Research multiagente en Cursor",
    category: "Discovery / Research",
    status: "Probado",
    purpose:
      "Comparar varias webs o productos en paralelo sin convertir el análisis en una tarea secuencial.",
    when:
      "Cuando tienes entre tres y cinco referencias y quieres una lectura comparada rápida.",
    input: "URLs de referencia y preguntas concretas para cada producto.",
    output: "Listado comparado de funcionalidades y patrones.",
    steps: [
      "Abrir el panel de agentes en Cursor.",
      "Asignar una referencia distinta a cada agente.",
      "Pedir el mismo inventario de funcionalidades a todos.",
      "Consolidar coincidencias, diferencias y oportunidades.",
    ],
    tools: ["Cursor", "Agentes paralelos"],
    schema: "Referencias → Agentes en paralelo → Inventarios → Consolidado",
  },
  {
    number: "1.3",
    slug: "arquitectura-informacion-producto",
    title: "Arquitectura de información de producto",
    category: "Discovery / Research",
    status: "Probado",
    purpose:
      "Entender cómo se organiza la navegación y el contenido de un producto de referencia.",
    when:
      "Cuando necesitas mapear niveles, secciones y patrones esperados antes de plantear una estructura.",
    input: "URL o capturas del producto.",
    output: "Mapa de IA con niveles L1, L2 y L3 y comparación de patrones.",
    steps: [
      "Extraer la arquitectura de información del producto.",
      "Repetir el ejercicio con varias referencias.",
      "Comparar jerarquías, recurrencias y excepciones.",
    ],
    tools: ["Claude", "Cursor"],
    schema: "Producto → Mapa L1/L2/L3 → Comparación",
  },
  {
    number: "1.4",
    slug: "audio-modulos-referencias-mobbin",
    title: "Audio → módulos → referencias Mobbin",
    category: "Discovery / Research",
    status: "Probado",
    purpose:
      "Convertir una conversación o reunión en módulos funcionales y referencias visuales.",
    when:
      "Cuando el material de partida son audios o notas y necesitas algo accionable para diseñar.",
    input: "Audio o notas de reunión y producto objetivo.",
    output: "Módulos, funcionalidades, referencias por módulo y documento para reunión.",
    steps: [
      "Extraer módulos y funcionalidades del audio con Claude.",
      "Buscar referencias Mobbin para cada módulo.",
      "Ordenar el resultado en FigJam para discutirlo con el equipo.",
    ],
    tools: ["Claude", "Mobbin", "FigJam"],
    schema: "Audio → Módulos → Referencias → Documento FigJam",
  },
  {
    number: "1.5",
    slug: "competencia-arquitectura-ia-ux",
    title: "Competencia por arquitectura IA/UX",
    category: "Discovery / Research",
    status: "Estable",
    purpose:
      "Analizar competidores por navegación, prioridades de negocio y apuestas estratégicas.",
    when:
      "Cuando necesitas diferenciar patrones estándar de industria y oportunidades propias.",
    input: "Estructuras de navegación de tres competidores.",
    output: "Patrones comunes, apuestas únicas y huecos detectados.",
    steps: [
      "Recopilar la navegación L1, L2 y L3 de tres competidores.",
      "Analizar qué prioriza cada uno y qué modelo de negocio revela.",
      "Separar patrones repetidos, apuestas únicas y huecos.",
    ],
    checklist: [
      "La comparación usa la misma profundidad para todos.",
      "Los patrones comunes no se presentan como innovación.",
      "Cada inferencia estratégica está respaldada por una evidencia visible.",
    ],
    tools: ["Claude", "Cursor"],
    schema: "3 arquitecturas → Patrones + apuestas → Huecos",
  },
  {
    number: "1.6",
    slug: "research-competencia-resenas-ost",
    title: "Research de competencia con reseñas (OST)",
    category: "Discovery / Research",
    status: "Estable",
    featured: true,
    purpose:
      "Detectar oportunidades desde reseñas reales y construir un Opportunity Solution Tree accionable.",
    when:
      "Cuando necesitas entender por qué la gente se queda o se va, pero no dispones de entrevistas propias.",
    whenNot:
      "Cuando sólo necesitas una exploración rápida o no puedes separar las reseñas originales del análisis.",
    input: "Outcome único, competidores, mercado y fuentes de reseñas.",
    output:
      "Dataset raw, temas de retención, oportunidades priorizadas, OST y experimentos.",
    steps: [
      "Definir un único outcome medible.",
      "Elegir las reseñas como fuente y documentar su sesgo.",
      "Seleccionar competidores reales del mercado.",
      "Localizar los IDs correctos en las stores.",
      "Recopilar reseñas y conservar el dataset raw.",
      "Analizar los temas con la lente del outcome.",
      "Construir oportunidades, soluciones y experimentos.",
      "Separar claramente evidencia e interpretación.",
    ],
    checklist: [
      "Existe un solo outcome.",
      "Pull y churn no están mezclados.",
      "Cada fuente y sesgo está citado.",
      "Raw e interpretación son artefactos distintos.",
      "Las oportunidades tienen un criterio de prioridad.",
    ],
    tools: [
      "Similarweb",
      "AppBrain",
      "App Store RSS",
      "Google Play",
      "Cursor",
    ],
    schema:
      "Outcome + competidores → Reseñas raw → Temas → Oportunidades → OST → Experimentos",
  },
  {
    number: "1.7",
    slug: "research-usuario-cro",
    title: "Research de usuario con /research-usuario-cro",
    category: "Discovery / Research",
    status: "Probado",
    purpose:
      "Investigar reseñas en varias plataformas con un flujo guiado, rápido y sin coste.",
    when:
      "Cuando quieres una exploración multi-plataforma antes de invertir en un análisis de gran volumen.",
    whenNot:
      "Cuando necesitas un OST completo o miles de reseñas de stores.",
    input: "Productos, competidores, plataformas, mercado y pregunta de research.",
    output: "Temas, fricciones, elogios, comparativa e insights accionables.",
    steps: [
      "Invocar la skill de research.",
      "Definir objetivo, plataformas, competidores y mercado.",
      "Recopilar y analizar reseñas de cada fuente.",
      "Separar elogios, fricciones y solicitudes.",
      "Comparar competidores y extraer entre tres y cinco insights.",
    ],
    checklist: [
      "Hay al menos dos fuentes si aplica.",
      "Observación e interpretación están separadas.",
      "Se cita plataforma y tipo de usuario.",
    ],
    tools: ["Cursor", "Skill /research-usuario-cro"],
    schema: "Objetivo → Reviews multi-plataforma → Temas → Comparativa → Insights",
  },
  {
    number: "1.8",
    slug: "research-fricciones-friction-miner",
    title: "Research de fricciones con Friction Miner",
    category: "Discovery / Research",
    status: "Probado",
    purpose:
      "Extraer y priorizar fricciones desde un gran volumen de reseñas de aplicaciones.",
    when:
      "Cuando una exploración gratuita se queda corta y necesitas profundidad en App Store o Google Play.",
    whenNot:
      "Cuando basta una exploración ligera o necesitas cruzar muchas plataformas no-app.",
    input: "Aplicaciones, mercado, stores y pregunta de research.",
    output: "Clusters, verbatims, comparativa y oportunidades priorizadas.",
    steps: [
      "Definir objetivo, aplicaciones y mercado.",
      "Acotar la fricción que se quiere comprender.",
      "Procesar las reseñas con Friction Miner.",
      "Revisar clusters y conservar verbatims.",
      "Comparar aplicaciones y separar raw de análisis.",
      "Priorizar fricciones por frecuencia e impacto.",
    ],
    checklist: [
      "El mercado está indicado.",
      "Los verbatims se guardan antes de sintetizar.",
      "La frecuencia no se confunde con importancia estratégica.",
    ],
    tools: ["Friction Miner", "Repeat Tools"],
    schema: "Apps + mercado → Reseñas → Clusters → Prioridad → Oportunidades",
  },
  {
    number: "2.1",
    slug: "web-design-system-documentado",
    title: "Web → design system documentado",
    category: "Diseño / Prototipado",
    status: "Probado",
    purpose:
      "Extraer reglas visuales de una referencia y convertirlas en una guía reutilizable.",
    when:
      "Cuando una web existente expresa bien la dirección visual que quieres estudiar.",
    input: "URL de referencia.",
    output: "Documento design.md o guía visual base.",
    steps: [
      "Analizar la referencia con Claude.",
      "Documentar tipografía, color, espaciado, componentes y comportamiento.",
    ],
    tools: ["Claude"],
    schema: "Referencia web → Análisis visual → design.md",
  },
  {
    number: "2.2",
    slug: "cursor-design-system-figma",
    title: "Claude Code/Cursor → DS en Figma",
    category: "Diseño / Prototipado",
    status: "Probado",
    purpose:
      "Crear un sistema visual Figma-first con tokens y componentes para una app móvil.",
    when:
      "Cuando el entregable vive en Figma y necesitas una base coherente antes de diseñar pantallas.",
    input: "Referencia visual, tecnología, tipo de app y punto de partida.",
    output: "Tokens y componentes visuales en Figma.",
    steps: [
      "Abrir el proyecto y la referencia en Cursor.",
      "Definir que el destino es Figma y el contexto es mobile.",
      "Generar y revisar tokens y componentes visuales.",
    ],
    tools: ["Claude Code", "Cursor", "Figma"],
    schema: "Referencia → Contexto → Tokens + componentes Figma",
  },
  {
    number: "2.3",
    slug: "build-ui-analisis-referencias",
    title: "Build UI desde análisis de referencias",
    category: "Diseño / Prototipado",
    status: "Probado",
    purpose:
      "Construir una UI base a partir de un análisis explícito de productos existentes.",
    when:
      "Cuando quieres apoyarte en una referencia principal sin copiarla de forma literal.",
    input: "Cinco referencias y funcionalidades deseadas.",
    output: "UI base y backlog de funcionalidades relevantes.",
    steps: [
      "Inventariar componentes y funcionalidades de la referencia principal.",
      "Repetir el análisis con cuatro referencias secundarias.",
      "Construir la base con la lógica de la referencia principal.",
      "Mover oportunidades secundarias al backlog.",
    ],
    tools: ["Claude", "Cursor"],
    schema: "5 referencias → Inventario → UI base + backlog",
  },
  {
    number: "2.4",
    slug: "prototipado-efectivo-html",
    title: "Prototipado efectivo en HTML",
    category: "Diseño / Prototipado",
    status: "Estable",
    featured: true,
    purpose:
      "Explorar direcciones visuales con bajo coste antes de comprometer Figma o código final.",
    when:
      "Cuando las especificaciones están claras, pero todavía no sabes qué dirección visual funciona.",
    whenNot:
      "Cuando todavía no existe una especificación ni un criterio con el que comparar alternativas.",
    input: "Spec de pantalla, referencias, restricciones y criterios de éxito.",
    output: "Diez variaciones, shortlist, decisión y notas de descarte.",
    steps: [
      "Redactar una especificación precisa.",
      "Crear diez variaciones en HTML.",
      "Compararlas contra objetivo y referencias.",
      "Elegir dos o tres candidatas.",
      "Documentar qué se descarta y por qué.",
      "Llevar la ganadora a Figma si aporta valor.",
      "Usar anotaciones visuales para ajustes puntuales.",
    ],
    checklist: [
      "La spec existe antes de producir variantes.",
      "Se compara contra el objetivo, no sólo contra el gusto.",
      "Se prueban estados básicos.",
      "Los descartes quedan documentados.",
    ],
    tools: ["Superpower", "Cursor", "HTML", "Figma"],
    schema: "Spec → 10 HTML → Shortlist → Decisión → Figma / build",
  },
  {
    number: "2.5",
    slug: "auditar-libreria-componentes",
    title: "Auditar librería de componentes",
    category: "Diseño / Prototipado",
    status: "Estable",
    purpose:
      "Ordenar una librería Figma empezando por diagnóstico y plan, sin modificarla prematuramente.",
    when:
      "Cuando una librería está desordenada y necesitas comprender el riesgo antes de migrar.",
    input: "Librería Figma y sistema de diseño existente.",
    output: "Inventario, problemas P0–P3, propuesta de tokens y plan de migración.",
    steps: [
      "Inventariar componentes, variables, estilos, duplicados y naming.",
      "Diagnosticar problemas con ejemplos y prioridad.",
      "Proponer arquitectura, consolidaciones y migración por fases.",
      "Esperar aprobación antes de ejecutar cambios.",
    ],
    checklist: [
      "La primera fase es sólo lectura.",
      "Cada problema incluye evidencia.",
      "La migración reduce riesgo de forma incremental.",
    ],
    tools: ["Figma", "Figma MCP"],
    schema: "Inventario → Diagnóstico P0–P3 → Propuesta → Aprobación",
  },
  {
    number: "2.6",
    slug: "motion-tuning-dialkit",
    title: "Motion tuning con DialKit",
    category: "Diseño / Prototipado",
    status: "Probado",
    purpose:
      "Ajustar springs, easing y opacidad visualmente antes de fijar valores en código.",
    when:
      "Cuando una animación funciona, pero necesita tuning fino en contexto.",
    input: "Componente Motion y entorno local.",
    output: "Valores finales exportados y componente limpio para producción.",
    steps: [
      "Crear una primera animación aproximada.",
      "Conectar los parámetros relevantes a DialKit.",
      "Ajustar visualmente en localhost.",
      "Exportar los valores elegidos.",
      "Hardcodear y retirar el panel antes de publicar.",
    ],
    tools: ["Motion", "DialKit", "Claude Code"],
    schema: "Animación → Panel de tuning → JSON → Valores finales → Limpieza",
  },
  {
    number: "2.7",
    slug: "eval-loop-diseno-critica-ciega",
    title: "Eval loop de diseño: crítica ciega",
    category: "Diseño / Prototipado",
    status: "Borrador",
    purpose:
      "Evitar el sesgo de autoevaluación usando un crítico con contexto independiente.",
    when:
      "Cuando una pantalla está construida y necesitas evaluar fidelidad, coherencia y craft con rigor.",
    whenNot:
      "Durante exploraciones tempranas sin especificación ni referencia clara.",
    input: "Fuente, build y rúbrica fija.",
    output: "Scorecard, fallos con fix, backlog y reglas derivadas.",
    steps: [
      "Construir la pantalla.",
      "Abrir un contexto nuevo para el crítico.",
      "Compartir fuente, build y rúbrica.",
      "Obtener scores y correcciones exactas.",
      "Aplicar fixes hasta superar el umbral.",
      "Promover fallos recurrentes a reglas permanentes.",
    ],
    checklist: [
      "El crítico no vio la construcción.",
      "La rúbrica no cambia entre iteraciones.",
      "Un 8 requiere evidencia verificada.",
      "Las mejoras intencionales se distinguen de los errores.",
    ],
    tools: ["Claude", "Figma", "Screenshots"],
    schema: "Build → Crítica ciega → Score → Fixes → Regla permanente",
  },
  {
    number: "3.1",
    slug: "superpower-planificar-antes-codigo",
    title: "Superpower para planificar antes de código",
    category: "Build / QA",
    status: "Estable",
    purpose:
      "Forzar preguntas, alternativas y un plan antes de empezar una implementación compleja.",
    when:
      "Cuando la tarea es ambigua, grande o contiene decisiones encadenadas.",
    input: "Intención de producto o cambio de código.",
    output: "Preguntas relevantes, alternativas y plan ejecutable.",
    steps: [
      "Exponer la intención y el contexto.",
      "Responder preguntas que cambian la solución.",
      "Comparar alternativas y riesgos.",
      "Aprobar un plan antes de editar.",
    ],
    checklist: [
      "Las preguntas cambian decisiones materiales.",
      "El plan nombra archivos, riesgos y verificación.",
      "No se implementa antes de aprobar.",
    ],
    tools: ["Superpower", "Cursor"],
    schema: "Petición → Preguntas → Alternativas → Plan → Ejecución",
  },
  {
    number: "3.2",
    slug: "modelo-escribe-otro-critica",
    title: "Un modelo escribe, otro critica",
    category: "Build / QA",
    status: "Estable",
    purpose:
      "Endurecer un plan de implementación antes de asumir su coste y sus riesgos.",
    when:
      "Cuando el plan afecta varias áreas o un error sería costoso.",
    input: "Plan de código completo.",
    output: "Tres riesgos principales y plan reescrito.",
    steps: [
      "Crear el plan con un primer modelo.",
      "Pedir a otro contexto los tres riesgos más importantes.",
      "Evaluar cada crítica en lugar de aceptarla automáticamente.",
      "Reescribir el plan incorporando sólo los riesgos válidos.",
    ],
    checklist: [
      "El crítico recibe el plan completo.",
      "Cada riesgo explica impacto y causa.",
      "La reescritura conserva el objetivo original.",
    ],
    tools: ["Claude", "ChatGPT", "Cursor"],
    schema: "Plan A → Crítica independiente → Riesgos → Plan endurecido",
  },
  {
    number: "3.3",
    slug: "implementar-funcionalidad-edge-cases",
    title: "Implementar funcionalidad con edge cases",
    category: "Build / QA",
    status: "Estable",
    featured: true,
    purpose:
      "Pasar de spec a código real sin quedarse únicamente en el camino feliz.",
    when:
      "Cuando una funcionalidad tiene datos, estados o comportamientos que pueden romper la interfaz.",
    input: "Spec, datos reales, estados de pantalla y flujo esperado.",
    output:
      "Implementación, matriz de estados, edge cases y artefacto para review.",
    steps: [
      "Planificar antes de editar código.",
      "Examinar datos reales y rangos inesperados.",
      "Preguntar qué ocurre si el usuario desobedece el flujo.",
      "Recorrer vacío, carga, error, uno, muchos y extremos.",
      "Implementar la funcionalidad.",
      "Crear el artefacto de datos y estados.",
      "Ejecutar review antes de abrir la PR.",
    ],
    checklist: [
      "Los campos raros se descubrieron antes de cerrar la UI.",
      "Vacío, carga y error están cubiertos.",
      "Abandono, retorno y repetición tienen comportamiento.",
      "La matriz de estados está documentada.",
      "La revisión final se ejecutó.",
    ],
    tools: ["Superpower", "Cursor", "Datos reales", "Code review"],
    schema: "Spec → Datos → Usuario desobediente → Estados → Build → Review",
  },
  {
    number: "5.1",
    slug: "review-obligatoria-antes-pr",
    title: "Review obligatoria antes de PR",
    category: "Release / Ops",
    status: "Estable",
    purpose:
      "Detectar bugs, riesgos y supuestos no probados antes de entregar un cambio.",
    when: "Antes de abrir o compartir cualquier pull request relevante.",
    input: "Diff, intención del cambio y riesgos conocidos.",
    output: "Hallazgos, correcciones aplicadas y límites documentados.",
    steps: [
      "Ejecutar una revisión del diff.",
      "Revisar edge cases.",
      "Probar flujo feliz y flujo de fallo.",
      "Documentar explícitamente lo que no se pudo probar.",
    ],
    checklist: [
      "La revisión automática o manual se ejecutó.",
      "Los edge cases se consideraron.",
      "Se probó al menos un fallo.",
      "Lo no probado está escrito.",
    ],
    tools: ["Code review", "Git", "CI"],
    schema: "Diff → Review → Pruebas → Correcciones → PR",
  },
  {
    number: "5.2",
    slug: "subir-testflight",
    title: "Subir a TestFlight",
    category: "Release / Ops",
    status: "Estable",
    purpose:
      "Publicar una beta iOS reproducible mediante una automatización de Fastlane.",
    when: "Cuando una build de desarrollo está lista para validación en TestFlight.",
    input: "Repositorio iOS configurado y build lista.",
    output: "Build disponible en TestFlight.",
    steps: [
      "Verificar entorno, versión y credenciales.",
      "Ejecutar la lane beta con el entorno de desarrollo.",
      "Confirmar que la build aparece y procesa correctamente.",
    ],
    checklist: [
      "La versión y build number son correctos.",
      "No se incluyen secretos en logs.",
      "La build se verifica en App Store Connect.",
    ],
    tools: ["Fastlane", "TestFlight", "App Store Connect"],
    schema: "Build lista → Fastlane beta → Procesado → TestFlight",
  },
  {
    number: "5.3",
    slug: "worktrees-conductor",
    title: "Worktrees reales con Conductor",
    category: "Release / Ops",
    status: "Probado",
    purpose:
      "Trabajar en tareas paralelas con carpetas y ramas realmente aisladas.",
    when:
      "Cuando dos cambios independientes deben avanzar en paralelo sin compartir working tree.",
    input: "Repositorio Git y tareas independientes.",
    output: "Workspaces aislados con carpeta, branch y agente propios.",
    steps: [
      "Separar las tareas que no dependen entre sí.",
      "Crear un workspace de Conductor para cada una.",
      "Trabajar y validar en cada worktree.",
      "Integrar los cambios de forma controlada.",
    ],
    tools: ["Conductor", "Git worktree", "Claude Code"],
    schema: "Tareas → Worktrees aislados → Validación → Integración",
  },
  {
    number: "5.4",
    slug: "artefacto-datos-matriz-estado",
    title: "Artefacto de datos y matriz de estado",
    category: "Release / Ops",
    status: "Estable",
    purpose:
      "Comunicar qué datos y estados se consideraron al implementar una funcionalidad.",
    when:
      "Al cerrar una feature compleja y antes de pedir revisión o abrir la PR.",
    input: "Inventario de datos, estados y decisiones de implementación.",
    output: "Artefacto breve para el reviewer y el equipo.",
    steps: [
      "Listar campos, rangos y anomalías de los datos reales.",
      "Documentar todos los estados relevantes de cada pantalla.",
      "Conectar decisiones de UI con datos y edge cases.",
      "Adjuntar el artefacto a la revisión.",
    ],
    checklist: [
      "Los datos reales y supuestos están diferenciados.",
      "Los estados extremos aparecen.",
      "El reviewer puede reproducir el razonamiento.",
    ],
    tools: ["Markdown", "Cursor", "PR"],
    schema: "Datos + estados → Decisiones → Artefacto → Review",
  },
];

export const featuredProcesses = processes.filter((process) => process.featured);

export function getProcess(slug: string) {
  return processes.find((process) => process.slug === slug);
}

export function getRelatedProcesses(process: Process) {
  return processes
    .filter(
      (candidate) =>
        candidate.category === process.category &&
        candidate.slug !== process.slug,
    )
    .slice(0, 3);
}

export function getProcessNeighbors(slug: string) {
  const index = processes.findIndex((process) => process.slug === slug);
  return {
    previous: index > 0 ? processes[index - 1] : undefined,
    next: index >= 0 && index < processes.length - 1 ? processes[index + 1] : undefined,
  };
}
