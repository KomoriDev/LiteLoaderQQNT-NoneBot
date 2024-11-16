import { spawn } from 'child_process';
import { Readable } from 'stream';
import { LogStorage } from './log';
import { ProcessLog } from './schemas';

type RunSubprocessOptions = {
  cwd?: string;
  stdin?: NodeJS.ReadStream | null;
  logStorage?: LogStorage<ProcessLog>;
};

type SubprocessResult = {
  process: ReturnType<typeof spawn>;
  logStorage?: LogStorage<ProcessLog>;
};

export async function runSubprocess(
  args: Array<string | Buffer | URL>,
  options: RunSubprocessOptions = {}
): Promise<SubprocessResult> {
  const { cwd, stdin, logStorage } = options;

  const stringArgs = args.map((arg) => arg.toString());

  const childProcess = spawn(stringArgs[0], stringArgs.slice(1), {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    detached: globalThis.process.platform === 'win32', // Windows equivalent of CREATE_NEW_PROCESS_GROUP
  });

  const readStream = async (stream: Readable | null, logStorage: LogStorage<ProcessLog>) => {
    if (stream) {
      for await (const chunk of stream) {
        const decodeLine = chunk.toString('utf-8').replace(/\r?\n$/, '');
        const logModel = new ProcessLog(decodeLine);
        await logStorage.add(logModel);
      }
    }
  };

  if (stdin) {
    stdin.pipe(childProcess.stdin!);
  }

  if (logStorage) {
    if (childProcess.stdout) {
      readStream(childProcess.stdout, logStorage);
    }
    if (childProcess.stderr) {
      readStream(childProcess.stderr, logStorage);
    }
  }

  return { process: childProcess, logStorage };
}
