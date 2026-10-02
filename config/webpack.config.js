const path = require("path");
const webpack = require("webpack");
const { ModuleFederationPlugin } = webpack.container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const dependencies = require("../package.json").dependencies;
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

module.exports = (_env, argv = {}) => {
  const isProduction = (argv.mode || process.env.NODE_ENV) === "production";
  const defaultRemoteOrigin = isProduction
    ? "https://mfpoc-omega.vercel.app"
    : "http://localhost:3000";
  const remoteOrigin = (process.env.USER_WIDGET_REMOTE_URL || defaultRemoteOrigin).replace(/\/$/, "");

  return {
    mode: isProduction ? "production" : "development",
    context: path.resolve(__dirname, ".."),
    entry: "./src/index.tsx",
    output: {
      path: path.resolve(__dirname, "../build"),
      filename: isProduction ? "static/js/[name].[contenthash:8].js" : "static/js/[name].js",
      chunkFilename: isProduction ? "static/js/[name].[contenthash:8].chunk.js" : "static/js/[name].chunk.js",
      publicPath: "auto",
      uniqueName: "userWidgetHost",
      clean: true
    },
    devtool: isProduction ? "source-map" : "eval-cheap-module-source-map",
    cache: { type: "filesystem", buildDependencies: { config: [__filename] } },
    resolve: { extensions: [".tsx", ".ts", ".jsx", ".js", ".json"] },
    module: {
      rules: [
        { test: /\.[jt]sx?$/, include: path.resolve(__dirname, "../src"), use: "babel-loader" },
        { test: /\.css$/i, use: [isProduction ? MiniCssExtractPlugin.loader : "style-loader", "css-loader"] }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ template: path.resolve(__dirname, "../public/index.html"), inject: "body", publicPath: "/" }),
      new ModuleFederationPlugin({
        name: "widgetHost",
        remotes: { userWidget: `userWidget@${remoteOrigin}/remoteEntry.js` },
        shared: {
          react: { singleton: true, requiredVersion: dependencies.react },
          "react-dom": { singleton: true, requiredVersion: dependencies["react-dom"] },
          "@tanstack/react-query": { singleton: true, requiredVersion: dependencies["@tanstack/react-query"] },
          "styled-components": { singleton: true, requiredVersion: dependencies["styled-components"] }
        }
      }),
      ...(isProduction ? [new MiniCssExtractPlugin({ filename: "static/css/[name].[contenthash:8].css" })] : [])
    ],
    optimization: { minimize: isProduction },
    devServer: {
      host: process.env.HOST || "localhost",
      port: Number(process.env.PORT) || 3001,
      historyApiFallback: true,
      hot: true,
      open: process.env.BROWSER !== "none",
      client: { overlay: { errors: true, warnings: false } }
    },
    stats: "errors-warnings"
  };
};
