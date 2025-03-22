<script setup lang="ts">
import { clsx } from 'clsx';
import { HTMLAttributes, useSlots } from 'vue';
import { X } from 'lucide-vue-next';

interface Props {
  title: string;
  open: boolean;
  class?: HTMLAttributes['class'];
}
const props = defineProps<Props>();

defineEmits(['close']);

const slots = useSlots();
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="props.open" class="setting-modal">
        <div class="mask" @click="$emit('close')"></div>
        <div :class="clsx('main', props.class)">
          <div class="container">
            <div class="header">
              <div class="extra">
                <slot name="header"></slot>
              </div>
              <div class="title">{{ props.title }}</div>
              <X class="close" @click="$emit('close')" />
            </div>

            <div class="body">
              <slot name="body"></slot>
            </div>

            <div v-if="slots.footer" class="footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="css">
.setting-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: var(--msp-container);
  z-index: 5000;

  .mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
}

.setting-modal .main {
  width: 480px;
  height: fit-content;
  position: absolute;
  background-clip: padding-box;
  background-color: var(--bg_top_light);
  box-shadow: var(--shadow_bg_middle_primary);
  border: var(--border_primary);
  border-radius: 8px;
  overflow: hidden;

  .container {
    background-color: var(--bg_bottom_standard);
    overflow: hidden;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 28px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      position: relative;
      padding: 0 5px;

      .title {
        flex: 0;
        left: 50%;
        margin: 0 auto;
        position: absolute;
        transform: translateX(-50%);
        font-family: 'PingFang SC';
        font-size: 12px;
        font-weight: 400;
        line-height: 28px;
        text-align: center;
      }

      .extra {
        flex: 1;
        position: absolute;
        font-size: 12px;
        font-weight: 400;
        line-height: 28px;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .close {
        flex: 1;
        width: 16px;
        height: 16px;
        position: absolute;
        right: 10px;
        cursor: pointer;
        color: var(--icon-primary);
      }
    }

    .body {
      border-radius: 8px;
      padding: 20px 20px 0px 20px;
      margin-bottom: 20px;
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      margin: 0 20px 20px;
    }
  }
}
</style>
