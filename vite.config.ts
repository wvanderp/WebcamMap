import { defineConfig, loadEnv, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import { sentryVitePlugin } from '@sentry/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  const plugins: PluginOption[] = [
    react(),
    svgr(),
  ];
  
  // Add Sentry plugin for source maps upload (only in production)
  if (mode === 'production' && env.VITE_SENTRY_DSN) {
    plugins.push(sentryVitePlugin({
      org: env.SENTRY_ORG,
      project: env.SENTRY_PROJECT,
      authToken: env.SENTRY_AUTH_TOKEN,
      
      // Upload source maps to Sentry
      sourcemaps: {
        assets: './build/assets/**',
        filesToDeleteAfterUpload: './build/assets/**/*.map',
      },
      
      // Other options
      telemetry: false,
    }));
  }
  
  return {
    plugins,
    
    build: {
      outDir: './build',
      emptyOutDir: true,
      // Generate source maps for production (hidden from public)
      sourcemap: 'hidden',
    },
    
    // Define global constants
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version),
    },
  };
})
