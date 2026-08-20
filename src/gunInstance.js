import Gun from "gun";
import "gun/sea";
import { getStoredPair, storePair } from "./gunKeys.js";

const RELAYS = [
  // Substitua pela URL do seu relay no Render depois do deploy, ex:
  // "https://calculadora-energia-gun-relay.onrender.com/gun"
  "https://gun-manhattan.herokuapp.com/gun",
  "https://peer.wallie.io/gun",
];

// Não desabilitar a opção `localStorage` do Gun aqui: ela controla o
// cache interno do próprio grafo Gun (radisk/IndexedDB + localStorage),
// sem relação com a chave separada usada em gunKeys.js — desligá-la faz
// o ack de `.put()` nunca disparar nesta versão do Gun.
export const gun = Gun({
  peers: RELAYS,
});

export const user = gun.user();

// Promise única em escopo de módulo: como módulos ES só são avaliados
// uma vez, isso garante que a geração/autenticação do par de chaves
// aconteça exatamente uma vez, mesmo com o React.StrictMode disparando
// efeitos duas vezes em desenvolvimento — todo mundo que chamar
// ensureAuthenticated() aguarda a mesma promise em vez de cada um
// checar-e-gerar uma chave por conta própria.
let authPromise = null;

export function ensureAuthenticated() {
  if (!authPromise) {
    authPromise = (async () => {
      let pair = getStoredPair();
      if (!pair) {
        pair = await Gun.SEA.pair();
        storePair(pair);
      }
      return new Promise((resolve, reject) => {
        user.auth(pair, (ack) => {
          if (ack.err) reject(new Error(ack.err));
          else resolve(pair);
        });
      });
    })();
  }
  return authPromise;
}

// Permite forçar um novo bootstrap (ex: se a autenticação falhar e o
// usuário tentar novamente). Não é chamado automaticamente em caso de
// erro — a política de retry fica a cargo de quem consome este módulo.
export function resetAuthPromise() {
  authPromise = null;
}
