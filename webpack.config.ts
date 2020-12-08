/**
 * 把 npm script 设置的 TS_NODE_PROJECT 置空
 *
 * 否则 TsconfigPathPlugin 也会读取改值
 */
process.env['TS_NODE_PROJECT'] = '';

import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TsconfigPathPlugin from 'tsconfig-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import webpack from 'webpack';
import { GlobalConfigProps } from 'typings/config';
import WebpackDevServer from 'webpack-dev-server';

const MODE: 'production' | 'development' = yargs.argv.mode !== 'production' ? 'production' : 'development';

const SRC_ROOT_DIR = 'src';
const DIST_ROOT_DIR = `dist`;
const STATIC = 'static';
const CONFIG_DIR = `${SRC_ROOT_DIR}/configs`;
const DIST_SCRIPT_DIR = `${STATIC}/scripts`;
const DIST_STYLE_DIR = `${STATIC}/styles`;
const DIST_IMAGE_DIR = `${STATIC}/images`;
const DIST_FONT_DIR = `${STATIC}/fonts`;

const ENVS = fs.readdirSync(CONFIG_DIR).reduce<string[]>((p, c) => p.concat(c === 'common.ts' || c === 'index.ts' ? [] : c.replace(/\.ts$/, '')), []);
const ENV: string = (yargs.argv as any).env || 'local';

if (!ENVS.includes(ENV)) {
  throw new Error(`请使用一下命令：\n\nnpm ${MODE === 'development' ? 'start' : 'run build'} -- --env {env} # env 为启动环境，可选：${ENVS.join('/')}\n\n`);
}

const config: GlobalConfigProps = require(`./${CONFIG_DIR}/${ENV}.ts`).default;
const lessVariable = Object.entries(config.theme).reduce((p, [key, value]) => ({ ...p, [`@${key}`]: value }), {});

const webpackConfig: webpack.Configuration & { devServer?: WebpackDevServer.Configuration} = {
  mode: MODE,
  entry: { index: `./${SRC_ROOT_DIR}/index.tsx` },
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

    new webpack.DefinePlugin({ __ENV__: JSON.stringify(ENV) }),

    new ESLintPlugin({ emitError: true, emitWarning: true, extensions: ['ts', 'tsx', 'js']}),

    new HtmlWebpackPlugin({
      template: `./${SRC_ROOT_DIR}/index.html`,
      filename: `index.html`,
      templateParameters: { config },
    }),

    ...MODE === 'development' ? [] : [
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
          MODE === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
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
                modifyVars: lessVariable,
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        include: /node_modules/, // 第三方框架的采用 css-loader
        use: [
          MODE === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: lessVariable,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MODE === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, { loader: 'css-loader' }],
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
  optimization: { splitChunks: { chunks: 'all' } },
  devServer: {
    contentBase: path.resolve(__dirname, DIST_ROOT_DIR),
    overlay: { errors: true, warnings: false },
    disableHostCheck: true,
    historyApiFallback: { rewrites: [{ from: /.*/, to: path.posix.join('/', 'index.html') }]},
  },
};

export default webpackConfig;
