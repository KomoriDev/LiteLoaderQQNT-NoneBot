import path from 'path';
import { ipcMain } from 'electron';
import { log, readJsonFile } from '@/lib';
import { BotConfig } from '@/types';

const dataPath = LiteLoader.plugins.liteloader_nonebot.path.data;

ipcMain.handle('LiteLoader.liteloader_nonebot.getBots', async () => {
  log('loading bots.json...');
  return readJsonFile<BotConfig[]>(path.join(dataPath, 'bots.json'));
});