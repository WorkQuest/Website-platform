<template>
  <ctm-modal-box
    class="remove"
    :title="$tc('modals.titles.removeLiquidity')"
  >
    <div class="remove__content content">
      <validation-observer v-slot="{handleSubmit, validated, passed, invalid}">
        <div class="content__grid">
          <div>
            <div class="content__field field">
              <div class="field__title">
                {{ $t('modals.withdrawalAmount') }}
              </div>
              <base-field
                v-model="withdraw"
                class="field__body"
                data-selector="WITHDRAWAL-AMOUNT"
                placeholder="1000 WQT"
                rules="required|decimal"
                :name="$tc('modals.withdrawalAmountField')"
              />
            </div>
            <div class="content__currencies currencies">
              <div
                v-for="(item, i) in currencies()"
                :key="i"
                class="currencies__body"
                :class="{'currencies__body_last':i=== currencies.length-1}"
              >
                <img
                  :src="item.url"
                  alt="tokens"
                  class="currencies__picture"
                >
                <div class="currencies__name">
                  {{ item.name }}
                </div>
                <div class="currencies__value">
                  {{ item.value }}
                </div>
              </div>
            </div>
          </div>
          <div class="content__zone zone">
            <div
              v-for="(item, i) in abouts()"
              :key="i"
              class="zone__field"
            >
              <div class="zone__title">
                {{ item.title }}
              </div>
              <div
                class="zone__subtitle"
                :class="{'zone__subtitle_last':i === abouts.length - 1}"
              >
                {{ item.subtitle }}
              </div>
            </div>
          </div>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            class="buttons__button"
            mode="outline"
            data-selector="CANCEL"
            @click="CloseModal"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            data-selector="REMOVE-LIQUIDITY"
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(CloseModal)"
          >
            {{ $t('modals.titles.removeLiquidity') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalRemoveLiquidity',
  data() {
    return {
      withdraw: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    abouts() {
      const { isBNB } = this.options;
      return [
        {
          title: this.$t('modals.exchangeRate'),
          subtitle: this.$t(`modals.tempForRemove${isBNB ? '2' : ''}`),
        },
        {
          title: this.$t('modals.currentPoolSize'),
          subtitle: this.$t(`modals.removeLiquidityCurrentPoolSize${isBNB ? '2' : ''}`),
        },
        {
          title: this.$t('modals.yourPoolShare'),
          subtitle: this.$t(`modals.removeLiquidityYourPoolShare${isBNB ? '2' : ''}`),
        },
      ];
    },
    currencies() {
      const { isBNB } = this.options;
      return [
        {
          url: require(`~/assets/img/ui/${isBNB ? 'bnb' : 'hromb'}-logo.svg`),
          name: this.$t(`modals.${isBNB ? 'bnb' : 'eth'}`),
          value: '25.0256',
        },
        {
          url: require('~/assets/img/ui/wqt-logo.svg'),
          name: this.$t('meta.coins.wqt'),
          value: '25.0256',
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>

.remove {
  max-width: 875px !important;
  max-height: 80vh;

  &__content {
  padding: 20px 28px 30px 28px;
  }
}
.content {
  &__zone {
    background-color: $black0;
    border-radius: 5px;
    padding: 20px;
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  &__buttons {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }
}
.currencies{
  &__body {
    display: grid;
    grid-template-columns: 45px 3fr auto;
    align-items: center;
    gap: 10px;
    margin-bottom: 23px;
    &_last{
      margin-bottom: 0;
    }
    }
    &__picture{
      box-shadow: 0 4px 9px rgba(0, 0, 0, 0.15);
      border-radius: 50%;
    }
    &__name {
      font-weight: 400;
      font-size: 16px;
      color: #1D2127;
    }
    &__value {
      @extend .currencies__name;
      text-align: right;
    }
}
.zone {
  &__title {
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 5px;
  }
  &__subtitle {
      color: #7C838D;
      font-weight: 500;
      font-size: 14px;
      margin-bottom: 20px;
      line-height: 130%;
    &_last{
      margin-bottom: 0;
    }
  }
}
.field{
  &__title{
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    margin-bottom: 10px;
  }
}

  @include _575 {
    .content {
      &__grid {
        grid-template-rows: repeat(2, auto);
        grid-template-columns: unset;
      }
      &__zone {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin: 0;
      }
    }
  }

</style>
