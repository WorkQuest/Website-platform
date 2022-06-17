<template>
  <ctm-modal-box
    class="transfer"
    :title="$tc('modals.titles.transfer')"
  >
    <div class="transfer__content content">
      <validation-observer v-slot="{handleSubmit, invalid}">
        <div class="content__container">
          <div class="content__input input">
            <span class="input__title">
              {{ $t('modals.recipientAddress') }}
            </span>
            <base-field
              v-model="recipient"
              class="input__field"
              data-selector="ADDRESS-RECIPIENT"
              :placeholder="$t('meta.addressBig')"
              :rules="`required|${checkFormatAddress(recipient)}`"
              :name="$tc('meta.addressSmall')"
            />
          </div>
          <div class="content__input input">
            <span class="input__title">
              {{ $t('modals.selectToken') }}
            </span>
            <base-dd
              v-model="ddValue"
              data-selector="TOKEN"
              :items="tokenSymbolsDd"
            />
          </div>
          <div class="content__input input">
            <span class="input__title">
              {{ $t('modals.amount') }}
            </span>
            <base-field
              v-model="amount"
              class="input__field"
              data-selector="AMOUNT"
              :placeholder="$t('modals.amount')"
              :rules="`required|decimal|is_not:0|max_value:${maxAmount}|decimalPlaces:${tokenDecimals}`"
              :name="$tc('modals.amountField')"
              @input="replaceDot"
            >
              <template
                v-slot:right-absolute
                class="content__max max"
              >
                <base-btn
                  mode="max"
                  class="max__button"
                  data-selector="MAX"
                  @click="maxBalance"
                >
                  <span class="max__text">
                    {{ $t('modals.maximum') }}
                  </span>
                </base-btn>
              </template>
            </base-field>
          </div>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            mode="outline"
            data-selector="CANCEL"
            class="buttons__action"
            @click="CloseModal"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__action"
            data-selector="SEND"
            :disabled="invalid||!isCanSubmit"
            @click="handleSubmit(showWithdrawInfo)"
          >
            {{ $t('meta.btns.send') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { TokenMap, TokenSymbols, WalletTokensData } from '~/utils/enums';
import { ERC20 } from '~/abi/index';

export default {
  name: 'ModalTakeTransfer',
  data() {
    return {
      recipient: '',
      amount: 0,
      ddValue: 0,
      maxFeeForNativeToken: 0,
      isCanSubmit: false,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isLoading: 'main/getIsLoading',
      balance: 'wallet/getBalanceData',
      selectedToken: 'wallet/getSelectedToken',
      userData: 'user/getUserData',
      isConnected: 'wallet/getIsWalletConnected',
      frozenBalance: 'wallet/getFrozenBalance',

      selectedNetwork: 'wallet/getSelectedNetwork',
    }),
    nativeTokenSymbol() {
      return WalletTokensData[this.selectedNetwork].tokenList[0];
    },
    tokenDecimals() {
      return this.balance[this.selectedToken].decimals;
    },
    tokenSymbolsDd() {
      return WalletTokensData[this.selectedNetwork].tokenList;
    },
    maxAmount() {
      const {
        selectedToken, balance, maxFeeForNativeToken,
      } = this;
      const fullBalance = new BigNumber(balance[selectedToken].fullBalance);
      if (selectedToken === TokenSymbols.WQT) return fullBalance.minus(maxFeeForNativeToken).toString();
      return fullBalance.toString();
    },
  },
  watch: {
    ddValue(val) {
      this.$store.dispatch('wallet/setSelectedToken', TokenSymbols[this.tokenSymbolsDd[val]]);
      this.amount = 0;
    },
  },
  async mounted() {
    const i = this.tokenSymbolsDd.indexOf(this.selectedToken);
    this.ddValue = i >= 0 && i < this.tokenSymbolsDd.length ? i : 1;
    await this.updateMaxFee();
  },
  methods: {
    checkFormatAddress(address) {
      if (address.startsWith('wq')) return 'max:41|min:41|addressBech32';
      return 'address';
    },
    async showWithdrawInfo() {
      const { submit } = this.options;
      const { recipient, amount, selectedToken } = this;
      submit({ recipient, amount, selectedToken });
    },
    replaceDot() {
      this.amount = this.amount.replace(/,/g, '.');
    },
    // Для просчета максимальной суммы транзакции от комиссии
    async updateMaxFee() {
      if (!this.isConnected) return;
      this.isCanSubmit = false;
      const {
        selectedToken, amount, userData, balance, nativeTokenSymbol,
      } = this;

      // 0 token is always native token for current network!
      if (nativeTokenSymbol === selectedToken) {
        const nativeTokenFee = await this.$store.dispatch('wallet/getTransferFeeData', {
          recipient: userData.wallet.address,
          value: balance[nativeTokenSymbol].fullBalance,
        });
        if (nativeTokenFee.ok) this.maxFeeForNativeToken = nativeTokenFee.result.fee;
        else this.maxFeeForNativeToken = 0;
      } else {
        const contractAddress = WalletTokensData[this.selectedNetwork].tokenAddresses[this.tokenSymbolsDd.indexOf(selectedToken) - 1];
        const feeTokens = await this.$store.dispatch('wallet/getContractFeeData', {
          method: 'transfer',
          abi: ERC20,
          contractAddress,
          data: [contractAddress, amount],
        });
        if (feeTokens.ok) this.maxFeeForNativeToken = feeTokens.result.fee;
        else this.maxFeeForNativeToken = 0;
      }
      this.isCanSubmit = true;
    },
    maxBalance() {
      this.amount = this.maxAmount;
    },
  },
};
</script>

<style lang="scss" scoped>

.transfer {
  max-width: 500px !important;
  padding: 0 !important;

  &__content {
    padding: 20px 28px 30px 28px !important;
  }
}

.buttons {
  display: flex;
  justify-content: space-between;

  &__action {
    width: 212px !important;

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}

.input {
  &__field {
    margin-top: 5px;
  }
}

.content {
  &__step {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  &__panel {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    margin: 0 20px 0 0;
    cursor: pointer;

    &_active {
      color: $black800;
      border-bottom: 2px solid $blue;
      padding: 0 0 12px 0;
    }
  }

  &__card {
    margin: 40px auto;
  }

  &__text {
    font-size: 16px;
    line-height: 130%;
    color: #D8DFE3;
    text-align: center;
  }
}

.grid {
  &__title {
    margin: 15px 5px 0 0;
  }
}

.max {
  &__button {
    margin-right: 10px !important;
    background-color: transparent !important;
  }
}
</style>
