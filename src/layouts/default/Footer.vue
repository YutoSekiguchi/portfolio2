<script lang="ts" setup>
  const nowYear: number = new Date().getFullYear();
</script>

<template>
  <v-col class="footer d-flex justify-center align-center mt-12">
    <p>©2022 - {{ nowYear }}  Yuto Sekiguchi</p>
  </v-col>
</template>