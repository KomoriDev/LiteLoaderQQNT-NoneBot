import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';
import fs from 'fs';
import psList from 'ps-list';
import treeKill from 'tree-kill';
import { LogStorage } from './log';

import { ProcessLog, ProcessInfo } from './schemas';

export class Processor {
  public process: ChildProcessWithoutNullStreams | null = null;
  public processIsRunning: boolean = false;
  public args: string[];
  public cwd: string;
  public env: NodeJS.ProcessEnv | undefined;
  public logStorage: LogStorage<ProcessLog>;

  constructor(args: string[], cwd: string, env: NodeJS.ProcessEnv | undefined, logDestroySeconds: number) {
    this.args = args;
    this.cwd = cwd;
    this.env = env;
    this.logStorage = new LogStorage(logDestroySeconds);
  }

  private async findDuplicateProcess(): Promise<number[]> {
    const duplicatePIDs: number[] = [];
    const processes = await psList();

    for (const proc of processes) {
      try {
        const processCwd = fs.readlinkSync(`/proc/${proc.pid}/cwd`);
        if (path.resolve(processCwd) === path.resolve(this.cwd)) {
          treeKill(proc.pid, 'SIGTERM');
          duplicatePIDs.push(proc.pid);
        }
      } catch (error) {
        continue;
      }
    }

    return duplicatePIDs;
  }

  private async processExecutor(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.process = spawn(this.args[0], this.args.slice(1), {
        cwd: this.cwd,
        env: this.env,
        detached: true,
        windowsHide: true,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      if (!this.process) {
        return reject(new Error('Failed to start process.'));
      }

      this.process.stdout?.on('data', (data) => {
        const output = data.toString();
        this.logStorage.add(new ProcessLog(output));
      });

      this.process.stderr?.on('data', (data) => {
        const errorOutput = data.toString();
        this.logStorage.add(new ProcessLog(errorOutput));
      });

      this.process.on('spawn', () => {
        this.processIsRunning = true;
        resolve();
      });

      this.process.on('close', (code) => {
        this.processIsRunning = false;
        this.logStorage.add(new ProcessLog(`Process finished with code: ${code}`));
        resolve();
      });
    });
  }

  public getStatus(): ProcessInfo {
    if (!this.process || this.process.killed) {
      return {
        statusCode: this.process?.exitCode || undefined,
        totalLog: this.logStorage.getCount(),
        isRunning: this.processIsRunning,
        performance: undefined,
      };
    }

    return {
      statusCode: this.process.exitCode || undefined,
      totalLog: this.logStorage.getCount(),
      isRunning: this.processIsRunning,
      performance: {
        cpu: Math.random() * 100,
        mem: Math.random() * 100,
      },
    };
  }

  public async start(): Promise<void> {
    if (this.processIsRunning) return;

    const duplicatePIDs = await this.findDuplicateProcess();
    if (duplicatePIDs.length > 0) {
      console.warn(`Possible duplicate processes found: ${duplicatePIDs.join(', ')}`);
    }

    await this.processExecutor();
  }

  public stop(): void {
    if (this.process) {
      const pid = this.process.pid;
      console.log(`stop pid ${pid}`);

      if (!pid) return;

      treeKill(pid, 'SIGTERM', (err) => {
        if (!err) {
          console.info(`Process ${pid} terminated.`);
          this.processIsRunning = false;
        }
      });
    }
  }

  public writeStdin(data: Buffer): Promise<number> {
    return new Promise((resolve, reject) => {
      if (this.process && this.process.stdin) {
        this.process.stdin.write(data, (err) => {
          if (err) reject(err);
          else resolve(data.length);
        });
      } else {
        reject(new Error('Process is not running.'));
      }
    });
  }
}

export class ProcessManager {
  private static processes: Map<string, Processor> = new Map();

  static getProcess(key: string): Processor | undefined {
    return this.processes.get(key);
  }

  static addProcess(process: Processor, key: string): void {
    if (key in this.processes) {
      throw new Error('ProcessAlreadyExists');
    }
    this.processes.set(key, process);
  }

  static removeProcess(key: string): void {
    const process = this.processes.get(key);
    if (!process) return;

    process.logStorage.listeners.clear();
    this.processes.delete(key);
  }
}
