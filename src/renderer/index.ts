import { localFetch } from '@/lib';
import log from '@/lib/log';

const pluginPath = LiteLoader.plugins.liteloader_nonebot.path.plugin;

export const onSettingWindowCreated = async (view: HTMLElement) => {
  try {
    log(`Loading welcome page from ${pluginPath}`);
    
    view.innerHTML = await (await localFetch('/renderer/views/welcome.html')).text();
    
    const officialWebsiteJumpBtn = view.querySelector<HTMLButtonElement>('.btn-official-website')!;
    const communityWebsiteJumpBtn = view.querySelector<HTMLButtonElement>('.btn-community-website')!;
    const githubJumpBtn = view.querySelector<HTMLButtonElement>('.btn-github')!;
    
    officialWebsiteJumpBtn.onclick = () => LiteLoader.api.openExternal('https://nonebot.dev');
    communityWebsiteJumpBtn.onclick = () => LiteLoader.api.openExternal('https://x.none.bot');
    githubJumpBtn.onclick = () => LiteLoader.api.openExternal('https://github.com/KomoriDev/LiteLoaderQQNT-NoneBot');
  } catch (error) {
    view.innerHTML = `<p>Error loading page: ${error}</p>`;
  }
};
