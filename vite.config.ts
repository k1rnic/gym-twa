import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const config = loadEnv(
    mode,
    path.resolve(process.cwd()),
    '',
  ) as ImportMetaEnv;

  return {
    envPrefix: 'APP_',
    server: {
      port: 3000,
      allowedHosts: config.APP_TUNNEL_HOST
        ? [config.APP_TUNNEL_HOST]
        : undefined,
    },
    build: {
      outDir: 'build',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [react()],
  };
});
