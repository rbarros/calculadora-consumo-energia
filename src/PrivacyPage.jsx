import React from "react";
import {
  ShieldCheck,
  Database,
  Scale,
  Share2,
  Globe,
  Clock,
  UserCheck,
  Lock,
} from "lucide-react";
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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <VoltarCalculadora />

        <div className="mt-6 mb-8">
          <div className="flex items-center gap-2 text-teal-700">
            <ShieldCheck size={18} strokeWidth={2.5} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Documento legal
            </span>
          </div>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl font-semibold text-stone-900">
            Política de Privacidade
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Última atualização: 20 de agosto de 2026
          </p>
        </div>

        <div className="space-y-5">
          <Secao numero="1" titulo="Escopo e responsável" icon={ShieldCheck}>
            <p>
              Esta política explica como a Calculadora de fatura de energia
              trata dados ao ser usada, em conformidade com a LGPD (Lei
              13.709/2018). A calculadora é um projeto independente, sem
              vínculo com nenhuma distribuidora de energia ou órgão público,
              mantido por seu autor.
            </p>
            <p>
              Dúvidas sobre esta política podem ser enviadas através do{" "}
              <a
                href="https://github.com/rbarros"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-700 hover:underline"
              >
                perfil do autor no GitHub
              </a>
              .
            </p>
          </Secao>

          <Secao numero="2" titulo="Dados tratados" icon={Database}>
            <p>
              Como não há cadastro, login ou pagamento, a calculadora trata
              apenas os seguintes tipos de dado:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <span className="font-medium text-stone-700">
                  Dados que você digita e salva:
                </span>{" "}
                consumo, tarifas, bandeira e histórico de faturas são
                cifrados no seu próprio navegador (criptografia de ponta a
                ponta) antes de serem salvos, e ficam disponíveis
                localmente (IndexedDB). Se você usar o recurso de
                sincronização, esses mesmos dados — sempre cifrados — também
                são replicados para os seus outros dispositivos pareados.
              </li>
              <li>
                <span className="font-medium text-stone-700">
                  Chave criptográfica (par de chaves):
                </span>{" "}
                gerada automaticamente no seu navegador no primeiro acesso e
                guardada localmente; funciona como sua identidade anônima
                para a sincronização. Não é uma senha cadastrada por você
                nem é enviada para nós — só é compartilhada se você mesmo
                usar o recurso de pareamento por QR Code.
              </li>
              <li>
                <span className="font-medium text-stone-700">
                  Metadados de sincronização:
                </span>{" "}
                ao sincronizar entre seus dispositivos, blobs cifrados e sua
                chave pública trafegam por servidores de retransmissão
                (relays) públicos de terceiros (
                <span className="font-mono text-xs">
                  gun-manhattan.herokuapp.com
                </span>
                ,{" "}
                <span className="font-mono text-xs">peer.wallie.io</span>).
                Esses operadores podem ver que existe tráfego cifrado
                associado a uma chave pública (e metadados técnicos como
                IP/horário), mas não conseguem ler o conteúdo.
              </li>
              <li>
                <span className="font-medium text-stone-700">
                  Dados técnicos agregados:
                </span>{" "}
                usamos Vercel Web Analytics e Speed Insights para entender,
                de forma agregada e anônima, quantas pessoas acessam o site,
                de qual página/dispositivo e o desempenho de carregamento.
                Essas ferramentas não usam cookies e não identificam
                visitantes individualmente.
              </li>
            </ul>
          </Secao>

          <Secao numero="3" titulo="Base legal para o tratamento" icon={Scale}>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <span className="font-medium text-stone-700">
                  Legítimo interesse:
                </span>{" "}
                para as métricas agregadas de uso e desempenho (Analytics e
                Speed Insights), necessárias para manter e melhorar a
                calculadora.
              </li>
              <li>
                <span className="font-medium text-stone-700">Consentimento:</span>{" "}
                para o armazenamento local do histórico de faturas, que só
                acontece quando você clica em "Salvar" — e pode ser apagado
                por você a qualquer momento.
              </li>
              <li>
                <span className="font-medium text-stone-700">
                  Legítimo interesse / execução da funcionalidade
                  solicitada:
                </span>{" "}
                para a sincronização de dados entre os seus próprios
                dispositivos, tratamento necessário apenas para viabilizar a
                funcionalidade que você mesmo aciona (pareamento por QR
                Code); os dados trafegam sempre cifrados.
              </li>
            </ul>
          </Secao>

          <Secao numero="4" titulo="Compartilhamento de dados" icon={Share2}>
            <p>
              O conteúdo do seu histórico nunca é compartilhado de forma
              legível — nem conosco, nem com terceiros. Para viabilizar a
              sincronização entre os seus próprios dispositivos, os dados
              cifrados (ilegíveis sem a sua chave) podem trafegar por
              servidores de retransmissão públicos da rede GunDB, mantidos
              pela comunidade open-source do projeto, não por nós. Não
              vendemos, alugamos nem compartilhamos dados com terceiros para
              fins de publicidade. Os únicos outros dados que trafegam para
              fora são as métricas técnicas agregadas processadas pela
              Vercel Inc., provedora de hospedagem do site, exclusivamente
              para fins de infraestrutura e análise de uso.
            </p>
          </Secao>

          <Secao numero="5" titulo="Transferência internacional" icon={Globe}>
            <p>
              A Vercel, provedora de hospedagem e das ferramentas de
              Analytics/Speed Insights, pode processar dados técnicos
              agregados em servidores localizados fora do Brasil (como
              Estados Unidos). Esse processamento segue as próprias políticas
              de privacidade e conformidade da Vercel.
            </p>
            <p>
              Os relays de sincronização GunDB (
              <span className="font-mono text-xs">
                gun-manhattan.herokuapp.com
              </span>
              ,{" "}
              <span className="font-mono text-xs">peer.wallie.io</span>) são
              uma segunda categoria de infraestrutura de terceiros, mantida
              pela comunidade open-source do GunDB, e também podem estar
              hospedados fora do Brasil. Apenas dados cifrados trafegam por
              eles.
            </p>
          </Secao>

          <Secao numero="6" titulo="Retenção dos dados" icon={Clock}>
            <p>
              O histórico salvo permanece no seu navegador até que você o
              exclua manualmente pela própria calculadora ou limpe os dados
              do site nas configurações do navegador — não temos como
              acessá-lo, retê-lo ou restaurá-lo. As métricas agregadas de
              Analytics/Speed Insights seguem o período de retenção padrão da
              Vercel.
            </p>
            <p>
              Por ser uma rede P2P descentralizada, cópias cifradas do seu
              histórico podem permanecer temporariamente em cache nos relays
              de sincronização mesmo após uma exclusão local, já que não há
              uma autoridade central capaz de garantir remoção imediata em
              todos os nós. Ainda assim, esse conteúdo permanece
              permanentemente ilegível sem a sua chave, já que sempre foi
              armazenado de forma cifrada.
            </p>
          </Secao>

          <Secao numero="7" titulo="Seus direitos" icon={UserCheck}>
            <p>Conforme a LGPD, você tem direito a:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Confirmar a existência de tratamento de dados;</li>
              <li>Acessar os dados tratados;</li>
              <li>Corrigir dados incompletos ou desatualizados;</li>
              <li>Solicitar a eliminação de dados;</li>
              <li>Revogar o consentimento a qualquer momento;</li>
              <li>Ser informado sobre com quem os dados são compartilhados.</li>
            </ul>
            <p>
              Você já exerce a maior parte desses direitos diretamente na
              calculadora (excluindo meses do histórico ou usando "Limpar
              tudo"). A exclusão propaga um marcador de remoção para os seus
              dispositivos sincronizados, mas por ser uma rede P2P
              descentralizada não é possível garantir remoção
              imediata/completa de eventuais cópias em cache nos relays — o
              conteúdo, porém, já era ilegível para terceiros desde sempre,
              pois sempre esteve cifrado. Para qualquer outra solicitação,
              inclusive relacionada às métricas agregadas, entre em contato
              pelo{" "}
              <a
                href="https://github.com/rbarros"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-700 hover:underline"
              >
                GitHub do autor
              </a>
              .
            </p>
          </Secao>

          <Secao numero="8" titulo="Segurança e menores de idade" icon={Lock}>
            <p>
              Como a calculadora não coleta dados pessoais identificáveis nem
              exige cadastro, o principal cuidado de segurança é técnico:
              todo o tráfego do site é feito via HTTPS, e a sincronização
              entre dispositivos usa criptografia de ponta a ponta (E2EE via
              SEA/GunDB) — os dados cifrados que trafegam pelos relays são
              ilegíveis sem a chave privada, mantida apenas no navegador do
              usuário. A ferramenta não é direcionada a crianças, mas também
              não coleta intencionalmente dados pessoais de nenhum
              visitante, independentemente da idade.
            </p>
          </Secao>
        </div>

        <LegalFooterNav atual="/politica-de-privacidade" />
      </div>
    </div>
  );
}
