/// <reference types="vite/client" />

import { IpcRenderer } from 'electron';
import type { ContextBridgeApi, ipcRendererBridgeApi } from './preload';

declare namespace LiteLoader {
  interface ILiteLoaderPath {
    root: string;
    profile: string;
    data: string;
    plugins: string;
  }

  interface ILiteLoaderVersion {
    qqnt: string;
    liteloader: string;
    node: string;
    chrome: string;
    electron: string;
  }

  interface ILiteLoaderOS {
    platform: 'win32' | 'linux' | 'darwin';
  }

  interface ILiteLoaderPackage {
    liteloader: object;
    qqnt: object;
  }

  interface ILiteLoaderPlugin {
    manifest: object;
    incompatible: boolean;
    disabled: boolean;
    path: ILiteLoaderPluginPath;
  }

  interface ILiteLoaderPluginPath {
    plugin: string;
    data: string;
    injects: ILiteLoaderPluginPathInject;
  }

  interface ILiteLoaderPluginPathInject {
    main: string;
    renderer: string;
    preload: string;
  }

  interface ILiteLoaderAPI {
    openPath: (path: string) => void;
    openExternal: (url: string) => void;
    disablePlugin: (slug: string) => void;
    config: ILiteLoaderAPIConfig;
  }

  interface ILiteLoaderAPIConfig {
    set: <IConfig = unknown>(slug: string, new_config: IConfig) => unknown;
    get: <IConfig = unknown>(slug: string, default_config?: IConfig) => IConfig;
  }
}

declare interface LiteLoader {
  path: LiteLoader.ILiteLoaderPath;
  versions: LiteLoader.ILiteLoaderVersion;
  os: LiteLoader.ILiteLoaderOS;
  package: LiteLoader.ILiteLoaderPackage;
  config: {
    LiteLoader: {
      disabled_plugins: string[];
    };
  };
  plugins: Record<string, LiteLoader.ILiteLoaderPlugin>;
  api: LiteLoader.ILiteLoaderAPI;
}

declare global {
  const LiteLoader: LiteLoader;

  interface Window {
    ipcRenderer: IpcRenderer;
    liteloader_nonebot: ContextBridgeApi;
  }
}
