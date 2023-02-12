<script lang="ts" setup>
  import { defineProps } from 'vue';

  export interface Props {
    name: string;
    cl?: string;
  }
  const props = defineProps<Props>();
</script>

<template>
  <v-chip
    variant="outlined"
    color="cyan"
    :class="`${props.cl ?? 'mr-3'}`"
  >#&nbsp;{{ props.name }}</v-chip>
</template>