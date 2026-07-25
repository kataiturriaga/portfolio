export type CaseMedia = { src: string; alt: string; caption?: string };

export type CaseProse = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
};

export type CaseGlanceData = {
  role: string;
  period: string;
  team: string;
  product: string;
  problem: string;
  solution: string;
};

export type Decision = {
  number: string; // "01".."04"
  title: string;
  area: string;
  from: string; // "de dónde veníamos"
  decided: string[]; // "qué decidimos y por qué"
  alternatives?: string[]; // alternativas descartadas
  finalStructure?: string; // estructura final (texto/ascii)
  media?: CaseMedia;
};

export type RestItem = { title: string; summary: string };

export type CaseStudy = {
  slug: string;
  title: string;
  kicker: string; // eyebrow del hero
  thesis: string;
  subthesis: string;
  glance: CaseGlanceData;
  problem: CaseProse;
  howWeWorked: CaseProse;
  decisions: Decision[];
  rest: RestItem[];
  reflection: string[];
  nextCase?: { slug: string; title: string };
  heroMedia?: CaseMedia;
};

export const casos: CaseStudy[] = [
  {
    slug: "asesorias-v2-app",
    title: "Asesorías V2 — la app del cliente",
    kicker: "Caso de estudio · App coached · 2026",
    thesis:
      "La v1 era plana. Un estilo de entreno, una lista de dieta, un contador de pasos que nadie miraba.",
    subthesis:
      "La v2 le dio profundidad a cada flujo: más experiencias de entreno, una dieta con capas, los pasos convertidos en juego y una puerta de entrada sin fricción.",
    glance: {
      role: "Product Designer + PM",
      period: "Abril–Junio 2026",
      team: "2 personas (diseño/PM + desarrollo)",
      product: "El Método — tier coached (asesorías personalizadas)",
      problem:
        "El tier coached costaba más que la suscripción pero heredó una app peor, plana y superficial.",
      solution:
        "Rediseño v1→v2 que añade capas de información y experiencias a cada flujo clave del cliente.",
    },
    problem: {
      eyebrow: "El problema",
      title: "Pagaban más, recibían menos",
      paragraphs: [
        "La app de asesorías existía como producto separado, con una experiencia muy por debajo del nivel de calidad de la app de suscripción (Automática) — nuestro benchmark interno de calidad, no una versión gratuita. Los usuarios del tier coached pagaban más pero recibían una experiencia peor: la diferencia no estaba justificada por el producto.",
        "Cada flujo clave era plano y tenía como máximo tres capas de profundidad. Entreno ofrecía un solo tipo de experiencia: fuerza. Dieta era una lista sin variedad, sin recetas ni equivalencias. Pasos era un contador pasivo que registraba el día y no llevaba a ninguna parte — un dato que nadie miraba.",
        "El objetivo de la v2 fue cerrar esa brecha dando profundidad a cada uno de esos flujos, sin perder de vista que el equipo era pequeño y el deadline de handoff era el 30 de mayo de 2026.",
      ],
    },
    howWeWorked: {
      eyebrow: "Cómo trabajamos",
      title: "Un equipo de dos, decisiones sobre datos de uso",
      paragraphs: [
        "Éramos dos personas: diseño/PM y desarrollo. Sin ese tamaño de equipo, cada decisión tenía que justificarse con algo más sólido que intuición — usamos la app de suscripción (Automática) como benchmark de calidad y los datos reales de uso como criterio de diseño.",
        "Por ejemplo: el 58% de los usuarios abre la app justo antes de cada comida, así que cada pantalla extra en ese momento es fricción real — eso determinó que la pantalla principal de dieta tuviera que resolver la consulta en un solo tap, sin pantallas intermedias.",
      ],
    },
    decisions: [
      {
        number: "01",
        title: "El contador de pasos se convierte en juego",
        area: "Retención / gamificación / filosofía de marca",
        from: "En la v1 la app tenía un contador de pasos: un número pasivo que registraba el día y no llevaba a ninguna parte. El objetivo de pasos diarios es una de las patas de la filosofía del método — combinar entrenamiento de fuerza (u otras modalidades) con movimiento moderado, andar — pero el producto no lo trataba como algo que importara. Un dato que nadie miraba.",
        decided: [
          "En la v2 el contador se mantiene, pero encima se construye un ranking basado en los pasos: los clientes compiten entre ellos por cumplir el objetivo diario. El número deja de ser un registro privado y pasa a ser una posición social.",
          "El motivo es alinear el producto con la filosofía de marca: si andar es media ecuación del método, tiene que sentirse tan protagonista como levantar peso. Un ranking convierte un hábito silencioso en algo con fricción emocional — quieres subir, quieres no bajar.",
          "El % de días con objetivo de pasos cumplido alimenta además el score del ciclo, así que el mismo dato tiene una lectura social (ranking) y una lectura personal (progreso en tus revisiones).",
        ],
        alternatives: [
          "Dejar solo el contador con un objetivo personal (statu quo mejorado): más simple, pero no explota la palanca social ni refuerza la filosofía.",
          "Insignias/medallas individuales sin comparación entre usuarios: gamificación sin el gancho competitivo; menos motivador para una comunidad que ya se conoce.",
        ],
        finalStructure:
          "Pasos\n  ├── Contador diario (objetivo personal)\n  └── Ranking entre clientes (posición por objetivo cumplido)\n        └── alimenta el score del ciclo (% días con objetivo)",
      },
      {
        number: "02",
        title: "De una lista plana a una dieta con capas",
        area: "Consulta de dieta / experiencia diaria del cliente",
        from: "La pantalla de dieta de la v1 separaba las dos decisiones del usuario en dos pantallas (elegir comida, luego ver opciones): dos taps, dos momentos de orientación. Y era una lista sin variedad: sin recetas, sin equivalencias, sin forma de ver cantidades en el formato que cada cliente prefiere. Pura consulta rápida antes de comer, tratada como un documento.",
        decided: [
          "Chips para navegar entre comidas del día y cards con la foto del plato a ancho completo como protagonista, con un badge de 'Opción 1/2/3'. La comida es visual: ver el plato reduce la carga de la decisión más que cualquier texto. Basado en el dato de que el 58% abre la app justo antes de comer — cada pantalla extra es fricción real.",
          "Acordeón de ingredientes dentro de la card (uno abierto a la vez): verificar cantidades sin cambiar de pantalla ni perder de vista las otras opciones.",
          "Pantalla de detalle con tabs por opción, toggle Raciones/Unidades, equivalencias de ingredientes para sustituciones y recetas asociadas. Las recetas se construyen sobre los mismos ingredient_id de la opción del cliente, así el match es por construcción y las cantidades se personalizan con un join directo.",
        ],
        alternatives: [
          "Tabs fijos con las comidas: más limpio, pero las abreviaturas (C.2, C.3) perdían contexto.",
          "Lista + bottom sheet: comunica el día entero pero obligaba a definir el comportamiento del sheet.",
          "Timeline vertical con la comida actual expandida: legible ('estás aquí') pero más pesado para el caso principal de consulta rápida. Se combinó lo mejor: navegación por chips + cards ricas.",
        ],
        finalStructure:
          "Pantalla dieta\n  ├── Chips → navegar comidas del día\n  └── Cards por opción (foto full-width + badge + nombre)\n        └── [Ingredientes] accordion con cantidades\n              └── Ver recetas y detalle → Detalle\n\nDetalle\n  ├── Tabs 1/2/3 · Imagen grande\n  ├── Toggle Raciones/Unidades\n  ├── Equivalencias de ingredientes\n  └── Recetas asociadas",
      },
      {
        number: "03",
        title: "De solo fuerza a varias experiencias, y de 'ayer' a 'estoy mejorando'",
        area: "Retención / motivación / progreso de entrenamiento",
        from: "La v1 ofrecía una sola experiencia de entrenamiento: fuerza. Y el histórico de marcas mostraba la última marca de la última sesión — un snapshot de 'qué hice ayer', útil como referencia de carga pero sin ninguna señal de tendencia. No respondía a la pregunta que retiene: '¿estoy mejorando?'.",
        decided: [
          "Se amplió la oferta a varias modalidades: además de fuerza, híbrido, running y Hyrox — cada una con su propia métrica (kg, tiempo mm:ss, rondas, AMRAP). El producto deja de asumir un único tipo de cliente.",
          "Se cambió la granularidad: de 'última marca por sesión' a 'evolución por ejercicio'. Cada ejercicio es una tarjeta con una línea de progreso a lo largo de las sesiones. El cambio no es de datos (ambos tienen el historial) sino de qué pregunta se considera más relevante.",
          "El header de cada tarjeta muestra el valor actual y el delta respecto a la sesión anterior en color de marca: la mejora es el dato protagonista, no el valor absoluto. Una curva ascendente en 8 semanas es un argumento que ninguna fila de tabla da.",
        ],
        alternatives: [
          "Mantener la última marca por sesión (statu quo): operativamente útil para preparar la sesión, pero sin valor narrativo ni motivacional.",
          "Un único gráfico agregado de 'volumen total': esconde el progreso por ejercicio, que es lo que el usuario reconoce como suyo.",
        ],
        finalStructure:
          "Marcas por ejercicio (7 tipos)\n  └── Tarjeta por ejercicio\n        ├── Valor actual + delta vs sesión anterior (color marca)\n        └── Línea de progreso sobre sesiones completadas\n              └── empty state si 0 sesiones",
      },
      {
        number: "04",
        title: "Una puerta de entrada sin fricción, para nuevos y antiguos",
        area: "Onboarding / activación / autenticación",
        from: "La entrada de la v1 dependía de email y contraseña, con un flujo largo. Al añadir social logins (Google/Apple) aparece un problema que no es trivial: los usuarios antiguos ya tienen cuenta con email; si entran ahora con un social, no se debe crear una cuenta duplicada ni dejar huérfano su historial. Y los usuarios nuevos deben poder hacer el alta con un social de forma directa, sin pasar por un formulario.",
        decided: [
          "Dos caminos, un solo resultado. Usuario nuevo: alta directa con el social — cero fricción, sin formulario. Usuario antiguo: al entrar con un social cuyo email coincide con una cuenta existente, se sincroniza (vincula) el social a esa cuenta en lugar de crear una nueva, conservando todo su historial.",
          "La clave del diseño es que el email es el identificador de reconciliación: el mismo email de la cuenta vieja y del social hacen match, así que 'entrar con Google' sobre una cuenta preexistente se resuelve como vinculación silenciosa, no como registro.",
          "Se simplificó y explicó el flujo de entrada para que el usuario nunca tenga que entender esta complejidad: entra como quiere entrar y acaba en su cuenta de siempre.",
        ],
        alternatives: [
          "Tratar cada social como cuenta nueva siempre: rompe el historial de los usuarios antiguos y genera duplicados.",
          "Obligar a los antiguos a migrar manualmente vinculando desde ajustes: más control pero fricción y abandono; la mayoría no lo haría.",
        ],
        finalStructure:
          "Entrada\n  ├── Nuevo → social login → alta directa (sin formulario)\n  └── Antiguo → social login\n        └── email coincide con cuenta existente\n              → vincular social a esa cuenta (conserva historial)",
      },
    ],
    rest: [
      {
        title: "Rediseño de Revisiones",
        summary:
          "De 'Progreso' a 'Revisiones': comparador foto como hero, score por ciclo con racha, y fuera los memes de los estados vacíos.",
      },
      {
        title: "% graso: IA + validación del coach",
        summary:
          "Decisión de producto con research de precisión real (sesgo de género, MAE); la IA propone y el coach firma para proteger el valor del tier coached.",
      },
      {
        title: "Teléfono en el onboarding",
        summary:
          "Capturar la llave de emparejamiento con el coach sin romper la ilusión de seguimiento personal, apoyando el copy en el WhatsApp previo a la compra.",
      },
    ],
    reflection: [
      "Las hipótesis de perfil de usuario quedaron sin validar del todo: solo teníamos frecuencia de apertura de la app, no contexto ni motivación real de cada segmento de dieta.",
      "Quedó deuda de tokens: los colores del gráfico de marcas (verde, grid lines, labels) están hardcodeados en lugar de usar variables del sistema de diseño.",
      "El empty state de 'sin marcas que mostrar aún' solo se implementó para el tipo de entreno Default; los otros 6 tipos (Superserie, Circuito, Hyrox×4) se quedaron sin ese estado.",
      "Quedó por validar si el comparador de revisiones (primera foto vs última) debería poder compararse entre cualquier par de revisiones, no solo primera y última — eso lo pasaría de estático a interactivo.",
    ],
    nextCase: {
      slug: "asesorias-v2-dash",
      title: "Asesorías V2 — el dashboard del coach",
    },
    // heroMedia: { src: "/casos/asesorias-v2-app/hero.png", alt: "App El Método — pantallas de la v2" },
    // TODO: restaurar al añadir la imagen (Tarea 4)
  },
];

export function getCaso(slug: string): CaseStudy | undefined {
  return casos.find((caso) => caso.slug === slug);
}

export function getCasoNeighbors(slug: string): {
  previous?: CaseStudy;
  next?: CaseStudy;
} {
  const index = casos.findIndex((caso) => caso.slug === slug);
  if (index === -1) return {};
  return {
    previous: index > 0 ? casos[index - 1] : undefined,
    next: index < casos.length - 1 ? casos[index + 1] : undefined,
  };
}
