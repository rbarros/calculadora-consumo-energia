import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Sun,
  Zap,
  Lightbulb,
  Info,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Wrench,
  History,
  Save,
  Trash2,
  TrendingUp,
  TrendingDown,
  FileDown,
  Table2,
  Github,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import CookieBanner from "./CookieBanner.jsx";
import { useHistoricoConsumo } from "./useHistoricoConsumo.js";
import DevicePairingModal from "./DevicePairingModal.jsx";

const brl = (n) =>
  (isNaN(n) ? 0 : n).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const mesLabel = (yyyyMm) => {
  if (!yyyyMm) return "";
  const [y, m] = yyyyMm.split("-");
  const idx = parseInt(m, 10) - 1;
  return `${MESES[idx] || m}/${y}`;
};

// Gera os 13 meses fixos, do mês atual até o mesmo mês do ano anterior
// (ex: se hoje é julho/2026, retorna JUL/2026 até JUL/2025).
function gerarMesesFixos() {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth();
  const meses = [];
  for (let i = 0; i <= 12; i++) {
    const d = new Date(anoAtual, mesAtual - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    meses.push(`${y}-${m}`);
  }
  return meses;
}

// Formata uma sequência de dígitos puros em texto pt-BR (milhar com ponto,
// decimal com vírgula), a partir da quantidade de casas decimais desejada.
function formatDigits(rawDigits, decimals) {
  let digits = (rawDigits || "").replace(/\D/g, "");
  digits = digits.replace(/^0+(?=\d)/, "");
  if (digits === "") digits = "0";
  while (digits.length <= decimals) digits = "0" + digits;
  const intPart = decimals > 0 ? digits.slice(0, digits.length - decimals) : digits;
  const decPart = decimals > 0 ? digits.slice(digits.length - decimals) : "";
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decimals > 0 ? `${intFormatted},${decPart}` : intFormatted;
}

const digitsToNumber = (rawDigits, decimals) => {
  const digits = (rawDigits || "").replace(/\D/g, "") || "0";
  return parseInt(digits, 10) / Math.pow(10, decimals);
};

const numberToDigits = (value, decimals) => {
  const cents = Math.round((Number(value) || 0) * Math.pow(10, decimals));
  return String(Math.max(cents, 0));
};

// Campo com máscara "digitação da direita para a esquerda": cada dígito
// digitado empurra os anteriores, e a vírgula decimal é inserida
// automaticamente conforme o número de casas configurado.
function NumberField({ label, value, onChange, decimals = 2, suffix }) {
  const [raw, setRaw] = useState(() => numberToDigits(value, decimals));
  const inputRef = useRef(null);

  // Sincroniza quando o valor muda por fora (botão "Usar exemplo",
  // carregar mês do histórico etc.)
  useEffect(() => {
    setRaw(numberToDigits(value, decimals));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals]);

  // Mantém o cursor sempre no fim, garantindo a digitação da direita
  // para a esquerda mesmo após a reformatação do valor.
  useEffect(() => {
    if (inputRef.current) {
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  });

  const handleChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    setRaw(digitsOnly);
    onChange(digitsToNumber(digitsOnly, decimals));
  };

  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wide text-stone-500 font-medium">
        {label}
      </span>
      <div className="mt-1 flex items-center rounded-md border border-stone-300 bg-white focus-within:border-teal-700 focus-within:ring-1 focus-within:ring-teal-700 transition-colors">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={formatDigits(raw, decimals)}
          onChange={handleChange}
          className="w-full bg-transparent px-3 py-2 font-mono text-sm text-stone-800 outline-none text-right"
        />
        {suffix && (
          <span className="pr-3 text-xs text-stone-400 font-mono">{suffix}</span>
        )}
      </div>
    </label>
  );
}

function Row({ label, qty, unit, value, tone = "default", info }) {
  const [infoOpen, setInfoOpen] = useState(false);
  const toneClass =
    tone === "credit"
      ? "text-teal-700"
      : tone === "total"
      ? "text-stone-900 font-semibold"
      : "text-stone-700";
  return (
    <div className="py-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <div className={`flex items-center gap-1 ${toneClass}`}>
          {label}
          {qty != null && (
            <span className="ml-1 text-xs text-stone-400 font-mono">
              {qty} {unit}
            </span>
          )}
          {info && (
            <button
              onClick={() => setInfoOpen((v) => !v)}
              aria-label={`O que é: ${label}`}
              className={`shrink-0 ${
                infoOpen ? "text-teal-700" : "text-stone-300"
              } hover:text-teal-700 transition-colors`}
            >
              <Info size={12} />
            </button>
          )}
        </div>
        <div className={`font-mono tabular-nums ${toneClass}`}>
          {tone === "credit" && value !== 0 ? "− " : ""}
          {brl(Math.abs(value))}
        </div>
      </div>
      {info && infoOpen && (
        <p className="mt-1 rounded bg-stone-50 px-2 py-1.5 text-xs leading-relaxed text-stone-500">
          {info}
        </p>
      )}
    </div>
  );
}

const STATUS_STYLES = {
  confirmado: {
    icon: CheckCircle2,
    color: "text-teal-700",
    bg: "bg-teal-50",
    label: "Fator confirmado",
  },
  separado: {
    icon: Wrench,
    color: "text-sky-700",
    bg: "bg-sky-50",
    label: "Problema à parte",
  },
  parcial: {
    icon: AlertTriangle,
    color: "text-amber-700",
    bg: "bg-amber-50",
    label: "Contribui pouco",
  },
  duvidoso: {
    icon: HelpCircle,
    color: "text-stone-500",
    bg: "bg-stone-100",
    label: "Não confirmado",
  },
};

const APARELHOS = [
  {
    nome: "Chuveiro elétrico — modo verão",
    potenciaW: 4400,
    uso: "15 min/dia",
    kwhMes: 33,
  },
  {
    nome: "Chuveiro elétrico — modo inverno",
    potenciaW: 5500,
    uso: "15 min/dia",
    kwhMes: 41.3,
  },
  {
    nome: "Aquecedor elétrico portátil",
    potenciaW: 1500,
    uso: "2h/dia (noites frias)",
    kwhMes: 90,
  },
  {
    nome: "Secadora de roupas",
    potenciaW: 2000,
    uso: "1 ciclo/dia",
    kwhMes: 90,
  },
  {
    nome: "Ar-condicionado (9.000 BTU)",
    potenciaW: 1200,
    uso: "6h/dia (verão)",
    kwhMes: 216,
  },
  {
    nome: "Televisão",
    potenciaW: 120,
    uso: "5h/dia",
    kwhMes: 20,
  },
  {
    nome: "Iluminação (5 lâmpadas LED)",
    potenciaW: 50,
    uso: "5h/dia",
    kwhMes: 7.5,
  },
];

const FATORES = [
  {
    id: "reajuste",
    titulo: "Reajuste de 14,98%",
    status: "confirmado",
    texto:
      'A ANEEL aprovou reajuste médio de 14,97% para consumidores residenciais da RGE (a distribuidora divulgou como "14,98%"), em vigor desde 19/06/2026. A própria empresa reconhece que esse percentual sozinho não explica aumentos de 200% a 300% relatados por clientes.',
  },
  {
    id: "enchentes",
    titulo: "Recomposição pós-enchentes",
    status: "confirmado",
    texto:
      "Em 2025, a ANEEL diferiu parte do reajuste da RGE por causa das enchentes de maio/2024 no RS, para não pesar sobre a população naquele momento. Agora esse valor está sendo recomposto em parcelas (30% neste ciclo, com mais devolução prevista para 2027), empurrando a tarifa para cima.",
  },
  {
    id: "sistema",
    titulo: "Troca do sistema de faturamento da RGE",
    status: "separado",
    texto:
      "Em julho/2026 a RGE migrou de plataforma de atendimento e faturamento, deslocando datas de leitura de 740 mil clientes (23% da base). Isso não explica valores mais altos — é um problema à parte: a fatura de agosto não foi emitida para esse grupo e está sendo parcelada em 6x entre out/2026 e mar/2027.",
  },
  {
    id: "inverno",
    titulo: "Consumo relacionado ao inverno",
    status: "parcial",
    texto:
      'O chuveiro elétrico no modo "inverno" pode consumir até 30% a mais. A RGE cita esse fator, mas vários consumidores comprovaram consumo em kWh praticamente estável enquanto o valor da fatura triplicava — insuficiente para explicar os casos mais extremos.',
  },
  {
    id: "bandeira",
    titulo: "Bandeira tarifária",
    status: "parcial",
    texto:
      "A bandeira está amarela desde maio/2026 (mantida em junho, julho e agosto), somando R$ 1,885 a cada 100 kWh consumidos. É um custo real, mas pequeno perto dos aumentos relatados.",
  },
  {
    id: "programassociais",
    titulo: "Programas Sociais",
    status: "duvidoso",
    texto:
      "Dois programas reais integram a CDE (Conta de Desenvolvimento Energético) e são pagos por todos os consumidores via rateio: (1) Tarifa Social / Desconto Social (Lei 15.235/2025) — isenta famílias de baixa renda cadastradas no CadÚnico da cobrança da CDE em até 120 kWh/mês, podendo zerar a fatura até 80 kWh; (2) Luz para Todos — programa federal mais antigo, voltado à universalização do acesso à energia elétrica em áreas rurais. Os dois têm efeito real no orçamento da CDE, mas o impacto é indireto e pequeno no reajuste geral — sem relação direta e específica com o caso da RGE.",
  },
];

function FatorItem({ fator, isOpen, onToggle }) {
  const s = STATUS_STYLES[fator.status];
  const Icon = s.icon;
  return (
    <div className="border border-stone-200 rounded-md overflow-hidden bg-white">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`shrink-0 rounded-full p-1 ${s.bg}`}>
            <Icon size={14} className={s.color} />
          </span>
          <span className="text-sm font-medium text-stone-800 truncate">
            {fator.titulo}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`hidden sm:inline text-[10px] uppercase tracking-wide font-semibold ${s.color}`}>
            {s.label}
          </span>
          <ChevronDown
            size={16}
            className={`text-stone-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-0">
          <span className={`sm:hidden inline-block mb-2 text-[10px] uppercase tracking-wide font-semibold ${s.color}`}>
            {s.label}
          </span>
          <p className="text-sm text-stone-600 leading-relaxed">{fator.texto}</p>
        </div>
      )}
    </div>
  );
}

function FaturaExemplo({ linhas, nota }) {
  return (
    <div className="mb-4 rounded-md border border-teal-100 bg-teal-50 p-3">
      <p className="text-xs text-teal-800 mb-2">
        Esses dados aparecem na tabela "Descrição da operação" da sua
        fatura RGE/CPFL:
      </p>
      <div className="overflow-x-auto rounded border border-teal-200 bg-white">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-teal-100 text-teal-900 text-left">
              <th className="px-2 py-1 font-medium">Descrição da operação</th>
              <th className="px-2 py-1 font-medium text-right">
                Quant. Faturada
              </th>
              <th className="px-2 py-1 font-medium text-right">
                Tarifa c/ tributos R$
              </th>
            </tr>
          </thead>
          <tbody className="font-mono text-stone-700">
            {linhas.map((l) => (
              <tr key={l.desc} className="border-t border-teal-100">
                <td className="px-2 py-1 font-sans">{l.desc}</td>
                <td className="px-2 py-1 text-right">{l.qtd}</td>
                <td className="px-2 py-1 text-right">{l.tarifa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {nota && <p className="text-[10px] text-teal-700 mt-1.5">{nota}</p>}
    </div>
  );
}

const NIVEL_STYLES = {
  critico: { color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
  atencao: { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  info: { color: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
};

const pctVar = (atual, anterior) => {
  if (!anterior) return 0;
  if (anterior === 0) return atual === 0 ? 0 : 100;
  return ((atual - anterior) / anterior) * 100;
};

// Compara um mês salvo com o mês anterior e aponta divergências que
// merecem atenção do usuário: leitura, tarifa, bandeira ou valor total
// fora do padrão esperado.
function analisarVariacao(atual, anterior) {
  if (!anterior) return [];
  const alertas = [];

  const varConsumo = pctVar(atual.kwhTUSD, anterior.kwhTUSD);
  const varTotal = pctVar(atual.totalPagar, anterior.totalPagar);
  const varTarifaTUSD = pctVar(atual.tarifaTUSD, anterior.tarifaTUSD);
  const varTarifaTE = pctVar(atual.tarifaTE, anterior.tarifaTE);
  const varBandeira = pctVar(atual.bandeira, anterior.bandeira);
  const varIpcip = pctVar(atual.ipcip, anterior.ipcip);

  if (varTotal - varConsumo > 50) {
    alertas.push({
      nivel: "critico",
      titulo: "Valor da fatura desproporcional ao consumo",
      mensagem: `A fatura subiu ${varTotal.toFixed(0)}%, bem mais que o consumo registrado (${varConsumo.toFixed(
        0
      )}%). Essa diferença não é explicada só pelo uso — vale contestar com a distribuidora.`,
    });
  } else if (varTotal > 50 && Math.abs(varConsumo) < 10) {
    alertas.push({
      nivel: "critico",
      titulo: "Fatura subiu com consumo estável",
      mensagem: `O valor total subiu ${varTotal.toFixed(
        0
      )}% enquanto o consumo ficou praticamente igual ao mês anterior. Pode indicar erro de leitura, tarifa ou faturamento.`,
    });
  }

  if (Math.abs(varConsumo) > 40) {
    alertas.push({
      nivel: "atencao",
      titulo: "Leitura com salto brusco",
      mensagem: `O consumo (kWh) ${
        varConsumo > 0 ? "subiu" : "caiu"
      } ${Math.abs(varConsumo).toFixed(0)}% em relação ao mês anterior. Vale conferir a leitura do medidor na fatura.`,
    });
  }

  if (Math.max(Math.abs(varTarifaTUSD), Math.abs(varTarifaTE)) > 15) {
    alertas.push({
      nivel: "atencao",
      titulo: "Mudança relevante na tarifa",
      mensagem:
        "A tarifa (TUSD ou TE) variou mais de 15% — pode ser um reajuste tarifário anual. Confira se a tarifa informada bate com a atual na fatura.",
    });
  }

  if (varBandeira > 50 && atual.bandeira > anterior.bandeira) {
    alertas.push({
      nivel: "atencao",
      titulo: "Adicional de bandeira maior",
      mensagem:
        "O valor do adicional de bandeira tarifária aumentou bastante — verifique se a cor da bandeira mudou (amarela/vermelha) na fatura.",
    });
  }

  if (Math.abs(varIpcip) > 30) {
    alertas.push({
      nivel: "info",
      titulo: "IP-CIP fora do padrão",
      mensagem:
        "A Contribuição de Iluminação Pública variou mais que o esperado em relação ao mês anterior — confira o valor exato na fatura.",
    });
  }

  return alertas;
}

export default function CalculadoraFatura() {
  const [kwhTUSD, setKwhTUSD] = useState(130);
  const [tarifaTUSD, setTarifaTUSD] = useState(0.662);
  const [kwhTE, setKwhTE] = useState(130);
  const [tarifaTE, setTarifaTE] = useState(0.3892);
  const [bandeira, setBandeira] = useState(3.13);

  const [temSolar, setTemSolar] = useState(true);
  const [kwhInjTUSD, setKwhInjTUSD] = useState(100);
  const [tarifaInjTUSD, setTarifaInjTUSD] = useState(0.3561);
  const [kwhInjTE, setKwhInjTE] = useState(100);
  const [tarifaInjTE, setTarifaInjTE] = useState(0.3893);
  const [creditoBandeira, setCreditoBandeira] = useState(2.42);

  const [ipcip, setIpcip] = useState(9.42);

  const [mesReferencia, setMesReferencia] = useState("2026-06");
  const [openFator, setOpenFator] = useState("reajuste");
  const [ajudaConsumo, setAjudaConsumo] = useState(false);
  const [ajudaSolar, setAjudaSolar] = useState(false);
  const [expandedAlerta, setExpandedAlerta] = useState(null);

  // Importar histórico manualmente (tabela de meses fixos)
  const [mesesFixos] = useState(() => gerarMesesFixos());
  const [importValues, setImportValues] = useState({});
  const [importValuesInjetada, setImportValuesInjetada] = useState({});
  const [importSaving, setImportSaving] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  const [importExpanded, setImportExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  // Histórico — sincronizado via GunDB (P2P + E2EE), ver useHistoricoConsumo.js
  const {
    historico,
    loadingHist,
    histError,
    saving,
    saveMsg,
    salvarMes: salvarMesGun,
    excluirMes: excluirMesGun,
    limparHistorico,
  } = useHistoricoConsumo();
  const [showPairing, setShowPairing] = useState(false);
  const [confirmandoLimpeza, setConfirmandoLimpeza] = useState(false);

  const calc = useMemo(() => {
    const debitoTUSD = kwhTUSD * tarifaTUSD;
    const debitoTE = kwhTE * tarifaTE;
    const debitos = debitoTUSD + debitoTE + bandeira;

    const creditoTUSD = temSolar ? kwhInjTUSD * tarifaInjTUSD : 0;
    const creditoTE = temSolar ? kwhInjTE * tarifaInjTE : 0;
    const creditoBand = temSolar ? creditoBandeira : 0;
    const creditos = creditoTUSD + creditoTE + creditoBand;

    const totalDistribuidora = debitos - creditos;
    const totalPagar = totalDistribuidora + ipcip;

    const precoMedioBruto = kwhTUSD > 0 ? (debitoTUSD + debitoTE) / kwhTUSD : 0;
    const consumoLiquidoKwh = kwhTUSD - (temSolar ? kwhInjTUSD : 0);
    const precoMedioLiquido =
      consumoLiquidoKwh > 0 ? totalDistribuidora / consumoLiquidoKwh : 0;

    return {
      debitoTUSD,
      debitoTE,
      debitos,
      creditoTUSD,
      creditoTE,
      creditoBand,
      creditos,
      totalDistribuidora,
      totalPagar,
      precoMedioBruto,
      consumoLiquidoKwh,
      precoMedioLiquido,
    };
  }, [
    kwhTUSD,
    tarifaTUSD,
    kwhTE,
    tarifaTE,
    bandeira,
    temSolar,
    kwhInjTUSD,
    tarifaInjTUSD,
    kwhInjTE,
    tarifaInjTE,
    creditoBandeira,
    ipcip,
  ]);

  const loadExample = () => {
    setKwhTUSD(130);
    setTarifaTUSD(0.662);
    setKwhTE(130);
    setTarifaTE(0.3892);
    setBandeira(3.13);
    setTemSolar(true);
    setKwhInjTUSD(100);
    setTarifaInjTUSD(0.3561);
    setKwhInjTE(100);
    setTarifaInjTE(0.3893);
    setCreditoBandeira(2.42);
    setIpcip(9.42);
    setMesReferencia("2026-06");
  };

  const salvarMes = async () => {
    if (!mesReferencia) return;
    const registro = {
      mes: mesReferencia,
      kwhTUSD,
      tarifaTUSD,
      kwhTE,
      tarifaTE,
      bandeira,
      temSolar,
      kwhInjTUSD,
      tarifaInjTUSD,
      kwhInjTE,
      tarifaInjTE,
      creditoBandeira,
      ipcip,
      totalPagar: calc.totalPagar,
      consumoLiquidoKwh: calc.consumoLiquidoKwh,
      salvoEm: new Date().toISOString(),
    };
    // Erros já são exibidos via saveMsg dentro do hook — aqui só evitamos
    // uma rejeição de promise não tratada.
    await salvarMesGun(registro).catch(() => {});
  };

  const carregarMes = (registro) => {
    setKwhTUSD(registro.kwhTUSD);
    setTarifaTUSD(registro.tarifaTUSD);
    setKwhTE(registro.kwhTE);
    setTarifaTE(registro.tarifaTE);
    setBandeira(registro.bandeira);
    setTemSolar(registro.temSolar);
    setKwhInjTUSD(registro.kwhInjTUSD);
    setTarifaInjTUSD(registro.tarifaInjTUSD);
    setKwhInjTE(registro.kwhInjTE);
    setTarifaInjTE(registro.tarifaInjTE);
    setCreditoBandeira(registro.creditoBandeira);
    setIpcip(registro.ipcip);
    setMesReferencia(registro.mes);
  };

  const excluirMes = async (mes) => {
    await excluirMesGun(mes);
  };

  const handleImportChange = (mes, valor) => {
    const digitsOnly = valor.replace(/\D/g, "");
    setImportValues((prev) => ({ ...prev, [mes]: digitsOnly }));
  };

  const handleImportInjetadaChange = (mes, valor) => {
    const digitsOnly = valor.replace(/\D/g, "");
    setImportValuesInjetada((prev) => ({ ...prev, [mes]: digitsOnly }));
  };

  // Monta um registro de histórico a partir do kWh consumido e do kWh
  // injetado digitados para o mês. Tarifas e adicionais de bandeira usam
  // os valores atualmente preenchidos no formulário como aproximação (a
  // tabela de consumo faturado da fatura não traz tarifas por mês).
  const construirRegistroImportado = (kwh, kwhInjecao, mesStr) => {
    const debitoTUSD = kwh * tarifaTUSD;
    const debitoTE = kwh * tarifaTE;
    const debitos = debitoTUSD + debitoTE + bandeira;
    const temInjecao = kwhInjecao > 0;
    const creditoTUSD = temInjecao ? kwhInjecao * tarifaInjTUSD : 0;
    const creditoTE = temInjecao ? kwhInjecao * tarifaInjTE : 0;
    const creditoBand = temInjecao ? creditoBandeira : 0;
    const creditos = creditoTUSD + creditoTE + creditoBand;
    const totalDistribuidora = debitos - creditos;
    const totalPagar = totalDistribuidora + ipcip;
    const consumoLiquidoKwh = kwh - kwhInjecao;
    return {
      mes: mesStr,
      kwhTUSD: kwh,
      tarifaTUSD,
      kwhTE: kwh,
      tarifaTE,
      bandeira,
      temSolar: temInjecao,
      kwhInjTUSD: kwhInjecao,
      tarifaInjTUSD,
      kwhInjTE: kwhInjecao,
      tarifaInjTE,
      creditoBandeira,
      ipcip,
      totalPagar,
      consumoLiquidoKwh,
      salvoEm: new Date().toISOString(),
      importado: true,
    };
  };

  const confirmarImportacao = async () => {
    const preenchidos = Object.entries(importValues)
      .filter(([, v]) => v && v.trim() !== "")
      .map(([mes, v]) => ({
        mes,
        kwh: parseInt(v, 10),
        kwhInjecao: importValuesInjetada[mes]
          ? parseInt(importValuesInjetada[mes], 10)
          : 0,
      }))
      .filter((r) => !isNaN(r.kwh));
    if (preenchidos.length === 0) return;
    setImportSaving(true);
    setImportMsg("");

    const novosRegistros = preenchidos.map((r) =>
      construirRegistroImportado(r.kwh, r.kwhInjecao || 0, r.mes)
    );

    // Gun não tem transação multi-chave: cada mês importado vira um
    // .put() independente. Reporta falhas parciais em vez de assumir
    // tudo-ou-nada.
    const resultados = await Promise.allSettled(
      novosRegistros.map((registro) => salvarMesGun(registro))
    );
    const falhas = resultados.filter((r) => r.status === "rejected").length;

    setImportValues({});
    setImportValuesInjetada({});
    setImportSaving(false);
    setImportMsg(
      falhas === 0
        ? `${novosRegistros.length} meses importados com sucesso.`
        : `${novosRegistros.length - falhas} de ${novosRegistros.length} meses importados (${falhas} falharam ao sincronizar).`
    );
    setTimeout(() => setImportMsg(""), 5000);
  };

  const historicoOrdenado = [...historico].sort((a, b) => a.mes.localeCompare(b.mes));
  const chartData = historicoOrdenado.map((h) => ({
    mes: mesLabel(h.mes).slice(0, 3),
    total: Number((Number(h.totalPagar) || 0).toFixed(2)),
  }));

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
      <style>{`
        @media print {
          @page { margin: 1.5cm; }
        }
      `}</style>
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12 print:hidden">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-teal-700">
            <Zap size={18} strokeWidth={2.5} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Calculadora de fatura
            </span>
          </div>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl font-semibold text-stone-900">
            Quanto custa cada kWh?
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Informe o consumo e as tarifas da sua fatura — os campos já vêm
            preenchidos com um exemplo real de junho/2026. O histórico salvo
            é privado: só você tem acesso a ele. Nenhuma informação pessoal
            é coletada — esta calculadora foi desenvolvida para ajudar você
            a entender melhor a sua fatura de energia.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={loadExample}
              className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:border-teal-700 hover:text-teal-700 transition-colors"
            >
              Usar exemplo
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-1.5 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:border-teal-700 hover:text-teal-700 transition-colors"
            >
              <FileDown size={13} />
              Exportar PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* FORM */}
          <div className="lg:col-span-3 space-y-5">
            {/* Mês de referência */}
            <section className="rounded-lg border border-stone-200 bg-white p-5">
              <span className="text-[11px] uppercase tracking-wide text-stone-500 font-medium">
                Mês de referência da fatura
              </span>
              <input
                type="month"
                value={mesReferencia}
                onChange={(e) => setMesReferencia(e.target.value)}
                className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 font-mono text-sm text-stone-800 outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
              />
            </section>

            {/* Consumo */}
            <section className="rounded-lg border border-stone-200 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb size={15} className="text-amber-600" />
                  <h2 className="font-serif text-base font-semibold">
                    Consumo faturado
                  </h2>
                </div>
                <button
                  onClick={() => setAjudaConsumo((v) => !v)}
                  aria-label="Onde encontrar esses dados na fatura"
                  className={`shrink-0 rounded-full p-1 transition-colors ${
                    ajudaConsumo
                      ? "bg-teal-100 text-teal-700"
                      : "text-stone-400 hover:bg-stone-100 hover:text-teal-700"
                  }`}
                >
                  <Info size={16} />
                </button>
              </div>

              {ajudaConsumo && (
                <FaturaExemplo
                  linhas={[
                    { desc: "Consumo Uso Sistema [kWh]-TUSD", qtd: "130,0000", tarifa: "0,66200000" },
                    { desc: "Consumo - TE", qtd: "130,0000", tarifa: "0,38923077" },
                    { desc: "Adicional de Bandeira Amarela", qtd: "—", tarifa: "3,13*" },
                  ]}
                  nota='*O adicional de bandeira aparece direto na coluna "Valor total da operação R$", sem tarifa unitária — use o valor total mesmo.'
                />
              )}

              <div className="grid grid-cols-2 gap-3">
                <NumberField
                  label="kWh consumidos (TUSD)"
                  value={kwhTUSD}
                  onChange={setKwhTUSD}
                  decimals={0}
                  suffix="kWh"
                />
                <NumberField
                  label="Tarifa TUSD c/ tributos"
                  value={tarifaTUSD}
                  onChange={setTarifaTUSD}
                  decimals={4}
                  suffix="R$/kWh"
                />
                <NumberField
                  label="kWh consumidos (TE)"
                  value={kwhTE}
                  onChange={setKwhTE}
                  decimals={0}
                  suffix="kWh"
                />
                <NumberField
                  label="Tarifa TE c/ tributos"
                  value={tarifaTE}
                  onChange={setTarifaTE}
                  decimals={4}
                  suffix="R$/kWh"
                />
                <div className="col-span-2">
                  <NumberField
                    label="Adicional de bandeira tarifária"
                    value={bandeira}
                    onChange={setBandeira}
                    decimals={2}
                    suffix="R$"
                  />
                </div>
              </div>
            </section>

            {/* Solar toggle */}
            <section className="rounded-lg border border-stone-200 bg-white p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Sun size={15} className="text-amber-600" />
                  <h2 className="font-serif text-base font-semibold">
                    Energia injetada (geração solar)
                  </h2>
                  <button
                    onClick={() => setAjudaSolar((v) => !v)}
                    aria-label="Onde encontrar esses dados na fatura"
                    className={`shrink-0 rounded-full p-1 transition-colors ${
                      ajudaSolar
                        ? "bg-teal-100 text-teal-700"
                        : "text-stone-400 hover:bg-stone-100 hover:text-teal-700"
                    }`}
                  >
                    <Info size={16} />
                  </button>
                </div>
                <button
                  role="switch"
                  aria-checked={temSolar}
                  onClick={() => setTemSolar((v) => !v)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    temSolar ? "bg-teal-700" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      temSolar ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-stone-500 mb-4">
                Ative se sua unidade possui geração própria (ex: painéis
                solares) que injeta energia na rede, gerando créditos.
              </p>

              {ajudaSolar && (
                <FaturaExemplo
                  linhas={[
                    { desc: "Energia Ativa Injetada TUSD", qtd: "100,0000", tarifa: "0,35610000" },
                    { desc: "Energia Ativa Injetada TE", qtd: "100,0000", tarifa: "0,38930000" },
                    { desc: "Cred Adc Band Amarela", qtd: "—", tarifa: "2,42*" },
                  ]}
                  nota="*Essas linhas aparecem com sinal negativo (−) na fatura, indicando desconto. Informe os valores positivos aqui — o desconto é aplicado automaticamente pela calculadora."
                />
              )}

              {temSolar && (
                <div className="grid grid-cols-2 gap-3">
                  <NumberField
                    label="kWh injetados (TUSD)"
                    value={kwhInjTUSD}
                    onChange={setKwhInjTUSD}
                    decimals={0}
                    suffix="kWh"
                  />
                  <NumberField
                    label="Tarifa injetada TUSD"
                    value={tarifaInjTUSD}
                    onChange={setTarifaInjTUSD}
                    decimals={4}
                    suffix="R$/kWh"
                  />
                  <NumberField
                    label="kWh injetados (TE)"
                    value={kwhInjTE}
                    onChange={setKwhInjTE}
                    decimals={0}
                    suffix="kWh"
                  />
                  <NumberField
                    label="Tarifa injetada TE"
                    value={tarifaInjTE}
                    onChange={setTarifaInjTE}
                    decimals={4}
                    suffix="R$/kWh"
                  />
                  <div className="col-span-2">
                    <NumberField
                      label="Crédito adicional de bandeira"
                      value={creditoBandeira}
                      onChange={setCreditoBandeira}
                      decimals={2}
                      suffix="R$"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Outros serviços */}
            <section className="rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="font-serif text-base font-semibold mb-4">
                Outros serviços
              </h2>
              <NumberField
                label="Contribuição de Custeio IP-CIP (iluminação pública)"
                value={ipcip}
                onChange={setIpcip}
                decimals={2}
                suffix="R$"
              />
            </section>
          </div>

          {/* RECEIPT */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-6 rounded-lg border border-stone-200 bg-white overflow-hidden">
              <div className="bg-stone-900 px-5 py-4">
                <span className="text-[11px] uppercase tracking-widest text-stone-400">
                  Resultado do cálculo
                </span>
                <div className="mt-1 font-mono text-2xl text-amber-400 font-semibold tabular-nums">
                  {brl(calc.totalPagar)}
                </div>
              </div>

              <div className="px-5 py-4">
                <div className="text-[11px] uppercase tracking-wide text-stone-400 font-medium mb-1">
                  Débitos por consumo
                </div>
                <Row
                  label="Consumo TUSD"
                  qty={kwhTUSD}
                  unit="kWh"
                  value={calc.debitoTUSD}
                  info="TUSD é a Tarifa de Uso do Sistema de Distribuição: cobre o custo de transportar a energia pelos fios, postes e transformadores até sua casa — é a parte que remunera a distribuidora (RGE/CPFL) pela infraestrutura."
                />
                <Row
                  label="Consumo TE"
                  qty={kwhTE}
                  unit="kWh"
                  value={calc.debitoTE}
                  info="TE é a Tarifa de Energia: cobre o custo da energia elétrica em si — a parte que remunera quem gera a energia (usinas), repassada pela distribuidora."
                />
                <Row
                  label="Adicional de bandeira"
                  value={bandeira}
                  info="Cobrança extra definida pela ANEEL conforme a condição dos reservatórios/custo de geração no país. Bandeira verde não cobra adicional; amarela e vermelha (patamares 1 e 2) somam um valor por cada 100 kWh consumidos."
                />
                <div className="border-t border-dashed border-stone-200 my-2" />
                <Row label="Subtotal débitos" value={calc.debitos} tone="total" />

                {temSolar && (
                  <>
                    <div className="text-[11px] uppercase tracking-wide text-stone-400 font-medium mt-4 mb-1">
                      Créditos de energia injetada
                    </div>
                    <Row
                      label="Injetada TUSD"
                      qty={kwhInjTUSD}
                      unit="kWh"
                      value={calc.creditoTUSD}
                      tone="credit"
                      info="Desconto na parte de TUSD referente à energia que sua geração própria (ex: painéis solares) devolveu para a rede elétrica — parte do sistema de compensação de energia (net metering)."
                    />
                    <Row
                      label="Injetada TE"
                      qty={kwhInjTE}
                      unit="kWh"
                      value={calc.creditoTE}
                      tone="credit"
                      info="Desconto na parte de TE referente à energia injetada na rede pela sua geração própria, abatendo o custo da energia que você teria pago à distribuidora."
                    />
                    <Row
                      label="Créd. adicional de bandeira"
                      value={calc.creditoBand}
                      tone="credit"
                      info="Assim como o consumo paga o adicional de bandeira, a energia que você injeta na rede também gera um crédito proporcional sobre esse adicional."
                    />
                    <div className="border-t border-dashed border-stone-200 my-2" />
                    <Row label="Subtotal créditos" value={calc.creditos} tone="credit" />
                  </>
                )}

                <div className="border-t border-stone-300 my-3" />
                <Row label="Total Distribuidora" value={calc.totalDistribuidora} tone="total" />
                <Row
                  label="Contribuição IP-CIP"
                  value={ipcip}
                  info="Contribuição de Custeio da Iluminação Pública: taxa municipal cobrada na fatura de energia para custear a iluminação das ruas da cidade — não é cobrada pela distribuidora, e sim repassada à prefeitura."
                />

                <div className="border-t-2 border-stone-900 mt-3 pt-3 flex items-baseline justify-between">
                  <span className="font-serif font-semibold text-stone-900">
                    Total a pagar
                  </span>
                  <span className="font-mono text-lg font-bold tabular-nums text-stone-900">
                    {brl(calc.totalPagar)}
                  </span>
                </div>
              </div>

              <div className="bg-teal-50 border-t border-teal-100 px-5 py-4 space-y-2">
                <div className="flex items-start gap-2 text-xs text-teal-800">
                  <Info size={14} className="mt-0.5 shrink-0" />
                  <div>
                    <div className="flex justify-between">
                      <span>Preço bruto por kWh (sem créditos)</span>
                      <span className="font-mono tabular-nums">
                        {brl(calc.precoMedioBruto)}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>
                        Preço líquido por kWh ({calc.consumoLiquidoKwh} kWh
                        efetivos)
                      </span>
                      <span className="font-mono tabular-nums">
                        {brl(calc.precoMedioLiquido)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salvar no histórico */}
              <div className="border-t border-stone-200 px-5 py-4">
                <button
                  onClick={salvarMes}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-teal-700 text-white text-sm font-medium py-2.5 hover:bg-teal-800 transition-colors disabled:opacity-60"
                >
                  <Save size={15} />
                  {saving ? "Salvando..." : `Salvar ${mesLabel(mesReferencia) || "mês"} no histórico`}
                </button>
                {saveMsg && (
                  <p className="text-xs text-center mt-2 text-stone-500">{saveMsg}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* HISTÓRICO MENSAL */}
        <section className="mt-6 rounded-lg border border-stone-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <History size={16} className="text-teal-700" />
              <h2 className="font-serif text-lg font-semibold">Histórico mensal</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPairing(true)}
                className="flex items-center gap-1.5 rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:border-teal-700 hover:text-teal-700 transition-colors"
              >
                <Smartphone size={13} />
                Sincronizar dispositivo
              </button>
              {historico.length > 0 && (
                <button
                  onClick={() => setConfirmandoLimpeza(true)}
                  className="flex items-center gap-1.5 rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:border-rose-600 hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={13} />
                  Limpar tudo
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-stone-500 mb-1">
            Comparar o histórico de consumo é a principal forma de identificar
            se um aumento vem do consumo real ou de outros fatores — é a
            própria orientação que as distribuidoras dão aos clientes.
          </p>
          <p className="flex items-start gap-1.5 text-xs text-stone-400 mb-4">
            <ShieldCheck size={13} className="mt-0.5 shrink-0" />
            Seu histórico é criptografado de ponta a ponta e fica vinculado a
            este dispositivo/navegador. Use "Sincronizar dispositivo" antes de
            trocar de navegador ou limpar os dados do site — sem isso, não há
            como recuperar o histórico.
          </p>

          {confirmandoLimpeza && (
            <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 p-3">
              <p className="text-xs text-rose-800 mb-2">
                Isso apaga todos os meses salvos em todos os dispositivos
                sincronizados. Essa ação não pode ser desfeita. Confirmar?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    limparHistorico();
                    setConfirmandoLimpeza(false);
                  }}
                  className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 transition-colors"
                >
                  Apagar tudo
                </button>
                <button
                  onClick={() => setConfirmandoLimpeza(false)}
                  className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Importar histórico manualmente */}
          <div className="mb-5 rounded-md border border-dashed border-stone-300 p-3">
            <button
              onClick={() => setImportExpanded((v) => !v)}
              className="w-full flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <Table2 size={15} className="text-teal-700" />
                <span className="text-sm font-medium text-stone-700">
                  Importar histórico manualmente
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`text-stone-400 transition-transform ${
                  importExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {importExpanded && (
              <>
                <p className="text-xs text-stone-500 mt-2 mb-3">
                  Preencha o consumo (kWh) dos meses que você tem em mãos —
                  os demais podem ficar em branco. Se tiver geração solar,
                  informe também a energia injetada do mês (opcional). As
                  tarifas usadas são as que estão preenchidas no formulário
                  acima; ajuste cada mês depois, se precisar de mais
                  precisão.
                </p>

                <div className="overflow-x-auto rounded border border-stone-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-stone-50 text-left text-[11px] uppercase text-stone-500">
                        <th className="px-3 py-2 font-medium">Mês</th>
                        <th className="px-3 py-2 font-medium text-right">
                          Consumo/kWh
                        </th>
                        <th className="px-3 py-2 font-medium text-right">
                          Energia Injetada
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mesesFixos.map((mes) => {
                        const jaExiste = historico.some((h) => h.mes === mes);
                        return (
                          <tr key={mes} className="border-t border-stone-100">
                            <td className="px-3 py-1.5 text-stone-700">
                              {mesLabel(mes)}
                              {jaExiste && (
                                <span className="ml-1.5 text-[10px] text-amber-600">
                                  (já salvo)
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-1.5 text-right">
                              <input
                                type="text"
                                inputMode="numeric"
                                placeholder="—"
                                value={importValues[mes] || ""}
                                onChange={(e) => handleImportChange(mes, e.target.value)}
                                className="w-20 text-right rounded border border-stone-300 bg-white px-2 py-1 font-mono text-sm outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                              />
                            </td>
                            <td className="px-3 py-1.5 text-right">
                              <input
                                type="text"
                                inputMode="numeric"
                                placeholder="—"
                                value={importValuesInjetada[mes] || ""}
                                onChange={(e) =>
                                  handleImportInjetadaChange(mes, e.target.value)
                                }
                                className="w-20 text-right rounded border border-stone-300 bg-white px-2 py-1 font-mono text-sm outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={confirmarImportacao}
                  disabled={
                    importSaving ||
                    Object.values(importValues).every((v) => !v || v.trim() === "")
                  }
                  className="mt-3 flex items-center gap-1.5 rounded-md bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-60"
                >
                  <Save size={13} />
                  {importSaving ? "Importando..." : "Importar meses preenchidos"}
                </button>

                {importMsg && (
                  <p className="text-xs text-stone-500 mt-2">{importMsg}</p>
                )}
              </>
            )}
          </div>

          {loadingHist ? (
            <p className="text-sm text-stone-400">Carregando histórico...</p>
          ) : historico.length === 0 ? (
            <p className="text-sm text-stone-400">
              Nenhum mês salvo ainda. Preencha os dados acima e clique em
              "Salvar no histórico".
            </p>
          ) : (
            <>
              {chartData.length >= 2 && (
                <div className="h-40 mb-4 -ml-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                      <XAxis
                        dataKey="mes"
                        tick={{ fontSize: 11, fill: "#78716c" }}
                        axisLine={{ stroke: "#e7e5e4" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#78716c" }}
                        axisLine={false}
                        tickLine={false}
                        width={44}
                        tickFormatter={(v) => `R$${v}`}
                      />
                      <Tooltip
                        formatter={(v) => brl(v)}
                        contentStyle={{ fontSize: 12, borderRadius: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#0f766e"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#0f766e" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="space-y-2">
                {[...historicoOrdenado].reverse().map((h, idxRev) => {
                  const idx = historicoOrdenado.length - 1 - idxRev;
                  const anterior = historicoOrdenado[idx - 1];
                  const variacao = anterior
                    ? ((h.totalPagar - anterior.totalPagar) / anterior.totalPagar) * 100
                    : null;
                  const alertas = analisarVariacao(h, anterior);
                  const nivelMaisAlto = alertas.some((a) => a.nivel === "critico")
                    ? "critico"
                    : alertas.some((a) => a.nivel === "atencao")
                    ? "atencao"
                    : alertas.length > 0
                    ? "info"
                    : null;
                  const isExpanded = expandedAlerta === h.mes;
                  return (
                    <div
                      key={h.mes}
                      className={`rounded-md border px-3 py-2.5 ${
                        nivelMaisAlto
                          ? NIVEL_STYLES[nivelMaisAlto].border
                          : "border-stone-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-stone-800 flex items-center gap-1.5">
                            {mesLabel(h.mes)}
                            {h.importado && (
                              <span
                                className="text-[9px] uppercase tracking-wide font-semibold text-teal-700 bg-teal-50 rounded-full px-1.5 py-0.5"
                                title="Importado por foto — tarifas aproximadas"
                              >
                                estimado
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-stone-400 font-mono">
                            {h.consumoLiquidoKwh} kWh efetivos
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {nivelMaisAlto && (
                            <button
                              onClick={() =>
                                setExpandedAlerta(isExpanded ? null : h.mes)
                              }
                              aria-label="Ver alertas deste mês"
                              className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${NIVEL_STYLES[nivelMaisAlto].bg} ${NIVEL_STYLES[nivelMaisAlto].color}`}
                            >
                              <AlertTriangle size={12} />
                              {alertas.length}
                            </button>
                          )}
                          {variacao !== null && (
                            <span
                              className={`flex items-center gap-0.5 text-xs font-medium ${
                                variacao > 0
                                  ? "text-rose-600"
                                  : variacao < 0
                                  ? "text-teal-700"
                                  : "text-stone-400"
                              }`}
                            >
                              {variacao > 0 ? (
                                <TrendingUp size={12} />
                              ) : (
                                <TrendingDown size={12} />
                              )}
                              {variacao > 0 ? "+" : ""}
                              {variacao.toFixed(0)}%
                            </span>
                          )}
                          <span className="font-mono text-sm font-semibold text-stone-900 tabular-nums">
                            {brl(h.totalPagar)}
                          </span>
                          <button
                            onClick={() => carregarMes(h)}
                            className="text-xs text-teal-700 hover:underline"
                          >
                            Carregar
                          </button>
                          <button
                            onClick={() => excluirMes(h.mes)}
                            className="text-stone-300 hover:text-rose-600 transition-colors"
                            aria-label="Excluir mês"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {isExpanded && alertas.length > 0 && (
                        <div className="mt-2.5 space-y-1.5 border-t border-stone-100 pt-2.5">
                          {alertas.map((a, i) => {
                            const ns = NIVEL_STYLES[a.nivel];
                            return (
                              <div
                                key={i}
                                className={`rounded-md ${ns.bg} px-2.5 py-2`}
                              >
                                <div
                                  className={`flex items-center gap-1.5 text-xs font-semibold ${ns.color}`}
                                >
                                  <AlertTriangle size={12} />
                                  {a.titulo}
                                </div>
                                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                                  {a.mensagem}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {histError && (
                <p className="text-xs text-rose-600 mt-2">{histError}</p>
              )}
            </>
          )}
        </section>

        {/* CONSUMO DE APARELHOS */}
        <section className="mt-6 rounded-lg border border-stone-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} className="text-amber-600" />
            <h2 className="font-serif text-lg font-semibold">
              Quanto cada aparelho pesa na conta
            </h2>
          </div>
          <p className="text-xs text-stone-500 mb-4">
            Estimativa de consumo mensal de aparelhos comuns e o quanto isso
            acrescentaria na sua fatura, usando o preço por kWh calculado
            acima ({brl(calc.precoMedioBruto)}/kWh).
          </p>

          <div className="overflow-x-auto rounded-md border border-stone-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 text-left text-[11px] uppercase text-stone-500">
                  <th className="px-3 py-2 font-medium">Aparelho</th>
                  <th className="px-3 py-2 font-medium text-right">Potência</th>
                  <th className="px-3 py-2 font-medium text-right">Uso típico</th>
                  <th className="px-3 py-2 font-medium text-right">kWh/mês</th>
                  <th className="px-3 py-2 font-medium text-right">
                    Acréscimo na conta
                  </th>
                </tr>
              </thead>
              <tbody>
                {APARELHOS.map((a) => (
                  <tr key={a.nome} className="border-t border-stone-100">
                    <td className="px-3 py-2 text-stone-800">{a.nome}</td>
                    <td className="px-3 py-2 text-right font-mono text-stone-500">
                      {a.potenciaW} W
                    </td>
                    <td className="px-3 py-2 text-right text-stone-500">{a.uso}</td>
                    <td className="px-3 py-2 text-right font-mono text-stone-700">
                      {a.kwhMes.toLocaleString("pt-BR")} kWh
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-semibold text-stone-900">
                      + {brl(a.kwhMes * calc.precoMedioBruto)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-stone-400 mt-2">
            Valores de potência e uso são médias de referência — variam por
            modelo e hábito de uso. O acréscimo é calculado multiplicando o
            consumo estimado (kWh/mês) pelo preço por kWh informado na
            calculadora, e não considera eventual mudança de faixa de
            bandeira tarifária.
          </p>
        </section>

        {/* PAINEL EDUCATIVO */}
        <section className="mt-6 rounded-lg border border-stone-200 bg-white p-5">
          <button
            onClick={() => setShowInfo((v) => !v)}
            className="w-full flex items-center justify-between gap-3"
          >
            <div className="text-left">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-600" />
                <h2 className="font-serif text-lg font-semibold">
                  Por que faturas saltaram de ~R$ 160 para R$ 1.000–3.000?
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Contexto do caso RGE/CPFL no Rio Grande do Sul (2026) e o que
                cada fator realmente explica.
              </p>
            </div>
            <ChevronDown
              size={18}
              className={`text-stone-400 shrink-0 transition-transform ${
                showInfo ? "rotate-180" : ""
              }`}
            />
          </button>

          {showInfo && (
            <div className="mt-4 space-y-2">
              {FATORES.map((f) => (
                <FatorItem
                  key={f.id}
                  fator={f}
                  isOpen={openFator === f.id}
                  onToggle={() => setOpenFator(openFator === f.id ? null : f.id)}
                />
              ))}
              <p className="text-xs text-stone-400 pt-2">
                Resumo: o reajuste de ~15% e a recomposição pós-enchentes
                explicam o aumento estrutural nas tarifas. Inverno e bandeira
                amarela somam um pouco mais, mas não bastam para justificar
                aumentos de 200–300%. A troca de sistema é um problema
                separado, ligado ao calendário de cobrança, não ao valor. Já
                os Programas Sociais (Tarifa Social e Luz para Todos) têm
                efeito real no orçamento da CDE, mas indireto e pequeno no
                reajuste geral.
              </p>
            </div>
          )}
        </section>

        <footer className="mt-10 flex flex-col items-center gap-3">
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs">
            <a
              href="/termos-de-uso"
              className="text-stone-400 hover:text-teal-700 transition-colors"
            >
              Termos de Uso
            </a>
            <a
              href="/politica-de-privacidade"
              className="text-stone-400 hover:text-teal-700 transition-colors"
            >
              Política de Privacidade
            </a>
            <a
              href="/politica-de-cookies"
              className="text-stone-400 hover:text-teal-700 transition-colors"
            >
              Política de Cookies
            </a>
          </nav>
          <a
            href="https://github.com/rbarros"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-teal-700 transition-colors"
          >
            <Github size={14} />
            github.com/rbarros
          </a>
        </footer>
      </div>

      {/* RELATÓRIO PARA IMPRESSÃO / PDF */}
      <div className="hidden print:block px-2 text-stone-900 font-sans">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={16} strokeWidth={2.5} />
          <span className="text-[11px] uppercase tracking-widest font-semibold">
            Calculadora de fatura de energia
          </span>
        </div>
        <h1 className="font-serif text-2xl font-semibold mb-1">
          Relatório — {mesLabel(mesReferencia) || "sem mês definido"}
        </h1>
        <p className="text-xs text-stone-500 mb-5">
          Gerado em{" "}
          {new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>

        <h2 className="font-serif text-base font-semibold border-b border-stone-300 pb-1 mb-2">
          Composição da fatura
        </h2>
        <table className="w-full text-sm mb-2" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr className="text-left text-[11px] uppercase text-stone-500">
              <th className="py-1">Descrição</th>
              <th className="py-1 text-right">Quantidade</th>
              <th className="py-1 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-stone-200">
              <td className="py-1">Consumo TUSD</td>
              <td className="py-1 text-right font-mono">{kwhTUSD} kWh</td>
              <td className="py-1 text-right font-mono">{brl(calc.debitoTUSD)}</td>
            </tr>
            <tr className="border-t border-stone-200">
              <td className="py-1">Consumo TE</td>
              <td className="py-1 text-right font-mono">{kwhTE} kWh</td>
              <td className="py-1 text-right font-mono">{brl(calc.debitoTE)}</td>
            </tr>
            <tr className="border-t border-stone-200">
              <td className="py-1">Adicional de bandeira</td>
              <td className="py-1 text-right font-mono">—</td>
              <td className="py-1 text-right font-mono">{brl(bandeira)}</td>
            </tr>
            <tr className="border-t border-stone-300 font-semibold">
              <td className="py-1">Subtotal débitos</td>
              <td className="py-1 text-right font-mono">—</td>
              <td className="py-1 text-right font-mono">{brl(calc.debitos)}</td>
            </tr>
            {temSolar && (
              <>
                <tr className="border-t border-stone-200 text-teal-700">
                  <td className="py-1">Injetada TUSD (crédito)</td>
                  <td className="py-1 text-right font-mono">{kwhInjTUSD} kWh</td>
                  <td className="py-1 text-right font-mono">− {brl(calc.creditoTUSD)}</td>
                </tr>
                <tr className="border-t border-stone-200 text-teal-700">
                  <td className="py-1">Injetada TE (crédito)</td>
                  <td className="py-1 text-right font-mono">{kwhInjTE} kWh</td>
                  <td className="py-1 text-right font-mono">− {brl(calc.creditoTE)}</td>
                </tr>
                <tr className="border-t border-stone-200 text-teal-700">
                  <td className="py-1">Créd. adicional de bandeira</td>
                  <td className="py-1 text-right font-mono">—</td>
                  <td className="py-1 text-right font-mono">− {brl(calc.creditoBand)}</td>
                </tr>
                <tr className="border-t border-stone-300 font-semibold text-teal-700">
                  <td className="py-1">Subtotal créditos</td>
                  <td className="py-1 text-right font-mono">—</td>
                  <td className="py-1 text-right font-mono">− {brl(calc.creditos)}</td>
                </tr>
              </>
            )}
            <tr className="border-t border-stone-300 font-semibold">
              <td className="py-1">Total Distribuidora</td>
              <td className="py-1 text-right font-mono">—</td>
              <td className="py-1 text-right font-mono">{brl(calc.totalDistribuidora)}</td>
            </tr>
            <tr className="border-t border-stone-200">
              <td className="py-1">Contribuição IP-CIP</td>
              <td className="py-1 text-right font-mono">—</td>
              <td className="py-1 text-right font-mono">{brl(ipcip)}</td>
            </tr>
            <tr className="border-t-2 border-stone-900 font-bold text-base">
              <td className="py-2">Total a pagar</td>
              <td className="py-2 text-right">—</td>
              <td className="py-2 text-right font-mono">{brl(calc.totalPagar)}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-between text-xs text-stone-600 mb-6 mt-1">
          <span>
            Preço bruto por kWh: <strong>{brl(calc.precoMedioBruto)}</strong>
          </span>
          <span>
            Preço líquido por kWh ({calc.consumoLiquidoKwh} kWh efetivos):{" "}
            <strong>{brl(calc.precoMedioLiquido)}</strong>
          </span>
        </div>

        {historicoOrdenado.length > 0 && (
          <>
            <h2 className="font-serif text-base font-semibold border-b border-stone-300 pb-1 mb-2">
              Histórico mensal
            </h2>
            <table className="w-full text-sm mb-6" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr className="text-left text-[11px] uppercase text-stone-500">
                  <th className="py-1">Mês</th>
                  <th className="py-1 text-right">kWh efetivos</th>
                  <th className="py-1 text-right">Total pago</th>
                  <th className="py-1 text-right">Variação</th>
                </tr>
              </thead>
              <tbody>
                {historicoOrdenado.map((h, idx) => {
                  const anterior = historicoOrdenado[idx - 1];
                  const variacao = anterior
                    ? ((h.totalPagar - anterior.totalPagar) / anterior.totalPagar) * 100
                    : null;
                  const alertas = analisarVariacao(h, anterior);
                  return (
                    <React.Fragment key={h.mes}>
                      <tr className="border-t border-stone-200">
                        <td className="py-1">{mesLabel(h.mes)}</td>
                        <td className="py-1 text-right font-mono">{h.consumoLiquidoKwh}</td>
                        <td className="py-1 text-right font-mono">{brl(h.totalPagar)}</td>
                        <td className="py-1 text-right font-mono">
                          {variacao === null
                            ? "—"
                            : `${variacao > 0 ? "+" : ""}${variacao.toFixed(0)}%`}
                        </td>
                      </tr>
                      {alertas.length > 0 && (
                        <tr>
                          <td colSpan={4} className="pb-1.5 pl-2">
                            {alertas.map((a, i) => (
                              <div key={i} className="text-[10px] text-rose-600">
                                ⚠ {a.titulo}: {a.mensagem}
                              </div>
                            ))}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        <h2 className="font-serif text-base font-semibold border-b border-stone-300 pb-1 mb-2">
          Fatores que podem explicar aumentos na fatura
        </h2>
        <div className="space-y-3 mb-4">
          {FATORES.map((f) => (
            <div key={f.id} className="text-sm break-inside-avoid">
              <div className="font-semibold">
                {f.titulo}{" "}
                <span className="font-normal text-[10px] uppercase text-stone-500">
                  ({STATUS_STYLES[f.status].label})
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">{f.texto}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-stone-400">
          Relatório gerado pela Calculadora de fatura de energia. Dados
          informados manualmente pelo usuário para fins de conferência e
          educação sobre a composição da conta de luz.
        </p>
      </div>

      <CookieBanner />
      <DevicePairingModal open={showPairing} onClose={() => setShowPairing(false)} />
    </div>
  );
}
