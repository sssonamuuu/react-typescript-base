const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathPlugin = require('tsconfig-paths-webpack-plugin');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const { SRC_ROOT_DIR, DIST_FONT_DIR, DIST_IMAGE_DIR, DIST_ROOT_DIR, DIST_SCRIPT_DIR, DIST_STYLE_DIR } = require('./build/config');
const { getEnv, getConfig, addPrefixForObjectKey } = require('./build/tools');

const { mode = 'development' } = getEnv();
const config = getConfig();

module.exports = {
  mode,
  entry: {
    index: `./${SRC_ROOT_DIR}/index.tsx`,
  },
  output: {
    publicPath: '/',
    path: path.join(__dirname, DIST_ROOT_DIR),
    chunkFilename: `${DIST_SCRIPT_DIR}/[name].[chunkhash:5].js`,
    filename: `${DIST_SCRIPT_DIR}/[name].[contenthash:5].js`,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    plugins: [new TsconfigPathPlugin()],
  },
  plugins: [
    new CleanWebpackPlugin(),

    new ESLintPlugin({ emitError: true, emitWarning: true, extensions: ['ts', 'tsx', 'js']}),

    new ExtraWatchWebpackPlugin({ files: `${SRC_ROOT_DIR}/config.toml` }),

    new HtmlWebpackPlugin({
      template: `./${SRC_ROOT_DIR}/index.html`,
      filename: `index.html`,
      templateParameters: { config },
    }),

    ...mode === 'development' ? [] : [
      new MiniCssExtractPlugin({
        filename: `${DIST_STYLE_DIR}/[name].[contenthash:5].css`,
        chunkFilename: `${DIST_STYLE_DIR}/[name].[contenthash:5].css`,
      }),

      new CssMinimizerPlugin({ cache: true }),
    ],
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
        ],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/, // 非 第三方框架的采用 css-modules
        use: [
          mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: '@teamsupercell/typings-for-css-modules-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
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
          mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
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
        use: [mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, { loader: 'css-loader' }],
      },
      {
        test: /\.(?:png|jpg|jpeg|gif|ico|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2 ** 10 * 10,
              esModule: false,
              name: `${DIST_IMAGE_DIR}/[name].[contenthash:5].[ext]`,
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
              esModule: false,
              name: `${DIST_FONT_DIR}/[name].[contenthash:5].[ext]`,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    contentBase: path.resolve(__dirname, DIST_ROOT_DIR),
    host: '0.0.0.0',
    overlay: { errors: true, warnings: false },
    disableHostCheck: true,
    historyApiFallback: { rewrites: [{ from: /.*/, to: path.posix.join('/', 'index.html') }]},
  },
};
