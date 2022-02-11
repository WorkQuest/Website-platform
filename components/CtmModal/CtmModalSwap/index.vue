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
                :items="tokens"
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
              v-model="account.address"
              class="body__input"
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
            @click="hide"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
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

export default {
  name: 'ModalSwap',
  data() {
    return {
      token: 0,
      fromToken: '',
      toToken: '',
      amount: '',
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
      return [
        'WQT',
      ];
    },
    addresses() {
      return [
        {
          id: 0,
          icon: require('~/assets/img/ui/bnb-logo.svg'),
          title: this.$t('crosschain.bsc'),
        },
        {
          id: 1,
          icon: require('~/assets/img/ui/ethereum.svg'),
          title: this.$t('crosschain.eth'),
        },
      ];
    },
    recipientAddress() {
      return this.account.address;
    },
  },
  async mounted() {
    await this.connectToMetamask();
    await this.crosschainFlow();
  },
  methods: {
    setMaxValue() {
      this.amount = this.tokensData.tokenAmount;
    },
    hide() {
      this.CloseModal();
    },
    async crosschainFlow() {
      if (this.options.crosschainId === 0) {
        this.fromToken = this.addresses[0].title;
        this.toToken = this.addresses[1].title;
      } else if (this.options.crosschainId === 1) {
        this.fromToken = this.addresses[1].title;
        this.toToken = this.addresses[0].title;
      }
    },
    checkAmount() {
      const maxAmount = this.tokensData.tokenAmount;
      return +maxAmount >= +this.amount;
    },
    async showSwapInfoModal() {
      this.SetLoader(true);
      if (this.checkAmount()) {
        this.amount = this.amount.replace(/[,]/g, '.');
        this.ShowModal({
          key: modals.swapInfo,
          crosschain: `${this.fromToken} > ${this.toToken}`,
          chain: this.fromToken,
          amount: `${this.amount} WQT`,
          amountInt: this.amount,
          recepient: this.cropTxt(this.recipientAddress),
          recepientFull: this.recipientAddress,
          worknetFee: '0,5 WQT',
          binanceFee: '0,0009 BNB',
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
    connectToMetamask() {
      if (!this.isConnected) {
        this.$store.dispatch('web3/connect');
      }
    },
    cropTxt(str) {
      if (str.length > 40) str = `${str.slice(0, 10)}...${str.slice(-10)}`;
      return str;
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
