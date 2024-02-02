const { defineConfig } = require('@vue/cli-service');

module.exports = {
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/ScanScore/" : "/",
  configureWebpack: {
    resolve: {
      fallback: {
        "assert": require.resolve("assert/"),
        "stream": require.resolve("stream-browserify"),
        "util": require.resolve("util/"),
      },
    },
  },
};
