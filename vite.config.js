import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,  // Définit le port sur 3000 pour Railway
    host: "0.0.0.0",
    strictPort: true,  // Empêche Vite de changer le port
    allowedHosts: ["ia-anthony-ranto.up.railway.app"] // Autorise Railway à accéder au serveur
  },
  preview: {
    port: 3000,  // Port pour `vite preview`
    host: "0.0.0.0"
  }
});
