<script lang="ts" setup>
import { ref, computed } from "vue";
import Works from "../settings/works.json";
import Products from "../settings/products.json";
import { WorksType } from "@/settings/worksType";
import { ProductsType } from "@/settings/productsType";
import Experiences from "@/settings/experience.json";
import { ExperienceType } from "@/settings/experienceType";
import PaperIcon from "@/components/icon/Paper.vue";
import SlideIcon from "@/components/icon/Slide.vue";
import CodeIcon from "@/components/icon/Code.vue";
import LinkIcon from "@/components/icon/Link.vue";
import { useLocale } from '@/i18n';
import {
  localizeAward,
  localizeExperiences,
  localizeProducts,
} from '@/i18n/content';

const { locale, copy } = useLocale();

const worksList = ref<WorksType[]>(Works as WorksType[]);
const productsList = computed(() =>
  localizeProducts(Products as ProductsType[], locale.value)
);
const experienceList = computed(() =>
  localizeExperiences(Experiences as ExperienceType[], locale.value)
);

type DialogSelection =
  | { kind: 'work'; image?: string; date?: string }
  | { kind: 'product'; image: string };

const dialogSelection = ref<DialogSelection | null>(null);
const dialog = ref<boolean>(false);

const dialogContent = computed(() => {
  const selection = dialogSelection.value;
  if (!selection) return undefined;
  if (selection.kind === 'work') {
    return worksList.value.find(
      (work) => work.image === selection.image && work.date === selection.date
    );
  }
  return productsList.value.find(
    (product) => product.image === selection.image
  );
});

const openWorkDialog = (work: WorksType) => {
  dialogSelection.value = { kind: 'work', image: work.image, date: work.date };
  dialog.value = true;
};

const openProductDialog = (product: ProductsType) => {
  dialogSelection.value = { kind: 'product', image: product.image };
  dialog.value = true;
};

const dialogImage = computed(() =>
  dialogSelection.value?.kind === 'work' ? dialogSelection.value.image : undefined
);

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
    Object.entries(groupedWorksOrdered.value).filter(([, subGroups]) =>
      Object.values(subGroups).some((arr) => arr.length > 0)
    )
  );
});

const filteredSubGroups = computed(() => (category: string) => {
  return Object.fromEntries(
    Object.entries(groupedWorksOrdered.value[category]).filter(
      ([, arr]) => arr.length > 0
    )
  );
});

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    Journal: copy.value.publicationCategories.journal,
    'International Conference': copy.value.publicationCategories.internationalConference,
    'Domestic Conference': copy.value.publicationCategories.domesticConference,
  };
  return labels[category] || category;
};

const getSubGroupLabel = (subGroup: string) => {
  if (subGroup === 'Demonstration/Poster') {
    return copy.value.publicationCategories.demonstrationPoster;
  }

  const reviewLabel = subGroup.startsWith('Non-Peer-Reviewed')
    ? copy.value.publicationCategories.nonPeerReviewed
    : copy.value.publicationCategories.peerReviewed;
  const typeLabel = subGroup.includes('Demonstration/Poster')
    ? copy.value.publicationCategories.demonstrationPoster
    : '';
  return [reviewLabel, typeLabel].filter(Boolean).join(' · ');
};

const formatPeriod = (start?: string, end?: string) => {
  const normalize = (s?: string) =>
    s ? s.replaceAll("/", "-").replaceAll(".", "-") : undefined;
  const toYm = (s?: string) => {
    if (!s) return undefined;
    const parts = s.split("-");
    if (parts.length === 1) return parts[0];
    if (parts.length >= 2) return `${parts[0]}.${parts[1]}`;
    return s;
  };
  const s = toYm(normalize(start));
  const isPresent = end && end.toLowerCase() === "present";
  const e = isPresent ? copy.value.common.present : toYm(normalize(end));
  return [s, e].filter(Boolean).join(" – ");
};

const formatProductYear = (year: string) =>
  locale.value === 'ja' ? `${year}${copy.value.common.yearSuffix}` : year;
</script>

<template>
  <v-dialog v-if="dialog" v-model="dialog" width="500">
    <v-card>
      <v-card-title class="headline">{{ copy.common.abstract }}</v-card-title>
      <v-img
          class="mx-auto"
          v-if="dialogImage"
          width="600"
          aspect-ratio="1.7"
          :src="createPath(`works/${dialogImage}.png`)"
          :alt="dialogContent?.title || ''"
        />
      <p class="map-text px-4">{{ dialogContent?.description }}</p>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="black darken-1" text @click="dialog = false">
          {{ copy.common.close }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div class="top mb-6">
    <v-img
      aspect-ratio="1"
      width="300"
      src="@/assets/me.jpg"
      :alt="copy.about.nameValue"
      class="me-img"
    />
    <v-col md="4" cols="12" sm="8">
      <h1 class="el-title">{{ copy.sections.profile }}</h1>
      <p class="map-text">
        {{ copy.profile.affiliation }}<br />
        <a
          class="link"
          href="https://nkmr-lab.org/"
          rel="noopener noreferrer"
          target="_blank"
        >{{ copy.profile.laboratory }}</a><br /><br />
        <span style="font-weight: bold;">{{ copy.profile.keywords }}</span><br />
        {{ copy.profile.keywordList }}<br /><br />
        <span style="font-weight: bold;">{{ copy.profile.memberships }}</span><br />
        <template v-for="membership in copy.profile.membershipList" :key="membership">
          • {{ membership }}<br />
        </template>
      </p>
    </v-col>
  </div>

  <v-col class="mx-auto" xl="6" md="8" cols="12">
    <h5 class="el-title">{{ copy.sections.certificationsAndAwards }}</h5>
    <ul style="padding-left: 1rem; line-height: 1.3rem;">
      <li v-for="award in copy.awards" :key="award">
        <p class="map-text" style="font-size: 0.6rem;">{{ award }}</p>
      </li>
    </ul>
  </v-col>

  <!-- Publication Section -->
  <v-col class="mx-auto" xl="6" md="8" cols="12">
    <h5 class="el-title">{{ copy.sections.publications }}</h5>
    <div v-for="category in mainCategories" :key="category" class="mb-8">
      <template v-if="category in filteredGroupedWorks">
        <h4 style="border-left: 5px solid #999; padding-left: 8px;">
          {{ getCategoryLabel(category) }}
        </h4>
        <div
          v-for="(subGroup, subGroupName) in filteredSubGroups(category)"
          :key="subGroupName"
        >
          <h5 v-if="subGroupName !== 'Regular'">
            {{ getSubGroupLabel(subGroupName.toString()) }}
          </h5>
          <div
            v-for="(work, index) in subGroup"
            :key="`${category}-${subGroupName}-${index}`"
            class="pub-item"
          >
            <div class="pub-main">
              <button
                type="button"
                class="pub-title pub-title-button"
                @click="openWorkDialog(work)"
              >
                {{ index + 1 }}.&nbsp;{{ work.citation }}
                <span class="pub-award" v-if="work.award !== ''">
                  【{{ localizeAward(work.award, locale) }}】
                </span>
              </button>
            </div>
            <div class="pub-icons">
              <span v-if="work.paper">
                <a
                  :href="work.paper"
                  :aria-label="`${copy.common.openPaper}: ${work.title}`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PaperIcon class="pub-icon" aria-hidden="true" />
                </a>
              </span>
              <span v-if="work.slide">
                <a
                  :href="work.slide"
                  :aria-label="`${copy.common.openSlides}: ${work.title}`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SlideIcon class="pub-icon" aria-hidden="true" />
                </a>
              </span>
              <span v-if="work.code">
                <a
                  :href="work.code"
                  :aria-label="`${copy.common.openCode}: ${work.title}`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CodeIcon class="pub-icon" aria-hidden="true" />
                </a>
              </span>
              <span v-if="work.system">
                <a
                  :href="work.system"
                  :aria-label="`${copy.common.openSystem}: ${work.title}`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkIcon class="pub-icon" aria-hidden="true" />
                </a>
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </v-col>

  

  <v-col class="mx-auto" xl="6" md="8" cols="12">
    <h5 class="el-title">{{ copy.sections.products }}</h5>
    <div class="product-slider">
      <div
        class="product-card"
        v-for="(product, index) in productsList"
        :key="index"
      >
        <v-img
          class="mx-auto"
          width="250"
          aspect-ratio="1.7"
          :src="createPath(`products/${product.image}.png`)"
          :alt="product.title"
        />
        <button
          type="button"
          class="product-title product-title-button"
          @click="openProductDialog(product)"
        >
          {{ product.title }}
        </button>
        <p class="work-authors map-text">{{ product.tagList.join(", ") }}</p>
        <p class="work-conference map-text">{{ formatProductYear(product.grade) }}</p>
        <div class="flex">
          <div v-if="product.code" class="flex mr-2">
            <CodeIcon />
            <a :href="product.code" target="_blank" rel="noopener noreferrer" class="work-url">
              {{ copy.common.code }}
            </a>
          </div>
          <div v-if="product.urlList" class="flex mr-2">
            <LinkIcon />
            <a :href="product.urlList[0]" target="_blank" rel="noopener noreferrer" class="work-url">
              {{ copy.common.link }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </v-col>

  <v-col class="mx-auto" xl="6" md="8" cols="12">
    <h5 class="el-title">{{ copy.sections.experience }}</h5>
    <div v-for="(exp, idx) in experienceList" :key="idx" class="exp-item">
      <div class="exp-main">
        <span class="exp-title">
          <template v-if="exp.url">
            <a :href="exp.url" target="_blank" rel="noopener noreferrer" class="link">{{ exp.title }}</a>
          </template>
          <template v-else>{{ exp.title }}</template>
        </span>
        <span v-if="exp.organization" class="exp-org"> — {{ exp.organization }}</span>
      </div>
      <div class="exp-meta map-text">
        <span v-if="exp.startDate || exp.endDate">{{ formatPeriod(exp.startDate, exp.endDate) }}</span>
        <span v-if="exp.location"> · {{ exp.location }}</span>
      </div>
      <p v-if="exp.description" class="map-text exp-desc">{{ exp.description }}</p>
      <div v-if="exp.tags && exp.tags.length" class="exp-tags">
        <span class="exp-tag" v-for="(t, i) in exp.tags" :key="i">{{ t }}</span>
      </div>
    </div>
  </v-col>

  <v-col class="mx-auto" xl="6" md="8" cols="12">
    <h5 class="el-title">{{ copy.sections.academicBackground }}</h5>
    <ul style="padding-left: 1rem;">
      <li v-for="education in copy.education" :key="education">
        <p class="map-text">{{ education }}</p>
      </li>
    </ul>
  </v-col>

  <v-col class="mx-auto mb-4" xl="6" md="8" cols="12">
    <h5 class="el-title">{{ copy.sections.skills }}</h5>
    <p class="map-text">
      React/Next.js, Vue/Nuxt.js, TypeScript, Python, Golang, Flutter, PHP, GAS,
      Node.js, Processing, MATLAB, Spring Boot, Docker
    </p>
  </v-col>

  <v-col class="mx-auto" xl="6" md="8" cols="12">
    <h5 class="el-title">{{ copy.sections.contact }}</h5>
    <p class="map-text">{{ copy.common.email }}: yuutosekiguchi[at]gmail.com</p>
  </v-col>
</template>

<style scoped>
/* Existing styles */
.me-img {
  max-width: 280px;
  border-radius: 5%;
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
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 5px;
}
.map-text {
  font-size: 0.8rem;
  line-height: 1.2em;
  word-break: break-word;
  white-space: pre-wrap;
  @media (min-width: 600px) {
    line-height: 1.3em;
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
.pub-title-button,
.product-title-button {
  appearance: none;
  background: transparent;
  border: 0;
  font-family: inherit;
  padding: 0;
  text-align: left;
}
.pub-title-button:focus-visible,
.product-title-button:focus-visible {
  outline: 2px solid #555;
  outline-offset: 2px;
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
  color: #333;
  cursor: pointer;
  display: block;
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
.product-slider {
  display: flex;
  overflow-x: auto;
  gap: 24px;
  padding: 16px 0;
  scroll-snap-type: x mandatory;
}

.product-slider::-webkit-scrollbar {
  height: 6px;
}

.product-slider::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.product-card {
  flex: 0 0 45%;
  scroll-snap-align: start;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.exp-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.exp-main {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px;
}
.exp-title {
  font-size: 0.8rem;
  font-weight: normal;
  color: #444;
}
.exp-org {
  color: #666;
  font-size: 0.75rem;
  font-weight: normal;
}
.exp-meta {
  color: #777;
  font-size: 0.6rem;
}
.exp-desc {
  margin-top: 4px;
  font-size: 0.75rem;
  color: #555;
}
.exp-tags {
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.exp-tag {
  font-size: 0.55rem;
  color: #666;
  background: #f7f7f7;
  padding: 2px 6px;
  border-radius: 999px;
}
</style>
