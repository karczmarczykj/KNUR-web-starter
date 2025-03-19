import { BuildType, FrontendParams, ComponentsInterface } from './utils/build-types.js';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import { fileURLToPath } from 'url';
import components from './components.json' with { type: "json" };
import frontendAliases from './frontend-aliases.json' with { type: "json" };

console.log('components', components);

const workDirPath = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(workDirPath, '..', '..', 'dist');

function createFrontendConfig(params : FrontendParams): Configuration {
  const output = path.resolve(distPath, params.buildType as string, params.component);
  let publicPath = '/';
  if (params.component !== 'public')
    publicPath = `/${params.component}/`;

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
        template: `./src/frontend/${params.component}/index.html`,
        filename: 'index.html',
        chunks: [params.component]
      })
    ]
  };

  return frontendConfig;
}

export default function componentConfigurations(buildType : BuildType) : Configuration[] {
  const configurations: Configuration[] = [];
  for (const component of components.frontend) {
    configurations.push(createFrontendConfig({
      component,
      entry: `./src/frontend/${component}/index.js`,
      buildType
    }));
  }
  return configurations;
}

