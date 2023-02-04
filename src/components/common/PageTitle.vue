<script lang="ts" setup>
  import { defineProps } from 'vue';
  
  export interface Props {
    title: string;
  }
  const props = defineProps<Props>();
</script>

<template>
  <p class="title">{{ props.title }}</p>
</template>

<style scoped>
.title {
  font-size: 3rem;
  font-weight: lighter;
}
</style>