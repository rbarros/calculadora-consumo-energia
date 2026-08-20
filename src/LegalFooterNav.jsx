import React from "react";
import { ArrowLeft } from "lucide-react";

const LINKS = [
  { href: "/termos-de-uso", label: "Termos de Uso" },
  { href: "/politica-de-privacidade", label: "Política de Privacidade" },
  { href: "/politica-de-cookies", label: "Política de Cookies" },
];

export function VoltarCalculadora() {
  return (
    <a
      href="/"
      className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-teal-700 transition-colors"
    >
      <ArrowLeft size={13} />
      Voltar para a calculadora
    </a>
  );
}

export default function LegalFooterNav({ atual }) {
  return (
    <footer className="mt-10 flex flex-col items-center gap-3">
      <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs">
        {LINKS.filter((l) => l.href !== atual).map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-stone-400 hover:text-teal-700 transition-colors"
          >
            {l.label}
          </a>
        ))}
      </nav>
      <a
        href="/"
        className="text-xs text-stone-400 hover:text-teal-700 transition-colors"
      >
        Voltar para a calculadora de fatura de energia
      </a>
    </footer>
  );
}
