<script lang="ts" setup>
  import { useRouter } from "vue-router";

  const router = useRouter();
  const icons: string[] = [
    "mdi-twitter",
    "mdi-instagram",
    "mdi-github",
  ];
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
        <v-btn icon v-for="(iconName, index) in icons" :key="index">
          <v-icon :icon=iconName class="icon" />
        </v-btn>
      </v-row>
      <h1>{{ title }}</h1>

      <v-row class="pr-12 pt-6" justify="end">
        <div v-for="(name, index) in tabNames" :key="index">
          <p @click="navigatePage(name)" class="tab">{{ name }}</p>
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

.tab {
  font-weight: bold;
  cursor: pointer;
  margin: 0 20px;
  color: #555;
}

.app-bar-elements {
  max-width: 1000px;
}
</style>