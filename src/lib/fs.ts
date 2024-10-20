import path from 'path';
import fs from 'fs-extra';

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const fullPath = path.resolve(__dirname, filePath);
  const fileContent = await fs.readFile(fullPath, 'utf-8');
  return JSON.parse(fileContent) as T;
}

export async function writeJsonFile<T>(
  filePath: string,
  data: T[],
  mode: 'append' | 'overwrite' = 'append'
): Promise<void> {
  let jsonData: T[] = [];
  const fullPath = path.resolve(__dirname, filePath);

  if (mode === 'append') {
    const fileContent = await fs.readFile(fullPath, 'utf-8');
    jsonData = JSON.parse(fileContent);
  }

  if (mode === 'append') {
    jsonData.push(...data);
  } else if (mode === 'overwrite') {
    jsonData = [...data];
  }

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

export async function processTemplate(
  templateDir: string,
  targetDir: string,
  replacements: Record<string, string>
): Promise<void> {
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
