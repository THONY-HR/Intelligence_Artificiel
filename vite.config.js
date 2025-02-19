import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: process.env.PORT || 4000,  // Définit le port sur 4000 pour Railway
    host: "0.0.0.0",
    strictPort: true   // Empêche Vite de changer le port
  },
  preview: {
    port: process.env.PORT || 4000,  // Port pour `vite preview`
    host: "0.0.0.0",
    allowedHosts: ["IA-Anthony-Ranto.up.railway.app"]
  }
});