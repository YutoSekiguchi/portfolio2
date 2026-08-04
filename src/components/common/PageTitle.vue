<script lang="ts" setup>
  import { defineProps } from 'vue';
  
  export interface Props {
    title: string;
  }
  const props = defineProps<Props>();
</script>

<template>
  <h1 class="page-title">{{ props.title }}</h1>
</template>
