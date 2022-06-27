<template>
  <div
    class="loader"
    :class="{'loader_hider': isLoaderBackgroundHider}"
  >
    <div class="loader__body">
      <div
        v-if="checkPage()"
        class="loader__modal"
      >
        <div class="loader__text">
          {{ $t('modals.pleaseWaitTx') }}
        </div>
        <div
          class="sk-chase"
          :class="{'sk-chase_small' : isMiniLoader}"
        >
          <div
            v-for="(item, i) in ['', '', '', '', '', '']"
            :key="i"
            class="sk-chase-dot"
          />
        </div>
      </div>
      <div
        v-else
        class="sk-chase"
        :class="{'sk-chase_small' : isMiniLoader}"
      >
        <div
          v-for="(item, i) in ['', '', '', '', '', '']"
          :key="i"
          class="sk-chase-dot"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import loaderModes from '~/store/main/loaderModes';
import { Path, TokenSymbols } from '~/utils/enums';

export default {
  props: {
    isMiniLoader: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    loaderModes,
  }),
  computed: {
    ...mapGetters({
      loaderStatusText: 'main/getLoaderStatusText',
      loaderMode: 'main/getLoaderMode',
      loaderProgress: 'main/getLoaderProgress',
      isLoaderBackgroundHider: 'main/getIsLoaderBackgroundHider',
    }),
  },
  methods: {
    checkPage() {
      return [
        Path.WALLET,
        Path.BRIDGE,
        Path.RETIREMENT, `${Path.RETIREMENT}/my`,
        `${Path.MINING}/:id`,
        Path.STAKING, `${Path.STAKING}/:id`,
      ].includes(this.$route.matched[0].path);
    },
  },
};
</script>
<style lang="scss" scoped>

.loader {
  padding: 10px;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(#000000, .5);
  z-index: 1000000000;
  align-items: center;
  justify-content: center;
  display: flex;

  &_hider {
    background: $black0;
  }

  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__modal {
    position: relative;

    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;

    width: fit-content;
    height: fit-content;
    padding: 25px;

    text-align: center;
    background: #FFFFFF;
    border-radius: 6px;
    box-shadow: 0 85px 147px rgba(10, 27, 61, 0.17), 0 47.1676px 61.4131px rgba(10, 27, 61, 0.078707), 0 26.7219px 32.8344px rgba(10, 27, 61, 0.0629546), 0 14.4955px 18.4067px rgba(10, 27, 61, 0.0598272), 0 6.96225px 9.77565px rgba(10, 27, 61, 0.0584222), 0 2.43911px 4.06787px rgba(10, 27, 61, 0.0492837);
  }

  &__text {
    font-family: 'Inter', sans-serif;
    font-size: 23px;
    color: $black800;
    font-weight: 500;
    line-height: 130%;
  }
}

.sk-chase {
  width: 40px;
  height: 40px;

  margin-top: 15px;

  position: relative;
  z-index: 1500;
  animation: sk-chase 2.5s infinite linear both;

  &_small {
    height: 20px;
    width: 20px;
  }
}

.sk-chase-dot {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  animation: sk-chase-dot 2.0s infinite ease-in-out both;
}

.sk-chase-dot:before {
  content: '';
  display: block;
  width: 25%;
  height: 25%;
  background-color: #0083C7;
  border-radius: 100%;
  animation: sk-chase-dot-before 2.0s infinite ease-in-out both;
}

.sk-chase-dot:nth-child(1) {
  animation-delay: -1.1s;
}

.sk-chase-dot:nth-child(2) {
  animation-delay: -1.0s;
}

.sk-chase-dot:nth-child(3) {
  animation-delay: -0.9s;
}

.sk-chase-dot:nth-child(4) {
  animation-delay: -0.8s;
}

.sk-chase-dot:nth-child(5) {
  animation-delay: -0.7s;
}

.sk-chase-dot:nth-child(6) {
  animation-delay: -0.6s;
}

.sk-chase-dot:nth-child(1):before {
  animation-delay: -1.1s;
}

.sk-chase-dot:nth-child(2):before {
  animation-delay: -1.0s;
}

.sk-chase-dot:nth-child(3):before {
  animation-delay: -0.9s;
}

.sk-chase-dot:nth-child(4):before {
  animation-delay: -0.8s;
}

.sk-chase-dot:nth-child(5):before {
  animation-delay: -0.7s;
}

.sk-chase-dot:nth-child(6):before {
  animation-delay: -0.6s;
}

@keyframes sk-chase {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sk-chase-dot {
  80%, 100% {
    transform: rotate(360deg);
  }
}

@keyframes sk-chase-dot-before {
  50% {
    transform: scale(0.4);
  }
  100%, 0% {
    transform: scale(1.0);
  }
}

</style>
