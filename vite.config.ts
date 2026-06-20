import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const backendUrl = process.env.VITE_SUPABASE_URL || "https://drkgltvwygfsynhygopq.supabase.co";
const backendPublishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_MyHVClIR5AygKOnkMfyOow_Z2ANkAsQ";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(backendUrl),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(backendPublishableKey),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
