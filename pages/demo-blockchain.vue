<template>
  <div class="blockchain">
    <div class="blockchain__banner banner">
      <div class="banner__background">
        <img
          class="banner__img"
          src="/img/app/banner_chain.svg"
          alt="Logo"
        >
      </div>
      <div class="banner__left">
        <div class="banner__title">
          Blockchain is work
        </div>
        <div class="banner__subtitle">
          Fill the fields and check it yourself
        </div>
      </div>
      <div class="banner__right">
        <div class="banner__card card">
          <ValidationObserver
            class="card__observer"
            tag="div"
          >
            <div class="card__input input">
              <base-field
                class="input__field"
                :placeholder="'Sum'"
                rules="required"
                :name="$t('modals.creditCardNumber')"
              />
            </div>
            <div class="card__input input">
              <base-field
                v-model="address"
                class="input__field"
                :placeholder="'Address'"
                :disabled="true"
                rules="required"
                :name="$t('modals.cardHolderField')"
              />
            </div>
            <base-btn
              mode="'outline'"
              class="card__button"
              @click="connectToMetamask"
            >
              {{ $t('mining.connectWallet') }}
            </base-btn>
          </ValidationObserver>
        </div>
      </div>
    </div>
    <div class="blockchain__description description">
      <div class="description__title">
        How i can test it?
      </div>
      <ul class="description__content">
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget fermentum elit lectus orci diam id nulla. Sed sit gravida ornare praesent diam mauris, egestas fringilla felis. Dolor ipsum ipsum est mauris proin a, lectus. Pulvinar et sit integer fames tellus. Semper ut nibh at sit diam neque. Augue aliquam, nec erat a diam vel, sed non gravida. Bibendum neque, urna vel scelerisque diam.</li>
        <li>Suspendisse morbi nisl est augue eget cras amet. Donec orci eget maecenas risus tempor elit ultricies. Pretium consectetur gravida rhoncus nulla et et. Eget egestas ut netus suspendisse porttitor. Lacus tellus sed enim quis. Porttitor dolor elementum eget ornare id convallis mattis. Tincidunt sit praesent imperdiet velit dui in dictum. Vitae lectus sed nec tincidunt nec vitae. Massa semper rutrum consectetur eu ultrices ac id auctor sit. Lobortis mi pharetra, sit rutrum diam tristique interdum sed eu. Proin sagittis risus, enim commodo ut. Pellentesque libero eget eu, sed. Ultricies sed enim, eget malesuada massa.</li>
        <li>Viverra adipiscing molestie euismod enim, eget. Sem felis, non venenatis, turpis et adipiscing. Senectus aliquam neque gravida at magnis lacus, vestibulum. Velit ut sem nibh vitae. Tincidunt venenatis bibendum rhoncus quis bibendum purus. Arcu ante donec quisque enim, sit nunc tincidunt quis. Scelerisque gravida ut tellus etiam mauris. Iaculis eu risus mattis risus felis, non nibh leo. Arcu accumsan posuere dolor in. Ullamcorper eleifend aliquet arcu, neque. Sit commodo amet tempus sed orci, accumsan, molestie. Non felis dolor nunc tellus. Pretium at risus faucibus aliquet. Pellentesque ut nunc, amet amet, ac sit ut. Urna nisl aliquet felis, ipsum morbi porttitor.</li>
        <li>Egestas eget ut sed blandit volutpat diam. Praesent sed nunc ut tincidunt lacus leo, sed turpis lectus. Egestas amet morbi nec eu aenean blandit. Dictum volutpat felis elit egestas. Faucibus dis tellus amet, arcu, aliquam. Dolor sit lacus enim cras. Blandit diam a nisl, lectus dapibus quis. Consectetur enim ullamcorper ac quam suspendisse vulputate in. Amet at aliquam vitae risus. Parturient et rhoncus in quis urna. Congue neque, facilisis velit ullamcorper senectus.</li>
        <li>Pulvinar faucibus eu quisque tincidunt egestas tristique tempor elit. Quis sit sit ac iaculis habitasse. Neque sit elit et libero iaculis ante tincidunt. Id consequat enim ut augue varius aliquet maecenas. Auctor sit cras turpis nec sollicitudin nam placerat ultrices integer. Morbi aliquam sit nisi, eleifend quam integer nulla elementum amet. Mattis ultricies adipiscing massa tortor risus urna. Lectus ipsum lorem facilisi ligula sapien, at id ultrices id. Porttitor eleifend sed luctus volutpat lacus, a tortor eget egestas. Purus at integer elit facilisis sit eget volutpat. Nascetur quis habitasse sit cursus porta egestas nibh consequat. Blandit maecenas sit lacinia ut nunc. Porttitor viverra dolor, pretium sed vestibulum faucibus et rhoncus. At facilisi pharetra elementum dui donec maecenas in magna.</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'DemoBlockchain',
  layout: 'guest',
  data() {
    return {
      address: '',
    };
  },
  computed: {
    ...mapGetters({
      isConnected: 'web3/isConnected',
      account: 'web3/getAccount',
    }),
  },
  methods: {
    async connectToMetamask() {
      if (!this.isConnected) {
        await this.$store.dispatch('web3/connectToMetaMask');
        this.address = this.account.address;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .blockchain {
    display: flex;
    flex-direction: column;
    align-items: center;
    &__banner {
      width: 1170px;
      height: 290px;
      margin-top: 20px;
      display: flex;
      position: relative;
      align-items: center;
      justify-content: space-between;
    }
    &__description {
      width: 1170px;
      margin-top: 20px;
    }
  }
  .banner {
    &__background {
      display: flex;
      justify-content: flex-end;
      z-index: 1;
      position: absolute;
      width: 100%;
      background: linear-gradient(135deg, #0083C7 0%, #00AA5B 100%);
      border-radius: 8px;
    }
    &__img {
      mix-blend-mode: lighten;
      opacity: 0.7;
      border-radius: 8px;
    }
    &__left {
      z-index: 2;
      padding-left: 60px;
    }
    &__right {
      z-index: 2;
      padding: 20px;
    }
    &__card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 30px;
      width: 423px;
      height: 245px;

      background: #FFFFFF;

      box-shadow: 0px 2px 10px rgba(56, 71, 79, 0.1);
      border-radius: 8px;
    }
    &__title, &__subtitle {
      font-style: normal;
      line-height: 130%;
      color: #FFFFFF;
    }
    &__title {
      font-weight: bold;
      font-size: 40px;
    }
    &__subtitle {
      font-weight: 500;
      font-size: 18px;
    }
  }
  .card {
    &__observer, &__input {
      width: 100%;
    }
  }
  .description {
    &__title {
      font-style: normal;
      font-weight: 600;
      font-size: 28px;
      line-height: 130%;
      color: #1D2127;
    }
    &__content {
      margin-top: 20px;
      list-style: disc;
      color: #4C5767;
      padding-left: 15px;
    }
  }
  @include _1199 {
    .blockchain {
      padding: 0 20px;
      &__banner {
        width: 100%;
      }
      &__description {
        width: 100%;
      }
    }
  }
  @include _991 {
    .banner {
      &__left {
        padding-left: 30px;
      }
      &__card {
        width: 323px;
      }
      &__background {
        height: 300px;
      }
    }
  }
  @include _575 {
    .blockchain {
      &__banner {
        justify-content: center;
      }
    }
    .banner {
      &__left {
        display: none;
      }
      &__background {
        height: 300px;
      }
    }
  }
  @include _380 {
    .banner {
      &__right {
        padding: 0;
      }
    }
  }
  @include _350 {
    .banner {
      &__card {
        width: 250px;
        height: 230px;
        padding: 20px;
      }
    }
  }
</style>
