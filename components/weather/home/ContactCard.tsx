"use client";

import { useEffect, useState } from "react";
import WeatherIcon from "../WeatherIcon";
import { copy } from "@/data/home";

export default function ContactCard() {
  const contact = copy.contact;
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState<string | null>(null);

  // La hora local solo existe en el cliente; en el servidor se omite.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura única de la hora local tras hidratar
    setNow(
      new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
    );
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard no disponible */
    }
  };

  return (
    <div className="card-prose">
      <p className="card-lead">{contact.intro}</p>
      <p>{contact.reads}</p>
      <div className="contact-actions">
        <button type="button" onClick={copyEmail}>
          <WeatherIcon name="sobre" size={16} />
          <strong>{copied ? contact.copied : contact.email}</strong>
          <span>{contact.emailHint}</span>
        </button>
        <a href="#" onClick={(e) => e.preventDefault()}>
          <WeatherIcon name="calendario" size={16} />
          <strong>{contact.schedule}</strong>
          <span>{contact.scheduleLabel}</span>
        </a>
      </div>
      <p className="contact-updated">
        {contact.availability}
        {now ? ` · ${contact.updatedAt} ${now}` : ""}
      </p>
    </div>
  );
}
