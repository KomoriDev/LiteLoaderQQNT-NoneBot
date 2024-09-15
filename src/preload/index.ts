import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('nonebot', {
  // 获取 Liteloader 插件配置文件
  getConfig: () => ipcRenderer.sendSync('LiteLoader.nonebot.getConfig'),
  // 获取 Bot 配置文件
  getBotConfig: () => ipcRenderer.sendSync('LiteLoader.nonebot.getBotConfig'),
  // 更新 Liteloader 插件配置文件
  setConfig: (config) => ipcRenderer.send('LiteLoader.nonebot.setConfig', config),
  // 更新 Bot 配置文件
  setBotConfig: (config) => ipcRenderer.send('LiteLoader.nonebot.setBotConfig', config),
});