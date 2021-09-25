<template>
  <ctm-modal-box
    class="swap"
    :title="$t('modals.swapTitle')"
  >
    <div class="swap__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
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
                v-model="amount"
                type="number"
                :placeholder="'0,05'"
                class="grid__input"
                rules="required|decimal"
                :name="$t('modals.amountField')"
              />
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
            :disabled="invalid"
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
      recipientAddress: '',
      userAddress: '',
      amount: '',
    };
  },
  computed: {
    ...mapGetters({
      account: 'web3/getAccount',
      options: 'modals/getOptions',
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
  },
  async mounted() {
    await this.fillAddress();
    await this.crosschainFlow();
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async fillAddress() {
      this.recipientAddress = await this.account.address;
      this.userAddress = await this.account.address;
    },
    async setSwapAddress() {
      await this.$store.dispatch('defi/setSwapAddress');
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
    async showSwapInfoModal() {
      this.ShowModal({
        key: modals.swapInfo,
        crosschain: `${this.fromToken} > ${this.toToken}`,
        chain: this.fromToken,
        amount: `${this.amount} WQT`,
        amountInt: this.amount,
        sender: this.cropTxt(this.userAddress),
        senderFull: this.userAddress,
        recepient: this.cropTxt(this.recipientAddress),
        recepientFull: this.recipientAddress,
        worknetFee: '0,5 WQT',
        binanceFee: '0,0009 BNB',
      });
    },
    showGiveDeposit() {
      this.ShowModal({
        key: modals.giveDeposit,
      });
    },
    cropTxt(str) {
      if (str.length > 40) str = `${str.slice(0, 10)}...${str.slice(-10)}`;
      return str;
    },
    showAddingCard() {
      this.ShowModal({
        key: modals.addingCard,
      });
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
