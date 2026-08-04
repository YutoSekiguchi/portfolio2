<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue'
import PageTitle from '@/components/common/PageTitle.vue'
import ArticleImage from '@/components/common/ArticleImage.vue'
import DetailDialog from '@/components/products/DetailDialog.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import Chip from '@/components/common/Chip.vue'
import Products from '../settings/products.json'
import { ProductsType } from '@/settings/productsType'
import { useTagsStore } from '@/store/tags'
import { useLocale } from '@/i18n'
import { localizeProducts, localizeTag } from '@/i18n/content'

const productsStore = useTagsStore()
const { locale, copy } = useLocale()
const isDialog = ref(false)
const selectedProduct = ref<ProductsType | null>(null)
const sourceProductsList = ref<ProductsType[]>(Products as ProductsType[])
const childComponent = ref()
const dialogTrigger = ref<HTMLElement | null>(null)

const productsList = computed(() =>
  localizeProducts(sourceProductsList.value, locale.value),
)

const openDialog = (product: ProductsType) => {
  dialogTrigger.value = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null
  selectedProduct.value = product
  isDialog.value = true
}

const closeDialog = () => {
  isDialog.value = false
  nextTick(() => dialogTrigger.value?.focus())
}

const clickTag = (tag: string) => {
  childComponent.value?.clickTag(tag, productsStore)
}

const showAllProducts = () => {
  sourceProductsList.value = Products as ProductsType[]
}

const showSearchProducts = (nowTag: string[]) => {
  productsStore.getProducts(nowTag)
  sourceProductsList.value = productsStore.products
}

const createPath = (name: string) => {
  return new URL(`../assets/${name}`, import.meta.url).href
}

</script>

<template>
  <DetailDialog
    v-if="selectedProduct"
    :is-dialog="isDialog"
    :close-dialog="closeDialog"
    :product="selectedProduct"
  />

  <main class="products-main mx-auto">
    <v-row class="products-main-header mx-auto">
      <PageTitle :title="copy.sections.products" />
      <SearchBar
        ref="childComponent"
        :data="Products"
        :show-all="showAllProducts"
        :show-search="showSearchProducts"
      />
    </v-row>

    <v-row class="container">
      <v-card
        v-for="product in productsList"
        :key="product.image"
        class="card"
      >
        <v-col cols="12" class="card-top">
          <ArticleImage
            role="button"
            tabindex="0"
            aria-haspopup="dialog"
            :aria-label="`${copy.common.details}: ${product.title}`"
            :height="150"
            :path="createPath(`products/${product.image}.png`)"
            :alt="product.title"
            style="cursor: pointer"
            @click="openDialog(product)"
            @keydown.enter="openDialog(product)"
            @keydown.space.prevent="openDialog(product)"
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
            v-for="tag in product.tagList"
            :key="tag"
            :name="localizeTag(tag, locale)"
            role="button"
            tabindex="0"
            @click="clickTag(tag)"
            @keydown.enter="clickTag(tag)"
            @keydown.space.prevent="clickTag(tag)"
          />
        </v-col>

        <v-col cols="12" class="card-grade d-flex justify-space-between">
          <div class="d-flex align-center">
            <v-icon icon="mdi-account-school" class="icon mr-1" aria-hidden="true" />
            <p>{{ product.grade }}</p>
          </div>
          <v-btn
            class="px-0"
            variant="text"
            @click="openDialog(product)"
          >
            <v-icon icon="mdi-open-in-new" class="icon mr-1" />
            <p>{{ copy.common.details }}</p>
          </v-btn>
        </v-col>
      </v-card>
    </v-row>
  </main>
</template>
