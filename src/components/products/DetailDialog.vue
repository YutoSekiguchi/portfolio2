<script lang="ts" setup>
import { computed } from 'vue'
import { ProductsType } from '@/settings/productsType'
import ArticleImage from '../common/ArticleImage.vue'
import Chip from '../common/Chip.vue'
import { useLocale } from '@/i18n'
import { localizeTag } from '@/i18n/content'

const { locale, copy } = useLocale()

interface Props {
  isDialog: boolean
  closeDialog: () => void
  product: ProductsType
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
    :aria-labelledby="`product-dialog-${product.image}`"
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
          <v-app-bar-title class="products">{{ copy.sections.products }}</v-app-bar-title>
        </v-app-bar>

        <v-main class="dialog-card-main">
          <p
            :id="`product-dialog-${product.image}`"
            :lang="contentLanguage(product.title)"
            class="text-center text-h6 font-weight-bold pt-2 px-5 mb-3"
          >
            {{ product.title }}
          </p>

          <ArticleImage
            :path="createPath(`products/${product.image}.png`)"
            :alt="product.title"
            :height="200"
            class="mb-6"
          />

          <p class="font-weight-bold text-h5 ml-4">{{ copy.common.abstract }}</p>
          <p class="description" :lang="contentLanguage(product.description)">
            {{ product.description }}
          </p>

          <template v-if="product.urlList?.length">
            <v-row
              v-for="url in product.urlList"
              :key="url"
              class="ml-0 pl-4 mt-4"
            >
              <v-icon icon="mdi-link" class="icon mr-1" aria-hidden="true" />
              <a :href="url" target="_blank" rel="noopener noreferrer">{{ url }}</a>
            </v-row>
          </template>

          <div class="tags mb-12 ml-2 mt-8">
            <Chip
              v-for="tag in product.tagList"
              :key="tag"
              :name="localizeTag(tag, locale)"
            />
          </div>
        </v-main>
      </v-layout>
    </v-card>
  </v-dialog>
</template>
