import localeEn from './locales/en.json';

require('dotenv').config();

export default {
  ssr: false,
  target: 'static',
  head: {
    title: 'WorkQuest',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Decentralized marketplace for work. Where employers can look for performers for different tasks, and workers perform. Work in any field with different deadlines, interactions occur through smart contracts.' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/img/app/favicon.svg' },
    ],
  },
  css: [
    '@/assets/scss/main.scss',
  ],
  plugins: [
    { src: '@plugins/axios.js' },
    { src: '@plugins/main.js' },
    { src: '@plugins/vee-validate.js' },
    { src: '@plugins/clipboard.js' },
    { src: '@plugins/injectComponents.js' },
    { src: '@plugins/vue-qrcode.js' },
  ],
  components: true,
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
    '@nuxtjs/color-mode',
  ],
  styleResources: {
    scss: ['./assets/scss/resources.scss'],
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    'bootstrap-vue/nuxt',
    'nuxt-i18n',
    'cookie-universal-nuxt',
    ['nuxt-gmaps', {
      key: process.env.GMAPKEY,
    }],
  ],
  router: {
    scrollBehavior() {
      return { x: 0, y: 0 };
    },
  },
  build: {
    analyze: true,
    productionSourceMap: false,
    productionGzip: true,
    productionGzipExtensions: ['js', 'css', 'svg'],
    extend(config) {
      config.node = {
        fs: 'empty',
      };
    },
    transpile: [
      'vee-validate/dist/rules',
    ],
    babel: {
      compact: false,
    },
  },
  axios: {
    baseURL: process.env.BASE_URL,
  },
  // bootstrapVue: {
  //   // bootstrapCSS: false, // Or `css: false`
  //   // bootstrapVueCSS: false, // Or `bvCSS: false`
  //   icons: true,
  // },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    vueI18n: {
      messages: {
        en: localeEn,
      },
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
    },
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    baseUrl: process.env.BASE_URL,
    GMAPKEY: process.env.GMAPKEY,
    PROD: process.env.PROD,
    WQT_TOKEN: process.env.WQT_TOKEN,
    NEW_WQT_TOKEN: process.env.NEW_WQT_TOKEN,
    LP_TOKEN: process.env.LP_TOKEN,
    STAKING_ADDRESS: process.env.STAKING_ADDRESS,
    SECRET_SUMSUB: process.env.SECRET_SUMSUB,
    BRIDGE_ADDRESS_RINKEBY: process.env.BRIDGE_ADDRESS_RINKEBY,
    BRIDGE_ADDRESS_BSCTESTNET: process.env.BRIDGE_ADDRESS_BSCTESTNET,
    TOKEN_WQT_NEW_ADDRESS_BSCTESTNET: process.env.TOKEN_WQT_NEW_ADDRESS_BSCTESTNET,
    TOKEN_WQT_OLD_ADDRESS_BSCTESTNET: process.env.TOKEN_WQT_OLD_ADDRESS_BSCTESTNET,
    TOKEN_ETH_ADDRESS_BSCTESTNET: process.env.TOKEN_ETH_ADDRESS_BSCTESTNET,
    EXCHANGE_ADDRESS_BSCTESTNET: process.env.EXCHANGE_ADDRESS_BSCTESTNET,
    EXCHANGE_ADDRESS_RINKEBY: process.env.EXCHANGE_ADDRESS_RINKEBY,
    STAKING_ADDRESS_BSC: process.env.STAKING_ADDRESS_BSC,
    CAKE_LP_TOKEN: process.env.CAKE_LP_TOKEN,
    CAKE_WQT_TOKEN: process.env.CAKE_WQT_TOKEN,
    MAINNET_BSC_WQT_TOKEN: process.env.MAINNET_BSC_WQT_TOKEN,
    MAINNET_BSC_BRIDGE: process.env.MAINNET_BSC_BRIDGE,
    MAINNET_ETH_WQT_TOKEN: process.env.MAINNET_ETH_WQT_TOKEN,
    MAINNET_ETH_BRIDGE: process.env.MAINNET_ETH_BRIDGE,
    TOKEN_WQT_OLD_ADDRESS_BSCMAINNET: process.env.TOKEN_WQT_OLD_ADDRESS_BSCMAINNET,
    TESTNET_BSC_STAKING: process.env.TESTNET_BSC_STAKING,
    MAINNET_STAKING_WQT_TOKEN: process.env.MAINNET_STAKING_WQT_TOKEN,
    MAINNET_STAKING_LP_TOKEN: process.env.MAINNET_STAKING_LP_TOKEN,
    MAINNET_BSC_STAKING: process.env.MAINNET_BSC_STAKING,
    MAINNET_STAKING_ETH_LP_TOKEN: process.env.MAINNET_STAKING_ETH_LP_TOKEN,
    MAINNET_ETH_STAKING: process.env.MAINNET_ETH_STAKING,
  },
};
