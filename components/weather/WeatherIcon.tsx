export type WeatherIconName =
  | "sol"
  | "luna"
  | "nube"
  | "nube-sol"
  | "lluvia"
  | "nieve"
  | "niebla"
  | "luna-nube"
  | "luna-lluvia"
  | "luna-nieve"
  | "nube-amanecer"
  | "sol-lluvia"
  | "sol-nieve"
  | "atardecer"
  | "viento"
  | "brujula"
  | "mapa"
  | "lista"
  | "ubicacion"
  | "amanecer"
  | "termometro"
  | "ojo"
  | "campana"
  | "sobre"
  | "calendario"
  | "flecha";

/* Paleta del set meteorológico, en el lenguaje de la app del Tiempo:
   formas rellenas y multicolor sobre iconos de interfaz monocromos.
   Los valores viven en styles/tokens.css; aquí solo se referencian. */
const SUN = "var(--w-sun)";
const SUN_DEEP = "var(--w-sun-deep)";
const CLOUD = "var(--w-cloud)";
const CLOUD_DIM = "var(--w-cloud-dim)";
const RAIN = "var(--w-rain)";
const MOON = "var(--w-moon)";

/** Nube sólida reutilizada por todas las variantes nubladas. */
const cloudPath = (d: string, fill: string) => <path d={d} fill={fill} stroke="none" />;
const CLOUD_D =
  "M7.4 18.4h9.1a3.9 3.9 0 0 0 .5-7.77 5.6 5.6 0 0 0-10.6-1.2A3.6 3.6 0 0 0 7.4 18.4Z";
const CLOUD_SMALL_D =
  "M6.2 19.2h7.9a3.4 3.4 0 0 0 .4-6.75 4.85 4.85 0 0 0-9.2-1.05A3.12 3.12 0 0 0 6.2 19.2Z";
/* Igual pero más arriba, para dejar sitio a la precipitación debajo */
const CLOUD_SMALL_RAIN_D =
  "M6.2 16.1h7.9a3.4 3.4 0 0 0 .4-6.75 4.85 4.85 0 0 0-9.2-1.05A3.12 3.12 0 0 0 6.2 16.1Z";

/** Astro pequeño que asoma tras la nube, y precipitación bajo ella. */
const MOON_SMALL = (
  <path
    d="M19.9 9.1a3.5 3.5 0 1 1-4.3-4.8 2.85 2.85 0 0 0 4.3 4.8Z"
    fill={MOON}
    stroke="none"
  />
);

const SUN_SMALL = (
  <>
    <circle cx="16.8" cy="6.6" r="2.9" fill={SUN} stroke="none" />
    <path
      d="M16.8 1.4v1.4M22 6.6h-1.4M20.5 2.9l-1 1M20.5 10.3l-1-1"
      stroke={SUN}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </>
);

const RAIN_DROPS = (
  <path
    d="M7.9 18.1 7.1 20.6M11.4 18.1l-.8 2.5M14.9 18.1l-.8 2.5"
    stroke={RAIN}
    strokeWidth="1.8"
    strokeLinecap="round"
  />
);

const SNOW_DOTS = (
  <path
    d="M7.9 18.6h.01M11.4 20.3h.01M14.9 18.6h.01"
    stroke={RAIN}
    strokeWidth="2.5"
    strokeLinecap="round"
  />
);

const PATHS: Record<WeatherIconName, React.ReactNode> = {
  sol: (
    <>
      <circle cx="12" cy="12" r="4.6" fill={SUN} stroke="none" />
      <path
        d="M12 2.2v2.6M12 19.2v2.6M2.2 12h2.6M19.2 12h2.6M4.9 4.9l1.85 1.85M17.25 17.25 19.1 19.1M19.1 4.9l-1.85 1.85M6.75 17.25 4.9 19.1"
        stroke={SUN}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  luna: (
    <>
      <path
        d="M20.2 14.9A8.6 8.6 0 0 1 9.1 3.8a8.6 8.6 0 1 0 11.1 11.1Z"
        fill={MOON}
        stroke="none"
      />
      <path
        d="M17.4 3.2l.55 1.5 1.5.55-1.5.55-.55 1.5-.55-1.5-1.5-.55 1.5-.55Z"
        fill={MOON}
        stroke="none"
        opacity="0.85"
      />
    </>
  ),
  nube: cloudPath(CLOUD_D, CLOUD),
  "nube-sol": (
    <>
      <circle cx="16.8" cy="7.2" r="3" fill={SUN} stroke="none" />
      <path
        d="M16.8 1.9v1.5M22.1 7.2h-1.5M20.55 3.45l-1.05 1.05M20.55 10.95l-1.05-1.05"
        stroke={SUN}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {cloudPath(CLOUD_SMALL_D, CLOUD)}
    </>
  ),
  lluvia: (
    <>
      {cloudPath(
        "M7.4 15.6h9.1a3.9 3.9 0 0 0 .5-7.77 5.6 5.6 0 0 0-10.6-1.2A3.6 3.6 0 0 0 7.4 15.6Z",
        CLOUD,
      )}
      <path
        d="M8.8 17.6 7.9 20.4M12.4 17.6l-.9 2.8M16 17.6l-.9 2.8"
        stroke={RAIN}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </>
  ),
  nieve: (
    <>
      {cloudPath(
        "M7.4 15.1h9.1a3.9 3.9 0 0 0 .5-7.77 5.6 5.6 0 0 0-10.6-1.2A3.6 3.6 0 0 0 7.4 15.1Z",
        CLOUD,
      )}
      <path
        d="M8.7 18.2h.01M12 20.1h.01M15.3 18.2h.01"
        stroke={RAIN}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </>
  ),
  niebla: (
    <>
      {cloudPath(
        "M7.4 13.2h9.1a3.9 3.9 0 0 0 .5-7.77 5.6 5.6 0 0 0-10.6-1.2A3.6 3.6 0 0 0 7.4 13.2Z",
        CLOUD,
      )}
      <path
        d="M5.2 16.6h13.6M7 20h10.4"
        stroke={CLOUD_DIM}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </>
  ),
  viento: <path d="M3.5 9h10a2.6 2.6 0 1 0-2.4-3.6M3.5 13h14.5a2.6 2.6 0 1 1-2.4 3.6M3.5 17H10" />,
  brujula: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <path d="m15.2 8.8-1.8 4.6-4.6 1.8 1.8-4.6Z" />
    </>
  ),
  mapa: <path d="m9 4.5-5 2v13l5-2 6 2 5-2v-13l-5 2Zm0 0v13m6-11v13" />,
  lista: (
    <path
      d="M8.5 6.5H20M8.5 12H20M8.5 17.5H20M4 6.5h.01M4 12h.01M4 17.5h.01"
      strokeWidth="2"
      strokeLinecap="round"
    />
  ),
  ubicacion: <path d="M20.5 3.5 3.8 10.2l7 2.6 2.6 7Z" />,
  amanecer: (
    <>
      <path d="M7.6 15.4a4.4 4.4 0 0 1 8.8 0Z" fill={SUN} stroke="none" />
      <path
        d="M12 4.6v2.4M3.9 15.4h2.2M17.9 15.4h2.2M6.1 9.5l1.7 1.7M17.9 9.5l-1.7 1.7"
        stroke={SUN}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path d="M3 18.8h18" stroke={SUN_DEEP} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  atardecer: (
    <>
      <path d="M7.6 15.4a4.4 4.4 0 0 1 8.8 0Z" fill={SUN_DEEP} stroke="none" />
      <path
        d="M3.9 15.4h2.2M17.9 15.4h2.2M6.1 9.5l1.7 1.7M17.9 9.5l-1.7 1.7"
        stroke={SUN_DEEP}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      {/* flecha hacia abajo: el sol se pone */}
      <path
        d="M12 7.4v-2.8M12 7.4 10.4 5.8M12 7.4l1.6-1.6"
        stroke={SUN_DEEP}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3 18.8h18" stroke={SUN_DEEP} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  "luna-nube": (
    <>
      {MOON_SMALL}
      {cloudPath(CLOUD_SMALL_D, CLOUD)}
    </>
  ),
  "luna-lluvia": (
    <>
      {MOON_SMALL}
      {cloudPath(CLOUD_SMALL_RAIN_D, CLOUD)}
      {RAIN_DROPS}
    </>
  ),
  "luna-nieve": (
    <>
      {MOON_SMALL}
      {cloudPath(CLOUD_SMALL_RAIN_D, CLOUD)}
      {SNOW_DOTS}
    </>
  ),
  "nube-amanecer": (
    <>
      <path d="M13.4 9.9a3.4 3.4 0 0 1 6.8 0Z" fill={SUN} stroke="none" />
      <path
        d="M16.8 3.1v1.5M11.9 9.9h1.4M20.3 9.9h1.4M13.9 5.6l1 1"
        stroke={SUN}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {cloudPath(CLOUD_SMALL_D, CLOUD)}
    </>
  ),
  "sol-lluvia": (
    <>
      {SUN_SMALL}
      {cloudPath(CLOUD_SMALL_RAIN_D, CLOUD)}
      {RAIN_DROPS}
    </>
  ),
  "sol-nieve": (
    <>
      {SUN_SMALL}
      {cloudPath(CLOUD_SMALL_RAIN_D, CLOUD)}
      {SNOW_DOTS}
    </>
  ),
  termometro: <path d="M10.5 13.8V5a1.8 1.8 0 0 1 3.6 0v8.8a3.6 3.6 0 1 1-3.6 0ZM12.3 9h2" />,
  ojo: (
    <>
      <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  campana: (
    <path d="M12 4a5.2 5.2 0 0 1 5.2 5.2c0 5 1.8 6.3 1.8 6.3H5s1.8-1.3 1.8-6.3A5.2 5.2 0 0 1 12 4Zm-1.8 15a2 2 0 0 0 3.6 0" />
  ),
  sobre: <path d="M3.5 6.5h17v11h-17Zm0 .5 8.5 6 8.5-6" />,
  calendario: <path d="M4.5 6.5h15V20h-15ZM4.5 10.5h15M8.5 4v3M15.5 4v3" />,
  flecha: <path d="M5 12h13m-5-6 6 6-6 6" />,
};

export default function WeatherIcon({
  name,
  size = 18,
  className,
}: {
  name: WeatherIconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
