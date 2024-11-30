<script setup lang="ts">
import path from 'path';
import { toast } from 'vue-sonner';
import { onMounted, reactive, ref } from 'vue';
import { BotConfig, Python } from '@/types';
import { router } from '@@/router';

import { Button } from '@@/components/ui/button';

const pythonList = ref<Python[]>([]);
const botList = ref<BotConfig[]>([]);
const isShowModal = ref<boolean>(false);
const isButtonDisabled = ref<boolean>(false);

interface Modal {
  botName?: string;
  botPath?: string;
}

const createBotModal = reactive<Modal>({});

const dataPath = LiteLoader.plugins.liteloader_nonebot.path.data;
const version = LiteLoader.plugins.liteloader_nonebot.manifest['version'];

const openExternal = (url: string) => {
  LiteLoader.api.openExternal(url);
};

const getBots = async () => {
  await window.liteloader_nonebot.getBots().then((data) => (botList.value = data));
};

const selectLocalFolder = async () => {
  const result = await window.liteloader_nonebot.showOpenDialog({
    title: '请选择文件夹',
    properties: ['openDirectory'],
    buttonLabel: '选择文件夹',
  });
  if (!result.canceled) {
    createBotModal.botPath = result.filePaths[0];
  }
};

const confirmModal = async () => {
  await toast.promise(
    (async () => {
      isButtonDisabled.value = true;

      try {
        const data = await window.liteloader_nonebot.getInstalledPython();

        data.forEach((py) => {
          pythonList.value.push(py);
        });

        if (!createBotModal.botName) {
          isButtonDisabled.value = false;
          throw new Error('请输入 Bot 名称');
        }

        if (!createBotModal.botPath) {
          createBotModal.botPath = path.join(dataPath, 'app');
        }

        const botConfig: BotConfig = {
          name: createBotModal.botName,
          path: createBotModal.botPath,
          pid: 0,
          autoStart: false,
          python: pythonList.value[0],
        };

        const sanitizedBotConfig: BotConfig = {
          ...botConfig,
          path: botConfig.path.replace(/\\/g, '/'),
          python: {
            ...botConfig.python,
            path: botConfig.python.path.replace(/\\/g, '/'),
          },
        };

        await window.liteloader_nonebot.createProject(botConfig.path, {
          'name': botConfig.name,
          'pyVersion': botConfig.python.version.split('.').slice(0, 2).join('.'),
        });

        await window.liteloader_nonebot.setBot(sanitizedBotConfig);

        await window.liteloader_nonebot.syncBotDependencies(sanitizedBotConfig);

        isShowModal.value = false;
        getBots();

        return `机器人『 ${botConfig.name} 』创建成功`;
      } catch (error) {
        console.error(error);
        throw error;
      }
    })(),
    {
      loading: '创建中，请稍候...',
      success: (message: string) => message,
      error: (error) => `创建失败: ${error.message || error}`,
    }
  );
};

onMounted(async () => {
  await getBots();
});
</script>

<template>
  <setting-section data-title="机器人">
    <setting-panel v-if="botList.length === 0">
      <setting-list data-direction="row">
        <setting-item>
          <setting-text>当前还没有创建 Bot 喔</setting-text>
          <span class="flex gap-1 justify-center mt-0.5">
            <Button
              variant="primary"
              @click="
                isShowModal = true;
                isButtonDisabled = false;
              "
              >即刻创建</Button
            >
            <Button variant="secondary">从本地导入</Button>
          </span>
        </setting-item>
      </setting-list>
    </setting-panel>
    <setting-panel v-else>
      <setting-list data-direction="column">
        <setting-item>
          <setting-text>共 {{ botList.length }} 个 Bot</setting-text>
          <Button
            variant="secondary"
            @click="
              isShowModal = true;
              isButtonDisabled = false;
            "
            >创建 Bot</Button
          >
        </setting-item>
        <data-orientation data-orientation="horizontal"></data-orientation>
        <setting-item v-for="(bot, index) in botList" :key="index">
          <div class="flex gap-2 items-center">
            <span v-if="bot?.pid === 0" class="w-1.5 h-1.5 mt-0.5 rounded-full bg-red-500"></span>
            <span v-else class="w-1.5 h-1.5 mt-0.5 rounded-full bg-green-500"></span>
            <setting-text>{{ bot.name }}</setting-text>
          </div>
          <Button variant="primary" @click="router.push(`/bot/${index}`)">查看</Button>
        </setting-item>
      </setting-list>
    </setting-panel>
    <setting-modal v-if="isShowModal" data-title="创建 Bot" is-active>
      <setting-section>
        <setting-panel>
          <setting-list data-direction="column">
            <setting-item data-direction="column">
              <setting-text style="margin-right: 20px">名称</setting-text>
              <input
                v-model="createBotModal.botName"
                placeholder="请输入 Bot 名称"
                class="input-text"
                type="text"
                spellcheck="false"
              />
            </setting-item>
            <setting-item data-direction="column">
              <div>
                <div style="display: flex; align-items: center; margin-bottom: 2px">
                  <setting-text>目录</setting-text>
                  <setting-text data-type="secondary" style="margin-left: 5px; margin-right: 5px">-</setting-text>
                  <setting-text data-type="secondary">留空则使用默认值</setting-text>
                </div>
                <input
                  v-model="createBotModal.botPath"
                  title="移除路径"
                  class="input-text"
                  type="text"
                  spellcheck="false"
                  readonly
                  style="cursor: pointer"
                  :placeholder="createBotModal.botPath ? createBotModal.botPath : '请选择 Bot 目录'"
                  @click="createBotModal.botPath = ''"
                />
              </div>
              <Button variant="secondary" @click="selectLocalFolder">选择</Button>
            </setting-item>
          </setting-list>
        </setting-panel>
        <div style="display: flex; justify-content: flex-end; gap: 5px; margin-bottom: 20px">
          <Button variant="secondary" @click="isShowModal = false">取消</Button>
          <Button
            variant="primary"
            :style="isButtonDisabled ? 'opacity: 0.3; cursor: not-allowed; pointer-events: none;' : ''"
            @click="confirmModal"
          >
            确定
          </Button>
        </div>
      </setting-section>
    </setting-modal>
  </setting-section>

  <setting-section data-title="需知">
    <setting-panel>
      <setting-list data-direction="column">
        <setting-item>
          <div>
            <setting-text>官方文档</setting-text>
            <setting-text data-type="secondary">https://nonebot.dev</setting-text>
          </div>
          <Button variant="secondary" @click="openExternal('https://nonebot.dev')"> 进去瞅瞅 </Button>
        </setting-item>
        <setting-item>
          <div>
            <setting-text>社区文档</setting-text>
            <setting-text data-type="secondary">https://x.none.bot</setting-text>
          </div>
          <Button variant="secondary" @click="openExternal('https://x.none.bot')"> 进去瞅瞅 </Button>
        </setting-item>
      </setting-list>
    </setting-panel>
  </setting-section>

  <setting-section data-title="关于">
    <setting-panel>
      <setting-list data-direction="column">
        <setting-item>
          <div>
            <setting-text>LiteLoader NoneBot - v{{ version }}</setting-text>
            <setting-text data-type="secondary"
              >在 QQ 上管理你的 NoneBot 应用 / Manage your NoneBot App on QQ</setting-text
            >
          </div>
          <Button variant="secondary" @click="openExternal('https://github.com/KomoriDev/LiteLoaderQQNT-NoneBot')">
            Github
          </Button>
        </setting-item>
        <setting-item>
          <div class="flex gap-1">
            <setting-text>赞助</setting-text>
            <setting-text v-if="new Date().getDay() === 4" data-type="secondary">
              KFCError: KFC Crazy Thursday V me ￥50
            </setting-text>
          </div>
          <Button
            variant="secondary"
            style="border-color: #8060da"
            @click="openExternal('https://afdian.com/@komoridev')"
          >
            {{ new Date().getDay() === 4 ? 'V我50' : '请杯咖啡' }}
          </Button>
        </setting-item>
        <setting-item>
          <setting-text>开源协议</setting-text>
          <setting-text data-type="secondary">AGPL-3.0 license</setting-text>
        </setting-item>
      </setting-list>
    </setting-panel>
  </setting-section>
</template>

<style scoped>
.input-text {
  align-self: normal;
  height: 24px;
  flex: 1;
  border-radius: 4px;
  margin-right: 16px;
  transition: all 100ms ease-out;
  padding-left: 5px;
  background-color: var(--overlay_active);
}

.input-text:last-child {
  margin-right: 0;
}

@media (prefers-color-scheme: light) {
  .input-text {
    color: black;
  }
}

@media (prefers-color-scheme: dark) {
  .input-text {
    color: white;
  }
}
</style>
