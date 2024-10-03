<script setup lang="ts">
import { Toaster as Sonner, type ToasterProps } from 'vue-sonner';

const props = defineProps<ToasterProps>();
</script>

<template>
  <Sonner class="toaster" v-bind="props" rich-colors />
</template>

<style>
.toaster[data-sonner-toaster] {
  --width: 20rem !important;
  --offset: 1.25rem !important;

  & [data-sonner-toast] {
    @apply flex p-5;

    & [data-icon] {
      @apply flex w-4 h-4 relative justify-start items-center flex-shrink-0 ml-[--toast-icon-margin-start] mr-[--toast-icon-margin-end];
    }

    & [data-title] {
      @apply text-sm font-semibold;
    }

    & [data-description] {
      @apply text-sm;
    }

    & [data-button] {
      @apply ml-auto;
    }

    & [data-close-button] {
      @apply static order-last border-none rounded-md size-7 transform-none;

      & svg {
        @apply w-5 h-5;
      }
    }

    &:not(:has([data-button])) [data-close-button] {
      @apply ml-auto;
    }
  }
}
</style>
