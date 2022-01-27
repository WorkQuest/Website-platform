<template>
  <ctm-modal-box
    class="stake"
    :title="$t('mining.stake')"
  >
    <div class="stake__content content">
      <validation-observer v-slot="{handleSubmit, valid}">
        <base-field
          v-model="amount"
          :placeholder="1000"
          class="content__field"
          type="number"
          :label="$t('modals.amount')"
          :name="$t('modals.amount')"
          :rules="`required|decimal|decimalPlaces:18|is_not:0|max_value:${stakeAmountLimit}`"
        >
          <template v-slot:right-absolute>
            <base-btn
              mode="max"
              class="content__max-button"
              @click="maxAmount()"
            >
              <span class="max__text">{{ $t('modals.maximum') }}</span>
            </base-btn>
          </template>
        </base-field>
        <div v-if="!isStakingStarted">
          {{ $t('staking.stakeDays') }}
          <base-dd
            v-model="daysValue"
            class="content__days-dd"
            :placeholder="30"
            :items="stakeDays"
          />
        </div>
        <div class="content__actions">
          <base-btn
            :mode="'outline'"
            @click="hide()"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            :disabled="!valid"
            @click="handleSubmit(onSubmit)"
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
import { WQStaking, WQStakingNative, ERC20 } from '~/abi/abi';
import { StakingTypes, TokenSymbols } from '~/utils/enums';
import { getWalletAddress } from '~/utils/wallet';
import modals from '~/store/modals/modals';
import { error, success } from '~/utils/web3';

export default {
  name: 'CtmModalStake',
  data() {
    return {
      amount: '',
      daysValue: 0,
      stakeDays: [30, 60, 90],
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      balanceData: 'wallet/getBalanceData',
      stakingPoolsData: 'wallet/getStakingPoolsData',
      stakingUserData: 'wallet/getStakingUserData',
    }),
    isStakingStarted() {
      return this.userInfo.isStakingStarted;
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
    stakeAmountLimit() {
      const balance = this.balanceData[this.stakingType].fullBalance;
      const max = this.poolData.fullMaxStake;
      if (!this.isStakingStarted) {
        return new BigNumber(balance).isLessThan(max) ? balance : max;
      }
      const possible = new BigNumber(max).minus(this.userInfo.fullStaked).toString();
      if (new BigNumber(possible).isGreaterThan(balance)) {
        return balance;
      }
      return possible;
    },
  },
  async beforeMount() {
    await this.updateBalances();
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    maxAmount() {
      this.amount = this.stakeAmountLimit;
    },
    async updateBalances() {
      await Promise.all([
        this.$store.dispatch('wallet/getBalance'),
        this.$store.dispatch('wallet/getBalanceWQT', getWalletAddress()),
      ]);
    },
    async onSubmit() {
      const { stakeTokenAddress, poolAddress, fullMaxStake } = this.poolData;
      const { stakingType, amount, isStakingStarted } = this;
      const isNative = stakingType === StakingTypes.WUSD;
      const days = this.stakeDays[this.daysValue];

      this.hide();
      if (!isNative) { // Staking WQT
        this.SetLoader(true);
        const [allowance] = await Promise.all([
          this.$store.dispatch('wallet/getAllowance', {
            tokenAddress: stakeTokenAddress,
            spenderAddress: poolAddress,
          }),
          this.updateBalances(),
        ]);
        if (allowance === false) {
          await this.$store.dispatch('main/showToast', { text: 'get allowance error' });
          this.SetLoader(false);
          return;
        }
        if (new BigNumber(allowance).isLessThan(amount)) {
          const txFee = await this.$store.dispatch('wallet/getContractFeeData', {
            _abi: ERC20,
            method: 'approve',
            contractAddress: stakeTokenAddress,
            data: [poolAddress, new BigNumber(fullMaxStake).shiftedBy(18).toString()],
          });
          if (!txFee.ok) {
            await this.$store.dispatch('main/showToast', {
              text: txFee.message,
            });
            this.SetLoader(false);
            this.CloseModal();
            return;
          }
          this.SetLoader(false);
          this.ShowModal({
            key: modals.transactionReceipt,
            title: this.$t('mining.approve'),
            fields: {
              from: { name: this.$t('modals.fromAddress'), value: getWalletAddress() },
              to: { name: this.$t('modals.toAddress'), value: poolAddress },
              fee: { name: this.$t('wallet.table.trxFee'), value: txFee.result.fee, symbol: TokenSymbols.WUSD },
            },
            isShowSuccess: false,
            submitMethod: async () => {
              const successApprove = await this.$store.dispatch('wallet/approve', {
                tokenAddress: stakeTokenAddress,
                spenderAddress: poolAddress,
                amount: fullMaxStake,
              });
              if (!successApprove) {
                await this.$store.dispatch('main/showToast', { title: this.$t('mining.approve'), text: this.$t('modals.failed') });
                this.SetLoader(false);
                return error();
              }
              await this.$store.dispatch('main/showToast', { title: this.$t('mining.approve'), text: this.$t('modals.success') });
              return success();
            },
            callback: async () => await this.stake(stakeTokenAddress, poolAddress, amount, stakingType, days, isStakingStarted),
          });
        } else {
          await this.stake(stakeTokenAddress, poolAddress, amount, stakingType, days, isStakingStarted);
        }
        return;
      }
      await this.stake(stakeTokenAddress, poolAddress, amount, stakingType);
    },
    async stake(stakeTokenAddress, poolAddress, amount, stakingType, days, isStakingStarted) {
      this.SetLoader(true);
      const txFee = await this.getStakeFeeForAmount(amount, stakingType, poolAddress, days);
      if (!txFee.ok) {
        await this.$store.dispatch('main/showToast', { title: this.$t('staking.stake'), text: this.$t('modals.failed') });
        this.SetLoader(false);
        return;
      }
      this.SetLoader(false);
      this.ShowModal({
        key: modals.transactionReceipt,
        title: `${this.$t('staking.stake')} ${stakingType}`,
        fields: {
          from: { name: this.$t('modals.fromAddress'), value: getWalletAddress() },
          to: { name: this.$t('modals.toAddress'), value: poolAddress },
          days: days && !isStakingStarted ? { name: this.$t('staking.stakeDays'), value: days } : null,
          amount: { name: this.$t('modals.amount'), value: amount, symbol: TokenSymbols.WQT },
          fee: { name: this.$t('wallet.table.trxFee'), value: txFee.result.fee, symbol: TokenSymbols.WUSD },
        },
        submitMethod: async () => {
          const res = await this.$store.dispatch('wallet/stake', {
            stakingType, amount, poolAddress, duration: days,
          });
          if (!res.ok) {
            await this.$store.dispatch('main/showToast', { title: this.$t('staking.stake'), text: this.$t('modals.failed') });
          }
          return res;
        },
        callback: async () => {
          await Promise.all([
            this.$store.dispatch('wallet/getStakingPoolsData', stakingType),
            this.$store.dispatch('wallet/getStakingUserInfo', stakingType),
          ]);
        },
      });
    },
    async getStakeFeeForAmount(amount, stakingType, poolAddress, days) {
      amount = new BigNumber(amount).shiftedBy(18).toString();
      const isNative = stakingType === StakingTypes.WUSD;
      return await this.$store.dispatch('wallet/getContractFeeData', {
        _abi: isNative ? WQStakingNative : WQStaking,
        contractAddress: poolAddress,
        method: 'stake',
        amount: isNative ? amount : null,
        data: isNative ? null : [amount, days.toString()],
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.stake {
  max-width: 487px!important;
  &__content {
    padding: 22px 28px 30px 28px!important;
  }
}
.content {
  &__field {}
  &__days-dd {
    border-radius: 6px;
    border: 1px solid $black0;
  }
  &__max-button {
    margin-right: 10px !important;
    background-color: transparent !important;
  }
  &__actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
    margin-top: 25px;
 }
}
</style>
