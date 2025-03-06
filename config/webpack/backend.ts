import { PathLike } from 'fs';
import webpack, { Configuration } from 'webpack';
import { BuildType } from './build-types.js';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import { fileURLToPath } from 'url';
const workDirPath = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(workDirPath, '..', '..', 'dist');

export default function createBackendConfig(name: string, entry: PathLike, buildType: BuildType) : Configuration {
  const output = path.resolve(distPath, buildType as string, name);
  const mode = buildType === 'development' ? 'development' : 'production';
  const componentMacro = `__COMPONENT_${name.toUpperCase()}__`;

  return {
    mode,
    target: 'node',
    externals: [nodeExternals()],
    entry: entry as string,
    output: {
      path: output,
      filename: 'main.js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: {
            loader: 'ts-loader',
            options: {
              logLevel: 'INFO',
              compilerOptions: {
                module: 'preserve',
                moduleResolution: 'bundler',
              },
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    experiments: {
      topLevelAwait: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEVELOPMENT__: buildType === 'development',
        __TEST__: buildType === 'test',
        __PRODUCTION__: buildType === 'production',
        [componentMacro]: true,
      }),
    ],
  };
}


