"use client";

import { useState } from "react";
import SectionHeading from "./SectionHeading";

const email = "hola@tudominio.com";

export default function SiteFooter() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <footer id="contacto" className="footer">
      <div className="paper-shell">
        <SectionHeading
          light
          eyebrow="Cartas a la redacción · Contacto"
          title="Hablemos."
        />
        <div className="footer__intro">
          <p>
            Proyectos, equipos, colaboraciones o un café por videollamada.
            Escríbeme.
          </p>
          <span>Leo todos los mensajes.</span>
        </div>
        <div className="footer__links">
          <button type="button" onClick={copyEmail}>
            <span>✉ Correo</span>
            <strong>{email}</strong>
            <small>{copied ? "Copiado ✓" : "Haz clic para copiar →"}</small>
          </button>
          <a href="https://cal.com/" target="_blank" rel="noreferrer">
            <span>◷ Agenda</span>
            <strong>Reserva 30 minutos</strong>
            <small>Abrir calendario ↗</small>
          </a>
        </div>
        <div className="footer__meta">
          <div>
            <span>Actualmente en</span>
            <strong>Barcelona · Disponible en remoto · CET</strong>
            <small>■ Abierto a nuevos proyectos</small>
          </div>
          <div>
            <span>También en</span>
            <a href="#">LinkedIn ↗</a>
            <a href="#">Read.cv ↗</a>
            <a href="#">Are.na ↗</a>
          </div>
        </div>
        <div className="footer__signoff">
          <span>✶ Gracias por leer.</span>
          <strong>La Redacción</strong>
        </div>
      </div>
    </footer>
  );
}
