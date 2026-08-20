import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import App from "./App.jsx";
import CookiesPage from "./CookiesPage.jsx";
import TermsPage from "./TermsPage.jsx";
import PrivacyPage from "./PrivacyPage.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import "./index.css";

const PAGINAS = {
  "/politica-de-cookies": CookiesPage,
  "/termos-de-uso": TermsPage,
  "/politica-de-privacidade": PrivacyPage,
};

const Pagina = PAGINAS[window.location.pathname] || App;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Pagina />
    </ErrorBoundary>
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>
);
