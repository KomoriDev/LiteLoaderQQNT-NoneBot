import { localFetch } from '@/lib';
import log from '@/lib/log';

const pluginPath = LiteLoader.plugins.liteloader_nonebot.path.plugin;

export const onSettingWindowCreated = async (view: HTMLElement) => {
  try {
    log(`Loading welcome page from ${pluginPath}`);
    
    view.innerHTML = await (await localFetch('/renderer/views/welcome.html')).text();
    
    const officialWebsiteJumpBtn = view.querySelector<HTMLButtonElement>('.btn-official-website')!;
    officialWebsiteJumpBtn.onclick = () => {
      window.location.href = 'https://nonebot.dev';
    };
    const communityWebsiteJumpBtn = view.querySelector<HTMLButtonElement>('.btn-community-website')!;
    communityWebsiteJumpBtn.onclick = () => {
      window.location.href = 'https://x.none.bot';
    };
    const githubJumpBtn = view.querySelector<HTMLButtonElement>('.btn-github')!;
    githubJumpBtn.onclick = () => {
      window.location.href = 'https://github.com/KomoriDev/LiteLoaderQQNT-NoneBot';
    };
  } catch (error) {
    view.innerHTML = `<p>Error loading page: ${error}</p>`;
  }
};
  