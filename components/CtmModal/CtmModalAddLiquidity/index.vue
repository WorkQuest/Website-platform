<template>
  <ctm-modal-box
    class="liquidity"
    :title="$t('modals.addLiquidity')"
  >
    <div class="liquidity__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
      >
        <div class="content__grid">
          <div class="content__field field">
            <div class="field__title">
              {{ $t('modals.amountOfWusd') }}
            </div>
            <base-field
              v-model="amountOfWusd"
              :placeholder="'0 ETH'"
              class="field__input"
              rules="required|numeric"
              :name="$t('modals.amountOfWusdField')"
            />
            <div class="field__field">
              <div class="field__title">
                {{ $t('modals.amountOfEth') }}
              </div>
              <base-field
                v-model="amountOfEth"
                :placeholder="'0 WUSD'"
                class="field__input"
                rules="required|numeric"
                :name="$t('modals.amountOfEthField')"
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
              v-for="(item, i) in abouts"
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
            @click="hide()"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            :disabled="!validated || !passed || invalid"
            @click="hide()"
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
      amountOfWusd: '',
      amountOfEth: '',
      abouts: [
        {
          title: this.$t('modals.amountEthPerWusd'),
          subtitle: 54,
        },
        {
          title: this.$t('modals.amountEthPerWusd'),
          subtitle: 65,
        },
        {
          title: this.$t('modals.shareOfPool'),
          subtitle: '5%',
        },
      ],
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
    background-color: #F7F8FA;
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
