<template>
  <ctm-modal-box
    class="getWUSD"
    :title="$t('modals.getWUSD')"
  >
    <div class="getWUSD__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
        ref="form"
      >
        <form
          action=""
          @submit.prevent="handleSubmit(requestGetWUSD)"
        >
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
                {{ $t('modals.countOfRecievedWUSD') }}
              </div>
              <div class="content__text">
                {{ $t('modals.countOfRecievedWUSDDescription') }}
              </div>
              <base-field
                v-model="amountWUSD"
                class="content__input"
                placeholder="10 WUSD"
                rules="required|decimal"
                :name="$t('modals.fieldCountOf', { countOf: 'WUSD' })"
              />
            </div>
            <div class="content__field">
              <div class="content__label">
                {{ $t('modals.countOfCollateral') }}
              </div>
              <div class="content__text">
                {{ $t('modals.countOfCollateralDescription') }}
              </div>
              <base-field
                id="amountOfPercents_input"
                v-model="amountCollateral"
                class="content__input"
                :placeholder="`10 ${currentCurrency}`"
                rules="required|decimal"
                :name="$t('modals.fieldCountOf', { countOf: `${ currentCurrency } collateral` })"
              />
            </div>
            <div class="content__field">
              <div class="content__label">
                {{ $t('modals.percentageConversion') }}
              </div>
              <div class="content__text">
                {{ $t('modals.conversionPercentDescription') }}
              </div>
              <base-field
                ref="percentInput"
                :value="conversionPercent"
                class="content__input"
                placeholder="150 %"
                rules="required"
                :name="$t('modals.fieldPercentConversion')"
                @input="calcConversionPercent"
              />
              <div class="content__text">
                <a href="#">
                  {{ $t('modals.conversionAdditionalInfo') }}
                </a>
              </div>
            </div>
          </div>
          <div class="content__buttons buttons">
            <base-btn
              class="buttons__button"
              mode="outline"
              :is-submit="false"
              @click="CloseModal"
            >
              {{ $t('meta.cancel') }}
            </base-btn>
            <base-btn
              class="buttons__button"
              :disabled="!validated || !passed || invalid"
            >
              {{ $t('meta.submit') }}
            </base-btn>
          </div>
        </form>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalGetWUSD',
  data() {
    return {
      selCurrencyID: 1,
      amountWUSD: '',
      amountCollateral: '',
      conversionPercent: '',
      checkpoints: [
        { name: this.$t('meta.bnb'), id: 1 },
        { name: this.$t('meta.eth'), id: 2 },
        { name: this.$t('meta.wqt'), id: 3 },
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    currentCurrency() {
      return this.checkpoints.find((el) => el.id === this.selCurrencyID).name;
    },
  },
  methods: {
    async requestMock() {
      // TODO async
      throw new Error('error');
    },
    async requestGetWUSD() {
      const payload = {
        amount: this.amountWUSD,
        collateral: this.amountCollateral,
        percent: this.conversionPercent,
        currency: this.currentCurrency,
      };
      try {
        await this.requestMock();
        this.CloseModal();
      } catch (e) {
        this.ShowToast(this.$t('modals.errorGetWUSD'));
      }
    },
    calcConversionPercent(value) {
      const valueWithoutWords = value.replace(/[^0-9,.]/g, '');
      const isEmpty = valueWithoutWords.length === 0;
      const isDotFirst = valueWithoutWords[0] === '.' || valueWithoutWords[0] === '.';
      if (isEmpty) {
        this.conversionPercent = '';
      } else if (isDotFirst) {
        const memo = valueWithoutWords.split('');
        memo.unshift('0');
        console.log(memo);
        this.conversionPercent = memo.join('');
      } else {
        this.conversionPercent = `${valueWithoutWords}%`;
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.getWUSD {
  max-width: 490px !important;
  height: auto !important;
  padding: 0!important;
  &__content{
    padding: 25px 28px 30px 28px;
  }
}
  .buttons{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 40px;
  }
.content{
  &__field{
    margin-top: 3px;
  }
  &__label {
    margin-bottom: 5px;
  }
  &__text {
    color: #7C838D;
    font-weight: 400;
    font-size: 14px;
    margin-top: 3px;
  }
  &__checkpoints {
    margin-bottom: 25px;
    &_label {
      margin-bottom: 10px;
    }
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
</style>
