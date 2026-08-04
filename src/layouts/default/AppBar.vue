<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  import { useLocale } from '@/i18n'

  type SocialName = 'twitter' | 'instagram' | 'github'
  type SocialLink = {
    name: string
    label: SocialName
    link: string
  }

  const router = useRouter()
  const { locale, copy, setLocale } = useLocale()

  const socialLinks: SocialLink[] = [
    {
      name: 'mdi-twitter',
      label: 'twitter',
      link: 'https://twitter.com/yuto_2611',
    },
    {
      name: 'mdi-instagram',
      label: 'instagram',
      link: 'https://www.instagram.com/mendyy1126/',
    },
    {
      name: 'mdi-github',
      label: 'github',
      link: 'https://github.com/YutoSekiguchi',
    },
  ]

  const title = 'Yuto Sekiguchi'
</script>

<template>
  <v-app-bar flat class="app-bar">
    <v-col class="app-bar-elements mx-auto">
      <v-row class="items-center bar" justify="space-between" no-gutters>
        <button class="brand" type="button" @click="router.push('/')">
          <h1 class="title">{{ title }}</h1>
        </button>

        <div class="header-actions">
          <div class="social-links">
            <v-btn
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.link"
              :aria-label="copy.social[social.label]"
              class="social-button"
              icon
              rel="noopener noreferrer"
              size="small"
              target="_blank"
              variant="text"
            >
              <v-icon :icon="social.name" class="icon" />
            </v-btn>
          </div>

          <div class="mobile-social-menu">
            <v-menu>
              <template #activator="{ props: menuProps }">
                <v-btn
                  v-bind="menuProps"
                  :aria-label="copy.social.menu"
                  class="mobile-social-button"
                  icon="mdi-share-variant"
                  variant="text"
                />
              </template>
              <v-list density="compact">
                <v-list-item
                  v-for="social in socialLinks"
                  :key="social.label"
                  :href="social.link"
                  :prepend-icon="social.name"
                  :title="copy.social[social.label]"
                  rel="noopener noreferrer"
                  target="_blank"
                />
              </v-list>
            </v-menu>
          </div>

          <div class="language-switch" role="group" :aria-label="copy.language.label">
            <button
              type="button"
              class="language-option"
              :class="{ active: locale === 'ja' }"
              :aria-pressed="locale === 'ja'"
              @click="setLocale('ja')"
            >
              <span class="language-long">{{ copy.language.japanese }}</span>
              <span class="language-short" aria-hidden="true">JA</span>
            </button>
            <button
              type="button"
              class="language-option"
              :class="{ active: locale === 'en' }"
              :aria-pressed="locale === 'en'"
              @click="setLocale('en')"
            >
              <span class="language-long">{{ copy.language.english }}</span>
              <span class="language-short" aria-hidden="true">EN</span>
            </button>
          </div>
        </div>
      </v-row>
    </v-col>
  </v-app-bar>
</template>

<style scoped>
.items-center {
  align-items: center;
}

.brand {
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  padding: 2px 4px;
}

.brand:focus-visible,
.language-option:focus-visible {
  outline: 2px solid #555;
  outline-offset: 2px;
}

.header-actions,
.social-links {
  align-items: center;
  display: flex;
}

.header-actions {
  gap: 12px;
}

.social-links {
  gap: 2px;
}

.mobile-social-menu {
  display: none;
}

.social-button .icon {
  margin: 0;
}

.language-switch {
  align-items: center;
  background: #f2f2f2;
  border: 1px solid #dedede;
  border-radius: 999px;
  display: flex;
  padding: 2px;
}

.language-option {
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: #777;
  cursor: pointer;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1;
  min-height: 28px;
  padding: 0 10px;
  transition: background-color 160ms ease, color 160ms ease, box-shadow 160ms ease;
}

.language-option.active {
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  color: #333;
}

.language-short {
  display: none;
}

@media (max-width: 599px) {
  .title {
    font-size: 18px;
    white-space: nowrap;
  }

  .bar {
    padding: 5px 8px 0 12px;
  }

  .app-bar {
    height: 60px;
  }

  .header-actions {
    gap: 4px;
  }

  .social-links {
    display: none;
  }

  .mobile-social-menu {
    display: block;
  }

  .mobile-social-button {
    height: 40px;
    min-width: 40px;
    width: 40px;
  }

  .language-long {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  .language-short {
    display: inline;
  }

  .language-option {
    font-size: 0.68rem;
    min-height: 38px;
    padding: 0 10px;
  }
}

@media (min-width: 600px) {
  .title {
    font-size: 24px;
  }

  .bar {
    padding: 10px 40px 0;
  }

  .app-bar {
    height: 60px;
  }
}
</style>
