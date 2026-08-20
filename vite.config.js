import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from '@vitejs/plugin-basic-ssl';

// GunDB (via gun/sea) tenta puxar o polyfill Node "text-encoding" durante
// o pre-bundling do Vite, o que não é necessário em navegadores modernos
// e infla o bundle em ~700kB. Este plugin neutraliza esse módulo.
// Ref: https://github.com/amark/gun/wiki/vite
const moduleExclude = (match) => {
  const m = (id) => id.indexOf(match) > -1;
  return {
    name: `exclude-${match}`,
    resolveId(id) {
      if (m(id)) return id;
    },
    load(id) {
      if (m(id)) return `export default {}`;
    },
  };
};

export default defineConfig({
  preview: {
   https: false
  },
  plugins: [moduleExclude("text-encoding"), react(), basicSsl()],
  optimizeDeps: {
    include: ["gun", "gun/gun", "gun/sea", "gun/sea.js"],
  },
});
