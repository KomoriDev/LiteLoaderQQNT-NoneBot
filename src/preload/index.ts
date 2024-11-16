import { contextBridge, ipcRenderer, OpenDialogOptions, OpenDialogReturnValue } from 'electron';
import { BotConfig, NontBotConfig, Python } from '@/types';
import { ProcessLog } from '@/lib/process/schemas';

export type ContextBridgeApi = {
  getBots: () => Promise<BotConfig[]>;
  getConfig: () => null;
  getBotConfig: () => NontBotConfig;
  getInstalledPython: () => Promise<Python[]>;
  setBot: (config: BotConfig) => Promise<void>;
  setConfig: (config: object) => void;
  setBotConfig: (config: object) => void;
  deleteBot: (id: string, path: string) => Promise<void>;
  showOpenDialog: (data: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
  createProject: (output: string, replacements: Record<string, string>) => Promise<void>;
  syncBotDependencies: (bot: BotConfig) => Promise<void>;
  runBot: (id: string) => Promise<void>;
  stopBot: (id: string) => Promise<void>;
  onBotLog: (callback: (log: ProcessLog) => void) => void;
};

const exposedApi: ContextBridgeApi = {
  // 获取 Bot
  getBots: () => ipcRenderer.invoke('LiteLoader.liteloader_nonebot.getBots'),
  // 获取 Liteloader 插件配置文件
  getConfig: () => ipcRenderer.sendSync('LiteLoader.liteloader_nonebot.getConfig'),
  // 获取 Bot 配置文件
  getBotConfig: () => ipcRenderer.sendSync('LiteLoader.liteloader_nonebot.getBotConfig'),
  // 获取系统 Python 信息
  getInstalledPython: () => ipcRenderer.invoke('LiteLoader.liteloader_nonebot.getInstalledPython'),
  // 添加 Bot
  setBot: (config) => ipcRenderer.invoke('LiteLoader.liteloader_nonebot.setBot', config),
  // 更新 Liteloader 插件配置文件
  setConfig: (config) => ipcRenderer.send('LiteLoader.liteloader_nonebot.setConfig', config),
  // 更新 Bot 配置文件
  setBotConfig: (config) => ipcRenderer.send('LiteLoader.liteloader_nonebot.setBotConfig', config),
  // 删除 Bot
  deleteBot: (id, path) => ipcRenderer.invoke('LiteLoader.liteloader_nonebot.deleteBot', id, path),
  // 通用文件选择窗口
  showOpenDialog: (data) => ipcRenderer.invoke('LiteLoader.liteloader_nonebot.showOpenDialog', data),
  // 创建 Bot 项目
  createProject: (output, replacements) =>
    ipcRenderer.invoke('LiteLoader.liteloader_nonebot.createProject', output, replacements),
  // 同步 Bot 依赖
  syncBotDependencies: (bot) => ipcRenderer.invoke('LiteLoader.liteloader_nonebot.syncBotDependencies', bot),
  // 运行 Bot
  runBot: (id) => ipcRenderer.invoke('LiteLoader.liteloader_nonebot.runBot', id),
  // 关闭 Bot
  stopBot: (id) => ipcRenderer.invoke('LiteLoader.liteloader_nonebot.stopBot', id),
  // Bot 运行日志
  onBotLog: (callback: (log: ProcessLog) => void) =>
    ipcRenderer.on('LiteLoader.liteloader_nonebot.onBotLog', (_, log) => callback(log)),
};

contextBridge.exposeInMainWorld('liteloader_nonebot', exposedApi);
