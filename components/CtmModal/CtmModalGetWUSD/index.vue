<template>
  <ctm-modal-box
    class="getWUSD"
    :title="$tc('modals.titles.buyWUSD')"
  >
    <div class="getWUSD__checkpoints checkpoints">
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
            v-model="selCurrency"
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
    <validation-observer
      v-slot="{handleSubmit, invalid}"
      ref="form"
      tag="div"
      class="getWUSD__content content"
    >
      <div class="content__field">
        <div class="content__label">
          {{ $t('modals.countOfReceivedWUSD') }}
        </div>
        <base-field
          ref="amount_wusd"
          v-model="amountWUSD"
          class="content__input"
          placeholder="10 WUSD"
          :rules="rulesWUSDInput"
          :name="$tc('modals.fieldCountOf', { countOf: $options.TokenSymbols.WUSD })"
          vid="WUSD"
          type="number"
          data-selector="WUSD"
          @input="onChangeWUSD"
        />
      </div>
      <div class="content__field">
        <div class="content__label">
          {{ $t('modals.countOfCollateral') }}
        </div>
        <base-field
          ref="amount_input"
          v-model="amountCollateral"
          class="content__input"
          :placeholder="`10 ${currentCurrency}`"
          :rules="rulesCollateralInput"
          :name="$tc('modals.fieldCountOf', { countOf: `${ currentCurrency } collateral` })"
          vid="Collateral"
          type="number"
          data-selector="TOKEN"
          @input="onChangeCollateral"
        />
      </div>
      <div
        class="content__field"
        @keydown.delete="ChangeCaretPosition($refs.percentInput)"
      >
        <div class="content__label">
          {{ $t('modals.percentageConversion') }}
        </div>
        <base-field
          ref="percentInput"
          :value="collateralPercent"
          class="content__input"
          placeholder="150 %"
          :rules="`required|min_percent:${minRatio}|max_percent:${maxRatio}|zeroFail|min:2|max:4`"
          :name="$tc('modals.fieldPercentConversion').toLowerCase()"
          data-selector="PERCENT"
          @input="calcCollateralPercent"
        />
        <slider
          :value="Number(collateralPercentClear)"
          :mode="$options.SLIDER_MODE.BLUE"
          :from="minRatio"
          :to="maxRatio"
          @change="calcCollateralPercent"
        />
        <div class="content__text">
          {{ $t('modals.conversionAdditionalInfo', {min_percent: collateralPercentClear, risks: getRisksGrade}) }}
        </div>
      </div>
      <div class="content__buttons buttons">
        <base-btn
          class="buttons__button"
          mode="outline"
          data-selector="CANCEL"
          :is-submit="false"
          @click="CloseModal"
        >
          {{ $t('meta.btns.cancel') }}
        </base-btn>
        <base-btn
          class="buttons__button"
          data-selector="SUBMIT"
          :disabled="invalid"
          @click="handleSubmit(requestGetWUSD)"
        >
          {{ $t('meta.btns.submit') }}
        </base-btn>
      </div>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { TokenMap, TokenSymbols } from '~/utils/enums';
import { ERC20 } from '~/abi';
import Slider from '~/components/ui/Slider';
import { SLIDER_MODE } from '~/components/ui/Slider/model';

export default {
  name: 'ModalGetWUSD',
  SLIDER_MODE,
  TokenSymbols,
  components: { Slider },
  data() {
    return {
      maxRatio: 0,
      selCurrency: TokenMap.USDT,
      amountWUSD: null,
      amountCollateral: null,
      collateralPercent: '',
      currentCurrencyPrice: 0,
      optimalCollateralRatio: 0,
      checkpoints: [
        { name: TokenSymbols.USDT, id: TokenMap.USDT },
        { name: TokenSymbols.USDC, id: TokenMap.USDC },
        // { name: this.$t('meta.coins.bnb'), id: TokenMap.BNB },
        // { name: this.$t('meta.coins.eth'), id: TokenMap.ETH },
        // { name: this.$t('meta.coins.wqt'), id: TokenMap.WQT }, // TODO: wqt native now, fix it
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',

      minRatio: 'oracle/getMinRatio',
      ratio: 'oracle/getSecurityRatio',

      userWalletAddress: 'user/getUserWalletAddress',

      currentBalance: 'wallet/getBalanceData',
    }),
    optimalCollateralPercent() {
      return new BigNumber(this.optimalCollateralRatio).toFixed(0);
    },
    currentCurrency() {
      return this.checkpoints.find((el) => el.id === this.selCurrency).name;
    },
    collateralPercentClear() {
      return this.collateralPercent.replace(/[^0-9,.]/g, '');
    },
    currentCollateralRatio() {
      return new BigNumber(this.collateralPercentClear).dividedBy(100).toFixed();
    },
    mediumRiskPoint() {
      const { maxRatio, minRatio } = this;
      const averageRatio = new BigNumber(maxRatio).plus(minRatio).dividedBy(2).toNumber();
      return new BigNumber(this.optimalCollateralPercent)
        .plus(averageRatio)
        .dividedBy(2)
        .dp(0, 6)
        .toNumber();
    },
    getRisksGrade() {
      if (
        new BigNumber(this.collateralPercentClear).isGreaterThanOrEqualTo(this.minRatio)
        && new BigNumber(this.collateralPercentClear).isLessThan(this.optimalCollateralPercent)
      ) return this.$t('modals.highRisk');

      if (
        new BigNumber(this.collateralPercentClear).isGreaterThanOrEqualTo(this.optimalCollateralPercent)
        && new BigNumber(this.collateralPercentClear).isLessThan(this.mediumRiskPoint)
      ) return this.$t('modals.mediumRisk');

      return this.$t('modals.lowRisk');
    },
    rulesWUSDInput() {
      const decimal_places = `decimalPlaces:${this.currentBalance[TokenSymbols.WUSD].decimals}`;
      return `required|decimal|greaterThanZero|${decimal_places}`;
    },
    rulesCollateralInput() {
      const { currentBalance, currentCurrency } = this;
      const not_enough_funds = `not_enough_funds:${currentBalance[currentCurrency].fullBalance}`;
      const max_value = `max_value:${currentBalance[currentCurrency].fullBalance}`;
      const decimal_places = `decimalPlaces:${currentBalance[currentCurrency].decimals}`;
      return `required|decimal|greaterThanZero|${not_enough_funds}|${max_value}|${decimal_places}`;
    },
  },
  watch: {
    selCurrency: {
      async handler() {
        this.clearForm();
        await this.fetchMinRatio({ currency: this.currentCurrency });
        await this.getCollateralData();
        this.setActualCollateralPercent();
      },
    },
    currentCurrencyPrice: {
      handler() {
        this.calculateCollateral();
      },
    },
  },
  async mounted() {
    this.SetLoader(true);

    await Promise.all([
      this.fetchWalletData({
        method: 'balanceOf',
        address: this.userWalletAddress,
        abi: ERC20,
        token: TokenMap[this.currentCurrency],
        symbol: TokenSymbols[this.currentCurrency],
      }),
      this.fetchMinRatio({ currency: this.currentCurrency }),
    ]);

    await this.getCollateralData();
    this.setActualCollateralPercent();
    this.SetLoader(false);
  },
  methods: {
    ...mapActions({
      fetchWalletData: 'wallet/fetchWalletData',

      fetchRatio: 'oracle/getSecurityRatio',
      fetchMinRatio: 'oracle/getCurrencyInfo',
    }),
    onChangeWUSD(value) {
      this.amountWUSD = value;
      this.calculateCollateral();
      this.$nextTick(() => {
        this.$refs.form.validate();
      });
    },
    onChangeCollateral(value) {
      this.amountCollateral = value;
      this.calculateWUSD();
      this.$nextTick(() => {
        this.$refs.form.validate();
      });
    },
    calculateWUSD() {
      if (+this.amountCollateral > 0 && +this.collateralPercentClear > 0 && +this.currentCurrencyPrice > 0) {
        this.amountWUSD = Number(new BigNumber(this.amountCollateral)
          .multipliedBy(this.currentCurrencyPrice)
          .dividedBy(this.currentCollateralRatio)
          .toFixed(18, 1));
      } else this.amountWUSD = null;
    },
    calculateCollateral() {
      if (+this.amountWUSD > 0 && +this.collateralPercentClear > 0 && +this.currentCurrencyPrice > 0) {
        this.amountCollateral = Number(new BigNumber(+this.amountWUSD)
          .multipliedBy(+this.currentCollateralRatio)
          .dividedBy(+this.currentCurrencyPrice)
          .toFixed(+this.currentBalance[this.currentCurrency].decimals, 1));
      } else this.amountCollateral = null;
    },
    async getCollateralData() {
      await this.fetchRatio();
      /**
       * @property price - current price for selected token
       * @property recommendedPercent - percent of optimal risk
       * @property maxPercent - maximum percent available for collateral
       */
      this.ratio.some((item) => {
        if (item.symbol === this.currentCurrency) {
          this.maxRatio = item.maxPercent;
          this.currentCurrencyPrice = item.price;
          this.optimalCollateralRatio = new BigNumber(item.recommendedPercent).toNumber();
          return true;
        }
        return false;
      });
    },
    setActualCollateralPercent() {
      this.collateralPercent = `${this.optimalCollateralPercent}%`;
    },
    clearForm() {
      this.amountWUSD = null;
      this.amountCollateral = null;
      this.collateralPercent = '';
      this.$refs.form.reset();
    },
    calcCollateralPercent(value) {
      this.collateralPercent = this.CalcPercent(value, this.collateralPercent);
      this.calculateCollateral();
      this.ChangeCaretPosition(this.$refs.percentInput);
    },
    async requestGetWUSD() {
      const { submit } = this.options;
      this.CloseModal();
      await submit({
        amountWUSD: this.amountWUSD,
        collateral: this.amountCollateral,
        percent: this.collateralPercent.substr(0, this.collateralPercent.length - 1),
        currency: this.currentCurrency,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.getWUSD {
  max-width: 490px !important;
  height: auto !important;

  &__checkpoints {
    padding: 0 28px;
    margin: 30px 0;

    &_label {
      margin-bottom: 10px;
    }
  }

  &__content {
    padding: 0 28px 30px;
  }
}

.buttons {
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 10px));
  grid-gap: 20px;
  gap: 20px;
  margin-top: 40px;
}

.content {
  &__field {
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

}

.checkpoints {
  &__label {
    margin-bottom: 15px;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
  }

  &__main {
    display: grid;
    // dependence on count of collateral tokens USDT, USDC ... (look at checkpoints array)
    grid-template-rows: repeat(2, 1fr);
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

  &__item {
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
