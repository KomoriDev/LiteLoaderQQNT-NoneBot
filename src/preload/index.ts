import { contextBridge, ipcRenderer, OpenDialogOptions, OpenDialogReturnValue } from 'electron';
import { ProcessLog } from '@/lib/process/schemas';

import type { BotConfig, NontBotConfig, Python } from '@/types/config';
import type { Adapter, AdaptersResponse } from '@/types/adapter';
import type { Driver, DriversResponse } from '@/types/driver';
import type { Plugin, PluginsResponse } from '@/types/plugin';

export type RegistryDataResponseTypes = {
  adapter: AdaptersResponse;
  driver: DriversResponse;
  plugin: PluginsResponse;
};
export type RegistryDataType = keyof RegistryDataResponseTypes;

export type ResourceTypes = {
  adapter: Adapter;
  driver: Driver;
  plugin: Plugin;
};

export type Resource = Adapter | Driver | Plugin;

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
  getLogHistory: (key: string) => Promise<ProcessLog[]>;
  logListener: (callback: (key: string, log: ProcessLog) => void) => void;
  fetchRegistryData: <T extends RegistryDataType>(dataType: T) => Promise<ResourceTypes[T][]>;
  fetchGithubUser: (username: string) => Promise<any>;
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
  // 历史日志
  getLogHistory: (key) => ipcRenderer.invoke('LiteLoader.liteloader_nonebot.getLogHistory', key),
  // 进程日志
  logListener: (callback: (key: string, log: ProcessLog) => void) =>
    ipcRenderer.on('LiteLoader.liteloader_nonebot.logListener', (_, key, log) => callback(key, log)),
  // 获取测试数据
  fetchRegistryData: (dataType) => ipcRenderer.invoke('LiteLoader.liteloader_nonebot.fetchRegistryData', dataType),
  // 获取 Github 账户信息
  fetchGithubUser: (username) => ipcRenderer.invoke('LiteLoader.liteloader_nonebot.fetchGithubUser', username),
};

contextBridge.exposeInMainWorld('liteloader_nonebot', exposedApi);
