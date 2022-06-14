import localeEn from './locales/en.json';
import localeRu from './locales/ru.json';
import localeAr from './locales/ar.json';
import localeFr from './locales/fr.json';
import localeBn from './locales/bn.json';
import localeZh from './locales/zh.json';
import localeHi from './locales/hi.json';
import localeId from './locales/id.json';
import localePt from './locales/pt.json';
import localeEs from './locales/es.json';

import ENV from './utils/addresses/index';

export default {
  ssr: false,
  target: 'static',
  head: {
    title: 'WorkQuest',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Decentralized marketplace for work. Where employers can look for performers for different tasks, and workers perform. Work in any field with different deadlines, interactions occur through smart contracts.',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/img/app/favicon.svg' },
    ],
  },
  css: [
    '@/assets/scss/main.scss',
  ],
  plugins: [
    { src: '@plugins/ws', mode: 'client' },
    { src: '@plugins/axios.js' },
    { src: '@plugins/axiosOracle.js' },
    { src: '@plugins/main.js' },
    { src: '@plugins/vee-validate.js' },
    { src: '@plugins/clipboard.js' },
    { src: '@plugins/injectComponents.js' },
    { src: '@plugins/vue-qrcode.js' },
    { src: '@plugins/vue-google-map.js' },
  ],
  components: true,
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
    '@nuxtjs/color-mode',
    '@nuxtjs/moment',
  ],
  styleResources: {
    scss: ['./assets/scss/resources.scss'],
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    '@nuxtjs/i18n',
    'bootstrap-vue/nuxt',
    'cookie-universal-nuxt',
    '@nuxtjs/google-gtag',
  ],
  'google-gtag': {
    id: 'G-1NQ8BHKM4F',
  },
  build: {
    productionSourceMap: false,
    productionGzip: true,
    productionGzipExtensions: ['js', 'css', 'svg'],
    extend(config) {
      config.node = { fs: 'empty' };
    },
    transpile: [
      'vee-validate/dist/rules',
      /^vue2-google-maps($|\/)/,
    ],
    babel: {
      compact: false,
    },
  },
  axios: {
    baseURL: ENV.BASE_URL,
  },
  moment: {
    defaultLocale: 'en',
    locales: ['ru', 'bn', 'ar', 'fr', 'hi', 'id', 'pt', 'es', 'zh-cn'],
  },
  // bootstrapVue: {
  //   // bootstrapCSS: false, // Or `css: false`
  //   // bootstrapVueCSS: false, // Or `bvCSS: false`
  //   icons: true,
  // },
  i18n: {
    // locales: ['en', 'ru', 'bn', 'ar', 'fr', 'hi', 'id', 'pt', 'es', 'zh_cn'],
    locales: ['en'],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    vueI18n: {
      messages: {
        en: localeEn,
        ru: localeRu,
        ar: localeAr,
        fr: localeFr,
        bn: localeBn,
        zh_cn: localeZh,
        hi: localeHi,
        id: localeId,
        pt: localePt,
        es: localeEs,
      },
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
    },
  },
  env: {
    BRANCH: process.env.BRANCH,
    GMAPKEY: process.env.GMAPKEY,
    SECRET_SUMSUB: process.env.SECRET_SUMSUB,

    ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL,
  },
};
