import path from 'path';

export default function getAliases(basePath : string | undefined) {
  const rootPath = basePath ? path.resolve(basePath, 'src') : path.resolve('src');
  const backendPath = path.resolve(rootPath, 'server');

  return {
    WebPackConfig: path.resolve('config', 'webpack'),
  };
}
