<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useRouter, useRoute } from "vue-router";

  const route = useRoute();
  const nowTab = ref<string>(route.path=="/"? "Home": (route.path.slice(1)).charAt(0).toUpperCase() + route.path.substring(2));
  watch(
    () => route.path,
    async path => {
      let res: string = "";
      if (path=="/") {
        res = "Home";
      } else {
        // "/"を削除し，最初の文字を大文字に
        let tmp: string = path.slice(1);
        res = (tmp).charAt(0).toUpperCase() + tmp.slice(1);
      }
      nowTab.value = res;
    }
  )

  const router = useRouter();
  type Icons = {
    name: string,
    link: string,
  }
  const icons: Icons[] = [
    {
      name: "mdi-twitter",
      link: "https://twitter.com/yuto_2611",
    },
    {
      name: "mdi-instagram",
      link: "https://www.instagram.com/mendyy1126/"
    },
    {
      name: "mdi-github",
      link: "https://github.com/YutoSekiguchi"
    }
  ];
  const moveLink = (url: string) => {
    window.open(url, '_blank');
  }

  const title: string = "Yuto Sekiguchi";
  // const tabNames = [
  //   "Home",
  //   "About",
  //   "Works",
  //   "Products",
  // ] as const; // tabの文字を入れる配列

  // type TabName = typeof tabNames[number]; // TabNameは型"Home"|"About"|"Works"となる

  // const navigatePage = (name: TabName) => {
  //   const lowerName: string = name=="Home"? "": name.toLowerCase(); // Home画面のURLは / のみのためHomeでは空を返す
  //   router.push(`/${lowerName}`);
  // }
</script>

<template>
  <v-app-bar 
    flat
    class="app-bar"
  >
    <v-col class="app-bar-elements mx-auto">
      <v-row class="items-center bar" justify="space-between" >
        <div @click="() => {router.push('/')}">
          <h1 class="title">{{ title }}</h1>
        </div>
        <div>
          <v-btn
            icon 
            v-for="(icon, index) in icons"
            :key="index"
            @click="moveLink(icon.link)"
          >
            <v-icon 
              :icon=icon.name
              class="icon"
            />
          </v-btn>
        </div>
      </v-row>


      <!-- <v-row class="pr-12 pt-0" justify="end">
        <div v-for="(name, index) in tabNames" :key="index">
          <p @click="navigatePage(name)" :class="`tab ${name===nowTab && 'now'}`">{{ name }}</p>
        </div>
      </v-row> -->
    </v-col>
  </v-app-bar>
</template>

<style scoped>
@media (max-width: 599px) {
  .title {
    font-size: 20px; /* スマホ等の小さな画面でのフォントサイズ */
  }
  .bar {
    padding-left: 20px;
    padding-right: 10px;
    padding-top: 5px;
  }
  .app-bar {
    height: 60px;
  }
}

@media (min-width: 600px) {
  .title {
    font-size: 24px; /* タブレットやデスクトップ等の大きな画面でのフォントサイズ */
  }
  .tab {
    font-size: 16px; /* タブレットやデスクトップ等の大きな画面でのタブのフォントサイズ */
  }
  .bar {
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 10px;
  }
  .app-bar {
    height: 60px;
  }
}

.items-center {
  align-items: center;
}
</style>
