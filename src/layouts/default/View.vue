<template>
  <v-main id="main-content" tabindex="-1">
    <router-view />
    <Footer />
  </v-main>
</template>

<script lang="ts" setup>
  import Footer from './Footer.vue';
</script>
