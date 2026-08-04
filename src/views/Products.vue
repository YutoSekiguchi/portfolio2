<script lang="ts" setup>
  import PageTitle from '@/components/common/PageTitle.vue';
  import ArticleImage from '@/components/common/ArticleImage.vue';
  import DetailDialog from '@/components/products/DetailDialog.vue';
  import SearchBar from '@/components/common/SearchBar.vue';
  import Chip from '@/components/common/Chip.vue';
  import Products from '../settings/products.json';
  import { ProductsType } from '@/settings/productsType';
  import { computed, ref } from 'vue';
  import { useTagsStore } from '@/store/tags';
  import { useLocale } from '@/i18n';
  import { localizeProducts } from '@/i18n/content';

  const productsStore = useTagsStore();
  const { locale, copy } = useLocale();

  const isDialog = ref<boolean>(false);
  const num = ref<number>(0);

  const openDialog = (index: number) => {
    num.value = index;
    isDialog.value = true;
  }

  const closeDialog = () => {
    isDialog.value = false;
  }
  const sourceProductsList = ref<ProductsType[]>(Products as ProductsType[]);
  const productsList = computed(() =>
    localizeProducts(sourceProductsList.value, locale.value)
  );

  const childComponent = ref();
  // 記事のタグクリック時の動作
  const clickTag = (tag: string) => {
    childComponent.value.clickTag(tag, productsStore);
  }
  
  const showAllProducts = () => {
    sourceProductsList.value = Products as ProductsType[];
  }

  const showSearchProducts = (nowTag: string[]) => {
    productsStore.getProducts(nowTag);
    sourceProductsList.value = productsStore.products;
  }
  
  const createPath =  (name: string) => {
    return new URL(`../assets/${name}`, import.meta.url).href;
  }
</script>

<template>
  <DetailDialog
    :is-dialog="isDialog"
    :close-dialog="closeDialog"
    :product="productsList[num]"
  />
  <div class="products-main mx-auto">
    <v-row class="products-main-header mx-auto">
      <PageTitle :title="copy.sections.products" />
      <SearchBar
        ref="childComponent"
        :data="Products"
        :showAll="showAllProducts"
        :showSearch="showSearchProducts"
      />
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
            :alt="product.title"
            style="cursor: pointer;"
            @click="openDialog(i)"
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
            @click="clickTag(tag)"
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
            @click="openDialog(i)"
          >
            <v-icon icon="mdi-open-in-new" class="icon mr-1" />
            <p>{{ copy.common.details }}</p>
          </v-btn>
        </v-col>
        
      </v-card>
    </v-row>
  </div>
</template>
