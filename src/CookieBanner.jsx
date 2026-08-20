import React, { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "aviso-cookies-fechado";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(CONSENT_KEY)) {
        setVisible(true);
      }
    } catch (e) {
      setVisible(true);
    }
  }, []);

  const fechar = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(CONSENT_KEY, "1");
    } catch (e) {
      // localStorage indisponível — o aviso volta a aparecer na próxima visita
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 print:hidden">
      <div className="mx-auto max-w-4xl px-4 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-stone-200 bg-white shadow-lg px-4 py-3.5">
          <Cookie size={18} className="hidden sm:block shrink-0 text-teal-700" />
          <p className="flex-1 text-xs leading-relaxed text-stone-600">
            Usamos apenas cookies essenciais para manter você conectado e
            guardar suas preferências. Sem rastreamento publicitário.{" "}
            <a
              href="/politica-de-cookies"
              className="font-medium text-teal-700 hover:underline"
            >
              Política de Cookies
            </a>
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fechar}
              className="rounded-md bg-teal-700 text-white text-xs font-medium px-3 py-1.5 hover:bg-teal-800 transition-colors"
            >
              Entendi
            </button>
            <button
              onClick={fechar}
              aria-label="Fechar aviso de cookies"
              className="text-stone-300 hover:text-stone-500 transition-colors sm:hidden"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
