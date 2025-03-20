import type { Config } from 'jest';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

export default async (): Promise<Config> => {
  const backendAliasesPath = path.resolve(
    '.',
    'config',
    'webpack',
    'backend-aliases.json'
  );
  let aliases = {};

  if (fs.existsSync(backendAliasesPath)) {
    aliases = JSON.parse(fs.readFileSync(backendAliasesPath, 'utf8'));
  }

  const moduleNameMapper = Object.entries(aliases).reduce(
    (acc: { [name: string]: string }, [alias, targetPath]) => {
      acc[`^${alias}/(.*)$`] = `<rootDir>/${targetPath}/$1`;
      if (alias === '@config-runtime') {
        acc[`^${alias}$`] = `<rootDir>/${targetPath}/$1/__mocks__/index.ts`;
      } else if (alias === '#ansi-styles') {
        acc[`^${alias}$`] = '<rootDir>/node_modules/ansi-styles/index.js'
      } else
        acc[`^${alias}$`] = `<rootDir>/${targetPath}/$1/index.ts`;

      return acc;
    },
    {}
  );

  return {
    globals: {
      __DEV__: false,
      __TEST_JEST__: true,
      __TEST__: true,
    },
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['/node_modules/', '/frontned/'],
    coverageProvider: 'v8',
    moduleDirectories: ['node_modules'],
    moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'node'],
    testEnvironment: 'node',
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
      '^.+\\.ts?$': 'ts-jest',
    },
    moduleNameMapper,
    testMatch: [
      '**/src/**/__tests__/**/*.[jt]s?(x)',
      '**/src/**/?(*.)+(spec|test).[tj]s?(x)',
    ],
  };
};
