import { BrowserWindow } from 'electron';
import { ProcessLog } from './schemas';

export const logCache: Map<string, ProcessLog[]> = new Map();

export function logForward(key: string, log: ProcessLog) {
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send('LiteLoader.liteloader_nonebot.logListener', key, log);
  });
}
