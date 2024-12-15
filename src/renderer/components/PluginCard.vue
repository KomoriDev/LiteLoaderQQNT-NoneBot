<script setup lang="ts">
import { ref } from 'vue';
import { Box, Maximize, CalendarDays, PackageCheck, PackageX } from 'lucide-vue-next';

import { Plugin } from '@/types';
import { Github } from './icons';
import { Modal } from './ui/modal';
import { Avatar, AvatarFallback, AvatarImage } from '@@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@@/components/ui/hover-card';

const props = defineProps<{
  plugin: Plugin;
}>();

const detailModal = ref<boolean>(false);

const githubInfo = ref<any>();
const githubInfoLoading = ref<boolean>(false);

const openExternal = (url: string) => {
  LiteLoader.api.openExternal(url);
};

const fetchGithubUser = async (username: string) => {
  githubInfoLoading.value = true;
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    githubInfo.value = await response.json();
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    githubInfo.value = null;
  } finally {
    githubInfoLoading.value = false;
  }
};
</script>

<template>
  <Modal :title="props.plugin.name" :open="detailModal" @close="detailModal = false">
    <template #body></template>
  </Modal>

  <div class="relative w-full h-40 bg-[#7f7f7f26] rounded-2xl">
    <div
      class="absolute inset-0 h-4/5 bg-[--fill_light_primary] rounded-2xl shadow shadow-[#00000024] mix-blend-color-burn"
    ></div>
    <div
      class="relative flex h-4/5 p-4 bg-[--fill_light_primary] rounded-2xl overflow-hidden"
      @click="openExternal(props.plugin.homepage)"
    >
      <div class="w-full flex flex-col justify-between">
        <header class="ml-2">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2">
              <h1 class="text-lg font-semibold max-w-48 truncate">{{ props.plugin.name }}</h1>
              <PackageCheck
                v-if="props.plugin.valid"
                class="w-5 stroke-green-400 cursor-pointer"
                @click="
                  openExternal(
                    `https://registry.nonebot.dev/plugin/${props.plugin.project_link}:${props.plugin.module_name}`
                  )
                "
              />
              <PackageX
                v-else
                class="w-5 stroke-red-400 cursor-pointer"
                @click="
                  openExternal(
                    `https://registry.nonebot.dev/plugin/${props.plugin.project_link}:${props.plugin.module_name}`
                  )
                "
              />
            </div>
            <Maximize class="w-5" @click="detailModal = true" />
          </div>
          <p class="text-[--text_secondary] text-sm">{{ props.plugin.desc }}</p>
        </header>
        <div class="mt-2 ml-2 space-x-2">
          <span
            v-for="(tag, index) in props.plugin.tags"
            :key="index"
            class="px-2.5 py-0.5 rounded-full text-xs text-white"
            :style="`background-color: ${tag.color}`"
          >
            {{ tag.label }}
          </span>
        </div>
      </div>
    </div>
    <div class="w-full flex px-4 mt-1.5 relative justify-between items-center">
      <div class="flex gap-1">
        <Github
          class="w-5 opacity-70 cursor-pointer fill-[#434343] dark:fill-[#ADADAD]"
          @click="openExternal(props.plugin.homepage)"
        />
        <Box
          class="w-5 opacity-70 cursor-pointer"
          @click="
            openExternal(`https://registry.nonebot.dev/plugin/${props.plugin.project_link}:${props.plugin.module_name}`)
          "
        />
      </div>
      <HoverCard>
        <HoverCardTrigger
          as-child
          class="cursor-pointer"
          @click="openExternal(`https://github.com/${props.plugin.author}`)"
          @mouseover="fetchGithubUser(props.plugin.author)"
        >
          <Avatar size="xs">
            <AvatarImage :src="`https://avatars.githubusercontent.com/${props.plugin.author}`" />
            <AvatarFallback>{{ props.plugin.author }}</AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent class="w-80">
          <div class="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage :src="`https://avatars.githubusercontent.com/${props.plugin.author}`" />
              <AvatarFallback>{{ props.plugin.author }}</AvatarFallback>
            </Avatar>
            <div class="space-y-1">
              <h4 class="text-sm font-semibold">{{ props.plugin.author }}</h4>
              <Skeleton v-if="githubInfoLoading" class="w-full h-2 rounded-xl" />
              <p v-else class="text-sm">
                {{ githubInfo['bio'] ? githubInfo['bio'] : '这个人很懒，什么都没留下...' }}
              </p>
              <div class="flex items-center pt-2">
                <CalendarDays class="mr-2 h-4 w-4 opacity-70" />
                <Skeleton v-if="githubInfoLoading" class="w-full h-4 rounded-xl" />
                <span v-else class="text-xs text-[--text_secondary]">
                  {{ githubInfo['created_at'] }}
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  </div>
</template>
