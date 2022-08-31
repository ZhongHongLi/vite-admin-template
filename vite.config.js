import { createVuePlugin } from 'vite-plugin-vue2'
import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path' // ts如果报错 npm i @types/node -D
import compressPlugin from 'vite-plugin-compression' // 静态资源压缩
import visualizer from 'rollup-plugin-visualizer'
import { cjs2esmVitePlugin } from 'cjs2esmodule' // 将 commonjs 转化为 es module
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
// import { viteMockServe } from 'vite-plugin-mock'
// const localEnabled = process.env.USE_MOCK || false
// const prodEnabled = process.env.USE_CHUNK_MOCK || false
export default defineConfig({
  outDir: 'target',
  // 反向代理
  server: {
    port: 8080,
    // 是否自动在浏览器打开
    open: false,
    // 是否开启 https
    https: false,
    proxy: {
      '/api': {
        target: 'https://blog.csdn.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    hmr: true // 开启热更新
  },
  plugins: [
    createVuePlugin(),
    vueJsx({}),
    visualizer(),
    compressPlugin({
      // gzip静态资源压缩
      verbose: true, // 默认即可
      disable: false, // 开启压缩(不禁用)，默认即可
      deleteOriginFile: false, // 删除源文件
      threshold: 10240, // 压缩前最小文件大小
      algorithm: 'gzip', // 压缩算法
      ext: '.gz' // 文件类型
    }),
    createSvgIconsPlugin({
      // 配置路径在你的src里的svg存放文件
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      symbolId: 'icon-[dir]-[name]'
    }),
    cjs2esmVitePlugin(),
    viteCommonjs()
    // viteMockServe({
    //   mockPath: './mock/user', // mock文件地址
    //   // localEnabled: localEnabled, // 开发打包开关
    //   // prodEnabled: prodEnabled, // 生产打包开关
    //   // 这样可以控制关闭mock的时候不让mock打包到最终代码内
    //   injectCode: `
    //     import { setupProdMockServer } from './src/mockProdServer';
    //     setupProdMockServer();
    //   `,
    //   logger: true, // 是否在控制台显示请求日志
    //   supportTs: false // 打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件
    // })
  ],
  build: {
    target: 'es2015',
    outDir: './dist/',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
          vueRouter: ['vue-router'],
          elementUI: ['element-ui'],
          axios: ['axios']
        }
      }
    }
  },
  resolve: {
    extensions: ['.vue', '.js', '.jsx', '.json', '.scss'],
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        data: `@import "./src/styles/index.scss";`
      }
    }
  }
})
