import { BuildType } from './build-types.js';
import fs from 'fs';

import { PathLike } from 'fs';
import webpack, { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import { fileURLToPath } from 'url';
const workDirPath = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(workDirPath, '..', '..', 'dist');

function createDefinitions(name: string, buildType: BuildType) {
  const componentMacro = `__COMPONENT_${name.toUpperCase()}__`;
  const definitions = {
    __DEVELOPMENT__: buildType === 'development',
    __TEST__: buildType === 'test',
    __PRODUCTION__: buildType === 'production',
    [componentMacro]: true,
  };

  return new webpack.DefinePlugin(definitions);
}

export default function createBackendConfig(
  name: string,
  entry: PathLike,
  buildType: BuildType
): Configuration {
  const output = path.resolve(distPath, buildType as string, name);
  const mode = buildType === 'development' ? 'development' : 'production';
  const backendAliasesFile = path.resolve(
    workDirPath,
    './backend-aliases.json'
  );
  let aliases: { [name: string]: string } = {};

  if (fs.existsSync(backendAliasesFile)) {
    aliases = JSON.parse(fs.readFileSync(backendAliasesFile, 'utf8'));
    for (const key in aliases) {
      aliases[key] = path.resolve(workDirPath, '..', '..', aliases[key]);
    }
  } else {
    console.error(`Aliases file not found: ${backendAliasesFile}`);
    process.exit(1);
  }

  return {
    mode,
    target: 'node',
    externals: [nodeExternals()],
    entry: entry as string,
    output: {
      path: output,
      filename: 'main.cjs',
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: aliases,
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
                noEmit: false,
                allowImportingTsExtensions: false,
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
    plugins: [createDefinitions(name, buildType)],
  };
}
