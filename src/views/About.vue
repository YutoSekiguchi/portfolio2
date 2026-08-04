<script lang="ts" setup>
import { computed } from 'vue'
import PageTitle from '@/components/common/PageTitle.vue'
import { useLocale } from '@/i18n'

const { copy } = useLocale()

interface ElementType {
  icon: string
  title: string
  body: string
}

const elementList = computed<ElementType[]>(() => [
  {
    icon: 'mdi-account',
    title: copy.value.about.name,
    body: copy.value.about.nameValue,
  },
  {
    icon: 'mdi-cake',
    title: copy.value.about.birthday,
    body: '2000/11/26',
  },
  {
    icon: 'mdi-lead-pencil',
    title: copy.value.about.highSchool,
    body: copy.value.about.highSchoolValue,
  },
  {
    icon: 'mdi-school',
    title: copy.value.about.affiliation,
    body: copy.value.about.affiliationValue,
  },
  {
    icon: 'mdi-laptop',
    title: copy.value.about.skills,
    body: 'React/Next.js, Vue/Nuxt.js, TypeScript, Python, Golang, Flutter, PHP, Ruby on Rails, GAS, Node.js, Processing, MATLAB, Julia, Spring Boot, Docker',
  },
])
</script>

<template>
  <main class="about-main mx-auto">
    <PageTitle :title="copy.about.title" />
    <v-row class="container mt-6">
      <v-col cols="12" sm="6" class="left-container" align-self="center">
        <v-img
          cover
          aspect-ratio="1"
          width="350"
          src="@/assets/me.png"
          :alt="copy.about.nameValue"
          class="mx-auto me-img"
        />
      </v-col>

      <v-col cols="12" sm="6" class="right-container">
        <div
          v-for="element in elementList"
          :key="element.title"
          class="element mb-2"
        >
          <div class="element-header d-flex">
            <v-icon :icon="element.icon" class="icon mr-1" aria-hidden="true" />
            <p class="element-title">{{ element.title }}</p>
          </div>
          <div class="element-body">
            <p class="element-body-text">{{ element.body }}</p>
          </div>
        </div>
      </v-col>
    </v-row>
  </main>
</template>
