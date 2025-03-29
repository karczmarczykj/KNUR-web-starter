import path from 'path';
import { Configuration } from 'webpack';
// Very important !!!! ts-loader will not work without importing this as .js file
// even if in reality it is a .ts file this is caused by the fact that ts-node/esm is used
// see package.json scripts for more info
import { BuildType } from './utils/build-types.js';
import chalk from 'chalk';
import createBackendConfig from './backend.js';
import { createFrontendConfig } from './frontend.js';
import services from './services.json' with { type: "json" };

export default (env: { buildMode?: string, service?: string }) => {
  const buildMode = env.buildMode as BuildType || "production" as BuildType;
  const service = env.service || "all";

  console.log('Building service ' + chalk.bold(service) + ' in ' + chalk.bold(buildMode) + ' mode');
  console.log('Available backend services: ' + chalk.bold(services.backend.join(', ')));
  console.log('Available frontend services: ' + chalk.bold(services.frontend.join(', ')));

  if (service !== 'all' && (!services.backend.includes(service) && !services.frontend.includes(service))) {
    console.error('Service ' + chalk.bold(service) + ' not found in services.json');
    process.exit(1);
  }
  let backendsToBuild = [ service ];
  let frontendsToBuild : string[] = [ ];
  if (service === 'all') {
    backendsToBuild = [...services.backend, ...services.frontend];
    frontendsToBuild = services.frontend;
  } else {
    backendsToBuild = [ service ];
    if (services.frontend.includes(service) && buildMode !== 'development') {
      frontendsToBuild = [ service ];
    }
  }

  const backendEntry = './src/backend/index.ts';
  let configurations: Configuration[] = [];


  if ( buildMode !== 'development' ) {
    console.log('Building frontends: ' + chalk.bold(frontendsToBuild.join(', ')));
    for (const frontendService of frontendsToBuild) {
      configurations.push(createFrontendConfig({ service: frontendService, buildType: buildMode, entry: `./src/frontend/${frontendService}/index.tsx` }));
    }
  } else {
    console.log('Frontends wont be build in case of development version');
  }

  console.log('Building backends: ' + chalk.bold(backendsToBuild.join(', ')));

  configurations.push(createBackendConfig(service, backendsToBuild, frontendsToBuild, backendEntry, buildMode));

  for (const configItem of configurations) {
    console.log(`Aliases for ${configItem.name}`);
    console.log(JSON.stringify(configItem.resolve?.alias));
  }
  return configurations;
};
