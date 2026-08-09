import type { WeatherIconName } from "@/components/weather/WeatherIcon";

export type CaseMedia = { src: string; alt: string; caption?: string };

export type ImpactMetric = {
  value: string; // p.ej. "20% → 13%" o "Por medir"
  label: string;
  note?: string; // aclaración corta opcional
  pending?: boolean; // true = todavía sin dato real
};

export type RestItem = { title: string; summary: string };

export type Decision = {
  number: string;
  title: string;
  summary: string; // resumen de una línea
  shortLabel: string; // etiqueta corta para índices
  area: string;
  from: string; // de dónde veníamos
  decided: string[]; // qué decidimos y por qué
  alternatives?: string[];
  finalStructure?: string; // estructura final en texto
  media?: CaseMedia;
  comparison?: {
    before: { src: string; alt: string }; // imagen estática
    after: { src: string; alt: string }; // vídeo (mp4)
    beforeLabel?: string;
    afterLabel?: string;
  };
};

/**
 * Anchura de un bloque dentro de la rejilla de seis columnas del caso.
 * En móvil todos ocupan el ancho completo.
 */
export type BlockWidth = "third" | "half" | "two-thirds" | "full";

type Base = { width?: BlockWidth };

/**
 * Un caso es una lista de bloques. El caso elige QUÉ bloques y de qué ancho;
 * nunca cómo se ven, que es cosa de los componentes y de los tokens. Así el
 * ritmo puede variar de un caso a otro sin que cambie el lenguaje visual.
 */
export type CaseBlock =
  | (Base & { type: "alert"; title?: string; teaser: string; body: string })
  | (Base & { type: "fact"; label: string; text: string; icon?: WeatherIconName })
  | (Base & { type: "metrics"; title?: string; items: ImpactMetric[] })
  | (Base & {
      type: "prose";
      title: string;
      lead?: string;
      paragraphs: string[];
      icon?: WeatherIconName;
    })
  | (Base & { type: "decision" } & Decision)
  | (Base & { type: "list"; title: string; items: RestItem[]; icon?: WeatherIconName })
  | (Base & { type: "notes"; title: string; items: string[]; icon?: WeatherIconName })
  | (Base & { type: "next"; slug: string; title: string });

export type CaseStudy = {
  slug: string;
  title: string; // título largo, para metadatos
  client: string; // nombre de ciudad y clave en la previsión de la home
  heroTitle: string; // el dato gigante del hero
  period: string;
  role: string;
  summary: string; // descripción corta para metadatos
  /* Lo que necesita la fila de la previsión en la home */
  shortTitle: string;
  year: string;
  status: string;
  tempBand: [number, number];
  weather: WeatherIconName;
  video?: string;
  blocks: CaseBlock[];
};

export const casos: CaseStudy[] = [
  {
    slug: "asesorias-v2-app",
    title: "Asesorías V2 — la app del cliente",
    client: "El Método",
    heroTitle: "Añadiendo capas",
    period: "03/26 - ahora",
    role: "Product Designer + PM",
    summary:
      "La versión uno era plana. La v2 le dio profundidad a cada flujo: entreno, dieta, pasos y la entrada a la app.",
    shortTitle: "Añadiendo capas",
    year: "2026",
    status: "Lanzado",
    tempBand: [0.55, 0.92],
    weather: "amanecer",
    video: "/casos/asesorias-v2-app/978_1080x30_shots_so.mp4",
    blocks: [
    {
      type: "alert",
      width: "full",
      teaser:
        "La versión uno era plana, un estilo de entreno, una lista de dieta, un contador de pasos sin profundidad",
      body: "La v2 le dio profundidad a cada flujo: más experiencias de entreno, una dieta con capas, los pasos convertidos en juego y una puerta de entrada sin fricción.",
    },
    {
      type: "fact",
      width: "half",
      label: "Problema",
      text: "El tier coached costaba más que la suscripción pero heredó una app peor, plana y superficial.",
    },
    {
      type: "fact",
      width: "half",
      label: "Solución",
      text: "Rediseño de la v1 a la v2 que añade capas de información y experiencias a cada flujo clave del cliente.",
    },
    {
      type: "metrics",
      width: "full",
      title: "Impacto",
      items: [
      {
        value: "20% → 13%",
        label: "Cancelaciones mensuales",
      },
      {
        value: "350 € → 538 €",
        label: "LTV por cliente",
        note: "Cuota media ÷ churn mensual · estimado",
      },
      {
        value: "50% → 85%",
        label: "Adherencia (entrenos completados)",
      },
      ],
    },
    {
      type: "prose",
      width: "half",
      icon: "nube",
      title: "El problema",
      lead: "Pagaban más, recibían menos",
      paragraphs: [
        "La app de asesorías existía como producto separado, con una experiencia muy por debajo del nivel de calidad de la app de suscripción (Automática), que era nuestro benchmark interno, no una versión gratuita. Los usuarios del tier coached pagaban más pero recibían una experiencia peor: la diferencia no estaba justificada por el producto.",
        "Cada flujo clave era plano y tenía como máximo tres capas de profundidad. Entreno ofrecía un solo tipo de experiencia: fuerza. Dieta era una lista sin variedad, sin recetas ni equivalencias. Pasos era un contador pasivo que registraba el día y no empujaba al usuario a superarse.",
        "El objetivo de la v2 fue cerrar esa brecha dando profundidad a cada uno de esos flujos, sin perder de vista que el equipo era pequeño y que el handoff tenía que estar listo en julio.",
      ],
    },
    {
      type: "prose",
      width: "half",
      icon: "viento",
      title: "Cómo trabajamos",
      lead: "Un equipo de dos, decisiones sobre datos de uso",
      paragraphs: [
        "Éramos dos personas: diseño/PM y desarrollo. Sin ese tamaño de equipo, cada decisión tenía que justificarse con algo más sólido que la intuición. Usamos la app de suscripción (Automática) como benchmark de calidad y los datos reales de uso como criterio de diseño. Hicimos entrevistas con clientes de la coached y encuestas para entender mejor sus dolores actuales.",
        "Por ejemplo: el 58% de los usuarios abre la app justo antes de cada comida, así que cada pantalla extra en ese momento es fricción real. Eso determinó que la pantalla principal de dieta tuviera que resolver la consulta en un solo tap, sin pantallas intermedias.",
      ],
    },
    {
      type: "decision",
      number: "01",
        title: "El contador de pasos se convierte en juego",
        summary: "El contador de pasos pasa de dato pasivo a un ranking social que refuerza la filosofía de la marca.",
        shortLabel: "Pasos",
        area: "Retención / gamificación / filosofía de marca",
        from: "En la v1 la app tenía un contador de pasos: un número pasivo que registraba el día y no llevaba a ninguna parte. El objetivo de pasos diarios es una de las patas de la filosofía del método, combinar el entrenamiento de fuerza (u otras modalidades) con movimiento moderado, andar. Pero el producto no lo trataba como algo que importara.",
        decided: [
          "En la v2 elevamos el contador con un diseño más cuidado e interactivo, y encima construimos un ranking basado en los pasos: los clientes compiten entre ellos por cumplir el objetivo diario. El número deja de ser un registro privado y pasa a ser una posición social.",
          "El motivo es alinear el producto con la filosofía de marca: si andar es media ecuación del método, tiene que sentirse tan protagonista como levantar peso. Un ranking convierte un hábito silencioso en algo con fricción emocional: quieres subir, quieres no bajar.",
          "El porcentaje de días con objetivo de pasos cumplido alimenta además el score del ciclo, así que el mismo dato tiene una lectura social (el ranking) y una lectura personal (tu progreso en las revisiones).",
        ],
        alternatives: [
          "Dejar solo el contador con un objetivo personal (un statu quo mejorado): más simple, pero no explota la palanca social ni refuerza la filosofía.",
          "Insignias o medallas individuales sin comparación entre usuarios: gamificación sin el gancho competitivo, menos motivadora para una comunidad que ya se conoce.",
        ],
        finalStructure:
          "Pasos\n  ├── Contador diario (objetivo personal)\n  └── Ranking entre clientes (posición por objetivo cumplido)\n        └── alimenta el score del ciclo (% días con objetivo)",
        media: {
          src: "/casos/asesorias-v2-app/cuentapasos-1.jpg",
          alt: "Pantalla del cuentapasos y el ranking de pasos en la app",
        },
        comparison: {
          before: {
            src: "/casos/asesorias-v2-app/cuentapasos-before.jpg",
            alt: "Cuentapasos de la v1: un contador pasivo, sin ranking",
          },
          after: {
            src: "/casos/asesorias-v2-app/cuentapasos-after.MP4",
            alt: "Cuentapasos de la v2 con el ranking de pasos entre clientes",
          },
        },
    },
    {
      type: "decision",
      number: "02",
        title: "De una lista plana a una dieta con capas",
        summary: "La dieta pasa de una lista plana a una experiencia visual con recetas, equivalencias y raciones.",
        shortLabel: "Dieta",
        area: "Consulta de dieta / experiencia diaria del cliente",
        from: "La pantalla de dieta de la v1 separaba las dos decisiones del usuario en dos pantallas, y además era una lista sin variedad: sin recetas, sin equivalencias, sin forma de ver las cantidades en el formato que cada cliente prefiere. Pura consulta rápida antes de comer, tratada como un documento.",
        decided: [
          "Chips para navegar entre las comidas del día y cards con la foto del plato a ancho completo como protagonista, con un badge de 'Opción 1/2/3'. La comida es visual: ver el plato reduce la carga de la decisión más que cualquier texto. Todo apoyado en el dato de que el 58% abre la app justo antes de comer, cuando cada pantalla extra es fricción real.",
          "Acordeón de ingredientes dentro de la card (uno abierto a la vez): verificar cantidades sin cambiar de pantalla ni perder de vista las otras opciones.",
          "Pantalla de detalle con tabs por opción, toggle Raciones/Unidades, equivalencias de ingredientes para sustituciones y recetas asociadas. Las recetas se construyen sobre los mismos ingredient_id de la opción del cliente, así el match es por construcción y las cantidades se personalizan con un join directo.",
        ],
        alternatives: [
          "Tabs fijos con las comidas: más limpio, pero las abreviaturas (C.2, C.3) perdían contexto.",
          "Lista con bottom sheet: comunica el día entero pero obligaba a definir el comportamiento del sheet.",
          "Timeline vertical con la comida actual expandida: muy legible ('estás aquí'), pero más pesado para el caso principal de consulta rápida. Al final combinamos lo mejor: navegación por chips con cards ricas.",
        ],
        finalStructure:
          "Pantalla dieta\n  ├── Chips → navegar comidas del día\n  └── Cards por opción (foto full-width + badge + nombre)\n        └── [Ingredientes] accordion con cantidades\n              └── Ver recetas y detalle → Detalle\n\nDetalle\n  ├── Tabs 1/2/3 · Imagen grande\n  ├── Toggle Raciones/Unidades\n  ├── Equivalencias de ingredientes\n  └── Recetas asociadas",
    },
    {
      type: "decision",
      number: "03",
        title: "De solo fuerza a varias experiencias, y de 'ayer' a 'estoy mejorando'",
        summary: "De solo fuerza a cuatro modalidades, y de 'qué hice ayer' a 'estoy mejorando' por ejercicio.",
        shortLabel: "Entreno",
        area: "Retención / motivación / progreso de entrenamiento",
        from: "La v1 ofrecía una sola experiencia de entrenamiento: fuerza. Y el histórico de marcas era una lista plana de todos los entrenos realizados, además fuera del flujo donde hacía falta. Para saber cuál había sido tu último peso en press banca tenías que salir del entreno, adivinar en qué sesión pasada aparecía ese ejercicio, mirar el resultado y volver. No le mostrábamos al cliente su progreso: el entreno era un checklist que cumplir, sin ninguna motivación interna.",
        decided: [
          "Ampliamos la oferta a varias modalidades: además de fuerza, híbrido, running y Hyrox, cada una con su propia métrica (kg, tiempo en mm:ss, rondas, AMRAP). El producto deja de asumir un único tipo de cliente.",
          "Cambiamos la granularidad: de 'última marca por sesión' a 'evolución por ejercicio'. Cada ejercicio es una tarjeta con una línea de progreso a lo largo de las sesiones, y la mostramos en varios puntos del flujo de entreno en su forma más relevante. El cambio no es de datos (ambos tienen el historial) sino de qué pregunta consideramos más importante responder.",
          "En el gráfico, el header de cada tarjeta muestra el valor actual y el delta respecto a la sesión anterior en color de marca: la mejora es el dato protagonista, no el valor absoluto. La última marca por sesión sigue existiendo, pero la movimos a la hoja del ejercicio individual, donde de verdad la necesitas: mientras entrenas y registras las series.",
        ],
        alternatives: [
          "Enseñar solo la última marca por sesión en la pantalla principal (el statu quo): operativamente útil para preparar la sesión, pero sin valor narrativo ni motivacional. La reubicamos en la hoja del ejercicio individual.",
          "Un único gráfico agregado de 'volumen total': esconde el progreso por ejercicio, que es justo lo que el usuario reconoce como suyo.",
        ],
        finalStructure:
          "Marcas por ejercicio (7 tipos)\n  └── Tarjeta por ejercicio\n        ├── Valor actual + delta vs sesión anterior (color marca)\n        └── Línea de progreso sobre sesiones completadas\n              └── empty state si 0 sesiones\n\nHoja del ejercicio individual (mientras entrenas)\n  └── Última marca por sesión + registro de series",
    },
    {
      type: "decision",
      number: "04",
        title: "Una puerta de entrada sin fricción, para nuevos y antiguos",
        summary: "Una sola pantalla de acceso decide por identidad y optimiza para el 98% que son usuarios que ya existen.",
        shortLabel: "Entrada",
        area: "Autenticación / onboarding / entrada a la app",
        from: "En la v1 se entraba solo con email y contraseña. Al añadir 'entrar con Google o Apple' apareció un lío: la misma pantalla servía para dos cosas a la vez, iniciar sesión si ya tenías cuenta y registrarte si eras nuevo, y la app no distinguía bien quién era quién. El resultado eran usuarios nuevos que se saltaban el cuestionario inicial y entraban con la app vacía: sin datos, sin dashboard y con dietas recomendadas sin sentido, porque nunca habían dicho su objetivo, su peso o su altura. Encima había una trampa: la app daba por hecho el cuestionario a cualquiera que tuviera guardado aunque fuera un solo dato, aunque no hubiera respondido nada, y así mucha gente quedaba marcada como 'ya lo hizo' sin haberlo hecho.",
        decided: [
          "Hay dos puertas de entrada, 'Empezar ahora' y 'Log in', pero las dos llevan a la misma pantalla de acceso (Google, Apple o email). En lugar de tratar cada proveedor por separado, dejamos que el sistema decida por identidad: si la persona ya tiene cuenta, la reconoce y le hace login; si no, le hace una sola pregunta, '¿ya tienes cuenta con nosotros?'. Sin ramas distintas para Google o Apple, un único camino claro.",
          "Optimizamos para el caso real, no para el teórico. Quien llega a esta pantalla viene casi siempre de 'Log in', así que asumimos que la gran mayoría son usuarios de siempre intentando entrar con Google o Apple en vez de con su email. El diseño se pone de su lado: reconocerlos y devolverlos a su cuenta con su historial intacto, sin pedirles que se registren otra vez.",
          "Resolvimos el caso incómodo: alguien que ya existe pero entra por 'Empezar ahora' y rellena el cuestionario. Cuando después mete su identidad de siempre, el sistema lo reconoce, lo lleva a su cuenta y descarta el cuestionario recién rellenado, con un aviso amable ('ya tienes cuenta con nosotros, te llevamos a ella') para que no se sorprenda de encontrarla con datos.",
          "El teléfono es la llave con la que el coach empareja a cada cliente, y solo se pedía en el cuestionario. A quien entra por 'Log in' con una cuenta antigua sin teléfono se lo pedimos una vez tras el login, de forma ligera y sin bloquear, para no dejar a ningún cliente sin emparejar.",
        ],
        alternatives: [
          "Tratar cada proveedor por separado, con una rama especial para 'Apple oculto sin match', otra para Google, etc.: era lo que había, y es frágil, porque cada caso nuevo suma otra rama. La pregunta única '¿ya tienes cuenta?' los cubre todos sin casos especiales.",
          "Fiarnos del botón que pulsó la persona ('iniciar sesión' o 'registrarse'): no funciona, porque la misma pantalla también registra, así que alguien nuevo podía colarse por la puerta de iniciar sesión y saltarse el cuestionario.",
          "Forzar el teléfono a todo el mundo tras el login: añade fricción a quien ya lo tiene. Pedirlo solo a quien le falta resuelve el hueco sin molestar al resto.",
        ],
        finalStructure:
          "Abrir la app\n  ├── Ya con sesión → Cargando → v1 / v2\n  ├── Sin sesión → Pantalla de acceso\n  └── Instalación nueva → Welcome\n        ├── 'Empezar ahora' → Cuestionario → Pantalla de acceso\n        └── 'Log in' → Pantalla de acceso\n\nPantalla de acceso (la misma en las dos puertas)\n  └── Google / Apple / Email → el sistema decide por identidad\n        ├── Reconoce la cuenta → Login (a su cuenta)\n        └── No la reconoce → '¿Ya tienes cuenta con nosotros?'\n              ├── Mete email y existe → Login\n              ├── Mete email y no existe → Cuestionario\n              └── 'No tengo cuenta' → Cuestionario",
    },
    {
      type: "list",
      width: "half",
      icon: "lista",
      title: "El resto",
      items: [
      {
        title: "Rediseño de Revisiones",
        summary:
          "De 'Progreso' a 'Revisiones': comparador de fotos como hero, score por ciclo con racha, y fuera los memes de los estados vacíos.",
      },
      {
        title: "% graso: IA + validación del coach",
        summary:
          "Decisión de producto con research de precisión real (sesgo de género, MAE): la IA propone y el coach firma, para proteger el valor del tier coached.",
      },
      {
        title: "Teléfono en el onboarding",
        summary:
          "Capturar la llave de emparejamiento con el coach sin romper la ilusión de seguimiento personal, apoyando el copy en el WhatsApp previo a la compra.",
      },
      ],
    },
    {
      type: "notes",
      width: "half",
      icon: "luna",
      title: "Reflexión",
      items: [
      "Las hipótesis de perfil de usuario quedaron sin validar del todo: teníamos frecuencia de apertura y algunas entrevistas, pero no un contexto claro de la motivación real de cada segmento de dieta.",
      "Quedó deuda de tokens: los colores del gráfico de marcas (verde, líneas de rejilla, etiquetas) están hardcodeados en lugar de usar variables del sistema de diseño.",
      "El empty state de 'sin marcas que mostrar aún' solo se implementó para el tipo de entreno Default; los otros seis tipos (Superserie, Circuito y los cuatro de Hyrox) se quedaron sin ese estado.",
      "Quedó por validar si el comparador de revisiones (primera foto frente a última) debería poder comparar cualquier par de revisiones, no solo la primera y la última, lo que lo pasaría de estático a interactivo.",
      "El lío de los logins llegó tarde y sin definición previa. Documentarlo después dejó claro que las reglas de entrada (quién es nuevo y qué cuenta como cuestionario hecho) deberían haberse decidido antes de tocar la pantalla de acceso.",
      ],
    },
    {
      type: "next",
      width: "full",
      slug: "asesorias-v2-dash",
      title: "Asesorías V2 — el dashboard del coach",
    },
    ],
  },
];

export function getCaso(slug: string): CaseStudy | undefined {
  return casos.find((caso) => caso.slug === slug);
}
