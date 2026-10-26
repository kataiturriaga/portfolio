"use client";

import { useState } from "react";
import { copy } from "@/data/home";

export default function ContactCard() {
  const contact = copy.contact;
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* sin portapapeles: el enlace mailto sigue disponible */
    }
  };

  return (
    <div className="contact">
      <p className="contact__lead">{contact.intro}</p>
      <p className="contact__note">{contact.reads}</p>
      <div className="contact__actions">
        <button type="button" className="pill pill--solid" onClick={copyEmail}>
          <span aria-live="polite">{copied ? contact.copied : contact.emailHint}</span>
        </button>
        <a
          className="pill"
          href={`mailto:${contact.email}?subject=${encodeURIComponent("Reservar 30 minutos")}`}
        >
          {contact.schedule}
        </a>
      </div>
      <p className="contact__email">{contact.email}</p>
    </div>
  );
}
