import path from 'path';

export default function getAliases(basePath: string | undefined) {
  const rootPath = basePath
    ? path.resolve(basePath, 'src')
    : path.resolve('src');
  const backendPath = path.resolve(rootPath, 'backend');

  return {
    '@config': path.resolve(backendPath, 'config'),
    '@config-runtime': path.resolve(backendPath, 'config', 'runtime'),
    '@logger': path.resolve(backendPath, 'logger'),
    '@backend': backendPath,
    '@webpack-config': path.resolve('config', 'webpack'),
  };
}
