/**
 * 修改自 cli-plugin-webui
 * @src https://github.com/nonebot/cli-plugin-webui/blob/master/nb_cli_plugin_webui/app/handlers/process/log.py
 */

/**
 * MIT License
 *
 * Copyright (c) 2023 Kyomotoi

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * @author Kyomotoi
 * @website https://github.com/nonebot/cli-plugin-webui
 */

type LogListener<T> = (log: T) => Promise<void>;

export class LogStorage<T> {
  private count: number = 0;
  private logs: Map<number, T> = new Map();
  public listeners: Set<LogListener<T>> = new Set();
  private rotation: number;
  private maxLogs?: number;

  constructor(rotation: number = 5 * 60 * 1000, maxLogs?: number) {
    this.rotation = rotation;
    this.maxLogs = maxLogs;
  }

  async add(log: T): Promise<number> {
    if (this.maxLogs && this.logs.size >= this.maxLogs) {
      this.removeOldest();
    }

    const seq = ++this.count;
    this.logs.set(seq, log);

    setTimeout(() => this.remove(seq), this.rotation);

    await Promise.all(
      Array.from(this.listeners).map((listener) =>
        listener(log).catch((err) => {
          console.error('Error in listener:', err);
        })
      )
    );

    return seq;
  }

  private remove(seq: number): void {
    this.logs.delete(seq);
  }

  private removeOldest(): void {
    const oldestSeq = Math.min(...this.logs.keys());
    this.remove(oldestSeq);
  }

  list(reverse: boolean = false): T[] {
    const entries = Array.from(this.logs.entries());
    const sortedEntries = reverse ? entries.reverse() : entries;
    return sortedEntries.map(([_, log]) => log);
  }

  getCount(): number {
    return this.count;
  }

  addListener(listener: LogListener<T>): void {
    this.listeners.add(listener);
  }
  removeListener(listener: LogListener<T>): void {
    this.listeners.delete(listener);
  }
}

export class LogStorageFather {
  private static storages: Map<string, LogStorage<any>> = new Map();

  static getStorage<T>(key: string): LogStorage<T> | undefined {
    return this.storages.get(key);
  }

  static addStorage<T>(storage: LogStorage<T>, key: string): void {
    if (this.storages.has(key)) {
      throw new Error('LogStorageAlreadyExists');
    }
    this.storages.set(key, storage);
  }

  static removeStorage(key: string): void {
    this.storages.delete(key);
  }
}
