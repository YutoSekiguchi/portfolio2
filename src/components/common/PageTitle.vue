<script lang="ts" setup>
  import { defineProps } from 'vue';
  
  export interface Props {
    title: string;
  }
  const props = defineProps<Props>();
</script>

<template>
  <p class="page-title">{{ props.title }}</p>
</template>