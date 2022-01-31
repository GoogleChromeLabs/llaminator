/*
 * Copyright 2021 Google Inc. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

const path = require('path');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, options) => {
  const plugins = [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          context: path.resolve(__dirname, 'public'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
    }),
    new CssMinimizerPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'index-sizes.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ];

  // When hot code reloading is used in development environments, Workbox is
  // unable to accumulate the iterative compilation steps which ends up creating
  // partial precache and routing configurations. In other words, bugs. See:
  // https://github.com/GoogleChrome/workbox/issues/1790
  if (options.mode !== 'development') {
    plugins.push(new InjectManifest({
      swSrc: './service_worker/index.ts',
      swDest: path.join(path.resolve(__dirname, 'dist'), 'sw.js'),
    }));
  }

  return {
    entry: { llaminator: './src/index.ts' },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
              },
            },
          ],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins,
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 4629,
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'llaminator',
            type: 'css/mini-extract',
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    output: {
      filename: options.mode === 'production' ? '[name].[contenthash].js' :
                                              '[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
  };
};
