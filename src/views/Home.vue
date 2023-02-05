<script lang="ts" setup>
  import PageCard from '@/components/home/PageCard.vue';
</script>

<template>
  <div class="top mb-12">
    <v-img
      cover
      aspect-ratio="1.7"
      width="600"
      src="@/assets/top.png"
      class="mx-auto"
    />
  </div>

  <v-row class="cards mx-auto justify-space-around">
    <PageCard 
      title="About"
      icon="mdi-account-circle"
      description="Aboutページは、私に関する情報を書いているページです。氏名や生年月日、所属・経歴、取得しているスキルなどが書かれています。あと、自分の写真も…笑"
    />
  </v-row>
</template>

<style scoped>
.top {
  background-color: #eeeeee;
}
.cards {
  max-width: 1000px;
}
</style>