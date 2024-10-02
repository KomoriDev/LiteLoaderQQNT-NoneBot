<script setup lang="ts">
import { cva } from 'class-variance-authority';
import { cn } from '@@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center overflow-visible rounded-md text-[12px] leading-[14px] border outline-none m-0',
  {
    variants: {
      variant: {
        primary:
          'bg-[--brand_standard] text-[--on_brand_primary] border-[--brand_standard] hover:bg-[--nt_brand_standard_2_overlay_hover_brand_2_mix] active:bg-[--nt_brand_standard_2_overlay_hover_brand_2_mix]',
        secondary:
          'bg-transparent text-[--text_primary] border-[--fill_standard_primary] hover:bg-[--overlay_hover] active:bg-[--overlay_pressed]',
        danger: 'bg-[#ef4444] text-[--on_brand_primary] border-[#ef4444] hover:bg-[#f87171] active:bg-[#dc2626]',
      },
      size: {
        default: 'min-w-[62px] p-[4px_7px]',
        icon: 'h-5 w-5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

interface Props {
  variant?: NonNullable<Parameters<typeof buttonVariants>[0]>['variant'];
  size?: NonNullable<Parameters<typeof buttonVariants>[0]>['size'];
  as?: string;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'default',
  as: 'button',
});
</script>

<template>
  <component :is="as" :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')">
    <slot />
  </component>
</template>
