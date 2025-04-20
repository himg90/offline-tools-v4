import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        popup: 'popup.html'
      },
      // output: {
      //   assetFileNames: (assetInfo) => {
      //     if(assetInfo.names.length > 0 &&
      //       assetInfo.names[0].startsWith('_')
      //     ) {
      //       var fileName = assetInfo.names[0].substring(1)
      //       return `assets/${fileName}-[hash][extname]`
      //     }
      //     return "assets/[name]-[hash][extname]"
      //   },
      //   chunkFileNames: (chunkInfo) => {
      //     if(chunkInfo.name.startsWith('_')
      //     ) {
      //       return "a[name]-[hash].js"
      //     }
      //     return "[name]-[hash].js";
      //   }
      // }
    },
    outDir: 'dist',
    assetsDir: '.',
    emptyOutDir: true,
  },
  base: './'
})
