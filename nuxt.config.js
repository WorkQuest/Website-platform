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
  ],
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
    baseURL: process.env.BASE_URL,
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
    PROD: process.env.PROD,
    BASE_URL: process.env.BASE_URL,
    GMAPKEY: process.env.GMAPKEY,
    SECRET_SUMSUB: process.env.SECRET_SUMSUB,

    WQ_PROVIDER: process.env.WQ_PROVIDER,
    WQ_EXPLORER: process.env.WQ_EXPLORER,
    WQ_ORACLE_URL: process.env.WQ_ORACLE_URL,

    NOTIFS_URL: process.env.NOTIFS_URL,
    WS_NOTIFS_URL: process.env.WS_NOTIFS_URL,
    WS_CHAT_ACTIONS_URL: process.env.WS_CHAT_ACTIONS_URL,
    WS_WQ_PROVIDER: process.env.WS_WQ_PROVIDER,

    ETHEREUM_BRIDGE: process.env.ETHEREUM_BRIDGE,
    ETHEREUM_LP_TOKEN: process.env.ETHEREUM_LP_TOKEN,
    ETHEREUM_MINING: process.env.ETHEREUM_MINING,
    ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL,
    ETHEREUM_WQT_TOKEN: process.env.ETHEREUM_WQT_TOKEN,

    BSC_BRIDGE: process.env.BSC_BRIDGE,
    BSC_LP_TOKEN: process.env.BSC_LP_TOKEN,
    BSC_MINING: process.env.BSC_MINING,
    BSC_OLD_WQT_TOKEN: process.env.BSC_OLD_WQT_TOKEN,
    BSC_WQT_EXCHANGE: process.env.BSC_WQT_EXCHANGE,
    BSC_WQT_TOKEN: process.env.BSC_WQT_TOKEN,
    BSC_RPC_URL: process.env.BSC_RPC_URL,

    WORKNET_BORROWING: process.env.WORKNET_BORROWING,
    WORKNET_BRIDGE: process.env.WORKNET_BRIDGE,
    WORKNET_LENDING: process.env.WORKNET_LENDING,
    WORKNET_ORACLE: process.env.WORKNET_ORACLE,
    WORKNET_PENSION_FUND: process.env.WORKNET_PENSION_FUND,
    WORKNET_PROMOTION: process.env.WORKNET_PROMOTION,
    WORKNET_REFERRAL: process.env.REFERRAL_ADDRESS,
    WORKNET_ROUTER: process.env.WORKNET_ROUTER,
    WORKNET_SAVING_PRODUCT: process.env.WORKNET_SAVING_PRODUCT,
    WORKNET_STAKING_WQT: process.env.WORKNET_STAKING_WQT,
    WORKNET_STAKING_WUSD: process.env.WORKNET_STAKING_WUSD,
    WORKNET_USDT_TOKEN: process.env.WORKNET_USDT_TOKEN,
    WORKNET_WBNB_TOKEN: process.env.WORKNET_WBNB_TOKEN,
    WORKNET_WETH_TOKEN: process.env.WORKNET_WETH_TOKEN,
    WORKNET_WUSD_TOKEN: process.env.WORKNET_WUSD_TOKEN,
    WORKNET_WQ_FACTORY: process.env.WORKNET_WQ_FACTORY,
    WORKNET_VOTING: process.env.WORKNET_VOTING,
  },
};
