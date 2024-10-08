import path from 'path';
import fs, { rm } from 'fs/promises';
import { ipcMain, dialog, OpenDialogOptions } from 'electron';
import { readJsonFile, writeJsonFile, processTemplate } from '@/lib';
import { BotConfig } from '@/types';
import { getInstalledPython, syncBotDependencies } from './uv';

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

ipcMain.handle('LiteLoader.liteloader_nonebot.deleteBot', async (_, id: string, folderPath: string) => {
  const jsonPath = path.join(dataPath, 'bots.json');
  const jsonData = await readJsonFile<BotConfig[]>(jsonPath);

  jsonData.splice(Number(id), 1);

  await fs.writeFile(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');
  await rm(folderPath, { recursive: true, force: true });
});

ipcMain.handle(
  'LiteLoader.liteloader_nonebot.createProject',
  async (_, output: string, replacements: Record<string, string>) => {
    const templatePath = `${pluginPath.replace(/\\/g, '/')}/template`;

    await fs.mkdir(output, { recursive: true });
    return await processTemplate(templatePath, output, replacements);
  }
);

ipcMain.handle('LiteLoader.liteloader_nonebot.getInstalledPython', async () => {
  return await getInstalledPython();
});

ipcMain.handle('LiteLoader.liteloader_nonebot.syncBotDependencies', async (_, bot: BotConfig) => {
  return await syncBotDependencies(bot);
});
