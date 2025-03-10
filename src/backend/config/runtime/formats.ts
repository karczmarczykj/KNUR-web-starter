import * as fs from 'fs';
import { Format } from 'convict';

function checkFile(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }
}

export interface SchemaFormats {
  [key: string]: Format;
}

export const schemaFormats: SchemaFormats = {
  file: {
    validate: checkFile,
    coerce: (val) => String(val),
  },
};
