import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { QrCode, ScanLine, X, ClipboardPaste, AlertTriangle } from "lucide-react";
import { getStoredPair, storePair } from "./gunKeys.js";

function validarPar(pair) {
  return Boolean(
    pair && pair.pub && pair.priv && pair.epub && pair.epriv
  );
}

export default function DevicePairingModal({ open, onClose }) {
  const [aba, setAba] = useState("mostrar");
  const [textoColado, setTextoColado] = useState("");
  const [erro, setErro] = useState("");
  const [chavesAtuais, setChavesAtuais] = useState(null);

  useEffect(() => {
    if (open) {
      setChavesAtuais(getStoredPair());
      setAba("mostrar");
      setErro("");
      setTextoColado("");
    }
  }, [open]);

  if (!open) return null;

  const aplicarNovoPar = (texto) => {
    let pair;
    try {
      pair = JSON.parse(texto);
    } catch (e) {
      setErro("Código inválido — não foi possível ler o JSON das chaves.");
      return;
    }
    if (!validarPar(pair)) {
      setErro("Código lido, mas não é um par de chaves válido.");
      return;
    }
    storePair(pair);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 px-4 print:hidden">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <h2 className="font-serif text-lg font-semibold text-stone-900">
            Sincronizar com outro dispositivo
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setAba("mostrar")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              aba === "mostrar"
                ? "text-teal-700 border-b-2 border-teal-700"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            <QrCode size={14} />
            Este dispositivo
          </button>
          <button
            onClick={() => setAba("ler")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              aba === "ler"
                ? "text-teal-700 border-b-2 border-teal-700"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            <ScanLine size={14} />
            Parear novo dispositivo
          </button>
        </div>

        <div className="p-5">
          {aba === "mostrar" && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs text-stone-500 text-center leading-relaxed">
                Escaneie este código no outro dispositivo para sincronizar o
                mesmo histórico. Ele contém sua chave criptográfica — trate-o
                como uma senha e não o compartilhe com ninguém em quem você
                não confie.
              </p>
              {chavesAtuais ? (
                <div className="rounded-md border border-stone-200 p-4 bg-white">
                  <QRCodeSVG value={JSON.stringify(chavesAtuais)} size={200} />
                </div>
              ) : (
                <p className="text-xs text-rose-600">
                  Nenhuma chave encontrada neste dispositivo ainda.
                </p>
              )}
            </div>
          )}

          {aba === "ler" && (
            <div className="space-y-3">
              <p className="text-xs text-stone-500 leading-relaxed">
                Aponte a câmera para o QR Code exibido no outro dispositivo,
                ou cole o código de texto abaixo. Isso vai substituir as
                chaves deste dispositivo e recarregar a página.
              </p>

              <div className="overflow-hidden rounded-md border border-stone-200 bg-stone-900 aspect-square">
                <Scanner
                  onScan={(codigos) => {
                    if (codigos && codigos[0]) {
                      aplicarNovoPar(codigos[0].rawValue);
                    }
                  }}
                  onError={() =>
                    setErro(
                      "Não foi possível acessar a câmera — use o campo de texto abaixo."
                    )
                  }
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-stone-500 font-medium mb-1">
                  <ClipboardPaste size={12} />
                  Ou cole o código de texto
                </label>
                <textarea
                  value={textoColado}
                  onChange={(e) => setTextoColado(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 font-mono text-xs text-stone-800 outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                  placeholder='{"pub":"...","priv":"...","epub":"...","epriv":"..."}'
                />
                <button
                  onClick={() => aplicarNovoPar(textoColado)}
                  disabled={!textoColado.trim()}
                  className="mt-2 w-full rounded-md bg-teal-700 text-white text-xs font-medium py-2 hover:bg-teal-800 transition-colors disabled:opacity-60"
                >
                  Confirmar
                </button>
              </div>

              {erro && (
                <p className="flex items-start gap-1.5 text-xs text-rose-600">
                  <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                  {erro}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
