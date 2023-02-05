<script lang="ts" setup>
  import { defineProps } from 'vue';

  export interface Props {
    path: string;
    width?: number;
    height?: number;
  }
  const props = defineProps<Props>();
</script>

<template>
  <v-img
    contain
    :width="`${props.width? props.width: 500}`"
    :height="`${props.height? props.height: 300}`"
    :src="`../src/assets/${props.path}`"
    class="mx-auto"
  />
</template>