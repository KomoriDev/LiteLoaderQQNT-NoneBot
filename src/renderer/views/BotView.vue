<script setup lang="ts">
import { toast } from 'vue-sonner';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronLeft, Ellipsis, Folder, Trash2 } from 'lucide-vue-next';

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
} from '../components/ui/dropdown-menu';

const route = useRoute();

const bot = ref<BotConfig>();

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

onMounted(async () => {
  await getBot();
});
</script>

<template>
  <header class="header">
    <nav class="flex gap-2 items-center">
      <Button variant="secondary" size="icon" @click="router.push({ name: 'home' })">
        <ChevronLeft class="w-3 h-3" />
      </Button>
      <p>{{ bot?.name }}</p>
    </nav>
    <nav>
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
          <Button variant="primary">启动</Button>
        </setting-item>
      </setting-list>
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
