export type WeatherIconName =
  | "sol"
  | "luna"
  | "nube"
  | "nube-sol"
  | "lluvia"
  | "nieve"
  | "niebla"
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

const PATHS: Record<WeatherIconName, React.ReactNode> = {
  sol: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19" />
    </>
  ),
  luna: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />,
  nube: <path d="M7 18h9a4 4 0 0 0 .8-7.9A5.5 5.5 0 0 0 6.2 12 3.5 3.5 0 0 0 7 18Z" />,
  "nube-sol": (
    <>
      <circle cx="16.5" cy="7.5" r="2.6" />
      <path d="M16.5 2.8v1M21.2 7.5h-1M19.8 4.2l-.7.7M19.8 10.8l-.7-.7" />
      <path d="M5.5 19h7.5a3.4 3.4 0 0 0 .7-6.7A4.7 4.7 0 0 0 4.8 14 3 3 0 0 0 5.5 19Z" />
    </>
  ),
  lluvia: (
    <>
      <path d="M7 15h9a4 4 0 0 0 .8-7.9A5.5 5.5 0 0 0 6.2 9 3.5 3.5 0 0 0 7 15Z" />
      <path d="M8.5 17.5 7.5 20M12.5 17.5l-1 2.5M16.5 17.5l-1 2.5" />
    </>
  ),
  nieve: (
    <>
      <path d="M7 14.5h9a4 4 0 0 0 .8-7.9A5.5 5.5 0 0 0 6.2 8.5 3.5 3.5 0 0 0 7 14.5Z" />
      <path d="M8.5 17.4h.01M12 19.4h.01M15.5 17.4h.01" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  niebla: <path d="M4 10h16M4 13.5h16M6.5 17h11" />,
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
      <path d="M12 10.2a4 4 0 0 1 4 4M4 14.2h2.2M17.8 14.2H20M6.6 9l1.6 1.5M17.4 9l-1.6 1.5M12 5.6v2.2" />
      <path d="M3.5 18h17" />
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
