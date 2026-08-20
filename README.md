# Calculadora de fatura de energia

App em React + Vite + Tailwind. Calcula débitos, créditos de energia
injetada (solar), guarda um histórico mensal e exporta um relatório em
PDF via impressão do navegador.

O histórico é sincronizado entre os seus próprios dispositivos via
[GunDB](https://gun.eco) com criptografia de ponta a ponta (SEA), sem
conta, sem senha e sem servidor de banco de dados tradicional — veja
[Sincronização P2P (relay Gun)](#sincronização-p2p-relay-gun) abaixo.

## Requisitos

- Node.js **18 ou superior** (recomendado: 20 LTS). O Vite 5 não roda em
  versões mais antigas (ex: Node 16), a build falha com erro de
  `crypto.getRandomValues`.

Se você usa [nvm](https://github.com/nvm-sh/nvm), este repositório já
tem um `.nvmrc` com a versão recomendada — basta rodar:

```bash
nvm install   # instala a versão indicada no .nvmrc, se ainda não tiver
nvm use       # troca para essa versão nesta pasta
```

## Rodar localmente

```bash
npm install
npm run dev
```

## Testar o build de produção localmente

Antes de publicar, é possível gerar o build e servi-lo localmente do
mesmo jeito que ficará em produção:

```bash
npm run build
npm run preview
```

## Deploy na Vercel

### Opção 1 — Vercel CLI (mais rápido)

```bash
npm install -g vercel
vercel
```

Siga as perguntas no terminal (escolha "Vite" quando perguntado o
framework, ou deixe a detecção automática). No fim, rode `vercel --prod`
para publicar em produção.

### Opção 2 — GitHub + painel da Vercel

1. Crie um repositório novo no GitHub e suba esta pasta:
   ```bash
   git init
   git add .
   git commit -m "Calculadora de fatura de energia"
   git branch -M main
   git remote add origin <URL_DO_SEU_REPOSITORIO>
   git push -u origin main
   ```
2. Em https://vercel.com/new, importe o repositório.
3. A Vercel detecta automaticamente o framework Vite — não é preciso
   configurar nada, só clicar em "Deploy".

## Sincronização P2P (relay Gun)

O app usa o [GunDB](https://gun.eco) para guardar e sincronizar o
histórico entre os seus dispositivos: no primeiro acesso, o navegador
gera um par de chaves criptográficas (sem e-mail/senha) e autentica
localmente; o histórico fica cifrado de ponta a ponta e só é legível por
quem tiver essa chave. A chave é compartilhada entre dispositivos via QR
Code (botão "Sincronizar dispositivo"), e os dados cifrados trafegam por
um **relay** — um servidor simples que só repassa/retransmite os blobs
cifrados, sem conseguir ler o conteúdo.

Por padrão o app aponta para relays públicos da comunidade GunDB, que
não têm SLA e podem ficar fora do ar (`gun-manhattan.herokuapp.com`,
`peer.wallie.io`, configurados em `src/gunInstance.js`). Para uma
sincronização mais confiável, hospede seu próprio relay:

### Deploy do relay no Render (grátis)

O código do relay está em `relay/` (servidor Node mínimo usando o pacote
`gun`) e já tem um Blueprint (`render.yaml`) pronto na raiz do repositório.

1. Suba este repositório para o GitHub (se ainda não fez isso).
2. Crie uma conta em [render.com](https://render.com) (grátis, sem
   cartão) e conecte sua conta do GitHub.
3. No painel, clique em **New > Blueprint**, selecione este
   repositório — o Render vai detectar o `render.yaml` automaticamente e
   propor um Web Service chamado `calculadora-energia-gun-relay`, plano
   **Free**, apontando para a pasta `relay/`. Confirme o deploy.
   - Alternativa manual (sem Blueprint): **New > Web Service**, selecione
     o repositório, defina *Root Directory* como `relay`, *Build Command*
     `npm install`, *Start Command* `npm start`, plano **Free**.
4. Quando o deploy terminar, copie a URL pública do serviço (algo como
   `https://calculadora-energia-gun-relay.onrender.com`) e monte a URL
   do relay adicionando `/gun` no final.
5. Edite `src/gunInstance.js` e adicione essa URL no array `RELAYS`
   (pode manter os relays públicos como fallback):
   ```js
   const RELAYS = [
     "https://calculadora-energia-gun-relay.onrender.com/gun",
     "https://gun-manhattan.herokuapp.com/gun",
     "https://peer.wallie.io/gun",
   ];
   ```
6. Rode `npm run build` e publique normalmente.

**Importante — plano gratuito do Render:** o serviço "dorme" após 15 min
sem tráfego e leva de 30 a 60s para acordar na primeira conexão seguinte
— aceitável para este uso (sincronização eventual, não um chat em tempo
real constante). O armazenamento em disco do plano free também é
efêmero (`relay/radata`, ignorado no git): o relay é só um ponto de
encontro/retransmissão, a fonte de verdade continua sendo os próprios
dispositivos do usuário, então perder o cache do relay num redeploy não
apaga nada permanentemente — só atrasa a próxima sincronização.

## Observações

- O botão "Exportar PDF" usa a função de impressão do navegador
  (`window.print()`); no diálogo de impressão, escolha "Salvar como PDF"
  como destino.
