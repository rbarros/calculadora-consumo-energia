import React from "react";
import {
  ScrollText,
  Info,
  AlertTriangle,
  Copyright,
  RefreshCw,
  Gavel,
  KeyRound,
  Radio,
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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <VoltarCalculadora />

        <div className="mt-6 mb-8">
          <div className="flex items-center gap-2 text-teal-700">
            <ScrollText size={18} strokeWidth={2.5} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Documento legal
            </span>
          </div>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl font-semibold text-stone-900">
            Termos de Uso
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Última atualização: 20 de agosto de 2026
          </p>
        </div>

        <div className="space-y-5">
          <Secao numero="1" titulo="Sobre a calculadora" icon={Info}>
            <p>
              A Calculadora de fatura de energia é uma ferramenta gratuita e
              de uso livre, criada para ajudar você a entender a composição
              da sua fatura de energia elétrica (TUSD, TE, bandeira
              tarifária, créditos de geração solar e IP-CIP) e a comparar o
              histórico de consumo mês a mês.
            </p>
            <p>
              Não é necessário criar conta, fazer login ou informar dados
              pessoais para usá-la. Ao acessar e usar esta calculadora, você
              concorda com estes Termos de Uso.
            </p>
            <p>
              Por padrão, seus dados ficam associados a uma identidade
              criptográfica gerada automaticamente neste navegador (sem
              e-mail, senha ou cadastro). A sincronização com outro
              dispositivo seu é opcional e só acontece se você usar o recurso
              "Sincronizar dispositivo" (QR Code).
            </p>
          </Secao>

          <Secao
            numero="2"
            titulo="Natureza informativa — não é um cálculo oficial"
            icon={AlertTriangle}
          >
            <p>
              Os valores exibidos são <strong>estimativas</strong>, calculadas
              a partir dos dados que você mesmo digita (kWh, tarifas,
              bandeira, créditos etc.). A calculadora não tem acesso ao
              sistema de faturamento de nenhuma distribuidora e não substitui
              a fatura oficial emitida pela sua concessionária de energia.
            </p>
            <p>
              O painel educativo sobre possíveis causas de aumento na fatura
              (reajuste tarifário, recomposição pós-enchentes, bandeira,
              consumo de inverno etc.) tem caráter informativo, com base em
              fontes públicas, e não constitui aconselhamento jurídico,
              financeiro ou técnico. Para contestar valores cobrados, reclamar
              de faturamento indevido ou tomar decisões financeiras, procure
              diretamente sua distribuidora, a ANEEL ou um profissional
              habilitado.
            </p>
          </Secao>

          <Secao
            numero="3"
            titulo="Como seus dados são armazenados e sincronizados"
            icon={KeyRound}
          >
            <p>
              O histórico de faturas que você salva é protegido por
              criptografia de ponta a ponta (E2EE): ele é cifrado no seu
              próprio navegador antes de ser armazenado, usando uma chave
              criptográfica gerada automaticamente e exclusiva sua. Os dados
              cifrados podem trafegar por servidores de retransmissão
              (relays) públicos da rede GunDB para permitir a sincronização
              entre os seus próprios dispositivos — mas sempre de forma
              cifrada: sem a sua chave, ninguém (incluindo os operadores
              desses relays e o autor desta calculadora) consegue ler o
              conteúdo.
            </p>
            <p>
              A sincronização entre dispositivos só ocorre quando você mesmo
              compartilha sua chave com outro dispositivo seu, pelo recurso
              "Sincronizar dispositivo" (QR Code). Essa chave equivale a uma
              senha: qualquer pessoa com acesso a ela pode ler e apagar seu
              histórico. Não compartilhe o QR Code ou o texto da chave com
              ninguém em quem você não confie.
            </p>
            <p>
              Não existe recuperação de conta: se você limpar os dados do
              navegador ou perder a chave sem antes ter sincronizado com
              outro dispositivo, o histórico associado a ela é perdido de
              forma permanente — não temos como restaurá-lo. Mais detalhes na
              nossa{" "}
              <a
                href="/politica-de-privacidade"
                className="font-medium text-teal-700 hover:underline"
              >
                Política de Privacidade
              </a>
              .
            </p>
          </Secao>

          <Secao
            numero="4"
            titulo="Infraestrutura de sincronização (relays de terceiros)"
            icon={Radio}
          >
            <p>
              A sincronização usa a rede pública GunDB, incluindo os relays{" "}
              <span className="font-mono text-xs">
                gun-manhattan.herokuapp.com
              </span>{" "}
              e{" "}
              <span className="font-mono text-xs">peer.wallie.io</span>,
              mantidos pela comunidade de código aberto do GunDB — não por
              nós. Não garantimos disponibilidade, desempenho ou
              continuidade desses serviços de terceiros, e não somos
              responsáveis por indisponibilidade, lentidão ou eventual
              descontinuação deles.
            </p>
          </Secao>

          <Secao
            numero="5"
            titulo="Propriedade intelectual e uso permitido"
            icon={Copyright}
          >
            <p>
              O código, os textos, o layout e o design da calculadora
              pertencem ao seu autor. Você pode usar a ferramenta livremente
              para fins pessoais e educativos, inclusive exportando e
              imprimindo os relatórios gerados a partir dos seus próprios
              dados.
            </p>
            <p>
              Não é permitido copiar, redistribuir ou reaproveitar o código e
              o conteúdo do site para fins comerciais sem autorização prévia.
            </p>
          </Secao>

          <Secao
            numero="6"
            titulo="Limitação de responsabilidade"
            icon={AlertTriangle}
          >
            <p>
              A calculadora é oferecida "como está", sem garantia de
              exatidão, disponibilidade contínua ou ausência de erros. Não
              nos responsabilizamos por decisões financeiras tomadas com base
              nos valores calculados, nem por eventuais indisponibilidades,
              falhas técnicas ou perda de dados salvos localmente no seu
              navegador.
            </p>
            <p>
              Também não nos responsabilizamos por perda de acesso ao
              histórico decorrente da perda da chave criptográfica, do
              compartilhamento indevido dessa chave pelo próprio usuário, ou
              da indisponibilidade de servidores de retransmissão de
              terceiros usados na sincronização.
            </p>
          </Secao>

          <Secao numero="7" titulo="Alterações destes termos" icon={RefreshCw}>
            <p>
              Podemos atualizar estes Termos de Uso a qualquer momento para
              refletir mudanças na calculadora ou na legislação aplicável. A
              data de "última atualização" no topo desta página sempre
              indicará a versão vigente.
            </p>
          </Secao>

          <Secao
            numero="8"
            titulo="Legislação aplicável e contato"
            icon={Gavel}
          >
            <p>
              Estes termos são regidos pela legislação brasileira. Dúvidas
              sobre estes Termos de Uso podem ser enviadas através do{" "}
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
        </div>

        <LegalFooterNav atual="/termos-de-uso" />
      </div>
    </div>
  );
}
