import type { Locale } from '@/i18n'
import type { ExperienceType } from '@/settings/experienceType'
import type { ProductsType } from '@/settings/productsType'
import experienceSource from '@/settings/experience.json'
import experienceEnglish from './experience.en.json'
import productsEnglish from './products.en.json'
import tagsEnglish from './tags.en.json'

type ProductTranslation = Pick<ProductsType, 'title' | 'description'>
type ExperienceTranslation = Pick<ExperienceType, 'title' | 'organization' | 'description' | 'tags'>

const experienceEnglishByTitle = Object.fromEntries(
  (experienceSource as ExperienceType[]).map((experience, index) => [
    experience.title,
    (experienceEnglish as ExperienceTranslation[])[index],
  ]),
) as Record<string, ExperienceTranslation>

export const localizeTag = (tag: string, locale: Locale) => {
  if (locale === 'ja') return tag
  return (tagsEnglish as Record<string, string>)[tag] || tag
}

const awardEnglish: Record<string, string> = {
  'プレミアム採択': 'Premium Presentation',
  '学生奨励賞': 'Student Encouragement Award',
}

export const localizeAward = (award: string | undefined, locale: Locale) => {
  if (!award || locale === 'ja') return award || ''
  return awardEnglish[award] || award
}

export const localizeProduct = (product: ProductsType, locale: Locale): ProductsType => {
  if (locale === 'ja') return product
  return {
    ...product,
    ...(productsEnglish as Record<string, ProductTranslation>)[product.image],
  }
}

export const localizeProducts = (products: ProductsType[], locale: Locale) =>
  products.map((product) => localizeProduct(product, locale))

export const localizeExperience = (
  experience: ExperienceType,
  locale: Locale,
): ExperienceType => {
  if (locale === 'ja') return experience
  return {
    ...experience,
    ...experienceEnglishByTitle[experience.title],
  }
}

export const localizeExperiences = (experiences: ExperienceType[], locale: Locale) =>
  experiences.map((experience) => localizeExperience(experience, locale))
