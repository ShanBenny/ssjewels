import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';

function imageMetadataPlugin() {
  const virtualModuleId = 'virtual:image-metadata';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'image-metadata',
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        try {
          const imagesDir = path.resolve(__dirname, 'src/public/images');
          if (!fs.existsSync(imagesDir)) {
            return `export default []`;
          }
          const files = fs.readdirSync(imagesDir).filter((f: string) => f.endsWith('.jpg') || f.endsWith('.jpeg'));
          const images = files.map((file: string) => {
            const stat = fs.statSync(path.join(imagesDir, file));
            return {
              filename: file,
              path: `/images/${file}`,
              mtimeMs: stat.mtimeMs,
            };
          });
          // Sort by newest first
          images.sort((a: any, b: any) => b.mtimeMs - a.mtimeMs);
          return `export default ${JSON.stringify(images)}`;
        } catch (err) {
          console.error('Error reading images:', err);
          return `export default []`;
        }
      }
    }
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    publicDir: 'src/public',
    plugins: [react(), tailwindcss(), imageMetadataPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
