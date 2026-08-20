import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { comErro: false };
  }

  static getDerivedStateFromError() {
    return { comErro: true };
  }

  componentDidCatch(error, info) {
    console.error("Erro não tratado na interface:", error, info);
  }

  render() {
    if (!this.state.comErro) return this.props.children;
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
        <div className="max-w-sm w-full rounded-lg border border-stone-200 bg-white p-6 text-center">
          <AlertTriangle size={28} className="mx-auto text-amber-600" />
          <h1 className="mt-3 font-serif text-lg font-semibold text-stone-900">
            Algo deu errado
          </h1>
          <p className="mt-1.5 text-sm text-stone-500">
            Ocorreu um erro inesperado nesta tela. Recarregar a página
            costuma resolver — seus dados salvos não são afetados.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-teal-700 text-white text-sm font-medium px-4 py-2 hover:bg-teal-800 transition-colors"
          >
            <RefreshCw size={14} />
            Recarregar página
          </button>
        </div>
      </div>
    );
  }
}
