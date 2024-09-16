import { log, localFetch } from '@/lib';

const VERSION = LiteLoader.plugins.liteloader_nonebot.manifest['version'];

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
            <setting-button class="btn-import-bot" data-type="secondary">从本地导入</setting-button>
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

    const createBotBtn = view.querySelector<HTMLButtonElement>('.btn-create-bot')!;
    const createBotModal = view.querySelector<HTMLElement>('.create-bot-modal')!;
    const selectLocalFolderInput = view.querySelector<HTMLInputElement>('.input-local-folder')!;
    const selectLocalFolderBtn = view.querySelector<HTMLButtonElement>('.select-local-folder')!;
    const closeModalBtn = view.querySelector<HTMLButtonElement>('.btn-close-modal')!;
    
    createBotBtn.onclick = () => createBotModal.setAttribute('is-active', 'true');
    selectLocalFolderInput.onclick = () => selectLocalFolderInput.value = '';
    selectLocalFolderBtn.onclick = async () => {
      const result = await window.liteloader_nonebot.showOpenDialog({
        title: '请选择文件夹',
        properties: ['openDirectory'],
        buttonLabel: '选择文件夹',
      });
      if (!result.canceled) {
        selectLocalFolderInput.value = result.filePaths[0];
      }
    };
    closeModalBtn.onclick = () => createBotModal.removeAttribute('is-active');

    const versionText = view.querySelector<HTMLElement>('#version');
    versionText ? versionText.innerHTML += ` - v${VERSION}` : '';

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
