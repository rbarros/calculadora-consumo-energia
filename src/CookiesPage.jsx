import React from "react";
import { Cookie, ShieldCheck, Settings2 } from "lucide-react";
import LegalFooterNav, { VoltarCalculadora } from "./LegalFooterNav.jsx";

function Secao({ numero, titulo, icon: Icon, children }) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={16} className="text-teal-700" />}
        <h2 className="font-serif text-lg font-semibold text-stone-900">
          {numero}. {titulo}
        </h2>
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-stone-600">
        {children}
      </div>
    </section>
  );
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <VoltarCalculadora />

        <div className="mt-6 mb-8">
          <div className="flex items-center gap-2 text-teal-700">
            <Cookie size={18} strokeWidth={2.5} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Documento legal
            </span>
          </div>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl font-semibold text-stone-900">
            Política de Cookies
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Última atualização: 20 de agosto de 2026
          </p>
        </div>

        <div className="space-y-5">
          <Secao numero="1" titulo="O que este documento cobre" icon={Cookie}>
            <p>
              Esta política explica como a Calculadora de fatura de energia
              usa cookies e tecnologias de armazenamento local (localStorage)
              no seu navegador. Para efeitos desta política, tratamos o
              localStorage com as mesmas regras aplicadas a cookies, já que
              ambos guardam pequenas informações no seu dispositivo.
            </p>
            <p>
              Esta é uma ferramenta simples, sem cadastro e sem login: você
              não cria conta nem informa dados pessoais para usá-la.
            </p>
          </Secao>

          <Secao numero="2" titulo="Cookies e armazenamento essenciais" icon={ShieldCheck}>
            <p>
              Usamos apenas o armazenamento estritamente necessário para o
              funcionamento da calculadora:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <span className="font-medium text-stone-700">
                  Histórico de faturas:
                </span>{" "}
                os meses que você salva na calculadora ficam guardados via
                localStorage, apenas no seu navegador e neste dispositivo.
                Ninguém além de você tem acesso a esses dados — eles não são
                enviados a nenhum servidor.
              </li>
              <li>
                <span className="font-medium text-stone-700">
                  Preferência do aviso de cookies:
                </span>{" "}
                guardamos localmente que você já leu o aviso de cookies, para
                não exibi-lo novamente a cada visita.
              </li>
            </ul>
          </Secao>

          <Secao numero="3" titulo="Cookies não essenciais" icon={Settings2}>
            <p>
              Não usamos cookies de publicidade, remarketing ou rastreamento
              entre sites. As métricas de uso e desempenho do site (Vercel
              Web Analytics e Speed Insights) funcionam sem cookies e sem
              identificar você individualmente — servem apenas para
              entendermos, de forma agregada, como a calculadora está sendo
              usada e onde melhorar sua performance.
            </p>
            <p>
              Se isso mudar no futuro e passarmos a usar cookies não
              essenciais, atualizaremos esta política e pediremos seu
              consentimento antes de ativá-los.
            </p>
          </Secao>

          <Secao numero="4" titulo="Como controlar ou apagar esses dados" icon={Settings2}>
            <p>
              Você pode apagar o histórico salvo e a preferência do aviso a
              qualquer momento, de duas formas:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Pelas configurações do próprio navegador: em "Privacidade e
                segurança", procure por "Cookies e dados de sites" (ou
                "Dados de navegação") e limpe os dados armazenados para este
                site.
              </li>
              <li>
                Usando uma janela anônima/privada, que não guarda nada após
                fechar a aba.
              </li>
            </ul>
            <p>
              Atenção: limpar esses dados também apaga o histórico de faturas
              que você salvou na calculadora, já que ele é guardado
              exclusivamente no seu navegador. Não há como recuperá-lo depois
              disso.
            </p>
          </Secao>
        </div>

        <LegalFooterNav atual="/politica-de-cookies" />
      </div>
    </div>
  );
}
