import fs from 'fs';
import path from 'path';


export function readJsonFile<T>(filePath: string): T {
  const fullPath = path.resolve(__dirname, filePath);
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(fileContent) as T;
}
