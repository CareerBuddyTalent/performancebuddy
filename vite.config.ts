
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Production optimizations
    minify: 'terser',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs', '@radix-ui/react-select'],
          charts: ['recharts'],
        },
      },
    },
    target: 'es2015',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'date-fns',
      'lucide-react',
      'recharts'
    ],
  },
  define: {
    // Ensure environment variables are available at build time
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
}));
