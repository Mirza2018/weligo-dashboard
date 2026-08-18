import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: ["weligo.ch", "www.weligo.ch"],
  },
  // You can even remove the alias here if you want — the plugin handles it
  // resolve: { alias: { "@": path.resolve(__dirname, "./src") } }
});
