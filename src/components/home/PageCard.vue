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
    class="card"
    variant="flat"
  >
    <p class="card-title text-center">{{ props.title }}</p>
    <v-col class="d-flex justify-center py-0">
      <v-icon
        :icon=props.icon
        class="card-icon"
      />
    </v-col>
    <v-col class="card-description py-0">
      <p>{{ props.description }}</p>
    </v-col>
  </v-card>
</template>

<style scoped>
p, .card-icon {
  color: #555;
}
.card {
  width: 280px;
}
.card-title{
  font-size: 2rem;
  font-weight: bold;
}
.card-icon {
  font-size: 8rem;
}
.card-description {
  font-size: 0.9rem;
  height: 200px;
  overflow-y: scroll;
}
</style>