<template>
  <ctm-modal-box
    class="getWUSD"
    :title="$tc('modals.titles.buyWUSD')"
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
              <base-field
                :value="amountWUSD"
                class="content__input"
                placeholder="10 WUSD"
                rules="required|decimal"
                :name="$tc('modals.fieldCountOf', { countOf: 'WUSD' })"
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
                id="amountOfPercents_input"
                :value="amountCollateral"
                class="content__input"
                :placeholder="`10 ${currentCurrency}`"
                rules="required|decimal"
                :name="$tc('modals.fieldCountOf', { countOf: `${ currentCurrency } collateral` })"
                type="number"
                data-selector="TOKEN"
                @input="onChangeCollateral"
              />
            </div>
            <div
              class="content__field"
              @keydown.delete="ChangeCaretPosition( $refs.percentInput)"
            >
              <div class="content__label">
                {{ $t('modals.percentageConversion') }}
              </div>
              <base-field
                ref="percentInput"
                :value="collateralPercent"
                class="content__input"
                placeholder="150 %"
                rules="required|min_percent:150|zeroFail"
                :name="$tc('modals.fieldPercentConversion')"
                data-selector="PERCENT"
                @input="calcCollateralPercent"
              />
              <div class="content__text">
                {{ $t('modals.conversionAdditionalInfo', {risks: getRisksGrade}) }}
              </div>
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
              :disabled="!validated || !passed || invalid"
            >
              {{ $t('meta.btns.submit') }}
            </base-btn>
          </div>
        </form>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { getGasPrice, getWalletAddress } from '~/utils/wallet';
import { WQOracle, WQRouter, ERC20 } from '~/abi/index';
import { TokenMap, TokenSymbols } from '~/utils/enums';

export default {
  name: 'ModalGetWUSD',
  data() {
    return {
      selCurrencyID: TokenMap.BNB,
      amountWUSD: '',
      amountCollateral: '',
      collateralPercent: '',
      currentCurrencyPrice: 0,
      optimalCollateralRatio: 0,
      checkpoints: [
        { name: this.$t('meta.coins.bnb'), id: TokenMap.BNB },
        { name: this.$t('meta.coins.eth'), id: TokenMap.ETH },
        // { name: this.$t('meta.coins.wqt'), id: TokenMap.WQT }, // TODO: wqt native now, fix it
      ],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    optimalCollateralPercent() {
      return new BigNumber(this.optimalCollateralRatio).multipliedBy(100).toFixed();
    },
    currentCurrency() {
      return this.checkpoints.find((el) => el.id === this.selCurrencyID).name;
    },
    collateralPercentClear() {
      return this.collateralPercent.replace(/[^0-9,.]/g, '');
    },
    currentCollateralRatio() {
      return new BigNumber(this.collateralPercentClear).dividedBy(100).toFixed();
    },
    mediumRiskPoint() {
      return new BigNumber(this.optimalCollateralPercent).plus(150).dividedBy(2).toFixed();
    },
    getRisksGrade() {
      if (new BigNumber(this.collateralPercentClear).isGreaterThanOrEqualTo(this.optimalCollateralPercent)) {
        return this.$t('modals.lowRisk');
      }
      if (new BigNumber(this.collateralPercentClear).isGreaterThanOrEqualTo(this.mediumRiskPoint)) {
        return this.$t('modals.mediumRisk');
      }
      return this.$t('modals.highRisk');
    },
  },
  watch: {
    selCurrencyID: {
      async handler() {
        this.clearForm();
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
  async beforeMount() {
    await this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
    await this.getCollateralData();
    this.setActualCollateralPercent();
  },
  methods: {
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
        this.amountWUSD = new BigNumber(this.amountCollateral).multipliedBy(this.currentCurrencyPrice).dividedBy(this.currentCollateralRatio).toFixed();
      }
    },
    calculateCollateral() {
      if (+this.amountWUSD > 0 && +this.collateralPercentClear > 0 && +this.currentCurrencyPrice > 0) {
        this.amountCollateral = new BigNumber(this.amountWUSD).multipliedBy(this.currentCollateralRatio).dividedBy(this.currentCurrencyPrice).toFixed();
      }
    },
    async getCollateralData() {
      this.currentCurrencyPrice = 10000; // TODO backend
      this.optimalCollateralRatio = 2; // TODO backend
    },
    setActualCollateralPercent() {
      this.collateralPercent = `${this.optimalCollateralPercent}%`;
    },
    clearForm() {
      this.amountWUSD = '';
      this.amountCollateral = '';
      this.collateralPercent = '';
      this.$refs.form.reset();
    },
    async requestGetWUSD() {
      await this.$store.dispatch('wallet/getBalance');
      const payload = {
        amount: this.amountWUSD,
        collateral: this.amountCollateral,
        percent: this.collateralPercent.substr(0, this.collateralPercent.length - 1),
        currency: this.currentCurrency,
        amountBN: new BigNumber(this.amountWUSD).shiftedBy(18).toFixed(),
        collateralBN: new BigNumber(this.amountCollateral).shiftedBy(18).toFixed(),
        ratioBN: new BigNumber(this.collateralPercent.substr(0, this.collateralPercent.length - 1)).shiftedBy(16).toFixed(),
      };
      this.SetLoader(true);
      this.CloseModal();
      await this.setTokenPrice(payload);
      this.SetLoader(false);
    },
    async setTokenPrice(payload) {
      const date = Date.now().toString();
      const timestamp = date.substr(0, date.length - 3);
      const price = '10000000000000000000000'; // TODO price
      const v = '0x25';
      const r = '0x4f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88d';
      const s = '0x7e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0';
      const resultGasSetTokenPrice = await getGasPrice(WQOracle, process.env.WORKNET_ORACLE, 'setTokenPriceUSD', [timestamp, price, v, r, s, payload.currency]);

      if (resultGasSetTokenPrice.gas && resultGasSetTokenPrice.gasPrice) {
        const setTokenPriceData = {
          gasPrice: resultGasSetTokenPrice.gasPrice,
          gas: resultGasSetTokenPrice.gas,
          timestamp,
          price,
          v,
          r,
          s,
        };

        this.ShowModal({
          key: modals.transactionReceipt,
          title: this.$t('modals.setTokenPrice', { token: payload.currency }),
          fields: {
            from: { name: this.$t('modals.fromAddress'), value: getWalletAddress() },
            fee: {
              name: this.$t('wallet.table.trxFee'),
              value: new BigNumber(setTokenPriceData.gasPrice).multipliedBy(setTokenPriceData.gas).shiftedBy(-18).toFixed(),
              symbol: TokenSymbols.WUSD,
            },
          },
          submitMethod: async () => await this.$store.dispatch('collateral/setTokenPrice', {
            payload,
            setTokenPriceData,
          }),
          callback: async () => {
            await this.approveRouter(payload);
          },
        });
      } else {
        await this.approveRouter(payload);
      }
    },
    async approveRouter(payload) {
      const allowance = await this.$store.dispatch('wallet/getAllowance', {
        tokenAddress: TokenMap[payload.currency],
        spenderAddress: process.env.WORKNET_ROUTER,
      });
      if (+allowance < +payload.collateral) {
        const resultGasApprove = await getGasPrice(ERC20, TokenMap[payload.currency], 'approve', [process.env.WORKNET_ROUTER, payload.collateralBN]);
        this.ShowModal({
          key: modals.transactionReceipt,
          title: this.$t('modals.approveRouter', { token: payload.currency }),
          fields: {
            from: { name: this.$t('modals.fromAddress'), value: getWalletAddress() },
            fee: {
              name: this.$t('wallet.table.trxFee'),
              value: new BigNumber(resultGasApprove.gasPrice).multipliedBy(resultGasApprove.gas).shiftedBy(-18).toFixed(),
              symbol: TokenSymbols.WUSD,
            },
          },
          submitMethod: async () => {
            await this.$store.dispatch('wallet/approve', {
              tokenAddress: TokenMap[payload.currency],
              spenderAddress: process.env.WORKNET_ROUTER,
              amount: payload.collateral,
            });
            return { ok: true };
          },
          callback: async () => {
            await this.getWUSD(payload);
          },
        });
      } else {
        await this.getWUSD(payload);
      }
    },
    async getWUSD(payload) {
      const resultGasBuyWUSD = await getGasPrice(WQRouter, process.env.WORKNET_ROUTER, 'produceWUSD', [payload.collateralBN, payload.ratioBN, payload.currency]);
      const buyWUSDData = {
        gasPrice: resultGasBuyWUSD.gasPrice,
        gas: resultGasBuyWUSD.gas,
      };

      this.ShowModal({
        key: modals.transactionReceipt,
        title: this.$t('modals.takeWUSD'),
        fields: {
          from: { name: this.$t('modals.fromAddress'), value: getWalletAddress() },
          to: { name: this.$t('modals.toAddress'), value: process.env.WORKNET_ROUTER },
          amount: {
            name: this.$t('modals.amount'),
            value: payload.collateral,
            symbol: payload.currency,
          },
          fee: {
            name: this.$t('wallet.table.trxFee'),
            value: new BigNumber(resultGasBuyWUSD.gasPrice).multipliedBy(resultGasBuyWUSD.gas).shiftedBy(-18).toFixed(),
            symbol: TokenSymbols.WUSD,
          },
        },
        submitMethod: async () => await this.$store.dispatch('collateral/buyWUSD', { payload, buyWUSDData }),
        callback: async () => {
          this.ShowToast(this.$t('modals.successBuyWUSD'), this.$t('modals.success'));
        },
      });
    },
    calcCollateralPercent(value) {
      this.collateralPercent = this.CalcPercent(value, this.collateralPercent);
      this.calculateCollateral();
      this.ChangeCaretPosition(this.$refs.percentInput);
    },
  },
};
</script>

<style lang="scss" scoped>

.getWUSD {
  max-width: 490px !important;
  height: auto !important;
  padding: 0 !important;

  &__content {
    padding: 25px 28px 30px 28px;
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

  &__checkpoints {
    margin-bottom: 25px;

    &_label {
      margin-bottom: 10px;
    }
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
