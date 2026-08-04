<script lang="ts" setup>
import { computed } from 'vue'
import { WorksType } from '@/settings/worksType'
import ArticleImage from '../common/ArticleImage.vue'
import Chip from '../common/Chip.vue'
import { useLocale } from '@/i18n'
import { localizeTag } from '@/i18n/content'

const { locale, copy } = useLocale()

interface Props {
  isDialog: boolean
  closeDialog: () => void
  work: WorksType
}

const props = defineProps<Props>()
const model = computed({
  get: () => props.isDialog,
  set: (value: boolean) => {
    if (!value) props.closeDialog()
  },
})

const close = () => {
  model.value = false
}

const createPath = (name: string) => {
  return new URL(`../../assets/${name}`, import.meta.url).href
}

const contentLanguage = (value?: string) =>
  /[\u3040-\u30ff\u3400-\u9fff]/.test(value || '') ? 'ja' : 'en'
</script>

<template>
  <v-dialog
    transition="dialog-bottom-transition"
    v-model="model"
    :aria-labelledby="`work-dialog-${work.image || 'detail'}`"
  >
    <v-card
      variant="elevated"
      class="dialog-card bg-white mx-auto"
    >
      <v-layout>
        <v-app-bar
          flat
          color="white"
          density="compact"
        >
          <template #prepend>
            <v-btn
              icon="mdi-close"
              :aria-label="copy.common.close"
              class="icon"
              @click="close"
            />
          </template>
          <v-app-bar-title class="works">{{ copy.sections.publications }}</v-app-bar-title>
          <template #append>
            <v-btn
              v-if="work.url"
              class="bg-black"
              :href="work.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-icon icon="mdi-open-in-new" class="icon mr-1 text-white" />
              <p class="font-weight-bold text-white">{{ copy.common.viewPaper }}</p>
            </v-btn>
          </template>
        </v-app-bar>

        <v-main class="dialog-card-main">
          <p
            :id="`work-dialog-${work.image || 'detail'}`"
            :lang="contentLanguage(work.title)"
            class="text-center text-h6 font-weight-bold pt-2 px-5 mb-3"
          >
            {{ work.title }}
          </p>

          <ArticleImage
            v-if="work.image"
            :path="createPath(`works/${work.image}.png`)"
            :alt="work.title"
            class="mb-6"
          />

          <p class="font-weight-bold text-h5 ml-4">{{ copy.common.abstract }}</p>
          <p class="description" :lang="contentLanguage(work.description)">
            {{ work.description }}
          </p>

          <v-row class="authors mt-4 mx-4 mb-6">
            <v-icon icon="mdi-account" class="icon mr-1" aria-hidden="true" />
            <p :lang="contentLanguage(work.authors)">{{ work.authors }}</p>
          </v-row>

          <div class="tags mb-8 ml-2">
            <Chip
              v-for="tag in work.tagList"
              :key="tag"
              :name="localizeTag(tag, locale)"
            />
          </div>
        </v-main>
      </v-layout>
    </v-card>
  </v-dialog>
</template>
