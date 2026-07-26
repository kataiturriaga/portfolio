import { featuredProcesses } from "./processes";

export const stats = [
  { value: "4+", label: "Años diseñando" },
  { value: "12", label: "Proyectos entregados" },
  { value: "18", label: "Marcas acompañadas" },
  { value: "8M+", label: "Personas alcanzadas" },
];

export const quickLinks = [
  {
    kicker: "Por los números",
    page: "p. 08",
    title: "Mira las métricas",
    copy: "Sectores en los que he trabajado, desglosados por especialidad.",
    href: "#industrias",
  },
  {
    kicker: "Se dice por ahí",
    page: "p. 14",
    title: "Lee las referencias",
    copy: "Lo que cuentan los equipos después de construir juntos.",
    href: "#testimonios",
  },
  {
    kicker: "La contraportada",
    page: "p. 22",
    title: "Juega al Mad Libs",
    copy: "Imprime el próximo gran titular en menos de treinta segundos.",
    href: "#mad-libs",
  },
];

export type Project = {
  number: string;
  client: string;
  title: string;
  year: string;
  domain: string;
  role: string;
  tone: string;
  image?: string;
  href?: string;
};

export const projects: Project[] = [
  {
    number: "01",
    client: "El Método",
    title: "Añadiendo capas: la app coached de la v1 a la v2",
    year: "LANZADO · 2026",
    domain: "Salud y fitness",
    role: "Product Designer + PM",
    tone: "cobalt",
    image: "/casos/asesorias-v2-app/hero-v2-app-final.jpg",
    href: "/casos/asesorias-v2-app",
  },
  {
    number: "02",
    client: "Archivo Sur",
    title: "Una nueva forma de leer lo que importa",
    year: "LANZADO · 2025",
    domain: "Media-tech",
    role: "Diseño principal",
    tone: "coral",
  },
  {
    number: "03",
    client: "Nexo",
    title: "Crédito pensado para la vida real",
    year: "CONCEPTO · 2025",
    domain: "FinTech",
    role: "Investigación + UX",
    tone: "lime",
  },
  {
    number: "04",
    client: "Cancha",
    title: "El deporte local cruza fronteras",
    year: "LANZADO · 2024",
    domain: "Streaming",
    role: "Diseño de experiencia",
    tone: "violet",
  },
  {
    number: "05",
    client: "Común",
    title: "Participar también puede ser sencillo",
    year: "LANZADO · 2024",
    domain: "Civic tech",
    role: "Diseño 0 → 1",
    tone: "amber",
  },
  {
    number: "06",
    client: "Taller 33",
    title: "Un sistema para crear sin empezar de cero",
    year: "SISTEMA · 2023",
    domain: "Design systems",
    role: "Estrategia + UI",
    tone: "ink",
  },
];

export const industries = [
  { number: "01", title: "B2B SaaS", clients: "Órbita · Norte" },
  { number: "02", title: "FinTech", clients: "Nexo · Clara" },
  { number: "03", title: "Media y streaming", clients: "Archivo Sur · Cancha" },
  { number: "04", title: "Civic tech", clients: "Común · Agora" },
  { number: "05", title: "IA aplicada", clients: "Órbita · Estudio Uno" },
  { number: "06", title: "Estrategia de diseño", clients: "Taller 33 · Prisma" },
];

export const timeline = [
  {
    period: "2025 — Hoy",
    company: "Estudio Independiente",
    role: "Product Designer · Estrategia y ejecución",
    status: "Actual",
    bullets: [
      "Productos digitales desde la primera pregunta hasta producción",
      "Sistemas de diseño que conectan marca, producto y código",
      "Colaboración directa con fundadores y equipos de ingeniería",
    ],
    tags: ["Producto", "Estrategia"],
  },
  {
    period: "2023 — 2025",
    company: "Norte Digital",
    role: "Senior Product Designer",
    status: "Completado",
    bullets: [
      "Liderazgo de experiencias B2B para equipos internacionales",
      "Investigación continua y prototipos de alta fidelidad",
      "Mentoría y evolución del sistema de diseño",
    ],
    tags: ["B2B SaaS", "Design systems"],
  },
  {
    period: "2021 — 2023",
    company: "Taller Producto",
    role: "Product Designer",
    status: "Completado",
    bullets: [
      "Proyectos para finanzas, medios y servicios públicos",
      "Trabajo de punta a punta junto a equipos multidisciplinares",
      "Entrega de productos para web, iOS y Android",
    ],
    tags: ["UX research", "Mobile"],
  },
  {
    period: "2017 — 2021",
    company: "Grado en Diseño Digital",
    role: "Universidad Pública de Diseño",
    status: "Formación",
    bullets: [
      "Fundamentos visuales, interacción y pensamiento sistémico",
      "Proyecto final sobre acceso inclusivo a servicios digitales",
    ],
    tags: ["Diseño", "Tecnología"],
  },
];

export const articles = featuredProcesses.map((process) => ({
  number: process.number,
  title: process.title,
  category: process.category,
  copy: process.purpose,
  date: process.status,
  href: `/procesos/${process.slug}`,
}));

export const copy = {
  header: {
    volume: "VOL. I · N.º 01 · EDICIÓN GENERAL",
    navWork: "Trabajo",
    navJourney: "Trayectoria",
    navContact: "Contacto",
    masthead: "El Diario de Kata",
    availability: "Disponible para proyectos",
    edition: "Edición general",
    requestPortfolio: "Solicitar portfolio ↓",
  },
  hero: {
    title: "Product Designer",
    titleConnector: "que convierte",
    rotatingWords: ["ideas complejas", "productos útiles", "experiencias claras"],
    stampLabel: "Diseñado en",
    stampYear: "2026",
    stampLocation: "Barcelona · ESP",
    deck: "Diseño productos digitales desde la primera pregunta hasta el último detalle, conectando investigación, estrategia, interfaz y código.",
    cta: "Ver historias destacadas",
  },
  quickIndex: {
    title: "Salta a lo importante.",
    action: "Saltar ↓",
    darkKicker: "✶ El laboratorio",
    darkPage: "p. 33",
    darkTitle: "Descubre mis procesos",
    darkCopy:
      "Las herramientas, decisiones y rituales que utilizo para llevar cada proyecto de la idea a la entrega.",
    darkAction: "Entrar ↗",
  },
  work: {
    eyebrow: "Trabajo destacado",
    title: "Historias elegidas a mano",
    intro: "Una selección de productos lanzados y conceptos de los últimos años.",
    projectAction: "Ver el proyecto ↗",
    catalogueKicker: "✶ Seis historias arriba. Más dentro.",
    catalogueTitle: "Lee el catálogo completo",
    catalogueAction: "Explorar el archivo ↗",
    nextIssue: "✶ En el próximo número",
    nextItems: [
      "Un sistema de conocimiento para productos con IA",
      "Cómo se construyó este mismo portfolio",
      "Dos proyectos confidenciales, pendientes de publicación",
    ],
  },
  industries: {
    eyebrow: "Sectores en los que he trabajado",
    title: "Entre industrias",
  },
  timeline: {
    eyebrow: "El recorrido",
    title: "Trabajo y formación",
    all: "Todo",
    current: "Actual",
  },
  about: {
    portrait: "Tu retrato",
    portraitCaption: "✶ Hola, esa persona soy yo",
    eyebrow: "La firma",
    title: "Sobre quien diseña",
    signature: "Nombre Apellido",
    signatureRole: "✶ Diseño y dirección",
    lead: "Diseñador que construye, estratega que pregunta y colaborador que entrega.",
    firstParagraph:
      "Trabajo en los espacios que quedan entre lo que las personas dicen y lo que realmente necesitan; entre lo que un producto puede hacer y lo que debería hacer. Mi práctica combina profundidad en UX, interfaz, investigación y código con pensamiento de negocio.",
    secondParagraph:
      "Me gusta llevar las ideas del boceto a una experiencia real, saber qué detalle importa en cada momento y hacer que equipos distintos avancen en la misma dirección.",
    action: "Leer la historia completa ↗",
  },
  testimonial: {
    eyebrow: "Cartas a la redacción",
    title: "Lo que cuentan",
    number: "01 / 03",
    quote:
      "No se limitó a resolver la pantalla. Ordenó el problema, hizo las preguntas que faltaban y consiguió que producto e ingeniería tomaran decisiones juntos.",
    person: "Marina López",
    role: "Head of Product · Empresa ejemplo",
  },
  articles: {
    eyebrow: "Detrás de cada proyecto",
    title: "Procesos",
  },
  madlibs: {
    eyebrow: "La contraportada · Mad Libs de la redacción",
    title: "Ayúdame a escribir el próximo titular",
    intro:
      "La redacción tiene poco personal. Rellena los huecos y publicaremos lo que escribas. Sin verificar datos. Sin revisión editorial.",
    story: "Historia n.º 01 de 03",
    formTitle: "Rellena los huecos",
    labels: [
      "Un adjetivo",
      "Un sustantivo plural",
      "Un verbo en pasado",
      "Un número",
      "Otro adjetivo",
      "Una empresa imaginaria",
    ],
    print: "↓ Imprimir el titular",
    clear: "↻ Limpiar",
    newspaper: "El Diario de Kata",
    draft: "Borrador · Esperando contenido",
    waiting: "Esperando noticias...",
    empty:
      "Rellena los seis huecos de la izquierda y pondremos la tinta, encenderemos la rotativa y publicaremos tu historia.",
  },
  footer: {
    eyebrow: "Cartas a la redacción · Contacto",
    title: "Hablemos.",
    intro:
      "Proyectos, equipos, colaboraciones o un café por videollamada. Escríbeme.",
    reads: "Leo todos los mensajes.",
    emailLabel: "✉ Correo",
    email: "hola@tudominio.com",
    emailHint: "Haz clic para copiar →",
    copied: "Copiado ✓",
    scheduleLabel: "◷ Agenda",
    schedule: "Reserva 30 minutos",
    scheduleHint: "Abrir calendario ↗",
    locationLabel: "Actualmente en",
    location: "Barcelona · Disponible en remoto · CET",
    availability: "■ Abierto a nuevos proyectos",
    socialLabel: "También en",
    signoff: "✶ Gracias por leer.",
    signature: "La Redacción",
  },
} as const;

export const homeContent = {
  copy,
  stats,
  quickLinks,
  projects,
  industries,
  timeline,
  articles,
} as const;
