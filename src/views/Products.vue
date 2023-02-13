<script lang="ts" setup>
  import PageTitle from '@/components/common/PageTitle.vue';
  import ArticleImage from '@/components/common/ArticleImage.vue';
  import Chip from '@/components/common/Chip.vue';
  import Products from '../settings/products.json';
  import { ProductsType } from '@/settings/productsType';
  import { ref, computed, watch } from 'vue';
  
  const productsList = ref<ProductsType[]>(Products);
  const createPath =  (name: string) => {
    return new URL(`../assets/${name}`, import.meta.url).href;
  }
</script>

<template>
  <div class="products-main mx-auto">
    <v-row class="products-main-header mx-auto">
      <PageTitle title="Products" />
    </v-row>

    <v-row class="container">
      <v-card
        class="card"
        v-for="(product, i) in productsList"
        :key="i"
      >
        <v-col cols="12" class="card-top">
          <ArticleImage
            :height="150"
            :path="createPath(`products/${product.image}.png`)"
          />
        </v-col>
        <v-col cols="12" class="card-title pb-0">
          <p>{{ product.title }}</p>
        </v-col>
        <v-col cols="12" class="card-description pb-0">
          <p>{{ product.description }}</p>
        </v-col>
        <v-col class="mt-2 card-tags">
          <Chip
            v-for="(tag, index) in product.tagList"
            :key="index"
            :name="tag"
          />
        </v-col>
        <v-col cols="12" class="card-grade d-flex justify-space-between">
          <div class="d-flex align-center">
            <v-icon icon="mdi-account-school"  class="icon mr-1" />
            <p>{{ product.grade }}</p>
          </div>
          <v-btn
            class="px-0"
            variant="text"
          >
            <v-icon icon="mdi-open-in-new" class="icon mr-1" />
            <p>詳細へ</p>
          </v-btn>
        </v-col>
        
      </v-card>
    </v-row>
  </div>
</template>