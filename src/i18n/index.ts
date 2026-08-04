import { computed, ref, watch } from 'vue'

export type Locale = 'ja' | 'en'

const STORAGE_KEY = 'portfolio-locale'

const messages = {
  ja: {
    language: {
      label: '表示言語',
      japanese: '日本語',
      english: 'English',
    },
    social: {
      menu: 'SNSリンク',
      twitter: 'X（Twitter）を開く',
      instagram: 'Instagramを開く',
      github: 'GitHubを開く',
    },
    common: {
      abstract: 'Abstract',
      close: '閉じる',
      code: 'コード',
      link: 'リンク',
      email: 'メール',
      details: '詳細へ',
      selectTags: 'タグで絞り込む',
      noResults: '一致するタグがありません',
      viewPaper: '論文を見る',
      openPaper: '論文を開く',
      openSlides: '発表資料を開く',
      openCode: 'ソースコードを開く',
      openSystem: '関連システムを開く',
      present: '現在',
      yearSuffix: '年',
    },
    sections: {
      profile: 'Profile',
      certificationsAndAwards: 'Certifications and Awards',
      publications: 'Publication',
      products: 'Products',
      experience: 'Experience',
      academicBackground: 'Academic background',
      skills: 'Skills',
      contact: 'Contact',
    },
    publicationCategories: {
      journal: 'Journal',
      internationalConference: 'International Conference',
      domesticConference: 'Domestic Conference',
      demonstrationPoster: 'Demonstration/Poster',
      peerReviewed: 'Peer-Reviewed',
      nonPeerReviewed: 'Non-Peer-Reviewed',
    },
    profile: {
      affiliation: '明治大学大学院 先端数理科学研究科\n先端メディアサイエンス専攻 博士後期課程',
      laboratory: '中村聡史研究室',
      keywords: 'Keywords',
      keywordList: 'HCI、LLM、手書き、プログラミング教育',
      memberships: 'Academic Memberships',
      membershipList: ['情報処理学会 会員', 'ACM Student Member'],
    },
    awards: [
      '2021 基本情報技術者試験（FE）合格',
      '2022 第10回学生スマートフォンアプリコンテスト 奨励賞',
      '2023 HCI研究会 学生奨励賞',
      '2025 明治大学校友会卒業生表彰 特別表彰',
      '2025 情報処理推進機構（IPA）未踏IT人材発掘・育成事業 採択',
      '2026 情報処理推進機構（IPA）2025年度未踏IT人材発掘・育成事業 スーパークリエータ認定',
      '2026 明治大学 若手研究 研究費 採択',
    ],
    education: [
      '2019 千葉県立佐倉高等学校 卒業',
      '2023 明治大学 総合数理学部 先端メディアサイエンス学科 卒業',
      '2025 明治大学大学院 先端数理科学研究科 先端メディアサイエンス専攻 修了',
      '現在 明治大学大学院 先端数理科学研究科 先端メディアサイエンス専攻 博士後期課程2年 在学',
    ],
    about: {
      title: 'About',
      name: 'Name',
      nameValue: '関口 祐豊（Yuto Sekiguchi）',
      birthday: 'Birthday',
      highSchool: 'High School',
      highSchoolValue: '千葉県立佐倉高等学校 卒業',
      affiliation: 'Affiliation',
      affiliationValue: '明治大学大学院 先端数理科学研究科 先端メディアサイエンス専攻 博士後期課程',
      skills: 'Skills',
    },
  },
  en: {
    language: {
      label: 'Language',
      japanese: '日本語',
      english: 'English',
    },
    social: {
      menu: 'Social links',
      twitter: 'Open X (Twitter)',
      instagram: 'Open Instagram',
      github: 'Open GitHub',
    },
    common: {
      abstract: 'Abstract',
      close: 'Close',
      code: 'Code',
      link: 'Link',
      email: 'Email',
      details: 'View details',
      selectTags: 'Filter by tag',
      noResults: 'No matching tags',
      viewPaper: 'View paper',
      openPaper: 'Open paper',
      openSlides: 'Open slides',
      openCode: 'Open source code',
      openSystem: 'Open related system',
      present: 'Present',
      yearSuffix: '',
    },
    sections: {
      profile: 'Profile',
      certificationsAndAwards: 'Certifications & Awards',
      publications: 'Publications',
      products: 'Products',
      experience: 'Experience',
      academicBackground: 'Education',
      skills: 'Skills',
      contact: 'Contact',
    },
    publicationCategories: {
      journal: 'Journal Articles',
      internationalConference: 'International Conferences',
      domesticConference: 'Domestic Conferences',
      demonstrationPoster: 'Demonstrations / Posters',
      peerReviewed: 'Peer-reviewed',
      nonPeerReviewed: 'Non-peer-reviewed',
    },
    profile: {
      affiliation: 'Ph.D. Program in Frontier Media Science\nGraduate School of Advanced Mathematical Sciences, Meiji University',
      laboratory: 'Nakamura Laboratory',
      keywords: 'Keywords',
      keywordList: 'HCI, LLMs, handwriting, programming education',
      memberships: 'Academic Memberships',
      membershipList: ['Information Processing Society of Japan', 'ACM Student Member'],
    },
    awards: [
      '2021 Passed the Fundamental Information Technology Engineer Examination (FE)',
      '2022 Encouragement Award, 10th Student Smartphone App Contest',
      '2023 Student Encouragement Award, IPSJ SIG-HCI',
      '2025 Special Alumni Award, Meiji University Alumni Association',
      '2025 Selected for the IPA Exploratory IT Human Resources Project (MITOU Program)',
      '2026 Certified as a Super Creator in the 2025 IPA MITOU Program',
      '2026 Awarded a Meiji University Early-Career Research Grant',
    ],
    education: [
      '2019 Graduated from Chiba Prefectural Sakura High School',
      '2023 B.S., Frontier Media Science, School of Interdisciplinary Mathematical Sciences, Meiji University',
      '2025 M.S., Frontier Media Science, Graduate School of Advanced Mathematical Sciences, Meiji University',
      'Present Second-year Ph.D. student in Frontier Media Science, Graduate School of Advanced Mathematical Sciences, Meiji University',
    ],
    about: {
      title: 'About',
      name: 'Name',
      nameValue: 'Yuto Sekiguchi',
      birthday: 'Birthday',
      highSchool: 'High School',
      highSchoolValue: 'Chiba Prefectural Sakura High School',
      affiliation: 'Affiliation',
      affiliationValue: 'Ph.D. Program in Frontier Media Science, Graduate School of Advanced Mathematical Sciences, Meiji University',
      skills: 'Skills',
    },
  },
} as const

const getInitialLocale = (): Locale => {
  if (typeof window === 'undefined') return 'ja'
  try {
    const savedLocale = window.localStorage.getItem(STORAGE_KEY)
    return savedLocale === 'en' || savedLocale === 'ja' ? savedLocale : 'ja'
  } catch {
    return 'ja'
  }
}

const locale = ref<Locale>(getInitialLocale())
const copy = computed(() => messages[locale.value])

watch(
  locale,
  (nextLocale) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = nextLocale
      document.title = nextLocale === 'ja'
        ? '関口祐豊（Yuto Sekiguchi）'
        : 'Yuto Sekiguchi | Portfolio'
    }
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, nextLocale)
      } catch {
        // The language switch still works when browser storage is unavailable.
      }
    }
  },
  { immediate: true },
)

export const useLocale = () => {
  const setLocale = (nextLocale: Locale) => {
    locale.value = nextLocale
  }

  return {
    locale,
    copy,
    setLocale,
  }
}
