<template>
  <ctm-modal-box
    class="transfer"
    :title="$tc('modals.titles.withdraw')"
  >
    <div class="transfer__content content">
      <div class="step-panel">
        <div
          class="step-panel__step"
          :class="[{'step-panel__step_active': step === 'wallet'}]"
          @click="step = 'wallet'"
        >
          {{ $t('wallet.walletAddress') }}
        </div>
        <div
          class="step-panel__step"
          :class="[{'step-panel__step_active': step === 'bank'}]"
          @click="step = 'bank'"
        >
          {{ $t('meta.bankCard') }}
        </div>
      </div>
      <validation-observer
        v-if="step === 'wallet'"
        ref="observer"
        v-slot="{handleSubmit}"
        tag="div"
      >
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
              {{ $t('modals.chooseToken') }}
            </span>
            <base-dd
              v-model="ddValue"
              data-selector="TOKEN"
              :items="tokenSymbolsDd"
              type="border"
              is-icon
            />
          </div>
          <div class="content__input input input__amount">
            <span class="input__title">
              {{ $t('modals.amount') }}
            </span>
            <base-field
              v-model="amount"
              type="number"
              class="input__field"
              data-selector="AMOUNT"
              :placeholder="$t('modals.amount')"
              :rules="`required|decimal|max_value:${maxAmount}|decimalPlaces:${tokenDecimals}|not_enough_funds:${tokenBalance}`"
              :name="$tc('modals.amountField')"
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
          <div class="content__txFee txFee">
            <div class="txFee__title">
              {{ $t('wallet.table.trxFee') }}:
            </div>
            <div
              v-if="!isCanSubmit"
              class="txFee__loader-wrapper"
            >
              <loader
                class="txFee__loader"
                is-mini-loader
              />
            </div>
            <div
              v-else
              class="txFee__amount"
            >
              {{ currentFee }} {{ nativeTokenSymbol }}
            </div>
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
            :disabled="!isCanSubmit"
            @click="handleSubmit(showWithdrawInfo)"
          >
            {{ $t('meta.btns.next') }}
          </base-btn>
        </div>
      </validation-observer>
      <template v-else>
        <bank-card />
      </template>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { TokenSymbols, WalletTokensData } from '~/utils/enums';
import { ERC20 } from '~/abi/index';
import BankCard from '~/components/CtmModal/CtmModalDeposit/BankCard';

export default {
  name: 'ModalWalletWithdraw',
  components: { BankCard },
  data() {
    return {
      recipient: '',
      amount: null,
      ddValue: 0,
      currentFee: 0,
      maxFeeForNativeToken: 0,
      isCanSubmit: false,
      timeoutId: null,

      step: 'wallet',
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
      return this.tokenSymbolsDd[0].title;
    },
    tokenDecimals() {
      return +this.balance[this.selectedToken].decimals;
    },
    tokenBalance() {
      return this.balance[this.selectedToken].fullBalance;
    },
    tokenSymbolsDd() {
      return WalletTokensData[this.selectedNetwork].tokenList;
    },
    maxAmount() {
      const {
        selectedToken, tokenBalance, maxFeeForNativeToken,
      } = this;
      const fullBalance = new BigNumber(tokenBalance);
      if (selectedToken === this.nativeTokenSymbol) {
        const balanceMinusFee = fullBalance.minus(maxFeeForNativeToken).isGreaterThan(0);
        return balanceMinusFee ? fullBalance.minus(maxFeeForNativeToken).toString() : 0;
      }
      return fullBalance.toString();
    },
  },
  watch: {
    ddValue(val) {
      this.$store.dispatch('wallet/setSelectedToken', this.tokenSymbolsDd[val].title);
      this.$refs.observer.reset();
      this.amount = null;
    },
    async amount() {
      if (!this.isConnected) return;
      this.isCanSubmit = false;
      this.currentFee = '...';
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(async () => {
        const {
          selectedToken, amount, userData, tokenDecimals, nativeTokenSymbol, maxAmount,
        } = this;

        if (amount === '' || amount === null || new BigNumber(maxAmount).isLessThan(amount)) {
          this.currentFee = 0;
          this.isCanSubmit = true;
          return;
        }

        // 0 token is always native token for current network!
        if (selectedToken === nativeTokenSymbol) {
          const nativeTokenFee = await this.$store.dispatch('wallet/getTransferFeeData', {
            recipient: userData.wallet.address,
            value: amount,
          });
          this.currentFee = nativeTokenFee.ok ? nativeTokenFee.result.fee : 0;
        } else {
          let contractAddress;
          this.tokenSymbolsDd.some((token, i) => {
            if (token.title === this.selectedToken) {
              contractAddress = token.tokenAddress;
              this.ddValue = i;
              return true;
            }
            return false;
          });

          const feeTokens = await this.$store.dispatch('wallet/getContractFeeData', {
            method: 'transfer',
            abi: ERC20,
            contractAddress,
            data: [contractAddress, new BigNumber(amount).shiftedBy(tokenDecimals).toString()],
          });
          this.currentFee = feeTokens.ok ? feeTokens.result.fee : 0;
        }
        this.isCanSubmit = true;
      }, 300);
    },
  },
  async mounted() {
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
    // Для просчета максимальной суммы транзакции от комиссии
    async updateMaxFee() {
      if (!this.isConnected) return;
      this.isCanSubmit = false;
      const {
        selectedToken, tokenDecimals, userData, balance, nativeTokenSymbol,
      } = this;

      // 0 token is always native token for current network!
      if (selectedToken === nativeTokenSymbol) {
        const nativeTokenFee = await this.$store.dispatch('wallet/getTransferFeeData', {
          recipient: userData.wallet.address,
          value: balance[nativeTokenSymbol].fullBalance,
        });
        if (nativeTokenFee.ok) this.maxFeeForNativeToken = nativeTokenFee.result.fee;
        else this.maxFeeForNativeToken = 0;
      } else {
        let contractAddress;
        this.tokenSymbolsDd.some((token, i) => {
          if (token.title === this.selectedToken) {
            contractAddress = token.tokenAddress;
            this.ddValue = i;
            return true;
          }
          return false;
        });

        const feeTokens = await this.$store.dispatch('wallet/getContractFeeData', {
          method: 'transfer',
          abi: ERC20,
          contractAddress,
          data: [contractAddress, new BigNumber(balance[selectedToken].fullBalance).shiftedBy(tokenDecimals).toString()],
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
  margin-top: 10px;
  &__amount {
    margin-top: 30px !important;
  }
  &__field {
    margin-top: 5px;
  }
}

.content {
  &__container {
    margin-top: 10px;
  }
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

  &__txFee {
    margin-bottom: 20px;
    position: relative;
    display: flex;
  }
}

.txFee {
  &__loader-wrapper {
    width: 37px;
    height: 37px;
    margin-left: 10px;
    position: relative;
  }

  &__loader {
    position: absolute;
    top: -20px !important;
  }

  &__amount {
    margin-left: 10px;
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

.step-panel {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  &__step {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    margin: 0 10px 0 0;
    cursor: pointer;
    &_active {
      color: $black800;
      border-bottom: 1px solid $blue;
      padding: 0 0 12px 0;
    }
  }
}
</style>
