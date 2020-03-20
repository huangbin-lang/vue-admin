const path = require('path');
module.exports = {
  /* 部署生产环境和开发环境下的URL：可对当前环境进行区分，baseUrl 从 Vue CLI 3.3 起已弃用，要使用publicPath */
  /* baseUrl: process.env.NODE_ENV === 'production' ? './' : '/' */
  publicPath: process.env.NODE_ENV === 'production' ? '/public/' : './',
  /* 输出文件目录：在npm run build时，生成文件的目录名称 */
  outputDir: 'dist',
  /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
  assetsDir: "assets",
  /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
  productionSourceMap: false,
  /* 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存，你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变) */
  filenameHashing: false,
  /* 代码保存时进行eslint检测 */
  lintOnSave: false,
  /* 
    webpack配置,see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    配置svg : 依赖：npm install svg-sprite-loader -s
  */
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
    .use("svg-sprite-loader")
    .loader("svg-sprite-loader")
    .options({
      symbolId: "icon-[name]",
      include: ["./src/icons"]
    });
  },
  configureWebpack: (config) => {
    config.resolve = { //配置解析
      extensions: [".js", ".json", ".vue"],
      alias: {
        'vue': 'vue/dist/vue.js',
        '@': path.resolve(__dirname, './src'),
        'public': path.resolve(__dirname, '.public'),
        'common': path.resolve(__dirname, '.src/common'),
        'views': path.resolve(__dirname, '.@/views'),
        'api': path.resolve(__dirname, '.src/api'),
        'data': path.resolve(__dirname, '.src/data'),
        'components': path.resolve(__dirname, '.src/components')
      }
    }
  },
  /* 生产环境是否生成sourceMap */
  productionSourceMap: false,
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      sass: {
        // prependData: '@import "./src/styles/main.scss"'
        prependData: `@import "./src/styles/main.scss";`
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false // 去掉文件名中的 .module
  },
  // use thread-loader for babel & TS in production build

  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  /* webpack-dev-server 相关配置 */
  devServer: {
    /* 自动打开浏览器 */
    open: true,
    /* 设置为0.0.0.0则所有的地址均能访问 */
    host: '0.0.0.0',
    port: 8066,
    https: false,
    hotOnly: false,
    /* 使用代理 */
    proxy: {
      '/devapi': {
        //目标代理服务器地址
        /**
         * 这是浏览器中network中的请求：Request URL: http://localhost:8066/devapi/getSms/
         * 本身/devapi 就是 http://www.web-jshtml.cn 而 '^/devapi' 会在 它后面拼接设置的值
         */
        //  /api === http://www.web-jshtml.cn/productapi  遇到/api 就会将/api替换成http://www.web-jshtml.cn/productApi
        target: 'http://www.web-jshtml.cn/productapi/token',
        //允许跨域 
        changeOrigin: true,
        pathRewrite: {
          //这里的api意思是：
          '^/devapi': ''
        }
      },
    },
    overlay: {
      warnings: true,
      errors: true
    }
  },
  pluginOptions: {}
}