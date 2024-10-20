<script setup lang="ts">
import { toast } from 'vue-sonner';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronLeft, Ellipsis, Folder, Trash2, Terminal } from 'lucide-vue-next';

import { router } from '@@/router';
import { BotConfig } from '@/types';
import { Button } from '@@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@@/components/ui/dropdown-menu';

const route = useRoute();
const bot = ref<BotConfig>();
const logStorage = ref<string[]>();
const consoleModal = ref<Element>();

const getBot = async () => {
  await window.liteloader_nonebot.getBots().then((data) => (bot.value = data[Number(route.params.id as string)]));
};

const openBotFolder = () => {
  LiteLoader.api.openPath(bot.value!.path);
};

const deleteBot = async () => {
  try {
    await window.liteloader_nonebot.deleteBot(route.params.id as string, bot.value!.path);

    toast.success('操作成功', { description: `机器人『 ${bot.value!.name} 』删除成功` });
    router.push({ name: 'home' });
  } catch (error) {
    toast.error('操作失败', { description: String(error) });
  }
};

const runBot = async () => {
  try {
    await window.liteloader_nonebot.runBot(route.params.id as string);
  } catch (error) {
    toast.error('启动失败', { description: `机器人『 ${bot.value!.name} 』已在运行` });
  }
  getBot();
};

const stopBot = async () => {
  try {
    await window.liteloader_nonebot.stopBot(route.params.id as string);
  } catch (error) {
    toast.error('关闭失败', { description: String(error) });
  }
  getBot();
};

window.liteloader_nonebot.onBotLog((log) => {
  if (logStorage.value) {
    logStorage.value = [...logStorage.value, log];
  } else {
    logStorage.value = [log];
  }
});

onMounted(async () => {
  await getBot();
});
</script>

<template>
  <setting-modal ref="consoleModal" data-title="终端">
    <setting-section>
      <div v-if="logStorage">
        <setting-panel>
          {{ logStorage }}
        </setting-panel>
      </div>
      <div v-else class="flex flex-col gap-3 items-center justify-center mb-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          fill="none"
          version="1.1"
          width="100"
          height="100"
          viewBox="0 0 100 100"
        >
          <g>
            <path
              d="M31.2122,3.66407Q34.0098,2.52971,36.9236,1.7402Q39.8374,0.950684,42.825,0.51748L43.2555,3.48643Q37.6183,4.30383,32.3395,6.44422L31.2122,3.66407ZM11.8988,17.6225Q13.8511,15.3251,16.0653,13.279Q18.2795,11.2328,20.7235,9.46748L22.4801,11.8994Q17.8686,15.2303,14.1849,19.5652L11.8988,17.6225ZM1.23775,38.9436Q1.90313,36.0091,2.91563,33.1755Q3.92813,30.342,5.27315,27.6503L7.95676,28.9913Q5.41894,34.07,4.16349,39.607L1.23775,38.9436ZM1.62602,62.6475Q0.867231,59.7452,0.460874,56.7731Q0.0545177,53.801,0.00642588,50.8016L3.00604,50.7535Q3.09678,56.4127,4.52846,61.8886L1.62602,62.6475ZM12.9938,83.6235Q10.9654,81.3911,9.22017,78.931Q7.47491,76.471,6.03803,73.819L8.67575,72.3899Q11.3869,77.3939,15.2141,81.6061L12.9938,83.6235ZM32.7733,96.9387Q29.9437,95.9002,27.2594,94.5294Q24.575,93.1585,22.0748,91.4751L23.7503,88.9866Q28.4679,92.1629,33.8069,94.1224L32.7733,96.9387ZM56.342,99.5962Q53.1839,100,50,100Q47.2355,100,44.4879,99.6952L44.8187,96.7135Q47.4014,97,50,97Q52.9928,97,55.9615,96.6204L56.342,99.5962ZM78.6042,91.0097Q76.1363,92.7311,73.4798,94.1441Q70.8232,95.5571,68.0163,96.6413L66.9354,93.8428Q72.2314,91.7971,76.888,88.5491L78.6042,91.0097ZM94.351,73.0866Q92.9583,75.762,91.2542,78.2506Q89.55,80.7392,87.559,83.0049L85.3055,81.0246Q89.0621,76.7495,91.6899,71.7014L94.351,73.0866ZM99.9741,48.3918Q100,49.1957,100,50Q100,52.995,99.6425,55.9685Q99.285,58.9421,98.5751,61.8517L95.6606,61.1406Q97,55.6508,97,50Q97,49.244,96.9757,48.4883L99.9741,48.3918ZM93.5599,25.4534Q95.0403,28.0804,96.1942,30.8663Q97.3481,33.6522,98.1589,36.5566L95.2693,37.3632Q93.7396,31.883,90.9463,26.9262L93.5599,25.4534ZM77.2371,8.06981Q79.762,9.70993,82.0718,11.6412Q84.3816,13.5724,86.443,15.7669L84.2565,17.8209Q80.3669,13.6803,75.6029,10.5856L77.2371,8.06981ZM66.435,2.7783L65.4489,5.6116Q60.0722,3.74029,54.4043,3.20681L54.6854,0.220013Q57.6893,0.502746,60.6374,1.14465Q63.5855,1.78655,66.435,2.7783Z"
              fill-rule="evenodd"
              fill="#262626"
              fill-opacity="1"
            />
          </g>
        </svg>
        <h1>No Bot Running</h1>
      </div>
    </setting-section>
  </setting-modal>

  <header class="header">
    <nav class="flex gap-2 items-center">
      <Button variant="secondary" size="icon" @click="router.push({ name: 'home' })">
        <ChevronLeft class="w-3 h-3" />
      </Button>
      <p>{{ bot?.name }}</p>
    </nav>
    <nav class="flex gap-2 items-center">
      <Button variant="secondary" size="icon" @click="consoleModal!.setAttribute('is-active', 'true')">
        <Terminal class="w-3 h-3" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button class="border-0" variant="secondary" size="icon">
            <Ellipsis class="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-40 mr-3 bg-[#ffffff] dark:bg-[#1b1b1b]">
          <DropdownMenuGroup>
            <DropdownMenuItem @click="openBotFolder">
              <Folder class="mr-2 h-4 w-4" />
              <span>打开文件所在位置</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="deleteBot">
            <Trash2 class="mr-2 h-4 w-4" />
            <span>删除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  </header>

  <setting-section data-title="概览">
    <setting-panel>
      <setting-list data-direction="row">
        <setting-item>
          <setting-text>Bot</setting-text>
          <setting-text data-type="secondary">{{ bot?.name }}</setting-text>
        </setting-item>
        <setting-item>
          <setting-text>Python</setting-text>
          <setting-text data-type="secondary">{{ bot?.python.version }}</setting-text>
        </setting-item>
      </setting-list>
    </setting-panel>
  </setting-section>

  <setting-section data-title="管理">
    <setting-panel>
      <setting-list data-direction="column">
        <setting-item>
          <setting-text>进程</setting-text>
          <Button v-if="bot?.pid === 0" variant="primary" @click="runBot">启动</Button>
          <Button v-else variant="danger" @click="stopBot">结束</Button>
        </setting-item>
      </setting-list>
    </setting-panel>
  </setting-section>

  <setting-section data-title="日志">
    <setting-panel>
      {{ logStorage }}
    </setting-panel>
  </setting-section>
</template>

<style scoped>
.header {
  height: 40px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--fill_light_primary, var(--fg_white));
  margin-bottom: 20px;
  border-radius: 8px;
}
</style>
