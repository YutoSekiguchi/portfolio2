<script lang="ts" setup>
  import PageCard from '@/components/home/PageCard.vue';
  import homeCardsData from '../settings/homeCardsData.json';
  
  interface CardType {
    title: string;
    icon: string;
    description: string;
  }

  const cardList: CardType[] = homeCardsData;
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
    <div v-for="(card, i) in cardList" :key="i">
      <PageCard 
        :title=card.title
        :icon=card.icon
        :description=card.description
      />
    </div>
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