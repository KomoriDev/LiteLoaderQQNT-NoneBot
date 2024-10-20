import path from 'path';
import { readJsonFile, writeJsonFile } from '@/lib';
import { BotConfig } from '@/types';

const dataPath = LiteLoader.plugins.liteloader_nonebot.path.data;

export async function getBotConfig(id: string | number): Promise<BotConfig> {
  const config = await readJsonFile<BotConfig[]>(path.join(dataPath, 'bots.json'));
  return config[Number(id)];
}

export async function updateBotConfig(id: number, key: string, value: any): Promise<void> {
  const filePath = path.join(dataPath, 'bots.json');
  const data = await readJsonFile<BotConfig[]>(filePath);

  if (id < 0 || id >= data.length) {
    throw new Error(`Invalid id: ${id}. It should be between 0 and ${data.length - 1}.`);
  }

  if (!(key in data[id])) {
    throw new Error(`Invalid key: ${key}. It does not exist in the BotConfig.`);
  }

  (data[id] as any)[key] = value;

  await writeJsonFile(filePath, data, 'overwrite');
}
