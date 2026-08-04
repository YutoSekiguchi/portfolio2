<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import PageTitle from '@/components/common/PageTitle.vue'
import DetailDialog from '@/components/works/DetailDialog.vue'
import ArticleImage from '@/components/common/ArticleImage.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import Chip from '@/components/common/Chip.vue'
import Works from '../settings/works.json'
import { WorksType } from '@/settings/worksType'
import { useTagsStore } from '@/store/tags'
import { useLocale } from '@/i18n'
import { localizeTag } from '@/i18n/content'

const worksStore = useTagsStore()
const { locale, copy } = useLocale()
const isDialog = ref(false)
const selectedWork = ref<WorksType | null>(null)
const worksList = ref<WorksType[]>(Works as WorksType[])
const childComponent = ref()
const dialogTrigger = ref<HTMLElement | null>(null)

const openDialog = (work: WorksType) => {
  dialogTrigger.value = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null
  selectedWork.value = work
  isDialog.value = true
}

const closeDialog = () => {
  isDialog.value = false
  nextTick(() => dialogTrigger.value?.focus())
}

const clickTag = (tag: string) => {
  childComponent.value?.clickTag(tag, worksStore)
}

const showAllWorks = () => {
  worksList.value = Works as WorksType[]
}

const showSearchWorks = (nowTag: string[]) => {
  worksStore.getWorks(nowTag)
  worksList.value = worksStore.works
}

const createPath = (name: string) => {
  return new URL(`../assets/${name}`, import.meta.url).href
}

</script>

<template>
  <DetailDialog
    v-if="selectedWork"
    :is-dialog="isDialog"
    :close-dialog="closeDialog"
    :work="selectedWork"
  />

  <main class="works-main mx-auto">
    <v-row class="works-main-header mx-auto">
      <PageTitle :title="copy.sections.publications" />
      <SearchBar
        ref="childComponent"
        :data="Works"
        :show-all="showAllWorks"
        :show-search="showSearchWorks"
      />
    </v-row>

    <v-col
      v-for="(work, index) in worksList"
      :key="`${work.title}-${work.date || index}`"
    >
      <v-card
        variant="flat"
        class="card"
      >
        <v-card-item class="mb-6">
          <v-card-title class="text-center text-h5 font-weight-bold">
            {{ work.title }}
          </v-card-title>
        </v-card-item>

        <v-row class="mb-3">
          <v-col cols="12" sm="6" class="card-left">
            <ArticleImage
              v-if="work.image"
              role="button"
              tabindex="0"
              aria-haspopup="dialog"
              :aria-label="`${copy.common.details}: ${work.title}`"
              :path="createPath(`works/${work.image}.png`)"
              :alt="work.title"
              style="cursor: pointer"
              @click="openDialog(work)"
              @keydown.enter="openDialog(work)"
              @keydown.space.prevent="openDialog(work)"
            />
          </v-col>

          <v-col cols="12" sm="6" class="card-right">
            <p class="description">{{ work.description }}</p>

            <v-row class="open-dialog mt-0 justify-end">
              <v-btn
                class="px-0"
                variant="text"
                @click="openDialog(work)"
              >
                <v-icon icon="mdi-open-in-new" class="icon mr-1" />
                <p>{{ copy.common.details }}</p>
              </v-btn>
            </v-row>

            <v-row class="authors mt-3 ml-0">
              <v-icon icon="mdi-account" class="icon mr-1" aria-hidden="true" />
              <p>{{ work.authors }}</p>
            </v-row>

            <v-col class="d-flex justify-space-between pl-0 wrap">
              <v-row class="conference mt-3 ml-0">
                <v-icon icon="mdi-map-marker" class="icon mr-1" aria-hidden="true" />
                <p>{{ work.conference }}</p>
              </v-row>

              <v-row class="date mt-3 justify-end">
                <v-icon icon="mdi-calendar" class="icon mr-1" aria-hidden="true" />
                <p>{{ work.date }}</p>
              </v-row>
            </v-col>

            <v-col class="pl-0 tags">
              <Chip
                v-for="tag in work.tagList"
                :key="tag"
                :name="localizeTag(tag, locale)"
                role="button"
                tabindex="0"
                @click="clickTag(tag)"
                @keydown.enter="clickTag(tag)"
                @keydown.space.prevent="clickTag(tag)"
              />
            </v-col>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </main>
</template>
