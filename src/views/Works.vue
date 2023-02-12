<script lang="ts" setup>
  import PageTitle from '@/components/common/PageTitle.vue';
  import DetailDialog from '@/components/works/DetailDialog.vue';
  import ArticleImage from '@/components/works/ArticleImage.vue';
  import Works from '../settings/works.json';
  import { WorksType } from '@/settings/worksType';
  import { ref, computed, watch } from 'vue';
  import { useWorksStore } from '@/store/works';

  const worksStore = useWorksStore();
  const isDialog = ref<boolean>(false);
  const num = ref<number>(0);

  const openDialog = (index: number) => {
    num.value = index;
    isDialog.value = true;
  }

  const closeDialog = () => {
    isDialog.value = false;
  }

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

  const worksList = ref<WorksType[]>(worksStore.works);
  // 全てのタグのリストをランダムな順で保持
  const allTagList = computed(() => {
    const res: string[] = [];
    Works.map((work) => {
      work.tagList.map((tag) => {
        if (!res.includes(tag)) { res.push(tag); }
      })
    })
    return shuffleArray(res);
  })
  const inputedTag = ref<string[]>(worksStore.searchTagList);

  // 記事のタグクリック時の動作
  const clickTag = (tag: string) => {
    worksStore.changeTag(tag);
    inputedTag.value = worksStore.searchTagList;
  }

  // ボックス選択した時の動作
  watch(inputedTag, (nowTag) => {
    if (nowTag.length <= 0) { 
      worksList.value = Works;
    } else {
      worksStore.getWorks(nowTag);
      worksList.value = worksStore.works;
    }
  })
</script>

<template>
  <DetailDialog
    :is-dialog="isDialog"
    :close-dialog="closeDialog"
    :work="worksList[num]"
  />
  <div class="main mx-auto">
    <PageTitle title="Works" class="main-title mx-auto" />
    <v-col class="py-0">
      <v-autocomplete
        v-model="inputedTag"
        label="Select"
        :items="allTagList"
        multiple
        clearable
        variant="underlined"
        class="search-tag-bar mt-2 mx-auto"
      >
        <template v-slot:chip="data">
          <v-chip
            variant="outlined"
            color="cyan"
            class="mr-2 mb-1"
          >#&nbsp;{{ data.item.title }}</v-chip>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col v-for="(work, i) in worksList" :key="i">
      <v-card
        variant="flat"
        class="card"
      >
        <v-card-item class="mb-6">
          <v-card-title class="text-center text-h5 font-weight-bold">{{ work.title }}</v-card-title>
        </v-card-item>
        <v-row class="mb-3">
          <v-col cols="6" class="card-left">
            <ArticleImage
              :path="`works/${work.image}.png`"
            />
          </v-col>

          <v-col cols="6" class="card-right">
            <p class="description">{{ work.description }}</p>

            <v-row class="open-dialog mt-0 justify-end">
              <v-btn
                class="px-0"
                variant="text"
                @click="openDialog(i)"
              >
                <v-icon icon="mdi-open-in-new" class="icon mr-1" />
                <p>詳細へ</p>
              </v-btn>
            </v-row>

            <v-row class="authors mt-3 ml-0">
              <v-icon icon="mdi-account" class="icon mr-1" />
              <p>{{ work.authors }}</p>
            </v-row>

            <v-col class="d-flex justify-space-between pl-0 wrap">
              <v-row class="conference mt-3 ml-0">
                <v-icon icon="mdi-map-marker" class="icon mr-1" />
                <p>{{ work.conference }}</p>
              </v-row>
              
              <v-row class="date mt-3 justify-end">
                <v-icon icon="mdi-calendar" class="icon mr-1" />
                <p>{{ work.date }}</p>
              </v-row>
            </v-col>

            <v-col class="pl-0 tags">
              <v-chip
                variant="outlined"
                color="cyan"
                class="mr-3"
                v-for="(tag, index) in work.tagList"
                :key="index"
                @click="clickTag(tag)"
              >#&nbsp;{{ tag }}</v-chip>
            </v-col>
          </v-col> 
        </v-row>
      </v-card>
    </v-col>
  </div>
</template>

<style scoped>
.main {
  max-width: 1200px;
}
.main-title {
  max-width: 1000px;
}
.card {
  padding-bottom: 30px;
  border-bottom: dashed 1px #555;
}
p, .icon {
  color: #555;
}
.description {
  max-width: 500px;
  font-weight: bolder;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 8;
  overflow: hidden;
}
.wrap, .tags, .open-dialog {
  max-width: 500px;
}
.authors, .conference, .date, .open-dialog {
  font-size: 0.8rem;
}
.tags {
  overflow: auto;
  white-space:nowrap;
}
.search-tag-bar {
  max-width: 600px;
}
</style>