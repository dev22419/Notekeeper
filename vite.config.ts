import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    // A literal, unlike an unset import.meta.env.VITE_*, so the minifier can drop
    // every sync code path from builds without Supabase keys (DEV-1).
    define: {
      __SYNC_ENABLED__: JSON.stringify(Boolean(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_PUBLISHABLE_KEY)),
    },
    plugins: [react(), tailwindcss()],
    build: {
      rolldownOptions: {
        output: {
          // Long-lived libraries get their own chunks: smaller entry file, and they
          // stay cached across app deploys. (The editor and canvas are lazy-loaded.)
          codeSplitting: {
            groups: [
              { name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              {
                name: "radix",
                test: /node_modules[\\/](@radix-ui|@floating-ui|react-remove-scroll|react-remove-scroll-bar|react-style-singleton|use-callback-ref|use-sidecar|aria-hidden|tslib)[\\/]/,
              },
              { name: "date-picker", test: /node_modules[\\/](react-day-picker|date-fns|@date-fns)[\\/]/ },
            ],
          },
        },
      },
    },
  };
});
