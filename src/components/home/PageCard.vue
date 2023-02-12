<script lang="ts" setup>
  import { defineProps } from 'vue';

  export interface Props {
    title: string,
    icon: string,
    description: string,
  }
  const props = defineProps<Props>();
</script>

<template>
  <v-card 
    class="page-card"
    variant="flat"
  >
    <p class="card-title text-center">{{ props.title }}</p>
    <v-col class="d-flex justify-center py-0">
      <v-icon
        :icon=props.icon
        class="icon"
      />
    </v-col>
    <v-col class="card-description py-0">
      <p>{{ props.description }}</p>
    </v-col>
  </v-card>
</template>