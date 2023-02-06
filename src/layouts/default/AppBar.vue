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
  const tabNames = [
    "Home",
    "About",
    "Works",
  ] as const; // tabの文字を入れる配列

  type TabName = typeof tabNames[number]; // TabNameは型"Home"|"About"|"Works"となる

  const navigatePage = (name: TabName) => {
    const lowerName: string = name=="Home"? "": name.toLowerCase(); // Home画面のURLは / のみのためHomeでは空を返す
    router.push(`/${lowerName}`);
  }
</script>

<template>
  <v-app-bar 
    flat
    density="prominent"
    height="80"
  >
    <v-col class="app-bar-elements mx-auto">
      <v-row class="pr-12 pt-5" justify="end">
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
      </v-row>
      <h1 @click="() => {router.push('/')}" class="title">{{ title }}</h1>

      <v-row class="pr-12 pt-6" justify="end">
        <div v-for="(name, index) in tabNames" :key="index">
          <p @click="navigatePage(name)" :class="`tab ${name===nowTab && 'now'}`">{{ name }}</p>
        </div>
      </v-row>

    </v-col>
  </v-app-bar>
</template>


<style scoped>
.icon {
  font-size: 1.8rem;
  margin: 0 15px;
  color: #555;
}
.title {
  cursor: pointer;
}
.tab {
  font-weight: bold;
  cursor: pointer;
  margin: 0 20px;
  color: #555;
}
.now {
  border-bottom: 3px solid rgba(255, 177, 9, 0.5);
  color: #5558;
}
.app-bar-elements {
  max-width: 1000px;
}
</style>