import { promises as fs } from 'fs';
import { PathLike } from 'fs';

async function checkFile(filePath: PathLike) {
  try {
    await fs.access(filePath);
  }
  catch {
    throw new Error(`File does not exist: ${filePath}`);
  }
}

export default {
  'file': {
    validate: checkFile,
    coerce: (val: string) => String(val)
  }
};

