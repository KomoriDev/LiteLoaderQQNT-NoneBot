import { log, localFetch } from '@/lib';

export const onSettingWindowCreated = async (view: HTMLElement) => {
  try {
    view.innerHTML = await (await localFetch('/renderer/views/view.html')).text();

    const botList = view.querySelector<HTMLButtonElement>('.bot-list')!;

    await window.liteloader_nonebot.getBots().then(data => {
      if (data.length === 0) {
        botList.innerHTML = `
          <setting-item>
            <div>
              <setting-text>当前还没有创建 Bot 喔</setting-text>
            </div>
            <setting-button class="btn-create-bot" data-type="primary">即刻创建</setting-button>
          </setting-item>
        `;
      } else {
        data.forEach((bot) => {
          botList.innerHTML += `
            <setting-item>
              <setting-text>${bot.name}</setting-text>
              <setting-button class="btn-show-bot" data-type="primary">查看</setting-button>
            </setting-item>
          `;
        });
      } 
      log(`loading config: ${data.values}`);
    }).catch (error => {
      botList.innerHTML = `<p>Error loading bot: ${error}</p>`;
    });
    
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
