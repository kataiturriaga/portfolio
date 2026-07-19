export default function SectionHeading({
  eyebrow,
  title,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  light?: boolean;
}) {
  return (
    <div className={`section-heading ${light ? "section-heading--light" : ""}`}>
      {eyebrow ? <p className="eyebrow">✶ {eyebrow}</p> : null}
      <h2>{title}</h2>
    </div>
  );
}
