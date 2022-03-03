<template>
  <div class="blockchain">
    <div class="blockchain__banner banner">
      <div class="banner__background">
        <img
          class="banner__img"
          src="/img/app/banner_chain.svg"
          alt="Logo"
        >
      </div>
      <div class="banner__left">
        <div class="banner__title">
          Testnet launched successfully
        </div>
        <div class="banner__subtitle">
          Fill the fields and check it yourself
        </div>
      </div>
      <div class="banner__right">
        <div class="banner__card card">
          <validation-observer
            v-slot="{handleSubmit}"
            class="card__observer"
            tag="div"
          >
            <div class="card__input input">
              <base-field
                id="amount"
                v-model="amount"
                :disabled="!isConnected"
                class="content__field"
                type="number"
                placeholder="3500"
                rules="required|decimal|decimalPlaces:18|min_value:0.001"
                :name="$t('modals.amount')"
              >
                <template
                  v-slot:right-absolute
                  class="content__max max"
                >
                  <base-btn
                    mode="max"
                    class="max__button"
                    :class="{'max__button_hide' : !isConnected}"
                    @click="maxBalance()"
                  >
                    <span class="max__text">{{ $t('modals.maximum') }}</span>
                  </base-btn>
                </template>
              </base-field>
            </div>
            <div class="card__input input">
              <base-field
                v-model="address"
                :disabled="!isConnected"
                class="input__field"
                :placeholder="'Address'"
                rules="required"
                :name="$t('modals.cardHolderField')"
              />
            </div>
            <base-btn
              v-if="!isConnected"
              mode="'outline'"
              class="card__button"
              @click="connectToMetamask"
            >
              {{ $t('mining.connectWallet') }}
            </base-btn>
            <base-btn
              v-else
              mode="'outline'"
              class="card__button"
              @click="handleSubmit(send)"
            >
              {{ $t('meta.btns.send') }}
            </base-btn>
          </validation-observer>
        </div>
      </div>
    </div>
    <div class="blockchain__description description">
      <div class="description__title">
        How can i test it?
      </div>
      <ul class="description__content">
        <li>
          Add the WorkQuest Dev network to Metamask:
          <p>Network Name: <b>WorkQuest DEV</b></p>
          <p>RPC URL: <b>https://dev-node-nyc3.workquest.co</b></p>
          <p>Chain ID: <b>20211224</b></p>
          <p>Currency Symbol: <b>WUSD</b></p>
        </li>
        <li>Fill in the form to receive test $WUSD tokens.</li>
        <li>Connect your wallet and conduct a transaction on this page.</li>
        <li>Sending transactions directly from Metamask is available.</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { error, showToast } from '~/utils/web3';

export default {
  name: 'DemoBlockchain',
  layout: 'guest',
  data() {
    return {
      amount: null,
      address: '',
      maxAmount: 0,
    };
  },
  computed: {
    ...mapGetters({
      isConnected: 'web3/isConnected',
      account: 'web3/getAccount',
    }),
  },
  methods: {
    async connectToMetamask() {
      this.SetLoader(true);
      if (await this.$store.dispatch('web3/checkIsMobileMetamaskNeed')) {
        this.ShowModal({
          key: modals.status,
          title: 'Please install Metamask!',
          subtitle: 'Please open site from Metamask app',
        });
        this.SetLoader(false);
        return;
      }
      if (!this.isConnected) {
        await this.$store.dispatch('web3/goToChain', { chain: 'WUSD' });
        await this.$store.dispatch('web3/connectToMetaMask');
        this.maxAmount = Number(await this.$store.dispatch('web3/showBalanceOnDemo'));
      }
      this.SetLoader(false);
    },
    async send() {
      this.SetLoader(true);
      if (+this.amount > +this.maxAmount) {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('modals.transactionFail'),
          recipient: '',
          subtitle: this.$t('modals.incorrectAmount'),
        });
        this.amount = 0;
        this.SetLoader(false);
        return;
      }
      const result = await this.$store.dispatch('web3/sendTransaction', {
        address: this.address,
        amount: this.amount - 0.001,
        balance: this.maxAmount,
      });
      if (result.status) {
        this.ShowModal({
          key: modals.transactionSend,
        });
      }
      this.SetLoader(false);
    },
    async maxBalance() {
      this.maxAmount = Number(await this.$store.dispatch('web3/showBalanceOnDemo'));
      this.maxAmount = +this.maxAmount.toFixed(3);
      this.amount = this.maxAmount;
    },
  },
};
</script>

<style lang="scss" scoped>
  .blockchain {
    display: flex;
    flex-direction: column;
    align-items: center;
    &__banner {
      width: 1170px;
      height: 290px;
      margin-top: 20px;
      display: flex;
      position: relative;
      align-items: center;
      justify-content: space-between;
    }
    &__description {
      width: 1170px;
      margin-top: 20px;
    }
  }
  .banner {
    &__background {
      display: flex;
      justify-content: flex-end;
      z-index: 1;
      position: absolute;
      width: 100%;
      background: linear-gradient(135deg, #0083C7 0%, #00AA5B 100%);
      border-radius: 8px;
    }
    &__img {
      mix-blend-mode: lighten;
      opacity: 0.7;
      border-radius: 8px;
    }
    &__left {
      z-index: 2;
      padding-left: 60px;
    }
    &__right {
      z-index: 2;
      padding: 20px;
    }
    &__card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 30px;
      width: 423px;
      height: 245px;

      background: #FFFFFF;

      box-shadow: 0px 2px 10px rgba(56, 71, 79, 0.1);
      border-radius: 8px;
    }
    &__title, &__subtitle {
      font-style: normal;
      line-height: 130%;
      color: #FFFFFF;
    }
    &__title {
      font-weight: bold;
      font-size: 40px;
    }
    &__subtitle {
      font-weight: 500;
      font-size: 18px;
    }
  }
  .card {
    &__observer, &__input {
      width: 100%;
    }
  }
  .description {
    &__title {
      font-style: normal;
      font-weight: 600;
      font-size: 28px;
      line-height: 130%;
      color: #1D2127;
    }
    &__content {
      margin-top: 20px;
      list-style: disc;
      color: #4C5767;
      padding-left: 15px;
      font-size: 18px;
    }
  }
  .max__button {
    &_hide {
      display: none;
    }
  }
  @include _1199 {
    .blockchain {
      padding: 0 20px;
      &__banner {
        width: 100%;
      }
      &__description {
        width: 100%;
      }
    }
  }
  @include _991 {
    .banner {
      &__left {
        padding-left: 30px;
      }
      &__card {
        width: 323px;
      }
      &__background {
        height: 300px;
      }
    }
  }
  @include _575 {
    .blockchain {
      &__banner {
        justify-content: center;
      }
    }
    .banner {
      &__left {
        display: none;
      }
      &__background {
        height: 300px;
      }
    }
  }
  @include _380 {
    .banner {
      &__right {
        padding: 0;
      }
    }
  }
  @include _350 {
    .banner {
      &__card {
        width: 250px;
        height: 230px;
        padding: 20px;
      }
    }
  }
</style>
