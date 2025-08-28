// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  // Your app lives in /client
  root: "client",
  build: {
    outDir: "../web-dist",
    emptyOutDir: true,
  },
  // ✅ Resolve "@/..." to client/src
  resolve: {
    alias: { "@": path.resolve(__dirname, "client", "src") },
  },
  // For GitHub Pages (workflow sets VITE_BASE="/<repo>/")
  base: process.env.VITE_BASE ?? "/",
});
