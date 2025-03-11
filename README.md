# ![KNUR Logo](misc/logo.svg)  KNUR Web Platform Starter 

## Overview
KNUR Web Platform Starter is a starter project for web platform development.
The main goal of this project is to provide a basic structure for web platform development with all necessary tools and configurations.
The main advantage of this project is that it gives you a possibility to develop a web platform with a single server that serves all components and static content.
This will not only simplify the development process but also make it easier to manage the project.
One server for all components and static content is only when development mode is used. 
In production and test mode project is split into several servers in docker compose.
This project is written in TypeScript and uses Webpack for bundling and building.


**Project is still in development and most of the features are not implemented yet.**


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

### Static configuration
Static configuration is a configuration that is hardcoded in the project and is not changed during runtime.
Currently, there are three types of static configuration:
- common configuration - configuration that is common for both frontend and backend
- frontend configuration - configuration that is specific for frontend
- backend configuration - configuration that is specific for backend (`src/backend/config`)

Common static configuration contains information such as API Endpoint routes for several domains, frontend routes, etc.
Backend static configuration contains information such as logger detailed configuration, etc.

### Runtime configuration
Runtime configuration is a configuration that is provided during runtime and can be changed during runtime.
This configuration is avaliable only in backend components and is read from `dist/server-config.yaml` file.
Configuration is build based on convict library and is validated based on schemas provided in `src/backend/config/runtime/schemas` directory.
Configuration file name `server-config.yaml` is hardcoded in static configuration and is not changed during runtime.
Configuration file is looked up in the root directory of the project and when it is not found, default configuration is used.

**Currently available runtime configuration settings:**
- `logger.level` - Logging level (possible values: fatal, error, warn, info, debug, trace, silent)



