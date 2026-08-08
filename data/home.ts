import { featuredProcesses } from "./processes";

export const stats = [
  { value: "4+", label: "Años diseñando" },
  { value: "12", label: "Proyectos entregados" },
  { value: "18", label: "Marcas acompañadas" },
  { value: "8M+", label: "Personas alcanzadas" },
];

export type Project = {
  number: string;
  client: string;
  title: string;
  /** Versión breve para la fila de previsión */
  shortTitle: string;
  year: string;
  status: string;
  /** Franja de "temperatura" (0-1) dentro del rango de la condición actual */
  tempBand: [number, number];
  domain: string;
  role: string;
  tone: string;
  image?: string;
  video?: string;
  href?: string;
};

export const projects: Project[] = [
  {
    number: "01",
    client: "El Método",
    title: "Añadiendo capas: la app coached de la v1 a la v2",
    shortTitle: "Añadiendo capas",
    year: "2026",
    status: "Lanzado",
    tempBand: [0.55, 0.92],
    domain: "Salud y fitness",
    role: "Product Designer + PM",
    tone: "cobalt",
    image: "/casos/asesorias-v2-app/hero-v2-app-final.jpg",
    video: "/casos/asesorias-v2-app/978_1080x30_shots_so.mp4",
    href: "/casos/asesorias-v2-app",
  },
  {
    number: "02",
    client: "Archivo Sur",
    title: "Una nueva forma de leer lo que importa",
    shortTitle: "Leer lo que importa",
    year: "2025",
    status: "Lanzado",
    tempBand: [0.42, 0.78],
    domain: "Media-tech",
    role: "Diseño principal",
    tone: "coral",
  },
  {
    number: "03",
    client: "Nexo",
    title: "Crédito pensado para la vida real",
    shortTitle: "Crédito para la vida real",
    year: "2025",
    status: "Concepto",
    tempBand: [0.30, 0.58],
    domain: "FinTech",
    role: "Investigación + UX",
    tone: "lime",
  },
  {
    number: "04",
    client: "Cancha",
    title: "El deporte local cruza fronteras",
    shortTitle: "Deporte local sin fronteras",
    year: "2024",
    status: "Lanzado",
    tempBand: [0.48, 0.85],
    domain: "Streaming",
    role: "Diseño de experiencia",
    tone: "violet",
  },
  {
    number: "05",
    client: "Común",
    title: "Participar también puede ser sencillo",
    shortTitle: "Participar sin fricción",
    year: "2024",
    status: "Lanzado",
    tempBand: [0.22, 0.52],
    domain: "Civic tech",
    role: "Diseño 0 → 1",
    tone: "amber",
  },
  {
    number: "06",
    client: "Taller 33",
    title: "Un sistema para crear sin empezar de cero",
    shortTitle: "Crear sin empezar de cero",
    year: "2023",
    status: "Sistema",
    tempBand: [0.12, 0.40],
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
    tags: [
      "Producto",
      "Estrategia",
      "Design systems",
      "Prototipado",
      "Research",
      "Front-end",
      "Facilitación",
    ],
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
    tags: [
      "B2B SaaS",
      "Design systems",
      "Research",
      "Prototipado",
      "Mentoría",
      "Workshops",
      "Handoff",
    ],
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
    tags: [
      "UX research",
      "Mobile",
      "iOS",
      "Android",
      "Wireframing",
      "Testing",
      "Accesibilidad",
    ],
  },
  {
    period: "2017 — 2021",
    company: "Grado en Diseño Digital",
    role: "Universidad Pública de Diseño",
    status: "Formación",
    bullets: [
      "Fundamentos visuales, interacción y pensamiento sistémico",
      "Proyecto final sobre acceso inclusivo a servicios digitales",
      "Primeros encargos reales en paralelo a la carrera",
    ],
    tags: [
      "Fundamentos",
      "Interacción",
      "Tipografía",
      "Identidad",
      "Motion",
      "Sistemas",
      "Proyecto final",
    ],
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
    name: "Kata",
    big: "iturriaga",
    condition: "Portfolio",
    metrics: [
      { label: "Años", value: "3,8" },
      { label: "Ideas", value: "4,7K" },
    ],
  },
  intro:
    "Diseño productos digitales desde la primera pregunta hasta el último detalle, conectando investigación, estrategia, interfaz y código.",
  trajectory: { title: "Trayectoria" },
  work: {
    title: "Previsión a 6 proyectos",
    intro: "Una selección de productos lanzados y conceptos de los últimos años.",
    archive: "Explorar el archivo completo",
    next: "En el próximo parte",
    nextItems: [
      "Un sistema de conocimiento para productos con IA",
      "Cómo se construyó este mismo portfolio",
      "Dos proyectos confidenciales, pendientes de publicación",
    ],
  },
  smallCards: {
    sectors: "Sectores",
    reach: "Alcance",
    reachValue: "8M+",
    reachNote: "Personas alcanzadas por los productos en los que he trabajado.",
    brands: "Marcas",
    brandsValue: "18",
    brandsNote: "Marcas acompañadas en cuatro años de práctica.",
    availability: "Condiciones actuales",
    availabilityValue: "Disponible",
    availabilityNote: "Abierta a nuevos proyectos y colaboraciones.",
    location: "Ubicación",
    locationValue: "Barcelona",
    locationNote: "Disponible en remoto · CET",
    lab: "El laboratorio",
    labValue: "Procesos",
    labNote: "Las herramientas, decisiones y rituales que llevo de la idea a la entrega.",
  },
  about: {
    title: "Sobre quien diseña",
    lead: "Diseñador que construye, estratega que pregunta y colaborador que entrega.",
    firstParagraph:
      "Trabajo en los espacios que quedan entre lo que las personas dicen y lo que realmente necesitan; entre lo que un producto puede hacer y lo que debería hacer. Mi práctica combina profundidad en UX, interfaz, investigación y código con pensamiento de negocio.",
    secondParagraph:
      "Me gusta llevar las ideas del boceto a una experiencia real, saber qué detalle importa en cada momento y hacer que equipos distintos avancen en la misma dirección.",
    signature: "Nombre Apellido",
    signatureRole: "Diseño y dirección",
  },
  testimonial: {
    title: "Aviso destacado · Lo que cuentan",
    quote:
      "No se limitó a resolver la pantalla. Ordenó el problema, hizo las preguntas que faltaban y consiguió que producto e ingeniería tomaran decisiones juntos.",
    person: "Marina López",
    role: "Head of Product · Empresa ejemplo",
  },
  articles: { title: "Detrás de cada proyecto · Procesos" },
  contact: {
    title: "Hablemos",
    intro: "Proyectos, equipos, colaboraciones o un café por videollamada. Escríbeme.",
    reads: "Leo todos los mensajes.",
    emailLabel: "Correo",
    email: "hola@tudominio.com",
    emailHint: "Haz clic para copiar",
    copied: "Copiado ✓",
    scheduleLabel: "Agenda",
    schedule: "Reserva 30 minutos",
    availability: "Abierto a nuevos proyectos",
    updatedAt: "Actualizado a las",
  },
} as const;

export const homeContent = {
  copy,
  stats,
  projects,
  industries,
  timeline,
  articles,
} as const;
