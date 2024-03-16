<script lang="ts" setup>
  import Works from '../settings/works.json';
  import { ref } from 'vue';
  import { WorksType } from '@/settings/worksType';
  import { ProductsType } from '@/settings/productsType';
  import Products from '../settings/products.json';
  import PaperIcon from "@/components/icon/Paper.vue"
  import SlideIcon from "@/components/icon/Slide.vue"
  import CodeIcon from "@/components/icon/Code.vue"
  import LinkIcon from "@/components/icon/Link.vue"

  const worksList = ref<WorksType[]>(Works);
  const productsList = ref<ProductsType[]>(Products);
  const createPath =  (name: string) => {
    return new URL(`../assets/${name}`, import.meta.url).href;
  }

  const description = ref<string | undefined>("");
  const dialog = ref<boolean>(false);

  const handleClick = (tmp: string | undefined) => {
    description.value = tmp;
    dialog.value = true;
  }
</script>

<template>
  <v-dialog v-if="dialog" v-model="dialog" width="500">
    <v-card>
      <v-card-title class="headline">Abstract</v-card-title>
      <p class="map-text px-4">{{ description }}</p>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="black darken-1" text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div class="top mb-6">
    <v-img
      aspect-ratio="1"
      width="250"
      src="@/assets/me.jpg"
      class="me-img"
    />
    <v-col md="6" cols="12" sm="8">
      <h1 class="el-title">Profile</h1>
      <p class="map-text">明治大学大学院先端数理科学研究科先端メディアサイエンス専攻の1年生として、ヒューマンコンピュータインタラクション（HCI）の分野を研究。<br />特に選択行動、手書きユーザインタフェース、漫画の想起といったトピックに着手。また、ソフトウェアエンジニアとして、プログラミングやシステム開発のスキルを研究に活かしています。<br />HCIの知見とエンジニアリングの技術を組み合わせ、より使いやすく魅力的なインタラクションの実現を目指しています。<br /><br />＜所属学会＞<br />・情報処理学会会員</p>
    </v-col>
  </div>

  <v-col class="mx-auto" xl="6" md="8"  cols="12">
    <h5 class="el-title">
      Academic background
    </h5>
    <ul>
      <li>
        <p class="map-text">2019 千葉県立佐倉高等学校卒業</p>
      </li>
      <li>
        <p class="map-text">2023 明治大学総合数理学部先端メディアサイエンス学科卒業</p>
      </li>
      <li>
        <p class="map-text">2024 明治大学大学院先端数理科学研究科先端メディアサイエンス専攻在学</p>
      </li>
    </ul>
  </v-col>

  <v-col class="mx-auto" xl="6" md="8"  cols="12">
    <h5 class="el-title">
      Research
    </h5>
    <v-row class="mx-auto justify-space-around work-row" v-for="(work, index) in worksList" :key="index">
      <v-col sm="4" cols="12" class="my-auto">
        <v-img
        class="mx-auto"
          width="250"
          aspect-ratio="1.7"
          :src="createPath(`works/${work.image}.png`)"
        />
      </v-col>
      <v-col cols="12" sm="8" class="my-auto">
          <p class="work-title" @click="handleClick(work.description)">{{ work.title }}</p>
          <p class="work-authors map-text">{{ work.authors }}</p>
          <p class="work-conference map-text">{{ work.conference }}</p>
          <div class="flex">
            <div v-if="work.paper" class="flex">
              <PaperIcon />
              <a :href="work.paper" target="_blank" class="work-url">Paper</a>
            </div>
            <div v-if="work.slide" class="flex ml-2">
              <SlideIcon />
              <a :href="work.slide" target="_blank" class="work-url">Slide</a>
            </div>
            <div v-if="work.code" class="flex ml-2">
              <CodeIcon />
              <a :href="work.code" target="_blank" class="work-url">Code</a>
            </div>
            <div v-if="work.system" class="flex ml-2">
              <LinkIcon />
              <a :href="work.system" target="_blank" class="work-url">System</a>
            </div>
          </div>
      </v-col>
    </v-row>
  </v-col>

  <v-col class="mx-auto" xl="6" md="8"  cols="12">
    <h5 class="el-title">
      Certifications and Awards
    </h5>
    <ul>
      <li>
        <p class="map-text">2021 基本情報技術者試験（FE）合格</p>
      </li>
      <li>
        <p class="map-text">2022 第10回学生スマートフォンアプリコンテスト奨励賞受賞</p>
      </li>
      <li>
        <p class="map-text">2023 HCI研究会学生奨励賞受賞</p>
      </li>
    </ul>
  </v-col>

  <v-col class="mx-auto mb-4" xl="6" md="8"  cols="12">
    <h5 class="el-title">
      Skills
    </h5>
    <p class="map-text">React/Next.js, Vue/Nuxt.js, TypeScript, Python, Golang, Flutter, PHP, GAS, Node.js, Processing, MATLAB, Spring Boot, Docker</p>
  </v-col>

  <v-col class="mx-auto" xl="6" md="8"  cols="12">
    <h5 class="el-title">
      Products
    </h5>
    <v-row class="mx-auto justify-space-around work-row" v-for="(product, index) in productsList" :key="index">
      <v-col sm="6" cols="12" class="my-auto">
        <v-img
        class="mx-auto"
          width="250"
          aspect-ratio="1.7"
          :src="createPath(`products/${product.image}.png`)"
        />
      </v-col>
      <v-col cols="12" sm="6" class="my-auto">
          <p class="work-title" @click="handleClick(product.description)">{{ product.title }}</p>
          <p class="work-authors map-text">{{ product.tagList.join(", ") }}</p>
          <p class="work-conference map-text">{{ product.grade }}年</p>
          <div class="flex">
            <div v-if="product.code" class="flex mr-2">
              <CodeIcon />
              <a :href="product.code" target="_blank" class="work-url">Code</a>
            </div>
            <div v-if="product.urlList" class="flex mr-2">
              <LinkIcon />
              <a :href="product.urlList[0]" target="_blank" class="work-url">Link</a>
            </div>
          </div>
      </v-col>
    </v-row>
  </v-col>

  <v-col class="mx-auto" xl="6" md="8"  cols="12">
    <h5 class="el-title">
      Contact
    </h5>
    <p class="map-text">Email: yuutosekiguchi[at]gmail.com</p>
  </v-col>

</template>

<style scoped>
.me-img {
  max-width: 250px;
  @media (max-width: 599px) {
    margin: 20px auto;
    display: block;
  }@media (min-width: 600px) {
    margin-right: 40px;
    margin-top: 50px;
  }
}
.top {
  @media (min-width: 600px) {
    margin-left: 60px;
    margin-right: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.cards {
  max-width: 1000px;
}
.map {
  max-width: 1000px;
}
.el-title {
  font-size: 2rem;
  font-weight: bold;
}
.map-text {
  font-size: 0.8rem;
  line-height: 1.4em;
  word-break: auto-phrase;;
  white-space: pre-wrap;
  @media (min-width: 600px) {
    line-height: 1.6em;
  }
}
.el-title {
  margin-bottom: 5px;
}
.img-wrapper {
  text-align: center;
}
.work-title {
  font-size: 0.9rem;
  font-weight: bold;
  color: black;
  cursor: pointer;
  text-decoration: underline;
}
.work-authors {
  padding-top: 5px;

}
.work-row {
  margin-bottom: 0px;
}
.work-url {
  text-decoration: none;
  padding-left: 2px;
  font-size: 0.8rem;
  cursor: pointer;
  color: #555;
  border-bottom: 1px solid #ccc;
}
.work-url:hover {
  color: #aaa;
}
li {
  margin-top: 10px;
  margin-bottom: 5px;
  list-style: none;
}
</style>