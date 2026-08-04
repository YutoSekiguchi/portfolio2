<script lang="ts" setup>
  import { defineProps, computed, ref, watch, defineExpose } from 'vue';
  import { ProductsType } from '@/settings/productsType';
  import { WorksType } from '@/settings/worksType';
  import Chip from '@/components/common/Chip.vue';
  import { useLocale } from '@/i18n';
  import { localizeTag } from '@/i18n/content';

  const { locale, copy } = useLocale();

  interface Props {
    data: ProductsType[] | WorksType[];
    showAll: () => void;
    showSearch: (nowTag: string[]) => void;
  }
  const props = defineProps<Props>();
  // Keep the filter order stable so the interface does not jump between renders.
  const allTags = computed(() => {
    const res: string[] = [];
    props.data.map((el) => {
      el.tagList?.map((tag) => {
        if (!res.includes(tag)) { res.push(tag); }
      })
    })
    return res.sort((a, b) => a.localeCompare(b, locale.value));
  })

  const allTagList = computed(() =>
    allTags.value.map((tag) => ({
      title: localizeTag(tag, locale.value),
      value: tag,
    }))
  )

  const inputedTag = ref<string[]>([]);

  // 記事のタグクリック時の動作
  const clickTag = (tag: string, store: any) => {
    store?.changeTag(tag);
    inputedTag.value = store?.searchTagList;
  }

  watch(inputedTag, (nowTag) => {
    if (nowTag.length <= 0) {
      props.showAll();
    } else {
      props.showSearch(nowTag);
    }
  })
  
  defineExpose({
    clickTag,
  });
</script>

<template>
  <v-col class="py-0">
    <v-autocomplete
      v-model="inputedTag"
      :label="copy.common.selectTags"
      :items="allTagList"
      :no-data-text="copy.common.noResults"
      multiple
      clearable
      variant="underlined"
      class="search-tag-bar mt-2 ml-auto"
    >
      <template v-slot:chip="data">
        <Chip
          v-bind="data.props"
          :name="data.item.title"
          cl="mr-2 mb-1"
        />
      </template>
    </v-autocomplete>
  </v-col>
</template>
