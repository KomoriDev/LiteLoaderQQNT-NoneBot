import { contextBridge, ipcRenderer, OpenDialogOptions, OpenDialogReturnValue } from 'electron';
import { BotConfig, NontBotConfig } from '@/types';

export type ContextBridgeApi = {
  getBots: () => Promise<BotConfig[]>;
  getConfig: () => null;
  getBotConfig: () => NontBotConfig;
  setBot: (config: object) => void;
  setConfig: (config: object) => void;
  setBotConfig: (config: object) => void;
  showOpenDialog: (data: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
}

const exposedApi: ContextBridgeApi = {
  // 获取 Bot
  getBots: () => ipcRenderer.invoke('LiteLoader.liteloader_nonebot.getBots'),
  // 获取 Liteloader 插件配置文件
  getConfig: () => ipcRenderer.sendSync('LiteLoader.liteloader_nonebot.getConfig'),
  // 获取 Bot 配置文件
  getBotConfig: () => ipcRenderer.sendSync('LiteLoader.liteloader_nonebot.getBotConfig'),
  // 添加 Bot
  setBot: (config) => ipcRenderer.send('LiteLoader.liteloader_nonebot.setBot', config),
  // 更新 Liteloader 插件配置文件
  setConfig: (config) => ipcRenderer.send('LiteLoader.liteloader_nonebot.setConfig', config),
  // 更新 Bot 配置文件
  setBotConfig: (config) => ipcRenderer.send('LiteLoader.liteloader_nonebot.setBotConfig', config),
  // 通用文件选择窗口
  showOpenDialog: (data) => ipcRenderer.invoke('LiteLoader.liteloader_nonebot.showOpenDialog', data),
};

contextBridge.exposeInMainWorld('liteloader_nonebot', exposedApi);