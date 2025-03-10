import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

// Convert `import.meta.url` to directory path (`__dirname` equivalent in ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.resolve(__dirname, "../src");
const configPath = path.resolve(__dirname, "../config");
const frontendAliasesPath = path.join(configPath, "webpack/frontend-aliases.json");
const backendAliasesPath = path.join(configPath, "webpack/backend-aliases.json");
const tsconfigPath = path.resolve(__dirname, "../tsconfig.json");

// Ensure the `config/` directory exists
if (!fs.existsSync(configPath)) {
  fs.mkdirSync(configPath, { recursive: true });
}

// Recursively get all directories inside `src/`
async function getDirectoriesRecursive(dir) {
  let results = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results.push(fullPath);
      results = results.concat(await getDirectoriesRecursive(fullPath));
    }
  }
  return results;
}

async function main() {
  if (!fs.existsSync(srcPath)) {
    console.error("Error: The 'src/' directory does not exist!");
    return;
  }

  const directories = (await getDirectoriesRecursive(srcPath)).map((dir) =>
    path.relative(srcPath, dir)
  );

  if (directories.length === 0) {
    console.log("No directories found inside 'src/'.");
    return;
  }

  const { environment, selectedDir, aliasName } = await inquirer.prompt([
    {
      type: "list",
      name: "environment",
      message: "Is this alias for frontend or backend?",
      choices: ["Frontend", "Backend"],
    },
    {
      type: "list",
      name: "selectedDir",
      message: "Select a directory to create an alias for:",
      choices: directories,
    },
    {
      type: "input",
      name: "aliasName",
      message: "Enter an alias name (e.g., @components):",
      validate: (input) =>
        input.startsWith("@") ? true : 'Alias must start with "@".',
    },
  ]);

  // Select the correct file based on user choice
  const aliasFilePath =
    environment === "Frontend" ? frontendAliasesPath : backendAliasesPath;

  let aliases = {};
  if (fs.existsSync(aliasFilePath)) {
    aliases = JSON.parse(fs.readFileSync(aliasFilePath, "utf8"));
  }

  aliases[aliasName] = `./src/${selectedDir}`;

  // Save aliases to the correct JSON file
  fs.writeFileSync(aliasFilePath, JSON.stringify(aliases, null, 2));
  console.log(
    `Alias '${aliasName}' -> '${selectedDir}' has been saved to ${aliasFilePath}.`
  );

  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));

    if (!tsconfig.compilerOptions) 
        tsconfig.compilerOptions = {};
    if (!tsconfig.compilerOptions.paths) 
        tsconfig.compilerOptions.paths = {};

    tsconfig.compilerOptions.paths[`${aliasName}/*`] = [`${aliases[aliasName]}/*.ts`];
    tsconfig.compilerOptions.paths[aliasName] = [`${aliases[aliasName]}/index.ts`];

    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    console.log(`Alias '${aliasName}' added to tsconfig.json.`);
  } else {
    console.warn("Warning: tsconfig.json not found. Alias was not added.");
  }
}

main().catch(console.error);
