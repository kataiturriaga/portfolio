export default function CityHeader({
  over,
  name,
  big,
  unit,
  condition,
  hiLo,
}: {
  over?: string;
  name: string;
  big: string;
  unit?: string;
  condition: string;
  /** Línea máx/mín: texto suelto o varias métricas ya maquetadas */
  hiLo?: React.ReactNode;
}) {
  return (
    <header className="city-header">
      {over ? <p className="city-header__over">{over}</p> : null}
      <h1 className="city-header__name">{name}</h1>
      <p className="city-header__big">
        {big}
        {unit ? <sup>{unit}</sup> : null}
      </p>
      <p className="city-header__condition">{condition}</p>
      {hiLo ? <p className="city-header__hilo">{hiLo}</p> : null}
    </header>
  );
}
