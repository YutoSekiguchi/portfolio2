<script lang="ts" setup>
  import { WorksType } from '@/settings/worksType';
  import { defineProps, computed, ComputedRef } from 'vue';
  import ArticleImage from '../common/ArticleImage.vue';
  import Chip from '../common/Chip.vue';
  import { useLocale } from '@/i18n';
  import { localizeTag } from '@/i18n/content';

  const { locale, copy } = useLocale();
  
  interface Props {
    isDialog: boolean;
    closeDialog: () => void;
    work: WorksType;
  }
  const props = defineProps<Props>();
  const model: ComputedRef<boolean> = computed(() => props.isDialog);
  
  // 論文ページの表示
  const moveLink = (url?: string) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  }
  const createPath = (name: string) => {
    return new URL(`../../assets/${name}`, import.meta.url).href;
  }
</script>

<template>
  <v-dialog
    transition="dialog-bottom-transition"
    v-model="model"
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
          <template v-slot:prepend>
            <v-btn
              icon="mdi-close"
              :aria-label="copy.common.close"
              @click="props.closeDialog"
              class="icon"
            ></v-btn>
          </template>
          <v-app-bar-title class="works">{{ copy.sections.publications }}</v-app-bar-title>
          <template v-slot:append>
            <v-btn v-if="work.url" class="bg-black" @click="moveLink(work.url)">
              <v-icon icon="mdi-open-in-new" class="icon mr-1 text-white" />
              <p class="font-weight-bold text-white">{{ copy.common.viewPaper }}</p>
            </v-btn>
          </template>
        </v-app-bar>
        
        <v-main class="dialog-card-main">
          <p class="text-center text-h6 font-weight-bold pt-2 px-5 mb-3">{{ work.title }}</p>

          <ArticleImage
            :path="createPath(`works/${work.image}.png`)"
            :alt="work.title"
            class="mb-6"
          />
          
          <p class="font-weight-bold text-h5 ml-4">{{ copy.common.abstract }}</p>
          <p class="description">{{ work.description }}</p>

          <v-row class="authors mt-4 mx-4 mb-6">
            <v-icon icon="mdi-account" class="icon mr-1" />
            <p>{{ work.authors }}</p>
          </v-row>

          <div class="tags mb-8 ml-2">
            <Chip
              v-for="(tag, index) in work.tagList"
              :key="index"
              :name="localizeTag(tag, locale)"
            />
          </div>
        </v-main>
      </v-layout>
    </v-card>
  </v-dialog>
</template>
