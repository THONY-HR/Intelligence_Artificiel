import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: process.env.PORT || 9000,  // Définit le port sur 9000 pour Railway
    host: "0.0.0.0",
    strictPort: true   // Empêche Vite de changer le port
  },
  preview: {
    port: process.env.PORT || 9000,  // Port pour `vite preview`
    host: "0.0.0.0",
    allowedHosts: ["ia-anthony.up.railway.app"]
  }
});