import path from 'path';
import treeKill from 'tree-kill';
import fs, { rm } from 'fs/promises';
import { ipcMain, dialog, OpenDialogOptions } from 'electron';

import { BotConfig, PluginsResponse } from '@/types';
import { getBotConfig, updateBotConfig } from './config';
import { getInstalledPython, syncBotDependencies } from './uv';
import { readJsonFile, writeJsonFile, processTemplate } from '@/lib';
import { Processor, ProcessManager, LogStorageFather, logForward, ProcessLog } from '@/lib/process';

const dataPath = LiteLoader.plugins.liteloader_nonebot.path.data;
const pluginPath = LiteLoader.plugins.liteloader_nonebot.path.plugin;

ipcMain.handle('LiteLoader.liteloader_nonebot.getBots', async () => {
  return await readJsonFile<BotConfig[]>(path.join(dataPath, 'bots.json'));
});

ipcMain.handle('LiteLoader.liteloader_nonebot.showOpenDialog', async (_, data: OpenDialogOptions) => {
  return await dialog.showOpenDialog(data);
});

ipcMain.handle('LiteLoader.liteloader_nonebot.setBot', async (_, config: BotConfig) => {
  return await writeJsonFile<BotConfig>(path.join(dataPath, 'bots.json'), [config]);
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

ipcMain.handle('LiteLoader.liteloader_nonebot.runBot', async (_, id: string) => {
  const config = await getBotConfig(id);
  let process = ProcessManager.getProcess(id);

  if (process) {
    if (process.processIsRunning) {
      throw new Error(`Bot ${config.name} is already running`);
    } else {
      await process.start();
    }
  } else {
    process = new Processor(['nb', 'run'], config.path, undefined, 300);
  }

  process.logStorage.addListener('run-log', async (log: ProcessLog) => logForward(`run-bot-${id}`, log));

  LogStorageFather.addStorage(process.logStorage, `run-bot-${id}`);
  ProcessManager.addProcess(process, id);

  await process.start();
  await updateBotConfig(Number(id), 'pid', process.process?.pid);
});

ipcMain.handle('LiteLoader.liteloader_nonebot.stopBot', async (_, id: string) => {
  const process = ProcessManager.getProcess(id);

  if (process) {
    if (!process.processIsRunning) return;
    process.stop();
    await updateBotConfig(Number(id), 'pid', 0);
  } else {
    const config = await getBotConfig(id);
    treeKill(config.pid);
    await updateBotConfig(Number(id), 'pid', 0);
  }
  LogStorageFather.removeStorage(`run-bot-${id}`);
});

ipcMain.handle('LiteLoader.liteloader_nonebot.getLogHistory', (_, key: string) => {
  const logStorage = LogStorageFather.getStorage<ProcessLog>(key);
  return logStorage?.list();
});

ipcMain.handle('LiteLoader.liteloader_nonebot.fetchPlugins', async () => {
  const response = await fetch('https://registry.nonebot.dev/plugins.json', { method: 'GET' });
  const data: PluginsResponse = await response.json();
  return data;
});

ipcMain.handle('LiteLoader.liteloader_nonebot.fetchGithubUser', async (_, username: string) => {
  const response = await fetch(`https://api.github.com/users/${username}`, { method: 'GET' });
  const data = await response.json();
  return data;
});
