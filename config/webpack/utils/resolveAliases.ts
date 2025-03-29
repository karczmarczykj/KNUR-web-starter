import path from 'path';

export default function resolveAliases(aliases : Readonly<Record<string, string>>, workDir : string) : Record<string, string> {
  const retval : Record<string, string> = {};
  for (const [alias, aliasPath] of Object.entries(aliases))
    retval[alias] = path.resolve(workDir, aliasPath );

  return retval;
}

