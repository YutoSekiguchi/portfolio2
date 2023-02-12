<script lang="ts" setup>
  import PageTitle from "@/components/common/PageTitle.vue";
  interface ElementType {
    icon: string;
    title: string;
    body: string;
  }

  const elementList: ElementType[] = [
    {
      icon: "mdi-account",
      title: "Name",
      body: "関口 祐豊 （Yuto Sekiguhchi）",
    },
    {
      icon: "mdi-cake",
      title: "Birthday",
      body: "2000/11/26"
    },
    {
      icon: "mdi-lead-pencil",
      title: "High School",
      body: "千葉県立佐倉高等学校 卒業",
    },
    {
      icon: "mdi-school",
      title: "Affiliarion",
      body: "明治大学 総合数理学部 先端メディアサイエンス学科 4年"
    },
    {
      icon: "mdi-laptop",
      title: "Skills",
      body: "React/Next.js, Vue/Nuxt.js, TypeScript, Python, Golang, Flutter, PHP, Ruby on Rails, GAS, Node.js, Processing, MATLAB, Julia, Spring Boot, Docker",
    }
  ]
</script>

<template>
  <div class="about-main mx-auto">
    <PageTitle title="About" />
    <v-row class="container mt-6">
      <v-col cols="6" class="left-container" align-self="center">
        <v-img
          cover
          aspect-ratio="1"
          width="350"
          src="@/assets/me.png"
          class="mx-auto me-img"
        />
      </v-col>

      <v-col cols="6" class="right-container">
        <div class="element mb-2" v-for="(el, index) in elementList" :key="index">
          <div class="element-header d-flex">
            <v-icon :icon=el.icon class="icon mr-1" />
            <p class="element-title">{{ el.title }}</p>
          </div>
          <div class="element-body">
            <p class="element-body-text">{{ el.body }}</p>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>