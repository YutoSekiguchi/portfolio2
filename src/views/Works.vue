<script lang="ts" setup>
  import PageTitle from '@/components/common/PageTitle.vue';
  import DetailDialog from '@/components/works/DetailDialog.vue';
  import ArticleImage from '@/components/works/ArticleImage.vue';
  import Works from '../settings/works.json';
  import { WorksType } from '@/settings/worksType';
  import { ref } from 'vue';

  const isDialog = ref<boolean>(false);
  const num = ref<number>(0);

  const openDialog = (index: number) => {
    num.value = index;
    isDialog.value = true;
  }

  const closeDialog = () => {
    isDialog.value = false;
  }

  const worksList: WorksType[] = Works;
</script>

<template>
  <DetailDialog
    :is-dialog="isDialog"
    :close-dialog="closeDialog"
    :work="worksList[num]"
  />
  <div class="main mx-auto">
    <PageTitle title="Works" class="main-title mx-auto" />
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
              ># {{ tag }}</v-chip>
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
</style>