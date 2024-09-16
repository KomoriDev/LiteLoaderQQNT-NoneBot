import fs from 'fs';
import path from 'path';


export function readJsonFile<T>(filePath: string): T {
  const fullPath = path.resolve(__dirname, filePath);
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(fileContent) as T;
}

export function writeJsonFile<T>(filePath: string, data: Partial<T>): void {
  const fullPath = path.resolve(__dirname, filePath);

  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  const jsonData: T = JSON.parse(fileContent) as T;

  const updatedData: T = { ...jsonData, ...data };

  fs.writeFileSync(fullPath, JSON.stringify(updatedData, null, 2), 'utf-8');
}
