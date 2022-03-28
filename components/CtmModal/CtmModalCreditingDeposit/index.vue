<template>
  <ctm-modal-box
    class="deposit"
    :title="$t('modals.titles.deposit')"
  >
    <div class="deposit__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
        tag="div"
      >
        <div class="content__grid">
          <div class="content__body">
            <div class="content__checkpoints checkpoints">
              <label
                for="checkpoints__main"
                class="checkpoints__label"
              >
                {{ $t('modals.chooseTheCurrency') }}
              </label>
              <div
                id="checkpoints__main"
                class="checkpoints__main"
              >
                <div
                  v-for="(item, i) in checkpoints"
                  :key="i"
                  class="checkpoints__array"
                >
                  <input
                    :id="item.name"
                    v-model="selCurrencyID"
                    type="radio"
                    class="checkpoints__item"
                    :value="item.id"
                  >
                  <label
                    class="checkpoints__name"
                    :for="item.name"
                  >
                    {{ item.name }}
                  </label>
                </div>
              </div>
            </div>
            <div class="content__field">
              <div class="content__label">
                {{ $t('modals.howMuchEthWouldYouLikeToLock') }}
              </div>
              <base-field
                v-model="quantity"
                class="content__input"
                data-selector="TOKEN-VALUE"
                placeholder="1000 ETH"
                rules="required|decimal"
                :name="$t('modals.quantityField')"
              />
            </div>
            <div class="content__field">
              <div class="content__label">
                {{ $t('modals.choosePeriod') }}
              </div>
              <base-dd
                v-model="date"
                class="grid__drop"
                data-selector="DATE-DD"
                :items="dates"
              />
            </div>
            <div class="content__field">
              <div class="content__text">
                {{ $t('modals.tipAbout') }}
              </div>
            </div>
          </div>
          <div class="content__zone zone">
            <div
              v-for="(item, i) in abouts"
              :key="i"
            >
              <div class="zone__title">
                {{ item.title }}
              </div>
              <div class="zone__subtitle">
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
            data-selector="SUBMIT"
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(openConfirmDetailsModal)"
          >
            {{ $t('meta.btns.submit') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalTakeCreditingDeposit',
  data() {
    return {
      selCurrencyID: 1,
      quantity: '',
      generate: '',
      date: 0,
      checkpoints: [
        {
          name: this.$t('meta.coins.bnb'),
          id: 1,
        },
        {
          name: this.$t('meta.coins.eth'),
          id: 2,
        },
        {
          name: this.$t('meta.coins.wqt'),
          id: 3,
        },
      ],
      abouts: [
        {
          title: this.$t('modals.collateralization'),
          subtitle: this.$tc('meta.units.percentsCount', 0),
        },
        {
          title: this.$t('modals.liquidationPrice'),
          subtitle: this.$tc('meta.units.percentsCount', 0),
        },
        {
          title: this.$t('modals.currentPrice'),
          subtitle: this.$tc('meta.units.percentsCount', 0),
        },
        {
          title: this.$t('modals.stabilityFee'),
          subtitle: this.$tc('meta.units.percentsCount', 0),
        },
        {
          title: this.$t('modals.liquidationRatio'),
          subtitle: this.$tc('meta.units.percentsCount', 0),
        },
        {
          title: this.$t('modals.liquidationPenalty'),
          subtitle: this.$tc('meta.units.percentsCount', 0),
        },
        {
          title: this.$t('modals.generatedWUSD'),
          subtitle: this.$tc('meta.coins.count.WUSDCount', 0),
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userRole: 'user/getUserRole',
    }),
    dates() {
      return [
        this.$tc('meta.units.days', 7),
        this.$tc('meta.units.days', 14),
        this.$tc('meta.units.days', 30),
        this.$tc('meta.units.days', 90),
        this.$tc('meta.units.days', 180),
      ];
    },
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    openConfirmDetailsModal() {
      const receiptData = [
        {
          title: this.$t('modals.currencyDetails'),
          subtitle: this.$t('meta.coins.eth'),
        },
        {
          title: this.$t('modals.depositing'),
          subtitle: this.$tc('meta.coins.count.ETHCount', 1),
        },
        {
          title: this.$t('modals.generatingDetails'),
          subtitle: this.$tc('meta.coins.count.WUSDCount', 1000),
        },
      ];
      const dataForStatusModal = {
        img: require('~/assets/img/ui/transactionSend.svg'),
        title: this.$t('modals.depositIsOpened'),
        subtitle: '',
        path: 'crediting/1',
      };
      this.ShowModal({
        key: modals.confirmDetails,
        receiptData,
        dataForStatusModal,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.deposit {
  max-width: 943px !important;
  height: auto !important;
  padding: 0!important;
  &__content{
    padding: 20px 28px 30px 28px;
  }
}
.buttons{
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 10px));
  grid-gap: 20px;
  gap: 20px;
  margin-top: 25px;
}
.content{
  &__body{
  }
  &__field{
    margin-top: 3px;
    font-weight: 500;
  }
  &__label {
    margin-bottom: 13px;
  }
  &__text {
    color: $black500;
    font-size: 14px;
    margin: 3px 0 15px 0;
    line-height: 130%;
    font-weight: 400;
  }
  &__grid{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }
  &__checkpoints {
    margin-bottom: 25px;
    &_label {
      margin-bottom: 10px;
    }
  }
  &__zone {
    background-color: #F7F8FA;
    border-radius: 5px;
    margin-top: 15px;
    padding: 0 20px 20px 20px;
    height: fit-content;
  }
}
.checkpoints{
  &__label {
    margin-bottom: 15px;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
  }
  &__main{
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    text-align: left;
    justify-content: flex-start;
    gap: 13px;
  }
  &__array {
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 10px;
    > label {
      margin: unset;
    }
  }
  &__item{
    font-size: 16px;
    font-weight: 400;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    border: 1px solid #0083C7;
    cursor: pointer;
  }
}
.zone{
  &__title {
    font-size: 16px;
    font-weight: 400;
    margin-top: 20px;
  }
  &__subtitle {
    color: #7C838D;
    font-weight: 500;
    font-size: 14px;
  }
}

@include _575 {
  .content {
    &__grid {
      grid-template-columns: 1fr;
    }
    &__label {
      margin-bottom: 5px;
    }
  }
}

</style>
