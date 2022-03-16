<template>
  <ctm-modal-box
    class="swap"
    :title="$t('modals.swapTitle')"
  >
    <div class="swap__content content">
      <validation-observer
        v-slot="{handleSubmit}"
      >
        <div class="content__grid grid">
          <div class="grid__body">
            <div class="grid__field">
              <div class="grid__title">
                {{ $t('modals.coin') }}
              </div>
              <base-dd
                v-model="token"
                class="grid__drop"
                :data-selector="'Tokens'"
                :items="tokens"
                @input="changeToken()"
              />
            </div>
            <div class="grid__field">
              <div class="grid__title">
                {{ $t('modals.amount') }}
              </div>
              <base-field
                v-model.lazy="amount"
                type="number"
                :placeholder="'0,05'"
                :data-selector="'Amount'"
                class="grid__input"
                rules="required|decimal|decimalPlaces:18|min_value:0.00001"
                :name="$t('modals.amountField')"
              >
                <template
                  v-slot:right-absolute
                  class="content__max max"
                >
                  <base-btn
                    mode="max"
                    class="max__button"
                    selector="SET-MAX-VAL"
                    @click="setMaxValue()"
                  >
                    <span class="max__text">{{ $t('modals.maximum') }}</span>
                  </base-btn>
                </template>
              </base-field>
            </div>
          </div>
        </div>
        <div class="content__body body">
          <div>
            <div class="body__title">
              {{ $t('modals.recepientBinance') }}
            </div>
            <base-field
              v-model="recipientAddress"
              class="body__input"
              :data-selector="'Recipient-Address'"
              :disabled="true"
              placeholder="Enter binance address"
              :name="$t('modals.recepientAddressField')"
            />
          </div>
        </div>
        <div class="content__buttons buttons">
          <base-btn
            class="buttons__button"
            mode="outline"
            selector="CANCEL"
            @click="hide"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            selector="CREATE-SWAP"
            @click="handleSubmit(showSwapInfoModal)"
          >
            {{ $t('modals.createSwap') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { Chains } from '~/utils/enums';

export default {
  name: 'ModalSwap',
  data() {
    return {
      token: 0,
      fromToken: '',
      toToken: '',
      amount: '',
      addresses: {
        0: {
          id: 2,
          icon: require('~/assets/img/ui/ethereum.svg'),
          title: this.$t('crosschain.eth'),
          enum: Chains.ETHEREUM,
        },
        1: {
          id: 3,
          icon: require('~/assets/img/ui/bnb-logo.svg'),
          title: this.$t('crosschain.bsc'),
          enum: Chains.BINANCE,
        },
        2: {
          id: 1,
          icon: require('~/assets/img/ui/WQT.png'),
          title: this.$t('crosschain.worknet'),
          enum: Chains.WORKNET,
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      account: 'web3/getAccount',
      options: 'modals/getOptions',
      tokensData: 'web3/getCrosschainTokensData',
      tokens: 'web3/getPurseData',
      isConnected: 'web3/isConnected',
    }),
    tokens() {
      const tokens = ['WQT'];
      if ((this.options?.fromChain === 0 && this.options?.toChain === 2) || (this.options?.fromChain === 2 && this.options?.toChain === 0)) {
        tokens.push('ETH');
      } else if ((this.options?.fromChain === 1 && this.options?.toChain === 2) || (this.options?.fromChain === 2 && this.options?.toChain === 1)) {
        tokens.push('BNB');
      }
      return tokens;
    },
    crosschainFlow() {
      return {
        fromChain: this.addresses[this.options?.fromChain],
        toChain: this.addresses[this.options?.toChain],
      };
    },
    recipientAddress() {
      return this.account.address;
    },
  },
  // watch: {
  //   async isConnected() {
  //     await this.connectToMetamask();
  //   },
  // },
  async mounted() {
    const payload = {
      token: this.tokens[this.token],
      chainTo: this.crosschainFlow.toChain.id,
    };
    await this.$store.dispatch('web3/getCrosschainTokensData', payload);
  },
  methods: {
    async changeToken() {
      this.amount = 0;
      const payload = {
        token: this.tokens[this.token],
        chainTo: this.crosschainFlow.toChain.id,
      };
      await this.$store.dispatch('web3/getCrosschainTokensData', payload);
    },
    setMaxValue() {
      this.amount = this.tokensData.tokenAmount;
    },
    hide() {
      this.CloseModal();
    },
    checkAmount() {
      const maxAmount = this.tokensData.tokenAmount;
      return +maxAmount >= +this.amount;
    },
    async showSwapInfoModal() {
      this.SetLoader(true);
      if (this.checkAmount()) {
        this.amount = (this.amount.toString()).replace(/[,]/g, '.');
        this.ShowModal({
          key: modals.swapInfo,
          crosschain: `${this.crosschainFlow.fromChain.title} > ${this.crosschainFlow.toChain.title}`,
          chain: this.crosschainFlow.fromChain.enum,
          toChain: this.crosschainFlow.toChain.id,
          amount: `${this.amount} ${this.tokens[this.token]}`,
          amountInt: this.amount,
          recepient: this.CutTxn(this.recipientAddress),
          recepientFull: this.recipientAddress,
          worknetFee: `0,5 ${this.tokens[this.token]}`,
          binanceFee: '0,0009 BNB',
          tokenName: this.tokens[this.token],
        });
      } else {
        this.hide();
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('modals.transactionFail'),
          recipient: '',
          subtitle: this.$t('modals.incorrectAmount'),
        });
      }
      this.SetLoader(false);
    },
    async connectToMetamask() {
      console.log('connectToMetamask', this.isConnected);
      if (!this.isConnected) {
        await this.$store.dispatch('web3/connect', { chain: this.crosschainFlow.fromChain.enum });
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.swap {
  max-width: 700px !important;
  &__content {
    padding: 0 28px 30px 28px;
  }
}
.grid {
  &__body{
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: space-between;
    align-items: flex-end;
    margin: 20px 0 15px 0;
    grid-gap: 15px;
  }
  &__title{
    margin-bottom: 3px;
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
  }
  &__drop{
    border: 1px solid #F7F8FA;
    border-radius: 6px;
    margin-bottom: 23px;
  }
}
.max {
  &__button {
    background: transparent !important;
  }
}
.buttons {
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 10px));
  grid-gap: 20px;
  gap: 20px;
  margin-top: 25px;
}

.button{
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
  &__icon::before{
    font-size: 25px;
    color:$blue!important;
    margin-right: 12px;
  }
}
.body{
  &__title{
    margin-bottom: 3px;
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
  }
}
</style>
