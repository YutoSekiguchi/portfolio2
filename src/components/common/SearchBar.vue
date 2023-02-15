<script lang="ts" setup>
  import { defineProps, computed, ref, watch, defineExpose } from 'vue';
  import { ProductsType } from '@/settings/productsType';
  import { WorksType } from '@/settings/worksType';
  import Chip from '@/components/common/Chip.vue';

  export interface Props {
    data: ProductsType[] | WorksType[];
    showAll: () => void;
    showSearch: (nowTag: string[]) => void;
  }
  const props = defineProps<Props>();
  // 配列の要素の順番を入れ替える関数
  const shuffleArray = (array: string[]) => {
    const cloneArray = [...array]
    for (let i = cloneArray.length - 1; i >= 0; i--) {
      let rand = Math.floor(Math.random() * (i + 1))
      let tmpStorage = cloneArray[i]
      cloneArray[i] = cloneArray[rand]
      cloneArray[rand] = tmpStorage
    }
    return cloneArray
  }
  // 全てのタグのリストをランダムな順で保持
  const allTagList = computed(() => {
    const res: string[] = [];
    props.data.map((el) => {
      el.tagList?.map((tag) => {
        if (!res.includes(tag)) { res.push(tag); }
      })
    })
    return shuffleArray(res);
  })

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
    clickTag
  });
</script>

<template>
  <v-col class="py-0">
    <v-autocomplete
      v-model="inputedTag"
      label="Select"
      :items="allTagList"
      multiple
      clearable
      variant="underlined"
      class="search-tag-bar mt-2 ml-auto"
    >
      <template v-slot:chip="data">
        <Chip
          :name="data.item.title"
          cl="mr-2 mb-1"
        />
      </template>
    </v-autocomplete>
  </v-col>
</template>