import path from 'path';
import treeKill from 'tree-kill';
import fs, { rm } from 'fs/promises';
import { spawn } from 'child_process';
import { ipcMain, dialog, OpenDialogOptions, BrowserWindow } from 'electron';

import { BotConfig } from '@/types';
import { getBotConfig, updateBotConfig } from './config';
import { getInstalledPython, syncBotDependencies } from './uv';
import { readJsonFile, writeJsonFile, processTemplate, logStorage } from '@/lib';

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
  const process = spawn('nb', ['run'], { cwd: config.path });

  if (config.pid === 0) {
    await updateBotConfig(Number(id), 'pid', process.pid);
  } else {
    throw new Error(`Process with PID ${config.pid} is already running.`);
  }

  process.stdout.on('data', (data) => {
    logStorage.add(data.toString());
  });

  process.stderr.on('data', (data) => {
    logStorage.add(data.toString());
  });

  logStorage.addListener(async (log: string) => {
    console.log('Sending log to renderer:', log);
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('LiteLoader.liteloader_nonebot.onBotLog', log);
    });
  });

  process.on('exit', async () => {
    treeKill(process.pid!);
    await updateBotConfig(Number(id), 'pid', 0);
  });

  process.on('close', async () => {
    await updateBotConfig(Number(id), 'pid', 0);
  });
});

ipcMain.handle('LiteLoader.liteloader_nonebot.stopBot', async (_, id: string) => {
  const config = await getBotConfig(id);

  if (config.pid !== 0) {
    treeKill(config.pid);
    await updateBotConfig(Number(id), 'pid', 0);
  }
});
