import { BuildType, FrontendParams, ComponentsInterface } from './utils/build-types.js';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import { fileURLToPath } from 'url';
import frontendAliases from './frontend-aliases.json' with { type: "json" };

const workDirPath = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(workDirPath, '..', '..', 'dist');

export function createFrontendConfig(params : FrontendParams): Configuration {
  const output = path.resolve(distPath, params.buildType as string, 'content', params.service);
  console.log('Build output: ' + output);
  console.log('Service: ' + params.service);
  let publicPath = '/';

  const frontendConfig : Configuration = {
    target: 'web',
    externals: [nodeExternals()],
    entry: params.entry as string,
    mode: params.buildType === 'development' ? 'development' : 'production',
    output: {
      filename: '[name].[contenthash].js',
      path: output,
      publicPath,
    },
    stats: 'minimal',
    optimization: {
      runtimeChunk: true
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: frontendAliases,
    },
    module: {
      rules: [
        {
          test: /\.js|jsx$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          }
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `./src/frontend/${params.service}/index.html`,
        filename: 'index.html',
        chunks: [params.service]
      })
    ]
  };

  return frontendConfig;
}

