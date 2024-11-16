import path from 'path';
import { readJsonFile, writeJsonFile } from '@/lib';
import { BotConfig } from '@/types';
import { ProcessManager, Processor } from '@/lib/process/process';
import { LogStorageFather } from '@/lib/process/log';
import { BrowserWindow } from 'electron';

const dataPath = LiteLoader.plugins.liteloader_nonebot.path.data;

export async function getBotConfig(id: string | number): Promise<BotConfig> {
  const config = await readJsonFile<BotConfig[]>(path.join(dataPath, 'bots.json'));
  return config[Number(id)];
}

export async function updateBotConfig(id: number, key: string, value: any): Promise<void> {
  const filePath = path.join(dataPath, 'bots.json');
  const data = await readJsonFile<BotConfig[]>(filePath);
  const oldValue = data[id][key];

  if (id < 0 || id >= data.length) {
    throw new Error(`Invalid id: ${id}. It should be between 0 and ${data.length - 1}.`);
  }

  if (!(key in data[id])) {
    throw new Error(`Invalid key: ${key}. It does not exist in the BotConfig.`);
  }

  (data[id] as any)[key] = value;

  await writeJsonFile(filePath, data, 'overwrite');

  console.log(`修改 ${id} 配置 ${key}：${oldValue} -> ${value}`);
}

export async function syncBotStatus(): Promise<void> {
  const config = await readJsonFile<BotConfig[]>(path.join(dataPath, 'bots.json'));

  await Promise.all(
    config.map(async (bot, id) => {
      const process = ProcessManager.getProcess(String(id));

      if (bot.pid !== 0) {
        ProcessManager.addProcess(new Processor(['nb', 'run'], bot.path, undefined, 300), String(id));
        return;
      } else if (!process && bot.autoStart) {
        const process = new Processor(['nb', 'run'], bot.path, undefined, 300);

        process.logStorage.addListener(async (log) => {
          BrowserWindow.getAllWindows().forEach((win) => {
            win.webContents.send('LiteLoader.liteloader_nonebot.onBotLog', log);
          });
        });

        LogStorageFather.addStorage(process.logStorage, String(id));
        ProcessManager.addProcess(process, String(id));

        await updateBotConfig(id, 'isRunning', true);
        await process.start();
      }

      // const status = process.getStatus();
      // if (status.isRunning !== bot.isRunning) {
      //   await updateBotConfig(id, 'isRunning', status.isRunning);
      // }
    })
  );
}
