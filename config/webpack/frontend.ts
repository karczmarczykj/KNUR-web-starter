import { BuildType, FrontendParams } from './utils/build-types.js';
import * as resolveAliases from './utils/resolveAliases.ts';
import webpack from 'webpack';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';
import path from 'path';
import frontendAliases from './frontend-aliases.json' with { type: "json" };
import * as workdir from './utils/workdir.ts';

const workDirPath = workdir.default();
const distPath = path.resolve(workDirPath, 'dist');

type Definitions = Record<'__DEVELOPMENT__' |
  '__TEST__' |
  '__TEST_JEST__' |
  '__PRODUCTION__', string | boolean>;

function createDefinitions(buildType: BuildType) {
  const definitions: Definitions = {
    __DEVELOPMENT__: buildType === 'development',
    __TEST__: buildType === 'test',
    __TEST_JEST__: false,
    __PRODUCTION__: buildType === 'production',
  };
  return new webpack.DefinePlugin(definitions);
};

export function composeEntry(entry: string, publicPath: string, isProduction: boolean): { main: string[]; } {
  const result: string[] = [];

  result.push(entry);
  if (!isProduction)
    result.push(`webpack-hot-middleware/client?path=${publicPath}__webpack_hmr&reload=false&timeout=20000`);
  return {
    main: result,
  };
}

export function createFrontendConfig(params: FrontendParams): Configuration {
  const output = path.resolve(distPath, params.buildType as string, 'content', params.service);
  console.log('Build output: ' + output);
  console.log('Service: ' + params.service);
  let publicPath = '/';

  const frontendConfig: Configuration = {
    target: 'web',
    name: `frontend-${params.service}`,
    entry: composeEntry(params.entry as string, publicPath, params.buildType === 'production'),
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
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      alias: resolveAliases.default(frontendAliases, workDirPath)
    },
    module: {
      rules: [
        {
          test: /\.json$/,
          type: 'json'
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules\/(?!(core-js|@babel))/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env',
                  {
                    targets: { browsers: 'defaults' },
                    useBuiltIns: 'entry',
                    corejs: 3
                  }],
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript'
              ],
              plugins: [
                "@babel/plugin-syntax-import-assertions",
                params.buildType === 'development' && 'react-refresh/babel'
              ].filter(Boolean)
            }
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `./src/frontend/${params.service}/index.html`,
        filename: 'index.html',
        inject: 'body'
      }),
      createDefinitions(params.buildType)
    ]
  };

  if (params.buildType === 'production') {
    frontendConfig.mode = 'production';
    frontendConfig.devtool = false;
  }
  else {
    frontendConfig.mode = 'development';
    frontendConfig.devtool = 'source-map';

    if (frontendConfig.plugins == null)
      return frontendConfig;

    frontendConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    frontendConfig.plugins.push(new ReactRefreshPlugin({
      esModule: true,
      overlay: {
        sockIntegration: 'whm',
      },
    }));
  }

  return frontendConfig;
}

