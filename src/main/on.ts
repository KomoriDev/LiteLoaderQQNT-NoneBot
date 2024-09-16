import path from 'path';
import { ipcMain, dialog, OpenDialogOptions } from 'electron';
import { log, readJsonFile, writeJsonFile } from '@/lib';
import { BotConfig } from '@/types';

const dataPath = LiteLoader.plugins.liteloader_nonebot.path.data;

ipcMain.handle('LiteLoader.liteloader_nonebot.getBots', async () => {
  log('loading bots.json...');
  return readJsonFile<BotConfig[]>(path.join(dataPath, 'bots.json'));
});

ipcMain.handle('LiteLoader.liteloader_nonebot.showOpenDialog', async (_, data: OpenDialogOptions) => {
  return await dialog.showOpenDialog(data);
});

ipcMain.handle('LiteLoader.liteloader_nonebot.setBot', async (_, config: object) => {
  return writeJsonFile<BotConfig>(path.join(dataPath, 'bots.json'), config);
});
