import { exec } from 'child_process';
import { log } from '@/lib';
import { BotConfig, Python } from '@/types/config';

const os = LiteLoader.os.platform;

function checkUVInstalled(): Promise<boolean> {
  return new Promise((resolve) => {
    exec('uv -V', (error, _, stderr) => {
      if (error || stderr) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

function installUV(): Promise<void> {
  return new Promise((resolve, reject) => {
    const installCommand =
      os === 'win32'
        ? 'powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"'
        : os === 'linux'
          ? 'curl -LsSf https://astral.sh/uv/install.sh | sh'
          : os === 'darwin'
            ? 'curl -LsSf https://astral.sh/uv/install.sh | sh'
            : 'curl -LsSf https://astral.sh/uv/install.sh | sh';
    exec(installCommand, (error, _, stderr) => {
      if (error) {
        reject(`安装 uv 失败: ${stderr}`);
      } else {
        resolve();
      }
    });
  });
}

function checkPythonInstalled(): Promise<boolean> {
  return new Promise((resolve) => {
    exec('uv python list --only-installed', (error, _, stderr) => {
      if (error || stderr) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

function installPython(version: string = '3.12'): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(`uv python install ${version}`, (error, _, stderr) => {
      if (error) {
        reject(`安装 Python 失败: ${stderr}`);
      } else {
        resolve();
      }
    });
  });
}

export function getInstalledPython(): Promise<Python[]> {
  return new Promise((resolve, reject) => {
    const python: Python[] = [];

    exec('uv python list --only-installed', (error, stdout) => {
      if (error) {
        return reject(error);
      }

      const lines = stdout.split('\n');
      lines.forEach((line) => {
        // line: cpython-3.12.6-windows-x86_64-none     C:\Users\Administrator\AppData\Roaming\uv\python\cpython-3.12.6-windows-x86_64-none\python.exe

        if (line.startsWith('cpython')) {
          const version = line.split(' ')[0].split('-')[1];
          const path = line.match(/ ([A-Z]:\\.*)/i)![1];
          python.push({ version, path });
        }
      });

      resolve(python);
    });
  });
}

export function syncBotDependencies(bot: BotConfig): Promise<void> {
  log(`正在同步 ${bot.name} 的依赖，目录：${bot.path}`);
  return new Promise((resolve, reject) => {
    exec('uv sync --all-extras', { 'cwd': bot.path }, (error, _, stderr) => {
      if (error) {
        reject(`安装依赖失败: ${stderr}`);
      } else {
        resolve();
      }
    });
  });
}

checkUVInstalled()
  .then((isInstalled) => {
    if (isInstalled) {
      log('uv 已安装');
      return Promise.resolve();
    } else {
      log('uv 未安装，正在安装...');
      return installUV();
    }
  })
  .then(() => {
    log('uv 安装完成');
  })
  .catch((error) => {
    error('操作失败:', error);
  });

checkPythonInstalled()
  .then((isInstalled) => {
    if (isInstalled) {
      log('Python 已安装');
      return Promise.resolve();
    } else {
      log('Python 未安装，正在安装...');
      return installPython();
    }
  })
  .then(() => {
    log('Python 安装完成');
  })
  .catch((error) => {
    error('操作失败:', error);
  });
