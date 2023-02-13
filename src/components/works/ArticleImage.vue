<script lang="ts" setup>
  import { defineProps } from 'vue';

  export interface Props {
    path: string;
    width?: number;
    height?: number;
  }
  const props = defineProps<Props>();
  const imgPath = new URL(`../../assets/${props.path}`, import.meta.url).href;
</script>

<template>
  <v-img
    contain
    :width="`${props.width? props.width: 500}`"
    :height="`${props.height? props.height: 300}`"
    :src="imgPath"
    class="mx-auto"
  />
</template>