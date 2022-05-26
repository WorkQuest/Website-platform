<template>
  <ctm-modal-box
    class="liquidity"
    :title="$tc('modals.titles.addLiquidity')"
  >
    <div class="liquidity__content content">
      <validation-observer
        v-slot="{handleSubmit}"
        class="content__observer"
      >
        <div class="content__grid">
          <div class="content__field field">
            <div class="field__title">
              {{ $t('meta.amount.amountOfWQT') }}
            </div>
            <base-field
              v-model="amountOfWqt"
              :placeholder="$tc('meta.coins.count.WQTCount', 1000)"
              class="field__input"
              data-selector="AMOUNT-OF-WQT"
              rules="required|decimal"
              :name="$tc('meta.amount.amountOfWQT')"
            />
            <div class="field__container">
              <div class="field__title">
                {{ $t(`meta.amount.${options.isBNB ? 'amountOfBNB': 'amountOfETH'}`) }}
              </div>
              <base-field
                v-if="options.isBNB"
                v-model="amountOfBnb"
                :placeholder="$tc('meta.coins.count.BNBCount', 10)"
                data-selector="AMOUNT-OF-BNB"
                class="field__input"
                rules="required|decimal"
                :name="$tc('meta.amountOfBNB')"
              />
              <base-field
                v-else
                v-model="amountOfEth"
                :placeholder="$tc('meta.coins.count.ETHCount', 10)"
                class="field__input"
                data-selector="AMOUNT-OF-ETH"
                rules="required|decimal"
                :name="$tc('meta.amountOfETH')"
              />
              <div class="field__heading">
                {{ $t('modals.tip') }}
              </div>
              <div class="field__about">
                {{ $t('modals.tipAbout') }}
              </div>
            </div>
          </div>
          <div class="content__zone">
            <div class="content__subtitle">
              {{ $t('modals.byAddingLiquidityYouWillEarn') }}
            </div>
            <div
              v-for="(item, i) in abouts()"
              :key="i"
            >
              <div class="content__title">
                {{ item.title }}
              </div>
              <div class="content__subtitle_small">
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
            @click="hide"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            data-selector="CONNECT-WALLET"
            @click="handleSubmit(hide)"
          >
            {{ $t('modals.connectWallet') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalAddLiquidity',
  data() {
    return {
      amountOfWqt: '',
      amountOfEth: '',
      amountOfBnb: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    abouts() {
      const { isBNB } = this.options;
      return [
        {
          title: this.$t(`meta.amount.${isBNB ? 'amountBNBPerWQT' : 'amountETHPerWQT'}`),
          subtitle: 54,
        },
        {
          title: this.$t(`meta.amount.${isBNB ? 'amountBNBPerWQT' : 'amountBNBPerWQT'}`),
          subtitle: 65,
        },
        {
          title: this.$t('modals.shareOfPool'),
          subtitle: '5%',
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>

.liquidity {
    max-width: 945px !important;
    max-height: 80vh;
  &__content{
  padding: 20px 28px 30px;
  }
}

.content {
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  &__title{
    font-size: 16px;
    line-height: 130%;
    margin: 20px 0 5px 0;
  }
  &__subtitle {
    color: #7C838D;
    font-weight: 400;
    font-size: 16px;
    &_small {
      color: #7C838D;
      font-weight: 500;
      font-size: 14px;
    }
  }
  &__zone {
    background-color: $black0;
    border-radius: 5px;
    padding: 15px 20px 20px 20px;
  }
  &__buttons {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }
}
.field{
  &__title{
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    margin-bottom: 5px;
  }
  &__input{
    margin-bottom: 2px;
  }
  &__heading{
    font-size: 16px;
    line-height: 130%;
  }
  &__about{
    color: #7C838D;
    font-weight: 400;
    line-height: 130%;
    font-size: 16px;
  }
}
  @include _575 {
    .content{
      &__grid{
        grid-template-rows: repeat(2, auto);
        grid-template-columns: unset;
        overflow: auto;
        height: calc(80vh - 170px);
      }
      &__zone {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin: 0;
      }
      &__subtitle {
        grid-column-start: 1;
        grid-column-end: 3;
      }
    }
  }

</style>
