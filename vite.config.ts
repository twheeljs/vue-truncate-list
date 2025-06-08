import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const baseConfig = {
    plugins: [vue()],
  };

  const isBuildLib = mode === 'lib';
  if (isBuildLib) {
    return {
      ...baseConfig,
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/components/TruncateList/index.tsx'),
          name: 'TruncateList',
          fileName: (format) => `truncate-list.${format}.js`,
          cssFileName: 'truncate-list.css',
          formats: ['es', 'umd', 'cjs'],
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: { vue: 'Vue' }
          }
        }
      }
    }
  }

  return baseConfig;
})
