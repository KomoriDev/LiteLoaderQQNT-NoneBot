<script setup lang="ts">
import { ref, defineProps } from 'vue';

import type { Plugin } from '@/types/plugin';
import type { Driver } from '@/types/driver';
import type { Adapter } from '@/types/adapter';

import { GithubFilled, CircleXFilled, CircleCheckFilled } from '@@/components/icons';
import { Modal as DetailModal } from '@@/components/ui/modal';
import { Avatar, AvatarImage, AvatarFallback } from '@@/components/ui/avatar';
import { openExternal } from '@/renderer/lib/utils';

defineProps<{
  resource: Plugin | Driver | Adapter;
}>();

const isOpenModal = ref<boolean>(false);

defineExpose({
  openModal: () => {
    isOpenModal.value = true;
  },
  closeModal: () => {
    isOpenModal.value = false;
  },
});
</script>

<template>
  <DetailModal class="w-[800px] h-[648px]" :title="resource.name" :open="isOpenModal" @close="isOpenModal = false">
    <template #body>
      <header class="flex justify-between">
        <div class="flex align-top gap-3">
          <Avatar size="sm">
            <AvatarImage :src="`https://avatars.githubusercontent.com/${resource.author}`" />
            <AvatarFallback>{{ resource.author }}</AvatarFallback>
          </Avatar>
          <span>
            <span class="flex gap-1">
              <h1 class="text-sm font-semibold">{{ resource.name }}</h1>
              <p
                v-if="resource.is_official"
                class="px-2 py-0.5 text-xs rounded-md bg-green-300/60 text-green-600 dark:bg-green-300/20"
              >
                官方
              </p>
            </span>
            <p class="text-xs cursor-pointer" @click="openExternal(`https://github.com/${resource.author}`)">
              {{ resource.author }}
            </p>
          </span>
        </div>
        <div
          class="flex items-center gap-2 px-4 py-0.5 max-h-10 rounded-full bg-[--fill_light_primary] cursor-pointer"
          @click="openExternal(resource.homepage)"
        >
          <GithubFilled class="w-4 h-4" />
          <p class="text-sm">Github</p>
        </div>
      </header>

      <section class="mt-4">
        <div
          v-if="resource.resourceType === 'plugin' && resource.valid"
          class="inline-flex items-center gap-2 px-3 py-1 text-xs rounded-md cursor-pointer bg-green-300/60 text-green-600 dark:bg-green-300/20"
          @click="openExternal(`https://registry.nonebot.dev/plugin/${resource.project_link}:${resource.module_name}`)"
        >
          <CircleCheckFilled class="w-4 h-4" />
          <p>插件已通过测试</p>
        </div>
        <div
          v-else-if="resource.resourceType === 'plugin' && !resource.valid"
          class="inline-flex items-center gap-2 px-3 py-1 text-xs rounded-md cursor-pointer bg-red-300/60 text-red-600 dark:bg-red-300/20"
          @click="openExternal(`https://registry.nonebot.dev/plugin/${resource.project_link}:${resource.module_name}`)"
        >
          <CircleXFilled class="w-4 h-4" />
          <p>插件未通过测试</p>
        </div>
      </section>

      <section class="mt-4 text-sm">{{ resource.desc }}</section>
    </template>

    <template #footer>
      <button
        class="w-full py-1 rounded-lg bg-[--brand_standard] text-[--on_brand_primary] hover:bg-[--nt_brand_standard_2_overlay_hover_brand_2_mix] active:bg-[--nt_brand_standard_2_overlay_hover_brand_2_mix]"
      >
        安装
      </button>
    </template>
  </DetailModal>
</template>
