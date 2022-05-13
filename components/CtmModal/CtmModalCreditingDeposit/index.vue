<template>
  <ctm-modal-box
    class="deposit"
    :title="$tc('modals.titles.deposit')"
  >
    <validation-observer
      v-slot="{handleSubmit, validated, passed, invalid}"
      class="deposit__content content"
      tag="div"
    >
      <div class="content__grid">
        <div class="content__body">
          <div class="content__checkpoints checkpoints">
            <div class="checkpoints__block">
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
            <div class="checkpoints__block">
              <label
                for="checkpoints__field"
                class="checkpoints__label"
              >
                {{ $t('crediting.chooseSource') }}
              </label>
              <div
                id="checkpoints__field"
                class="checkpoints__main"
              >
                <div
                  v-for="(item, i) in fundsSource"
                  :key="i"
                  class="checkpoints__array"
                >
                  <input
                    :id="item.name"
                    v-model="selFundID"
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
          </div>
          <div class="content__field">
            <div class="content__label">
              {{ $t('modals.howMuchTokensWouldYouLikeToLock', { token: checkpoints[selCurrencyID - 1].name }) }}
            </div>
            <base-field
              v-model="quantity"
              class="content__input"
              data-selector="TOKEN-VALUE"
              :placeholder="`100 ${checkpoints[selCurrencyID - 1].name}`"
              rules="required|decimal"
              :name="$tc('modals.quantityField')"
            />
          </div>
          <div class="content__field">
            <div class="content__label">
              {{ $t('modals.choosePeriod') }}
            </div>
            <base-dd
              v-model="date"
              type="gray"
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
          data-selector="SUBMIT"
          :disabled="!validated || !passed || invalid"
          @click="handleSubmit(openConfirmDetailsModal)"
        >
          {{ $t('meta.btns.submit') }}
        </base-btn>
      </div>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalTakeCreditingDeposit',
  data() {
    return {
      selCurrencyID: 1,
      selFundID: 1,
      quantity: '',
      date: 0,
      datesNumber: [7, 14, 30, 90, 180],
      checkpoints: [
        { name: this.$t('meta.coins.bnb'), id: 1 },
        { name: this.$t('meta.coins.eth'), id: 2 },
        { name: this.$t('meta.coins.wqt'), id: 3 },
      ],
      fundsSource: [
        { name: this.$t('footer.DeFi.lending'), id: 1 },
        { name: this.$t('footer.DeFi.retirement'), id: 2 },
        { name: this.$t('ui.menu.savings.title'), id: 3 },
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
    async openConfirmDetailsModal() {
      const { submit } = this.options;
      const {
        fundsSource, selFundID, checkpoints, selCurrencyID, datesNumber, date, quantity,
      } = this;
      this.CloseModal();
      await submit({
        fundsSource,
        selFundID,
        checkpoints,
        selCurrencyID,
        datesNumber,
        date,
        quantity,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.deposit {
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
    grid-template-columns: auto;
    gap: 25px;
  }
  &__checkpoints {
    display: grid;
    grid-template-columns: repeat(2, auto);
    margin-bottom: 25px;
    &_label {
      margin-bottom: 10px;
    }
  }
  &__zone {
    background-color: $black0;
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
    grid-template-columns: auto 1fr;
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

@include _991 {
  .content {
    &__checkpoints {
      grid-template-columns: auto;
      grid-gap: 20px;
    }
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
