export const setupBotCreatedListener = (view: HTMLElement) => {
  const botList = view.querySelector<HTMLButtonElement>('.bot-list')!;

  document.addEventListener('botCreated', async () => {
    const data = await window.liteloader_nonebot.getBots();
    botList.innerHTML = '';

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
  });
};
