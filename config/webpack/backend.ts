import { PathLike } from 'fs';
import { Configuration } from 'webpack';
import { BuildType } from './buildTypes.js';
import path from 'path';
import { fileURLToPath } from 'url';
const workDirPath = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(workDirPath, '..', '..', 'dist');

export default function createBackendConfig(name: string, entry: PathLike, buildType: BuildType) : Configuration {
  const output = path.resolve(distPath, buildType as string, name);

  const mode = buildType === 'development' ? 'development' : 'production';

  return {
    mode,
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
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
  };
}


