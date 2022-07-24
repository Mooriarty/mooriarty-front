const { defineConfig } = require('@vue/cli-service')
const ip = '127.0.0.1'
module.exports = defineConfig({
  transpileDependencies: true,
  // 资源访问基础路径
  publicPath: '/',
  // 设置项目打包生成的文件的存储目录
  // outputDir: `/`,
  // 用于设定打包生成的 index.html 文件的存储位置
  // indexPath:""
  // 静态资源（js、css）时的基础路径
  assetsDir: 'static',
  filenameHashing: true,
  devServer: {
    hot: true,
    port: '8092',
    // 代理IP配置
    proxy: {
      "/mooriarty": {
        target: `http://${ip}:9000`
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  // 自定义webpack配置
  configureWebpack: {

  },
})
