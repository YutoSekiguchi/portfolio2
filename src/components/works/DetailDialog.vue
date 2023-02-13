<script lang="ts" setup>
  import { WorksType } from '@/settings/worksType';
  import { defineProps, computed, ComputedRef } from 'vue';
  import ArticleImage from '../common/ArticleImage.vue';
  import Chip from '../common/Chip.vue';
  
  export interface Props {
    isDialog: boolean;
    closeDialog: void;
    work: WorksType;
  }
  const props = defineProps<Props>();
  const model: ComputedRef<boolean> = computed(() => props.isDialog);
  
  // 論文ページの表示
  const moveLink = (url?: string) => {
    window.open(url, '_blank');
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
            <v-btn icon="mdi-close" @click="props.closeDialog" class="icon"></v-btn>
          </template>
          <v-app-bar-title class="works">Works</v-app-bar-title>
          <template v-slot:append>
            <v-btn class="bg-black" @click="moveLink(work.url)">
              <v-icon icon="mdi-open-in-new" class="icon mr-1 text-white" />
              <p class="font-weight-bold text-white">この論文へ</p>
            </v-btn>
          </template>
        </v-app-bar>
        
        <v-main class="dialog-card-main">
          <p class="text-center text-h6 font-weight-bold pt-2 px-5 mb-3">{{ work.title }}</p>

          <ArticleImage
            :path="createPath(`works/${work.image}.png`)"
            class="mb-6"
          />
          
          <p class="font-weight-bold text-h5 ml-4">Abstract</p>
          <p class="description">{{ work.description }}</p>

          <v-row class="authors mt-4 mx-4 mb-6">
            <v-icon icon="mdi-account" class="icon mr-1" />
            <p>{{ work.authors }}</p>
          </v-row>

          <div class="tags mb-8 ml-2">
            <Chip
              v-for="(tag, index) in work.tagList"
              :key="index"
              :name="tag"
            />
          </div>
        </v-main>
      </v-layout>
    </v-card>
  </v-dialog>
</template>