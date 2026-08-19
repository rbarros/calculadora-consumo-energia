# Calculadora de fatura de energia

App em React + Vite + Tailwind. Calcula débitos, créditos de energia
injetada (solar), guarda um histórico mensal (salvo no `localStorage` do
seu navegador) e exporta um relatório em PDF via impressão do navegador.

## Rodar localmente

```bash
npm install
npm run dev
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

## Observações

- O histórico mensal é salvo com `localStorage`, portanto fica **só
  neste navegador/dispositivo** — não sincroniza entre aparelhos nem
  fica acessível a outras pessoas.
- O botão "Exportar PDF" usa a função de impressão do navegador
  (`window.print()`); no diálogo de impressão, escolha "Salvar como PDF"
  como destino.
