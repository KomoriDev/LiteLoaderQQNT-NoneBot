export enum LogLevel {
  STDOUT = 'STDOUT',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

export interface CustomLog<T = string> {
  time: string | Date;
  level: T;
  message: string;
}

export class ProcessLog implements CustomLog<LogLevel> {
  time: string | Date;
  level: LogLevel;
  message: string;

  constructor(message: string, level: LogLevel = LogLevel.STDOUT) {
    this.time = new Date().toISOString();
    this.level = level;
    this.message = message;
  }
}

export interface ProcessPerformance {
  cpu: number;
  mem: number;
}

export interface ProcessInfo {
  statusCode?: number;
  totalLog: number;
  isRunning: boolean;
  performance?: ProcessPerformance;
}
