<template>
  <ctm-modal-box
    class="claim"
    :title="options.type === 1 ? $tc('modals.titles.stake') : $tc('modals.titles.unstake')"
  >
    <div class="claim__content content">
      <validation-observer
        v-slot="{handleSubmit, valid}"
      >
        <base-field
          id="amount"
          v-model="amount"
          class="content__field"
          type="number"
          data-selector="INPUT-AMOUNT"
          :placeholder="3500"
          :label="$tc('modals.amount')"
          :rules="`required|decimal|decimalPlaces:18${getInputRules()}`"
          :name="$tc('modals.amount')"
        >
          <template
            v-slot:right-absolute
            class="content__max max"
          >
            <base-btn
              mode="max"
              data-selector="MAX-BALANCE"
              class="max__button"
              @click="maxBalance()"
            >
              <span class="max__text">{{ $t('modals.maximum') }}</span>
            </base-btn>
          </template>
        </base-field>
        <div class="content__container">
          <base-btn
            mode="outline"
            data-selector="CANCEL"
            :disabled="statusBusy"
            @click="CloseModal"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            data-selector="SUBMIT"
            :disabled="!valid || !canSubmit"
            @click="handleSubmit(options.type === 1 ? staking : unstaking)"
          >
            {{ $t('meta.btns.submit') }}
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
import { StakingTypes } from '~/utils/enums';
import { getWalletAddress } from '~/utils/wallet';

export default {
  name: 'CtmModalClaimRewards',
  data() {
    return {
      miningPoolId: localStorage.getItem('miningPoolId'),
      amount: '',
      balance: 10,
      currency: 'WUSD',
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
      stakingPoolsData: 'wallet/getStakingPoolsData',
      stakingUserData: 'wallet/getStakingUserData',
    }),
    canSubmit() {
      const { stakingType, isConnected, statusBusy } = this;
      return !statusBusy || !(stakingType === StakingTypes.WUSD && stakingType !== StakingTypes.WQT && !isConnected);
    },
    stakingType() {
      return this.options.stakingType;
    },
    userInfo() {
      return this.stakingUserData[this.stakingType];
    },
    poolData() {
      return this.stakingPoolsData[this.stakingType];
    },
    poolAddress() {
      return this.poolData?.poolAddress ? this.poolData.poolAddress.toLowerCase() : '';
    },
  },
  mounted() { this.balance = this.options.balance; },
  methods: {
    getInputRules() {
      const {
        staked, minStake, maxStake, type,
      } = this.options;
      const min = `|min_value:${minStake || '0.00001'}`;
      let max = '';
      if (type === 1) max = maxStake ? `|max_value:${(new BigNumber(maxStake).minus(staked)).toString()}` : '';
      else max = staked ? `|max_value:${staked}` : '';
      return min + max;
    },
    maxBalance() {
      if (this.stakingType !== StakingTypes.MINING) {
        if (this.options.type === 1) {
          const max = new BigNumber(this.options.maxStake).minus(this.options.staked).toString();
          this.amount = new BigNumber(this.options.balance).isGreaterThanOrEqualTo(max)
            ? max : this.options.balance;
        } else this.amount = this.options.staked;
      } else this.amount = this.options.type === 1 ? this.userBalance : this.userStake;
    },
    checkAmount() {
      if (this.stakingType !== StakingTypes.MINING) {
        return this.options.type === 1
          ? new BigNumber(this.options.balance).isGreaterThanOrEqualTo(this.amount)
          : new BigNumber(this.amount).isLessThanOrEqualTo(this.options.staked);
      }
      const amount = this.options.type === 1
        ? this.userBalance
        : this.userStake;
      return new BigNumber(amount).isGreaterThanOrEqualTo(this.amount);
    },
    async staking() {
      this.SetLoader(true);
      await this.checkMetamaskStatus();
      if (this.checkAmount()) {
        const { decimals, stakingType, updateMethod } = this.options;
        this.CloseModal();
        await this.$store.dispatch('web3/stake', {
          decimals,
          amount: this.amount,
          stakingType,
        });
        if (updateMethod) await updateMethod();
      } else {
        this.CloseModal();
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
      const { options: { updateMethod, stakingType, decimals }, poolAddress, amount } = this;
      if (stakingType !== StakingTypes.WQT && stakingType !== StakingTypes.WUSD) await this.checkMetamaskStatus();
      if (this.checkAmount()) {
        this.CloseModal();
        if (stakingType === StakingTypes.WQT || stakingType === StakingTypes.WUSD) {
          const [txFee] = await Promise.all([
            this.$store.dispatch('wallet/getStakingUnstakeFeeData', {
              stakingType,
              poolAddress,
              amount,
            }),
            this.$store.dispatch('wallet/getBalance'),
          ]);
          this.SetLoader(false);
          if (!txFee.ok) {
            this.ShowToast(this.$t('modals.failed'), this.$t('meta.btns.unstake'));
            return;
          }
          this.ShowModal({
            key: modals.transactionReceipt,
            title: this.$t('meta.btns.unstake'),
            fields: {
              from: { name: this.$t('meta.fromBig'), value: getWalletAddress() },
              to: { name: this.$t('meta.toBig'), value: poolAddress },
              unstakeAmount: { name: this.$t('modals.amount'), value: amount },
              fee: { name: this.$t('wallet.table.trxFee'), value: txFee.result.fee, symbol: stakingType },
            },
            submitMethod: async () => {
              const res = await this.$store.dispatch('wallet/stakingUnstake', { amount, stakingType, poolAddress });
              if (!res.ok && res.msg.includes('insufficient funds: insufficient funds')) {
                this.ShowToast(this.$t('errors.transaction.notEnoughFunds'), this.$t('meta.btns.unstake'));
              }
              return res;
            },
            callback: async () => {
              await Promise.all([
                this.$store.dispatch('wallet/getBalance'),
                this.$store.dispatch('wallet/getStakingPoolsData', stakingType),
                this.$store.dispatch('wallet/getStakingUserInfo', stakingType),
              ]);
            },
          });
          return;
        }
        // for mining
        await this.$store.dispatch('web3/unstake', {
          decimals,
          amount: this.amount,
          stakingType,
        });
        if (updateMethod) await updateMethod();
      } else {
        this.CloseModal();
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
      if (!this.isConnected) await this.$store.dispatch('web3/connect');
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
          callback: () => window.open('https://metamask.io/download.html'),
        });
      } else {
        localStorage.setItem('metamaskStatus', 'installed');
        if (this.stakingType === StakingTypes.MINING) {
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
}
</style>
