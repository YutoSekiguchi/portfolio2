<script lang="ts" setup>
  import { ProductsType } from '@/settings/productsType';
  import { defineProps, computed, ComputedRef } from 'vue';
  import ArticleImage from '../common/ArticleImage.vue';
  import Chip from '../common/Chip.vue';
  
  export interface Props {
    isDialog: boolean;
    closeDialog: void;
    product: ProductsType;
  }
  const props = defineProps<Props>();
  const model: ComputedRef<boolean> = computed(() => props.isDialog);
  
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
          <v-app-bar-title class="products">Products</v-app-bar-title>
        </v-app-bar>
        
        <v-main class="dialog-card-main">
          <p class="text-center text-h6 font-weight-bold pt-2 px-5 mb-3">{{ product.title }}</p>

          <ArticleImage
            :path="createPath(`products/${product.image}.png`)"
            :height="200"
            class="mb-6"
          />
          
          <p class="font-weight-bold text-h5 ml-4">概要</p>
          <p class="description">{{ product.description }}</p>

          <template v-if="product.urlList">
            <v-row
              v-for="(url, index) in product.urlList"
              :key="index"
              class="ml-0 pl-4 mt-4"
            >
              <v-icon icon="mdi-link" class="icon mr-1" />
              <a :href="`${url}`" target="_blank">{{ url }}</a>
            </v-row>
          </template>
          
          <div class="tags mb-12 ml-2 mt-8">
            <Chip
              v-for="(tag, index) in product.tagList"
              :key="index"
              :name="tag"
            />
          </div>
        </v-main>
      </v-layout>
    </v-card>
  </v-dialog>
</template>