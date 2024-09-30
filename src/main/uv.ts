import { exec } from 'child_process';
import { log } from '@/lib';

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
