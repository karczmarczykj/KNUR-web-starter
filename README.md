![KNUR Web Platform Starter](misc/logo.svg)

# KNUR Web Platform Starter

## Overview
KNUR Web Platform Starter is a starter project for web platform development.
The main goal of this project is to provide a basic structure for web platform development with all necessary tools and configurations.
The main advantage of this project is that it gives you a possibility to create a web platform with a single server that serves all components and static content.
This project is written in TypeScript and uses Webpack for bundling and building.

_Project is still in development and most of the features are not implemented yet._


## Features
- One server for all components and static content
- Written in TypeScript from scratch
- Whole project is linted with ESLint and Prettier
- Project management scripts (creating snippets, components, pages, etc.)
- JEST for testing in TypeScript
- Webpack for bundling and building
- GitHub Workflow actions for CI/CD

## Getting Started
1. Clone the repository
2. Install dependencies
```bash
npm install
```

## Building the project

To build development version of the project run:
```bash
npm run build:dev
```

It should create a `dist\development` folder with all components and with every subdirectory should be `main.js` file that is ready to be served.

## Running the project

To run the project in development mode run:
```bash
npm run start:dev
```

## Running unit tests

Units tests are split into two categories: backend and frontend. To run backend tests run:
```bash
npm run test:unit:backend
```

## Linting the project

To lint the project run:
```bash
npm run lint
```

Or to fix linting issues and format code please run:
```bash
npm run lint:fix
```

## Project structure
```bash
.
├── .github
│   └── workflows
│       ├── e2e-dev-tests.yml
│       └── unit-tests.yml
├── config
│   ├── jest
│   │   └── backend.config.ts
│   └── webpack
│       ├── backend-aliases.json
│       ├── backend.ts
│       ├── build-types.ts
│       ├── frontend-aliases.json
│       └── webpack.config.ts
├── dist
│   ├── package.json
│   └── server-config.yaml
├── scripts
│   ├── generate-alias.mjs
│   └── remove-alias.mjs
├── src
│   ├── backend
│   │   ├── config
│   │   │   ├── index.ts
│   │   │   ├── runtime
│   │   │   │   ├── formats.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── schemas
│   │   │   │       ├── common.ts
│   │   │   │       └── server-api.ts
│   │   │   └── __tests__
│   │   │       └── index.spec.ts
│   │   ├── defined-globals.ts
│   │   ├── index.ts
│   │   └── logger
│   │       ├── index.ts
│   │       └── setup.ts
│   └── types
│       └── find-file-up.d.ts
├── .babelrc
├── eslint.config.js
├── .gitignore
├── package.json
├── package-lock.json
├── .prettierrc
├── README.md
└── tsconfig.json
```
## Aliases management
Aliases are managed by scripts in `scripts` directory with interactive mode. To add an alias to the project run:
```bash
node scripts/generate-alias.mjs
```
To remove an alias from the project run:
```bash
node scripts/remove-alias.mjs
```
Scripts are responsible to add or remove aliases in several configuration files:
- `tsconfig.json`
- `config/webpack/backend-aliases.json`
- `config/webpack/frontend-aliases.json`
- `config/jest/backend.config.ts`

It is possible to add/remove it manually but remember to update all configuration files.

## Importing modules

Beacuse of TypeScript used in both project and webpack configuration, it is necessary to use aliases for importing modules. To import a module use `@` alias. For example:
```typescript
import { definedGlobals } from '@backend/defined-globals';
```
Remeber that building the project using same tsconfig as used in webpack causes that:
  * It is not possible to add module extension to import statement:
    ```typescript
    import { definedGlobals } from '@backend/defined-globals.ts'; // This will not work
    ```
  * It is not possible to use relative paths in import statement:
    ```typescript
    import { definedGlobals } from '../../defined-globals'; // This will not work
    ```
  * It is not possible to use absolute paths in import statement:
    ```typescript
    import { definedGlobals } from '/src/backend/defined-globals'; // This will not work
    ```
## CI/CD
Project uses GitHub Actions for CI/CD. There are two workflows:
- `unit-tests.yml` - runs unit tests for backend and frontend
- `e2e-dev-tests.yml` - runs end-to-end tests for development version of the project

## Backend/frontend configuration implementation

System components must be flexible during runtime operation and aware of the environment for which they were built and in which they are running.
Therefore, information about how a component should work and in what environment it is running is provided from many different sources.

![Configuration diagram](misc/configuration.svg)

The configuration system is responsible for providing the necessary information to the components. The configuration system is divided into two several parts:
- static configuration (common, frontend, backend)
- runtime configuration
- build-time configuration

