module.exports = {
  lintOnSave: process.env.NODE_ENV !== "development",
  devServer: {
    https: false,
    host: "localhost",
    port: 8081
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true //For less
      }
    },
    modules: false,
  },
  configureWebpack: {
    devtool: process.env.NODE_ENV !== 'development' ? '' : 'source-map', 
  }
};
