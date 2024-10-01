import path from 'path';
import fs from 'fs/promises';
import { ipcMain, dialog, OpenDialogOptions } from 'electron';
import { readJsonFile, writeJsonFile, processTemplate } from '@/lib';
import { BotConfig } from '@/types';

const dataPath = LiteLoader.plugins.liteloader_nonebot.path.data;
const pluginPath = LiteLoader.plugins.liteloader_nonebot.path.plugin;

ipcMain.handle('LiteLoader.liteloader_nonebot.getBots', async () => {
  return await readJsonFile<BotConfig[]>(path.join(dataPath, 'bots.json'));
});

ipcMain.handle('LiteLoader.liteloader_nonebot.showOpenDialog', async (_, data: OpenDialogOptions) => {
  return await dialog.showOpenDialog(data);
});

ipcMain.handle('LiteLoader.liteloader_nonebot.setBot', async (_, config: BotConfig) => {
  return await writeJsonFile<BotConfig>(path.join(dataPath, 'bots.json'), config);
});

ipcMain.handle(
  'LiteLoader.liteloader_nonebot.createProject',
  async (_, output: string, replacements: Record<string, string>) => {
    const templatePath = `${pluginPath.replace(/\\/g, '/')}/template`;

    await fs.mkdir(output, { recursive: true });
    return await processTemplate(templatePath, output, replacements);
  }
);
