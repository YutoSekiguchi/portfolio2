<script lang="ts" setup>
import { ref, computed } from "vue";
import Works from "../settings/works.json";
import Products from "../settings/products.json";
import { WorksType } from "@/settings/worksType";
import { ProductsType } from "@/settings/productsType";
import PaperIcon from "@/components/icon/Paper.vue";
import SlideIcon from "@/components/icon/Slide.vue";
import CodeIcon from "@/components/icon/Code.vue";
import LinkIcon from "@/components/icon/Link.vue";

const worksList = ref<WorksType[]>(Works);
const productsList = ref<ProductsType[]>(Products);

const description = ref<string | undefined>("");
const dialogImage = ref<string | undefined>("");
const dialog = ref<boolean>(false);

const handleClick = (desc: string | undefined, imgFileName: string | undefined) => {
  description.value = desc;
  dialogImage.value = imgFileName;
  dialog.value = true;
};

const createPath = (name: string) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

// Define main categories in the desired order.
const mainCategories = [
  "Journal",
  "International Conference",
  "Domestic Conference",
];

const groupedWorksOrdered = computed(() => {
  const groups: Record<string, Record<string, WorksType[]>> = {
    Journal: { Regular: [] },
    "International Conference": { Regular: [], "Demonstration/Poster": [] },
    "Domestic Conference": {
      "Peer-Reviewed Regular": [],
      "Peer-Reviewed Demonstration/Poster": [],
      "Non-Peer-Reviewed Regular": [],
      "Non-Peer-Reviewed Demonstration/Poster": [],
    },
  };

  worksList.value.forEach((work) => {
    const pubType = work.publication_type || "";
    let mainGroup = "";

    if (pubType.includes("Journal")) {
      mainGroup = "Journal";
    } else if (pubType.includes("International")) {
      mainGroup = "International Conference";
    } else {
      mainGroup = "Domestic Conference";
    }

    if (mainGroup === "International Conference") {
      const subGroup = pubType.includes("Demonstration/Poster")
        ? "Demonstration/Poster"
        : "Regular";
      groups[mainGroup][subGroup].push(work);
    } else if (mainGroup === "Domestic Conference") {
      const peerReviewed = work.review ? "Peer-Reviewed" : "Non-Peer-Reviewed";
      const subGroup = pubType.includes("Demonstration/Poster")
        ? "Demonstration/Poster"
        : "Regular";
      const category = `${peerReviewed} ${subGroup}`;
      groups[mainGroup][category].push(work);
    } else {
      groups[mainGroup]["Regular"].push(work);
    }
  });

  return groups;
});

const filteredGroupedWorks = computed(() => {
  return Object.fromEntries(
    Object.entries(groupedWorksOrdered.value).filter(([_, subGroups]) =>
      Object.values(subGroups).some((arr) => arr.length > 0)
    )
  );
});

const filteredSubGroups = computed(() => (category: string) => {
  return Object.fromEntries(
    Object.entries(groupedWorksOrdered.value[category]).filter(
      ([_, arr]) => arr.length > 0
    )
  );
});

const removeSubstring = computed(() => (str: string, target: string) => {
  if (str.includes("Demonstration/Poster")) {
    return "Demonstration/Poster";
  }
  return str.split(target).join("");
});
</script>

<template>
  <v-dialog v-if="dialog" v-model="dialog" width="500">
    <v-card>
      <v-card-title class="headline">Abstract</v-card-title>
      <v-img
          class="mx-auto"
          v-if="dialogImage"
          width="600"
          aspect-ratio="1.7"
          :src="createPath(`works/${dialogImage}.png`)"
        />
      <p class="map-text px-4">{{ description }}</p>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="black darken-1" text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Profile Section (unchanged) -->
  <div class="top mb-6">
    <v-img aspect-ratio="1" width="300" src="@/assets/me.jpg" class="me-img" />
    <v-col md="6" cols="12" sm="8">
      <h1 class="el-title">Profile</h1>
      <p class="map-text">
        明治大学大学院 先端数理科学研究科 <br />
        先端メディアサイエンス専攻
        <a class="link" href="https://nkmr-lab.org/">中村聡史研究室</a><br />
        Meiji University Graduate School of Advanced Mathematical Sciences
        <br />
        Frontier Media Science Program
        <a class="link" href="https://nkmr-lab.org/">Nakamura Laboratory</a
        ><br /><br />
        <span style="font-weight: bold">Keywords</span><br />
        HCI、手書き、プログラミング教育、LLM<br />
        HCI, handwriting, programming education, LLM<br /><br />
        <span style="font-weight: bold">Academic Memberships</span><br />
        ・情報処理学会会員
      </p>
    </v-col>
  </div>

  <!-- Publication Section -->
  <v-col class="mx-auto" xl="6" md="8" cols="12">
    <h5 class="el-title">Publication</h5>
    <div v-for="category in mainCategories" :key="category" class="mb-8">
      <template v-if="category in filteredGroupedWorks">
        <h2 style="border-left: 5px solid #999; padding-left: 8px;">{{ category }}</h2>
        <div
          v-for="(subGroup, subGroupName) in filteredSubGroups(category)"
          :key="subGroupName"
        >
          <h3 v-if="subGroupName !== 'Regular'">{{ removeSubstring(subGroupName.toString(), "Regular") }}</h3>
          <div
            v-for="(work, index) in subGroup"
            :key="`${category}-${subGroupName}-${index}`"
            class="pub-item"
          >
            <div class="pub-main">
              <!-- <span class="pub-index">
                {{ index + 1 }}.
              </span> -->
              <span class="pub-title" @click="handleClick(work.description, work.image)">{{ index + 1 }}.&nbsp;{{ work.citation }}
                <span class="pub-award" v-if="work.award !== ''">
                【{{ work.award }}】
              </span>
              </span>
              
              <!-- <span class="pub-title" @click="handleClick(work.description, work.image)">{{
                work.title
              }}</span>
              <span class="pub-detail">
                — {{ work.authors }} — {{ work.conference }}</span
              > -->
            </div>
            <div class="pub-icons">
              <span v-if="work.paper">
                <a :href="work.paper" target="_blank">
                  <PaperIcon class="pub-icon" />
                </a>
              </span>
              <span v-if="work.slide">
                <a :href="work.slide" target="_blank">
                  <SlideIcon class="pub-icon" />
                </a>
              </span>
              <span v-if="work.code">
                <a :href="work.code" target="_blank">
                  <CodeIcon class="pub-icon" />
                </a>
              </span>
              <span v-if="work.system">
                <a :href="work.system" target="_blank">
                  <LinkIcon class="pub-icon" />
                </a>
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </v-col>

  <!-- Remaining sections (Certifications and Awards, Products, Academic background, Skills, Contact) remain unchanged -->
  <v-col class="mx-auto" xl="6" md="8" cols="12">
    <h5 class="el-title">Certifications and Awards</h5>
    <ul>
      <li>
        <p class="map-text">2021 基本情報技術者試験（FE）合格</p>
      </li>
      <li>
        <p class="map-text">2022 第10回学生スマートフォンアプリコンテスト奨励賞受賞
        </p>
      </li>
      <li>
        <p class="map-text">2023 HCI研究会学生奨励賞受賞</p>
      </li>
    </ul>
  </v-col>

  <v-col class="mx-auto" xl="6" md="8" cols="12">
    <h5 class="el-title">Products</h5>
    <v-row
      class="mx-auto justify-space-around work-row"
      v-for="(product, index) in productsList"
      :key="index"
    >
      <v-col sm="6" cols="12" class="my-auto">
        <v-img
          class="mx-auto"
          width="250"
          aspect-ratio="1.7"
          :src="createPath(`products/${product.image}.png`)"
        />
      </v-col>
      <v-col cols="12" sm="6" class="my-auto">
        <p class="product-title" @click="handleClick(product.description, undefined)">
          {{ product.title }}
        </p>
        <p class="work-authors map-text">{{ product.tagList.join(", ") }}</p>
        <p class="work-conference map-text">{{ product.grade }}年</p>
        <div class="flex">
          <div v-if="product.code" class="flex mr-2">
            <CodeIcon />
            <a :href="product.code" target="_blank" class="work-url">Code</a>
          </div>
          <div v-if="product.urlList" class="flex mr-2">
            <LinkIcon />
            <a :href="product.urlList[0]" target="_blank" class="work-url"
              >Link</a
            >
          </div>
        </div>
      </v-col>
    </v-row>
  </v-col>

  <v-col class="mx-auto" xl="6" md="8" cols="12">
    <h5 class="el-title">Academic background</h5>
    <ul>
      <li>
        <p class="map-text">2019 千葉県立佐倉高等学校卒業</p>
      </li>
      <li>
        <p class="map-text">
          2023 明治大学総合数理学部先端メディアサイエンス学科卒業
        </p>
      </li>
      <li>
        <p class="map-text">
          2024 明治大学大学院先端数理科学研究科先端メディアサイエンス専攻在学
        </p>
      </li>
    </ul>
  </v-col>

  <v-col class="mx-auto mb-4" xl="6" md="8" cols="12">
    <h5 class="el-title">Skills</h5>
    <p class="map-text">
      React/Next.js, Vue/Nuxt.js, TypeScript, Python, Golang, Flutter, PHP, GAS,
      Node.js, Processing, MATLAB, Spring Boot, Docker
    </p>
  </v-col>

  <v-col class="mx-auto" xl="6" md="8" cols="12">
    <h5 class="el-title">Contact</h5>
    <p class="map-text">Email: yuutosekiguchi[at]gmail.com</p>
  </v-col>
</template>

<style scoped>
/* Existing styles */
.me-img {
  max-width: 280px;
  border-radius: 5%;
  margin-right: 0px;
  margin-top: 12px;
}

.me-img {
  @media (max-width: 600px) {
    margin: auto;
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
.el-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 5px;
}
.map-text {
  font-size: 0.8rem;
  line-height: 1.4em;
  word-break: break-word;
  white-space: pre-wrap;
  @media (min-width: 600px) {
    line-height: 1.6em;
  }
}
.link {
  text-decoration: none;
  color: #00bfff;
  border-bottom: 1px solid #00bfff;
}
.link:hover {
  color: #0088aa;
  border-bottom: 1px solid #0088aa;
}

/* New one-line publication styles */
.pub-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  /* border-bottom: 1px solid #e0e0e0; */
}
.pub-main {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.pub-index {
  color: #555;
  font-size: 0.6rem;
  margin-right: 8px;
}
.pub-title {
  cursor: pointer;
  color: #333;
  font-size: 0.6rem;
  /* font-weight: bold; */
  margin-right: 8px;
  /* text-decoration: underline; */
}
.pub-title:hover {
  color: #888;
}
.pub-detail {
  color: #555;
  font-size: 0.5rem;
}
.pub-icons {
  display: flex;
  align-items: center;
}
.pub-icon {
  margin-left: 8px;
  color: #757575;
  cursor: pointer;
}
.pub-icon:hover {
  color: #424242;
}
.product-title {
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
}
.product-title:hover {
  color: #aaa;
}
.work-url {
  color: #555;
  font-size: 0.6rem;
}
.work-url:hover {
  color: #aaa;
}
.pub-award {
  color: #222;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: 2px;
}
</style>
