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

  <div class="map mx-auto mt-2">
    <v-col cols="12" class="text-center mb-2">
      <p class="el-title">University</p>
    </v-col>
    
    <v-row class="justify-space-around">
      <v-col cols="5" class="map-left d-flex align-center justify-end">
        <p class="map-text">
          明治大学&nbsp;中野キャンパス
          <br>
          〒164-8525&nbsp;東京都中野区4丁目21-1
          <br>
          <a href="https://nkmr-lab.org/">中村聡研究室</a>
        </p>
      </v-col>
      <v-col cols="5" class="map-right">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.788032396652!2d139.65716421547737!3d35.7068334361745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018f28568f3a5e5%3A0x567bdf699508c4ba!2z5piO5rK75aSn5a2m5Lit6YeO44Kt44Oj44Oz44OR44K5!5e0!3m2!1sja!2sjp!4v1676174028929!5m2!1sja!2sjp" height="300" style="border: 1px; border-radius: 5%;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.top {
  background-color: #eeeeee;
}
.cards {
  max-width: 1000px;
}
.map {
  max-width: 1000px;
}
p {
  color: #555;
}
.el-title {
  font-size: 2rem;
  font-weight: bold;
}
.map-text {
  line-height: 2em;
}
</style>