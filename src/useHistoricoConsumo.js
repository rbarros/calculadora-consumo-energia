import { useCallback, useEffect, useState } from "react";
import { user, ensureAuthenticated } from "./gunInstance.js";

const NODE_PATH = ["calculadora", "historico"];

function getHistoricoNode() {
  return NODE_PATH.reduce((node, chave) => node.get(chave), user);
}

// Estado e assinatura .map().on() em escopo de módulo, não por
// componente/efeito: sob React.StrictMode o efeito de um hook roda
// mount → cleanup → mount em dev, e o par .on()/.off() do Gun é
// processado de forma assíncrona internamente — desfazer e refazer a
// assinatura nesse ciclo pode deixar nenhum listener realmente ativo
// (o "off" do primeiro mount corre contra o "on" do segundo). Assinar
// uma única vez por sessão, aqui no módulo, elimina essa corrida —
// mesmo padrão já usado em gunInstance.js para a autenticação.
const records = new Map();
const listeners = new Set();
let subscribePromise = null;

function notify() {
  const registros = Array.from(records.values()).sort((a, b) =>
    a.mes.localeCompare(b.mes)
  );
  listeners.forEach((fn) => fn(registros));
}

function ensureSubscribed() {
  if (!subscribePromise) {
    subscribePromise = ensureAuthenticated().then(() => {
      getHistoricoNode()
        .map()
        .on((dado, chave) => {
          if (dado === null || dado === undefined) {
            records.delete(chave);
            notify();
            return;
          }
          // Gun injeta um campo de metadados "_" em cada nó — removemos
          // antes de tratar como registro de app, e reatribuímos "mes"
          // (a chave do nó não vem automaticamente como campo).
          const { _, ...resto } = dado;
          const registro = { ...resto, mes: chave };
          // Uma escrita nova pode propagar em mais de um evento antes do
          // objeto completo chegar — ignoramos updates sem os campos
          // essenciais em vez de deixar um registro incompleto entrar no
          // estado (evitava crash no cálculo do gráfico/histórico).
          if (
            typeof registro.totalPagar !== "number" ||
            Number.isNaN(registro.totalPagar)
          ) {
            return;
          }
          records.set(chave, registro);
          notify();
        });
    });
  }
  return subscribePromise;
}

// Envolve o ack de um .put() do Gun com um timeout: se a rede estiver
// indisponível (relays fora do ar, sem conectividade), o ack pode nunca
// chegar — sem isso a UI ficaria "salvando..." para sempre.
function putComTimeout(node, valor, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    let liquidado = false;
    const timer = setTimeout(() => {
      if (liquidado) return;
      liquidado = true;
      reject(new Error("tempo esgotado ao sincronizar"));
    }, timeoutMs);
    node.put(valor, (ack) => {
      if (liquidado) return;
      liquidado = true;
      clearTimeout(timer);
      if (ack.err) reject(new Error(ack.err));
      else resolve();
    });
  });
}

export function useHistoricoConsumo() {
  const [historico, setHistorico] = useState(() =>
    Array.from(records.values()).sort((a, b) => a.mes.localeCompare(b.mes))
  );
  const [loadingHist, setLoadingHist] = useState(true);
  const [histError, setHistError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    const ouvinte = (registros) => {
      if (!cancelled) setHistorico(registros);
    };
    listeners.add(ouvinte);

    ensureSubscribed()
      .then(() => {
        if (!cancelled) {
          setHistorico(
            Array.from(records.values()).sort((a, b) => a.mes.localeCompare(b.mes))
          );
          setLoadingHist(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          const detalhe = e && e.message ? e.message : "erro desconhecido";
          setHistError(
            `Não foi possível conectar ao histórico sincronizado (${detalhe}).`
          );
          setLoadingHist(false);
        }
      });

    return () => {
      cancelled = true;
      listeners.delete(ouvinte);
    };
  }, []);

  const salvarMes = useCallback(async (registro) => {
    setSaving(true);
    setSaveMsg("");
    try {
      await putComTimeout(getHistoricoNode().get(registro.mes), registro);
      setSaveMsg("Mês salvo e sincronizado.");
    } catch (e) {
      const detalhe = e && e.message ? e.message : "erro desconhecido";
      setSaveMsg(`Não foi possível salvar (${detalhe}).`);
      throw e;
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 4000);
    }
  }, []);

  const excluirMes = useCallback(async (mes) => {
    try {
      await putComTimeout(getHistoricoNode().get(mes), null);
    } catch (e) {
      const detalhe = e && e.message ? e.message : "erro desconhecido";
      setHistError(
        `Removido nesta sessão, mas não foi possível sincronizar a exclusão (${detalhe}).`
      );
      setTimeout(() => setHistError(null), 4000);
    }
  }, []);

  const limparHistorico = useCallback(async () => {
    const meses = Array.from(records.keys());
    if (meses.length === 0) return;
    const resultados = await Promise.allSettled(
      meses.map((mes) => putComTimeout(getHistoricoNode().get(mes), null))
    );
    const falhas = resultados.filter((r) => r.status === "rejected");
    if (falhas.length > 0) {
      setHistError(
        `${falhas.length} de ${meses.length} registros não puderam ser removidos.`
      );
      setTimeout(() => setHistError(null), 5000);
    }
  }, []);

  return {
    historico,
    loadingHist,
    histError,
    saving,
    saveMsg,
    salvarMes,
    excluirMes,
    limparHistorico,
  };
}
