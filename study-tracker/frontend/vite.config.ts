import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api/v1/records": {
        target: "http://records-api:8000",
        changeOrigin: true,
      },
      "/api/v1/goals": {
        target: "http://goals-api:8000",
        changeOrigin: true,
      },
    },
  },
});
