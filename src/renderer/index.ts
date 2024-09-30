import * as nodePath from 'path';
import { localFetch } from '@/lib';
import { BotConfig } from '@/types';
import { setupBotCreatedListener } from './listener';

const dataPath = LiteLoader.plugins.liteloader_nonebot.path.data;
const VERSION = LiteLoader.plugins.liteloader_nonebot.manifest['version'];

const botCreatedEvent = new CustomEvent('botCreated');

export const onSettingWindowCreated = async (view: HTMLElement) => {
  try {
    view.innerHTML = await (await localFetch('/renderer/views/view.html')).text();

    setupBotCreatedListener(view);

    const botList = view.querySelector<HTMLButtonElement>('.bot-list')!;

    await window.liteloader_nonebot
      .getBots()
      .then((data) => {
        if (data.length === 0) {
          botList.innerHTML = `
          <setting-item>
            <div>
              <setting-text>当前还没有创建 Bot 喔</setting-text>
            </div>
            <setting-button class="btn-show-modal" data-type="primary">即刻创建</setting-button>
            <setting-button class="btn-import-bot" data-type="secondary">从本地导入</setting-button>
          </setting-item>
        `;
        } else {
          const botPanelHeader = view.querySelector<HTMLElement>('.bot-panel-header')!;
          botPanelHeader.innerHTML = `
        <setting-list data-direction="column">  
          <setting-item>
            <setting-text>共 ${data.length} 个 Bot</setting-text>
            <setting-button class="btn-show-modal" data-type="secondary">创建 Bot</setting-text>
          </setting-item>
          <data-orientation data-orientation="horizontal"></data-orientation>
        </setting-list>
        `;
          data.forEach((bot) => {
            botList.innerHTML += `
            <setting-item>
              <setting-text>${bot.name}</setting-text>
              <setting-button class="btn-show-bot" data-type="primary">查看</setting-button>
            </setting-item>
          `;
          });
        }
        const openModalBtn = view.querySelector<HTMLButtonElement>('.btn-show-modal')!;
        const createBotModal = view.querySelector<HTMLElement>('.create-bot-modal')!;
        const botNameInput = view.querySelector<HTMLInputElement>('.input-bot-name')!;
        const selectLocalFolderInput = view.querySelector<HTMLInputElement>('.input-local-folder')!;
        const selectLocalFolderBtn = view.querySelector<HTMLButtonElement>('.select-local-folder')!;
        const closeModalBtn = view.querySelector<HTMLButtonElement>('.btn-close-modal')!;
        const confirmModalBtn = view.querySelector<HTMLButtonElement>('.btn-confirm-modal')!;

        openModalBtn.onclick = () => createBotModal.setAttribute('is-active', 'true');
        selectLocalFolderInput.onclick = () => (selectLocalFolderInput.value = '');
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
        confirmModalBtn.onclick = async () => {
          if (botNameInput.value === '') {
            alert('请输入 Bot 名称');
            return;
          }
          const botConfig: BotConfig = {
            name: botNameInput.value,
            path: selectLocalFolderInput.value ? selectLocalFolderInput.value : nodePath.join(dataPath, 'app'),
            autoStart: false,
          };
          const replacements = { 'name': botConfig.name };
          await window.liteloader_nonebot.createProject(botConfig.path, replacements).then(async () => {
            await window.liteloader_nonebot.setBot(botConfig).then(() => {
              createBotModal.removeAttribute('is-active');
              document.dispatchEvent(botCreatedEvent);
            });
          });
        };
      })
      .catch((error) => {
        botList.innerHTML = `<p>Error loading bot: ${error}</p>`;
      });

    const versionText = view.querySelector<HTMLElement>('#version');
    versionText ? (versionText.innerHTML += ` - v${VERSION}`) : '';

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
