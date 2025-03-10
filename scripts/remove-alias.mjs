import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';

// Convert `import.meta.url` to directory path (`__dirname` equivalent in ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.resolve(__dirname, '../config');
const frontendAliasesPath = path.join(
  configPath,
  'webpack/frontend-aliases.json'
);
const backendAliasesPath = path.join(
  configPath,
  'webpack/backend-aliases.json'
);
const tsconfigPath = path.resolve(__dirname, '../tsconfig.json');

// Function to remove an alias
async function removeAlias() {
  if (!fs.existsSync(configPath)) {
    console.error("Error: The 'config/' directory does not exist!");
    return;
  }

  const { environment } = await inquirer.prompt([
    {
      type: 'list',
      name: 'environment',
      message: 'Do you want to remove an alias from frontend or backend?',
      choices: ['Frontend', 'Backend'],
    },
  ]);

  const aliasFilePath =
    environment === 'Frontend' ? frontendAliasesPath : backendAliasesPath;

  if (!fs.existsSync(aliasFilePath)) {
    console.error(`Error: ${aliasFilePath} does not exist or has no aliases.`);
    return;
  }

  const aliases = JSON.parse(fs.readFileSync(aliasFilePath, 'utf8'));
  const aliasKeys = Object.keys(aliases);

  if (aliasKeys.length === 0) {
    console.log(`No aliases found in ${aliasFilePath}.`);
    return;
  }

  const { aliasToRemove } = await inquirer.prompt([
    {
      type: 'list',
      name: 'aliasToRemove',
      message: 'Select an alias to remove:',
      choices: aliasKeys,
    },
  ]);

  // Remove selected alias
  delete aliases[aliasToRemove];

  // Save updated aliases
  fs.writeFileSync(aliasFilePath, JSON.stringify(aliases, null, 2));
  console.log(
    `Alias '${aliasToRemove}' has been removed from ${aliasFilePath}.`
  );

  // Update `tsconfig.json`
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

    if (
      tsconfig.compilerOptions &&
      tsconfig.compilerOptions.paths &&
      tsconfig.compilerOptions.paths[aliasToRemove]
    ) {
      delete tsconfig.compilerOptions.paths[aliasToRemove];
      if (tsconfig.compilerOptions.paths[`${aliasToRemove}/*`]) {
        delete tsconfig.compilerOptions.paths[`${aliasToRemove}/*`];
      }

      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
      console.log(`Alias '${aliasToRemove}' removed from tsconfig.json.`);
    }
  }
}

removeAlias().catch(console.error);
