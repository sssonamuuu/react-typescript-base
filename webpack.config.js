const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathPlugin = require('tsconfig-paths-webpack-plugin');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const { SRC_ROOT_DIR, DIST_FONT_DIR, DIST_IMAGE_DIR, DIST_ROOT_DIR, DIST_SCRIPT_DIR, DIST_STYLE_DIR } = require('./build/config');
const { getEnv, getConfig, mergeConfig, addPrefixForObjectKey } = require('./build/tools');

const { mode } = getEnv();
const config = mergeConfig(getConfig());

module.exports = {
  mode,
  entry: {
    index: `./${SRC_ROOT_DIR}/index.tsx`,
  },
  output: {
    publicPath: '/',
    path: path.join(__dirname, DIST_ROOT_DIR),
    chunkFilename: `${DIST_SCRIPT_DIR}/[name].[chunkhash:5].js`,
    filename: `${DIST_SCRIPT_DIR}/[name].[hash:5].js`,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    plugins: [new TsconfigPathPlugin()],
    alias: {},
  },
  plugins: [
    new CleanWebpackPlugin(),

    new ExtraWatchWebpackPlugin({ files: `${SRC_ROOT_DIR}/config.toml` }),

    new HtmlWebpackPlugin({
      template: `./${SRC_ROOT_DIR}/index.html`,
      filename: `index.html`,
      templateParameters: {},
    }),

    /** 抽离CSS单独打包 */
    new MiniCssExtractPlugin({
      filename: `${DIST_STYLE_DIR}/[name].[hash:5].css`,
      chunkFilename: `${DIST_STYLE_DIR}/[name].[contenthash:5].css`,
    }),
  ],
  externals: {},
  module: {
    rules: [
      {
        test: /\.toml$/,
        use: {
          loader: './build/toml-loader',
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
          { loader: 'ts-loader' },
          { loader: 'eslint-loader' },
        ],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/, // 非 第三方框架的采用 css-modules
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              modules: true,
              namedExport: true,
              camelCase: true,
              less: true,
              minimize: true,
              localIdentName: '[local]_[hash:base64:5]',
            },
          },
          { loader: 'postcss-loader' },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: addPrefixForObjectKey(config.theme, '@'),
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        include: /node_modules/, // 第三方框架的采用 css-loader
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: addPrefixForObjectKey(config.theme, '@'),
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, { loader: 'css-loader' }],
      },
      {
        test: /\.(?:png|jpg|jpeg|gif|ico|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2 ** 10 * 10,
              esModule: true,
              name: `${DIST_IMAGE_DIR}/[name].[hash:5].[ext]`,
            },
          },
        ],
      },
      {
        test: /\.(?:eot|ttf|woff|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2 ** 10 * 10,
              esModule: true,
              name: `${DIST_FONT_DIR}/[name].[hash:5].[ext]`,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, DIST_ROOT_DIR),
    host: '0.0.0.0',
    overlay: { errors: true, warnings: false },
    disableHostCheck: true,
    historyApiFallback: { rewrites: [{ from: /.*/, to: path.posix.join('/', 'index.html') }]},
  },
};
