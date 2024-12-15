export interface Python {
  version: string;
  path: string;
}

export interface BotConfig {
  /** Bot 名称 */
  name: string;
  /** Bot 目录 */
  path: string;
  /** pid */
  pid: number;
  /** 是否自启动 */
  autoStart: boolean;
  /** Python 信息 */
  python: Python;
}

export interface NontBotConfig {
  /** NoneBot 运行所使用的驱动器 */
  driver?: string[];
  /** 当 NoneBot 作为服务端时，监听的 IP / 主机名 */
  host?: string;
  /** 当 NoneBot 作为服务端时，监听的端口 */
  port?: number;
  /** NoneBot 日志输出等级 */
  logLevel?: 'TRACE' | 'DEBUG' | 'INFO';
  /** 调用平台接口的超时时间，单位为秒 */
  apiTimeout?: number;
  /** 机器人超级用户，可以使用权限 `SUPERUSER` */
  superUsers?: string[];
  /** 机器人昵称 */
  nickname?: string[];
  /** 命令消息的起始符 */
  commandStart?: string[];
  /** 命令消息的分割符 */
  commandSep?: string[];
  /** 用户会话超时时间 */
  sessionExpireTimeout?: number;
}

export interface Tag {
  label: string;
  color: string;
}

export interface Plugin {
  author: string;
  desc: string;
  homepage: string;
  is_official: boolean;
  module_name: string;
  name: string;
  project_link: string;
  skip_test: boolean;
  supported_adapters: string[] | null;
  tags: Array<Tag>;
  time: string;
  type: string;
  valid: boolean;
  version: string;
}

export type PluginsResponse = Array<Plugin>;

export interface Plugins {
  [K: string]: Plugin;
}
