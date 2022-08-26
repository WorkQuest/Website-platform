<template>
  <ctm-modal-box
    class="collateral"
    :title="modalTitle"
  >
    <validation-observer
      ref="validation-collateral"
      v-slot="{ handleSubmit, validated, invalid }"
      class="collateral__content content"
      tag="div"
    >
      <template v-if="options.mode === CollateralMethods.claimExtraDebt">
        <div class="content__header">
          {{ $t('wallet.collateral.generationSubTitle') }}
        </div>
        <div class="content__header">
          {{ $t('wallet.collateral.tokenQuantity') }}
        </div>
        <div class="content__label">
          {{ options.symbol }}
        </div>
        <base-field
          data-selector="COLLATERAL-SYMBOL"
          disabled
          :value="options.lockedAmount"
        />
        <div class="content__label">
          {{ $t('wallet.collateral.availableAmount') }}
        </div>
        <base-field
          data-selector="WUSD"
          placeholder="10"
          disabled
          :value="options.availableToClaim"
        />
      </template>
      <template v-else-if="options.mode === CollateralMethods.removeCollateral">
        <div class="content__header">
          {{ $t('wallet.collateral.tokenQuantity') }}
        </div>
        <div class="content__label">
          {{ options.symbol }}
        </div>
        <base-field
          data-selector="COLLATERAL-SYMBOL"
          disabled
          :value="options.lockedAmount"
        />
        <div class="content__label">
          {{ $t('wallet.collateral.needToRevert') }}
        </div>
        <base-field
          data-selector="WUSD"
          placeholder="10"
          disabled
          vid="remove"
          :value="options.amountToRemoveCollateral"
          :rules="`have_funds:${balance[TokenSymbols.WUSD].fullBalance}, ${options.amountToRemoveCollateral}`"
        />
      </template>
      <template v-else>
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
                :value="item.name"
              >
              <label
                class="checkpoints__name"
                :for="item.name"
              >
                {{ item.name }}
              </label>
            </div>
          </div>
          <base-field
            data-selector="DEPOSIT"
            placeholder="10"
            disabled
            :vid="`deposit-${selCurrencyID}`"
            :value="availableToDeposit"
            :rules="`have_funds:${balance[selCurrencyID].fullBalance}, ${availableToDeposit}`"
          />
        </div>
      </template>
      <base-btn
        class="content__actions"
        :disabled="validated && invalid"
        @click="handleSubmit(onSubmit)"
      >
        {{ submitText }}
      </base-btn>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import { TokenMap, TokenSymbols } from '~/utils/enums';
import { ERC20 } from '~/abi';
import { CollateralMethods } from '~/utils/сonstants/auction';

export default {
  name: 'CollateralTransaction',
  data() {
    return {
      TokenSymbols,
      CollateralMethods,
      selCurrencyID: TokenSymbols.WUSD,
      currentDeposit: null,
      selectedMethod: null,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      balance: 'wallet/getBalanceData',
      userWalletAddress: 'user/getUserWalletAddress',
    }),
    checkpoints() {
      return [
        { name: TokenSymbols.WUSD },
        { name: TokenSymbols[this.options.symbol] },
      ];
    },
    modalTitle() {
      return {
        [CollateralMethods.claimExtraDebt]: this.$t('meta.btns.generate'),
        [CollateralMethods.disposeDebt]: this.$t('meta.deposit'),
        [CollateralMethods.addCollateral]: this.$t('meta.deposit'),
        [CollateralMethods.removeCollateral]: this.$t('wallet.collateral.removeCollateral'),
      }[this.options.mode];
    },
    submitText() {
      return {
        [CollateralMethods.claimExtraDebt]: this.$t('meta.btns.generate'),
        [CollateralMethods.disposeDebt]: this.$t('meta.deposit'),
        [CollateralMethods.addCollateral]: this.$t('meta.deposit'),
        [CollateralMethods.removeCollateral]: this.$t('meta.btns.remove'),
      }[this.options.mode];
    },
    availableToDeposit() {
      const { availableToDepositWUSD, availableToDepositCollateral } = this.options;
      const isWUSD = this.selCurrencyID === TokenSymbols.WUSD;
      return isWUSD ? availableToDepositWUSD : availableToDepositCollateral;
    },
  },
  watch: {
    selCurrencyID() {
      if (['disposeDebt', 'addCollateral'].includes(this.options.mode)) {
        this.selectedMethod = this.selCurrencyID === TokenSymbols.WUSD
          ? CollateralMethods.disposeDebt
          : CollateralMethods.addCollateral;
        this.$refs['validation-collateral'].validate();
      }
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.selectedMethod = this.options.mode;
    this.selCurrencyID = this.options.symbol;
    await Promise.all([
      this.$store.dispatch('wallet/getBalance'),
      this.$store.dispatch('wallet/fetchWalletData', {
        method: 'balanceOf',
        address: this.userWalletAddress,
        abi: ERC20,
        token: TokenMap[TokenSymbols.WUSD],
        symbol: TokenSymbols.WUSD,
      }),
      this.$store.dispatch('wallet/fetchWalletData', {
        method: 'balanceOf',
        address: this.userWalletAddress,
        abi: ERC20,
        token: TokenMap[this.selCurrencyID],
        symbol: this.selCurrencyID,
      }),
    ]);
    this.$refs['validation-collateral'].validate();
    this.SetLoader(false);
  },
  methods: {
    onSubmit() {
      const { submit } = this.options;
      this.CloseModal();
      submit(this.selectedMethod);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 20px 28px 30px;
  &__header {
    margin-bottom: 25px;
  }
  &__label {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    margin-bottom: 10px;
  }
  &__actions {
    display: flex;
    max-width: 250px;
    margin: 0 auto;
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
    grid-template-rows: repeat(2,1fr);
    text-align: left;
    justify-content: flex-start;
    gap: 13px;
    margin-bottom: 25px;
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
    border: 1px solid $blue;
    cursor: pointer;
  }
}
</style>
