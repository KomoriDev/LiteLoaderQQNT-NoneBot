import path from 'path';
import fs from 'fs-extra';
import { log } from '@/lib';

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const fullPath = path.resolve(__dirname, filePath);
  const fileContent = await fs.readFile(fullPath, 'utf-8');
  log('json', JSON.parse(fileContent) as string);
  return JSON.parse(fileContent) as T;
}

export async function writeJsonFile<T>(filePath: string, data: Partial<T>): Promise<void> {
  const fullPath = path.resolve(__dirname, filePath);

  const fileContent = await fs.readFile(fullPath, 'utf-8');
  const jsonData: T[] = JSON.parse(fileContent) as T[];

  jsonData.push(data as T);

  log('写入 bot.json', `路径：${fullPath}`, `数据：${data}`);
  return fs.writeFile(fullPath, JSON.stringify(jsonData, null, 2), 'utf-8');
}

export function replacePlaceholders(content: string, replacements: Record<string, string>) {
  let result = content;
  for (const key in replacements) {
    const placeholder = `{{ ${key} }}`;
    result = result.replace(new RegExp(placeholder, 'g'), replacements[key]);
  }
  return result;
}

export async function processTemplate(templateDir: string, targetDir: string, replacements: Record<string, string>): Promise<void> {
  const files = await fs.readdir(templateDir);

  for (const file of files) {
    const templateFilePath = path.join(templateDir, file);
    const targetFilePath = path.join(targetDir, file);
    const stat = await fs.stat(templateFilePath);

    if (stat.isDirectory()) {
      await fs.ensureDir(targetFilePath);
      await processTemplate(templateFilePath, targetFilePath, replacements);
    } else {
      await fs.ensureDir(path.dirname(targetFilePath));

      const content = await fs.readFile(templateFilePath, 'utf8');
      const replacedContent = replacePlaceholders(content, replacements);

      await fs.writeFile(targetFilePath, replacedContent);
    }
  }
}

