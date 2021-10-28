<template>
  <ctm-modal-box
    class="claim"
    :title="options.type === 1 ? $t('mining.stake') : 'Unstake'"
  >
    <div class="claim__content content">
      <validation-observer
        v-slot="{handleSubmit}"
      >
        <base-field
          id="amount"
          v-model="amount"
          class="content__field"
          type="number"
          :placeholder="3500"
          :label="$t('modals.amount')"
          :rules="`required|decimal|decimalPlaces:18${getInputRules()}`"
          :name="$t('modals.amount')"
        >
          <template
            v-slot:right-absolute
            class="content__max max"
          >
            <base-btn
              mode="max"
              class="max__button"
              @click="maxBalance()"
            >
              <span class="max__text">{{ $t('modals.maximum') }}</span>
            </base-btn>
          </template>
        </base-field>
        <div
          v-if="options.type === 1 && options.stakingType === 'WQT' && !options.alreadyStaked"
          class="content__days"
        >
          {{ $t('staking.stakeDays') }}
          <base-dd
            v-model="daysValue"
            class="content__dd"
            :placeholder="30"
            :items="stakeDays"
          />
        </div>
        <div class="content__container">
          <base-btn
            :mode="'outline'"
            :disabled="statusBusy"
            @click="hide()"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            :disabled="statusBusy"
            @click="handleSubmit(options.type === 1 ? staking : unstaking)"
          >
            {{ $t('meta.submit') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';

export default {
  name: 'CtmModalClaimRewards',
  data() {
    return {
      miningPoolId: localStorage.getItem('miningPoolId'),
      amount: '',
      balance: 10,
      currency: 'WUSD',
      daysValue: 0,
      stakeDays: [30, 60, 90],
    };
  },
  computed: {
    ...mapGetters({
      accountData: 'web3/getAccountData',
      options: 'modals/getOptions',
      statusBusy: 'web3/getStatusBusy',
      userBalance: 'web3/getUserBalance',
      userStake: 'web3/getUserStake',
      isConnected: 'web3/isConnected',
    }),
  },
  mounted() {
    this.balance = this.options.balance;
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    getInputRules() {
      const min = this.options.minStake ? `|min_value:${this.options.minStake}` : '|min_value:0.00001';
      const max = this.options.maxStake ? `|max_value:${(new BigNumber(this.options.maxStake).minus(this.options.staked)).toString()}` : '';
      return min + max;
    },
    maxBalance() {
      if (this.options.stakingType !== 'MINING') {
        const max = new BigNumber(this.options.maxStake).minus(this.options.staked).toString();
        this.amount = new BigNumber(this.options.balance).isGreaterThanOrEqualTo(max)
          ? max : this.options.balance;
      } else {
        this.amount = this.options.type === 1 ? this.userBalance : this.userStake;
      }
    },
    checkAmount() {
      if (this.options.stakingType !== 'MINING') {
        return +this.options.balance >= +this.amount;
      }
      const amount = this.options.type === 1 ? this.userBalance : this.userStake;
      return +amount >= +this.amount;
    },
    async staking() {
      this.SetLoader(true);
      await this.checkMetamaskStatus();
      if (this.checkAmount()) {
        const { decimals, stakingType, updateMethod } = this.options;
        this.hide();
        await this.$store.dispatch('web3/stake', {
          decimals,
          amount: this.amount,
          stakingType,
          duration: this.stakeDays[this.daysValue],
        });
        if (updateMethod) await updateMethod();
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
    async unstaking() {
      this.SetLoader(true);
      await this.checkMetamaskStatus();
      if (this.checkAmount()) {
        const { updateMethod } = this.options;
        this.hide();
        await this.$store.dispatch('web3/unstake', {
          decimals: this.accountData?.decimals?.stakeDecimal,
          amount: this.amount,
        });
        if (updateMethod) await updateMethod();
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
      if (!this.isConnected) {
        await this.$store.dispatch('web3/connect');
      }
    },
    async checkMetamaskStatus() {
      if (typeof window.ethereum === 'undefined') {
        localStorage.setItem('metamaskStatus', 'notInstalled');
        this.ShowModal({
          key: modals.status,
          img: '~assets/img/ui/cardHasBeenAdded.svg',
          title: 'Please install Metamask!',
          subtitle: 'Please click install...',
          button: 'Install',
          type: 'installMetamask',
        });
      } else {
        localStorage.setItem('metamaskStatus', 'installed');
        if (this.options.stakingType === 'MINING') {
          await this.$store.dispatch('web3/goToChain', { chain: this.miningPoolId });
        } else {
          await this.$store.dispatch('web3/goToChain', { chain: 'ETH' });
        }
        await this.connectToMetamask();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.max {
  &__button {
    margin-right: 10px !important;
    background-color: transparent !important;
  }
}
.claim {
  max-width: 487px!important;
  &__content {
    padding: 22px 28px 30px 28px!important;
  }
}
.content {
  &__subtitle {
    @include text-simple;
    font-weight: 400;
    font-size: 14px;
    color: $black500;
    &_blue {
      @extend .content__subtitle;
      color: $blue;
    }
  }
  &__container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
    margin-top: 25px;
  }
  &__dd {
    border-radius: 6px;
    border: 1px solid $black0;
  }
}
</style>
