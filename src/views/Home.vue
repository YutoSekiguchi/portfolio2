<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useLocale } from '@/i18n'
import {
  localizeAward,
  localizeExperiences,
  localizeProducts,
  localizeTag,
} from '@/i18n/content'
import Works from '@/settings/works.json'
import Products from '@/settings/products.json'
import Experiences from '@/settings/experience.json'
import type { WorksType } from '@/settings/worksType'
import type { ProductsType } from '@/settings/productsType'
import type { ExperienceType } from '@/settings/experienceType'
import PaperIcon from '@/components/icon/Paper.vue'
import SlideIcon from '@/components/icon/Slide.vue'
import CodeIcon from '@/components/icon/Code.vue'
import LinkIcon from '@/components/icon/Link.vue'

const { locale, copy } = useLocale()

const worksList = ref<WorksType[]>(Works as WorksType[])
const productsList = computed(() =>
  localizeProducts(Products as ProductsType[], locale.value),
)
const experienceList = computed(() =>
  localizeExperiences(Experiences as ExperienceType[], locale.value),
)

type DialogSelection =
  | { kind: 'work'; image?: string; date?: string }
  | { kind: 'product'; image: string }

const dialogSelection = ref<DialogSelection | null>(null)
const dialog = ref(false)
const dialogTrigger = ref<HTMLElement | null>(null)

const dialogContent = computed<WorksType | ProductsType | undefined>(() => {
  const selection = dialogSelection.value
  if (!selection) return undefined

  if (selection.kind === 'work') {
    return worksList.value.find(
      (work) => work.image === selection.image && work.date === selection.date,
    )
  }

  return productsList.value.find((product) => product.image === selection.image)
})

const createPath = (name: string) => new URL(`../assets/${name}`, import.meta.url).href

const dialogAsset = computed(() => {
  const selection = dialogSelection.value
  const content = dialogContent.value
  if (!selection || !content?.image) return undefined
  const directory = selection.kind === 'work' ? 'works' : 'products'
  return createPath(`${directory}/${content.image}.png`)
})

const rememberDialogTrigger = () => {
  dialogTrigger.value = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null
}

const openWorkDialog = (work: WorksType) => {
  rememberDialogTrigger()
  dialogSelection.value = { kind: 'work', image: work.image, date: work.date }
  dialog.value = true
}

const openProductDialog = (product: ProductsType) => {
  rememberDialogTrigger()
  dialogSelection.value = { kind: 'product', image: product.image }
  dialog.value = true
}

watch(dialog, (isOpen) => {
  if (!isOpen) {
    nextTick(() => dialogTrigger.value?.focus())
  }
})

const mainCategories = [
  'Journal',
  'International Conference',
  'Domestic Conference',
] as const

const groupedWorksOrdered = computed(() => {
  const groups: Record<string, Record<string, WorksType[]>> = {
    Journal: { Regular: [] },
    'International Conference': { Regular: [], 'Demonstration/Poster': [] },
    'Domestic Conference': {
      'Peer-Reviewed Regular': [],
      'Peer-Reviewed Demonstration/Poster': [],
      'Non-Peer-Reviewed Regular': [],
      'Non-Peer-Reviewed Demonstration/Poster': [],
    },
  }

  worksList.value.forEach((work) => {
    const publicationType = work.publication_type || ''
    let mainGroup = 'Domestic Conference'

    if (publicationType.includes('Journal')) {
      mainGroup = 'Journal'
    } else if (publicationType.includes('International')) {
      mainGroup = 'International Conference'
    }

    if (mainGroup === 'International Conference') {
      const subGroup = publicationType.includes('Demonstration/Poster')
        ? 'Demonstration/Poster'
        : 'Regular'
      groups[mainGroup][subGroup].push(work)
      return
    }

    if (mainGroup === 'Domestic Conference') {
      const review = work.review ? 'Peer-Reviewed' : 'Non-Peer-Reviewed'
      const format = publicationType.includes('Demonstration/Poster')
        ? 'Demonstration/Poster'
        : 'Regular'
      groups[mainGroup][`${review} ${format}`].push(work)
      return
    }

    groups[mainGroup].Regular.push(work)
  })

  return groups
})

const filteredGroupedWorks = computed(() => Object.fromEntries(
  Object.entries(groupedWorksOrdered.value).filter(([, subGroups]) =>
    Object.values(subGroups).some((works) => works.length > 0),
  ),
))

const filteredSubGroups = (category: string) => Object.fromEntries(
  Object.entries(groupedWorksOrdered.value[category]).filter(([, works]) => works.length > 0),
)

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    Journal: copy.value.publicationCategories.journal,
    'International Conference': copy.value.publicationCategories.internationalConference,
    'Domestic Conference': copy.value.publicationCategories.domesticConference,
  }
  return labels[category] || category
}

const getSubGroupLabel = (subGroup: string) => {
  if (subGroup === 'Demonstration/Poster') {
    return copy.value.publicationCategories.demonstrationPoster
  }

  const reviewLabel = subGroup.startsWith('Non-Peer-Reviewed')
    ? copy.value.publicationCategories.nonPeerReviewed
    : copy.value.publicationCategories.peerReviewed
  const formatLabel = subGroup.includes('Demonstration/Poster')
    ? copy.value.publicationCategories.demonstrationPoster
    : ''
  return [reviewLabel, formatLabel].filter(Boolean).join(' · ')
}

const formatPeriod = (start?: string, end?: string) => {
  const normalize = (value?: string) => value?.replaceAll('/', '-').replaceAll('.', '-')
  const toYearMonth = (value?: string) => {
    if (!value) return undefined
    const parts = value.split('-')
    return parts.length >= 2 ? `${parts[0]}.${parts[1]}` : parts[0]
  }
  const startValue = toYearMonth(normalize(start))
  const endValue = end?.toLowerCase() === 'present'
    ? copy.value.common.present
    : toYearMonth(normalize(end))
  return [startValue, endValue].filter(Boolean).join(' – ')
}

const formatProductYear = (year: string) => (
  locale.value === 'ja' ? `${year}${copy.value.common.yearSuffix}` : year
)

const contentLanguage = (value?: string) => (
  /[\u3040-\u30ff\u3400-\u9fff]/.test(value || '') ? 'ja' : 'en'
)
</script>

<template>
  <v-dialog
    v-if="dialog"
    v-model="dialog"
    width="500"
    @after-leave="dialogSelection = null"
  >
    <v-card class="detail-dialog">
      <v-card-title class="headline">{{ copy.common.abstract }}</v-card-title>
      <v-img
        v-if="dialogAsset"
        class="dialog-image mx-auto"
        :class="{ 'dialog-image--product': dialogSelection?.kind === 'product' }"
        width="600"
        aspect-ratio="1.7"
        :src="dialogAsset"
        :alt="dialogContent?.title || ''"
      />
      <p class="map-text px-4">{{ dialogContent?.description }}</p>
      <v-card-actions>
        <v-spacer />
        <v-btn color="black" variant="text" @click="dialog = false">
          {{ copy.common.close }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div class="top mb-6">
    <div class="profile-image-card">
      <div class="profile-image-frame">
        <v-img
          class="me-img"
          cover
          position="center"
          src="@/assets/me.jpg"
          :alt="copy.about.nameValue"
        />
      </div>
      <div class="profile-image-badge">
        <span>Meiji University</span>
        <strong>HCI Researcher</strong>
        <small>Ph.D. Student · 2nd Year</small>
      </div>
    </div>
    <v-col class="profile-copy" md="4" cols="12" sm="8">
      <h1 class="el-title">{{ copy.sections.profile }}</h1>
      <p class="map-text">
        {{ copy.profile.affiliation }}<br />
        <a
          class="link"
          href="https://nkmr-lab.org/"
          rel="noopener noreferrer"
          target="_blank"
        >{{ copy.profile.laboratory }}</a><br /><br />
        <strong>{{ copy.profile.keywords }}</strong><br />
        {{ copy.profile.keywordList }}<br /><br />
        <strong>{{ copy.profile.memberships }}</strong><br />
        <template v-for="membership in copy.profile.membershipList" :key="membership">
          • {{ membership }}<br />
        </template>
      </p>
    </v-col>
  </div>

  <v-col class="mx-auto" xl="6" md="8" cols="12">
    <h5 class="el-title">{{ copy.sections.certificationsAndAwards }}</h5>
    <ul class="simple-list awards-list">
      <li v-for="award in copy.awards" :key="award">
        <p class="map-text award-text">{{ award }}</p>
      </li>
    </ul>
  </v-col>

  <v-col class="mx-auto" xl="6" md="8" cols="12">
    <h5 class="el-title">{{ copy.sections.publications }}</h5>
    <div v-for="category in mainCategories" :key="category" class="mb-8">
      <template v-if="category in filteredGroupedWorks">
        <h4 class="publication-category">{{ getCategoryLabel(category) }}</h4>
        <div
          v-for="(subGroup, subGroupName) in filteredSubGroups(category)"
          :key="subGroupName"
        >
          <h5 v-if="subGroupName !== 'Regular'" class="publication-subgroup">
            {{ getSubGroupLabel(subGroupName.toString()) }}
          </h5>
          <div
            v-for="(work, index) in subGroup"
            :key="`${category}-${subGroupName}-${work.image}-${work.date}`"
            class="pub-item"
          >
            <div class="pub-main">
              <button
                type="button"
                class="pub-title pub-title-button"
                :lang="contentLanguage(work.citation)"
                :aria-label="`${copy.common.details}: ${work.title}`"
                aria-haspopup="dialog"
                @click="openWorkDialog(work)"
              >
                {{ index + 1 }}.&nbsp;{{ work.citation }}
                <span v-if="work.award" class="pub-award">
                  【{{ localizeAward(work.award, locale) }}】
                </span>
              </button>
            </div>
            <div class="pub-icons">
              <a
                v-if="work.paper"
                :href="work.paper"
                :aria-label="`${copy.common.openPaper}: ${work.title}`"
                target="_blank"
                rel="noopener noreferrer"
              >
                <PaperIcon class="pub-icon" aria-hidden="true" />
              </a>
              <a
                v-if="work.slide"
                :href="work.slide"
                :aria-label="`${copy.common.openSlides}: ${work.title}`"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SlideIcon class="pub-icon" aria-hidden="true" />
              </a>
              <a
                v-if="work.code"
                :href="work.code"
                :aria-label="`${copy.common.openCode}: ${work.title}`"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CodeIcon class="pub-icon" aria-hidden="true" />
              </a>
              <a
                v-if="work.system"
                :href="work.system"
                :aria-label="`${copy.common.openSystem}: ${work.title}`"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon class="pub-icon" aria-hidden="true" />
              </a>
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
        v-for="product in productsList"
        :key="product.image"
        class="product-card"
      >
        <v-img
          class="product-image mx-auto"
          width="250"
          aspect-ratio="1.7"
          :src="createPath(`products/${product.image}.png`)"
          :alt="product.title"
        />
        <button
          type="button"
          class="product-title product-title-button"
          :aria-label="`${copy.common.details}: ${product.title}`"
          aria-haspopup="dialog"
          @click="openProductDialog(product)"
        >
          {{ product.title }}
        </button>
        <p class="work-authors map-text">
          {{ product.tagList.map((tag) => localizeTag(tag, locale)).join(', ') }}
        </p>
        <p class="work-conference map-text">{{ formatProductYear(product.grade) }}</p>
        <div class="flex product-links">
          <div v-if="product.code" class="flex mr-2">
            <CodeIcon aria-hidden="true" />
            <a
              :href="product.code"
              target="_blank"
              rel="noopener noreferrer"
              class="work-url"
            >{{ copy.common.code }}</a>
          </div>
          <div v-if="product.urlList?.length" class="flex mr-2">
            <LinkIcon aria-hidden="true" />
            <a
              :href="product.urlList[0]"
              target="_blank"
              rel="noopener noreferrer"
              class="work-url"
            >{{ copy.common.link }}</a>
          </div>
        </div>
      </div>
    </div>
  </v-col>

  <v-col class="mx-auto" xl="6" md="8" cols="12">
    <h5 class="el-title">{{ copy.sections.experience }}</h5>
    <div
      v-for="experience in experienceList"
      :key="`${experience.title}-${experience.startDate}`"
      class="exp-item"
    >
      <div class="exp-main">
        <span class="exp-title">
          <a
            v-if="experience.url"
            :href="experience.url"
            target="_blank"
            rel="noopener noreferrer"
            class="link"
          >{{ experience.title }}</a>
          <template v-else>{{ experience.title }}</template>
        </span>
        <span v-if="experience.organization" class="exp-org">
          — {{ experience.organization }}
        </span>
      </div>
      <div class="exp-meta map-text">
        <span v-if="experience.startDate || experience.endDate">
          {{ formatPeriod(experience.startDate, experience.endDate) }}
        </span>
        <span v-if="experience.location"> · {{ experience.location }}</span>
      </div>
      <p v-if="experience.description" class="map-text exp-desc">
        {{ experience.description }}
      </p>
      <div v-if="experience.tags?.length" class="exp-tags">
        <span v-for="tag in experience.tags" :key="tag" class="exp-tag">{{ tag }}</span>
      </div>
    </div>
  </v-col>

  <v-col class="mx-auto" xl="6" md="8" cols="12">
    <h5 class="el-title">{{ copy.sections.academicBackground }}</h5>
    <ul class="simple-list">
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
.top {
  align-items: center;
  display: grid;
  gap: 34px;
  grid-template-columns: minmax(230px, 290px) minmax(0, 380px);
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  max-width: 760px;
  padding-top: 24px;
}

.profile-image-card {
  isolation: isolate;
  min-width: 0;
  padding: 0 0 28px 12px;
  position: relative;
  width: 100%;
}

.profile-image-frame {
  aspect-ratio: 4 / 5;
  background: linear-gradient(145deg, #10213d, #3157e5 68%, #00a9a5);
  border-radius: 30px;
  box-shadow: 0 22px 54px rgba(16, 33, 61, 0.2);
  padding: 6px;
  position: relative;
  transform: rotate(1.35deg);
  width: 100%;
}

.profile-image-frame::before {
  border: 1px solid rgba(49, 87, 229, 0.32);
  border-radius: inherit;
  content: '';
  inset: 16px -13px -13px 16px;
  pointer-events: none;
  position: absolute;
  z-index: -1;
}

.me-img {
  border-radius: 25px;
  height: 100%;
  overflow: hidden;
  transform: rotate(-1.35deg) scale(1.02);
  width: 100%;
}

.profile-image-badge {
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  bottom: 0;
  box-shadow: 0 12px 30px rgba(16, 33, 61, 0.16);
  display: grid;
  left: 0;
  max-width: calc(100% - 28px);
  padding: 11px 14px;
  position: absolute;
  z-index: 2;
}

.profile-image-badge span,
.profile-image-badge small {
  color: #697487;
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.35;
}

.profile-image-badge strong {
  color: #10213d;
  font-size: 0.86rem;
  line-height: 1.45;
}

.profile-copy {
  margin-left: 0;
  max-width: none;
  width: 100%;
}

.el-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.map-text {
  font-size: 0.8rem;
  line-height: 1.3em;
  white-space: pre-wrap;
  word-break: break-word;
}

.link {
  border-bottom: 1px solid #00bfff;
  color: #00bfff;
  text-decoration: none;
}

.link:hover {
  border-bottom-color: #0088aa;
  color: #0088aa;
}

.simple-list {
  padding-left: 1rem;
}

.awards-list {
  line-height: 1.3rem;
}

.award-text {
  font-size: 0.6rem;
}

.publication-category {
  border-left: 5px solid #999;
  padding-left: 8px;
}

.publication-subgroup {
  margin-top: 12px;
}

.pub-item {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.pub-main {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  min-width: 0;
}

.pub-title {
  color: #333;
  cursor: pointer;
  font-size: 0.6rem;
  line-height: 1.45;
  margin-right: 8px;
}

.pub-title:hover {
  color: #888;
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
.product-title-button:focus-visible,
.pub-icons a:focus-visible,
.work-url:focus-visible,
.link:focus-visible {
  outline: 2px solid #31577f;
  outline-offset: 2px;
}

.pub-icons {
  align-items: center;
  display: flex;
  flex: 0 0 auto;
}

.pub-icons a {
  color: inherit;
  display: inline-flex;
}

.pub-icon {
  color: #757575;
  cursor: pointer;
  margin-left: 8px;
}

.pub-icon:hover {
  color: #424242;
}

.pub-award {
  color: #222;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: 2px;
}

.product-slider {
  display: flex;
  gap: 24px;
  overflow-x: auto;
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
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex: 0 0 45%;
  padding: 12px;
  scroll-snap-align: start;
}

.product-image {
  max-width: 100%;
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

.product-links {
  align-items: center;
  flex-wrap: wrap;
}

.work-url {
  color: #555;
  font-size: 0.6rem;
}

.work-url:hover {
  color: #aaa;
}

.exp-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 8px 0;
}

.exp-main {
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.exp-title {
  color: #444;
  font-size: 0.8rem;
  font-weight: normal;
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
  color: #555;
  font-size: 0.75rem;
  margin-top: 4px;
}

.exp-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.exp-tag {
  background: #f7f7f7;
  border-radius: 999px;
  color: #666;
  font-size: 0.55rem;
  padding: 2px 6px;
}

.detail-dialog {
  border-radius: 8px;
}

.dialog-image--product :deep(.v-img__img) {
  object-fit: contain;
}

@media (max-width: 899px) {
  .top {
    display: block;
    margin-left: 0;
    margin-right: 0;
    padding: 20px 12px 0;
  }

  .profile-image-card {
    margin: 0 auto 18px;
    max-width: 300px;
    width: min(80vw, 300px);
  }

  .profile-copy {
    flex-basis: auto;
    margin-left: 0;
    max-width: none;
    padding-left: 4px;
    padding-right: 4px;
    width: 100%;
  }
}

@media (max-width: 599px) {
  .map-text {
    line-height: 1.35em;
  }

  .pub-item {
    align-items: flex-start;
  }

  .product-card {
    flex-basis: 82%;
  }
}

</style>
