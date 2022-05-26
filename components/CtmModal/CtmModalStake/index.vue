<template>
  <ctm-modal-box
    class="stake"
    :title="$tc('modals.titles.stake')"
  >
    <validation-observer
      v-slot="{handleSubmit, valid}"
      ref="input"
      tag="div"
      class="stake__content content"
    >
      <base-field
        v-model="amount"
        validation-mode="aggressive"
        placeholder="1000"
        data-selector="AMOUNT"
        class="content__field"
        type="number"
        :label="$tc('modals.amount')"
        :name="$tc('modals.amount')"
        :rules="`required|decimal|decimalPlaces:18|is_not:0|max_value:${stakeAmountLimit}|min_value:${minStakeAmount}`"
      >
        <template v-slot:right-absolute>
          <base-btn
            mode="max"
            data-selector="MAX"
            class="content__max-button"
            @click="maxAmount()"
          >
            <span class="max__text">{{ $t('modals.maximum') }}</span>
          </base-btn>
        </template>
      </base-field>
      <div
        v-if="!isStakingStarted"
        class="content__field"
      >
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
          mode="outline"
          data-selector="CANCEL"
          @click="CloseModal"
        >
          {{ $t('meta.btns.cancel') }}
        </base-btn>
        <base-btn
          :disabled="!valid || !canSubmit"
          data-selector="SUBMIT"
          @click="handleSubmit(onSubmit)"
        >
          {{ $t('meta.btns.submit') }}
        </base-btn>
      </div>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
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
      feeForMaxWUSDValue: 0,
      canSubmit: true,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      balanceData: 'wallet/getBalanceData',
      stakingPoolsData: 'wallet/getStakingPoolsData',
      stakingUserData: 'wallet/getStakingUserData',
    }),
    userStakeBalance() {
      return this.balanceData[TokenSymbols.WUSD].fullBalance;
    },
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
    minStakeAmount() {
      return this.stakingPoolsData[this.stakingType].fullMinStake;
    },
    stakeAmountLimit() {
      const maxStake = this.poolData.fullMaxStake;
      let maxBalance = this.balanceData[this.stakingType].fullBalance;
      // If we use WUSD - calc max value with max tx fee
      if (this.stakingType === StakingTypes.WUSD) {
        const diff = new BigNumber(maxBalance).minus(this.feeForMaxWUSDValue);
        maxBalance = diff.isLessThan(0) ? '0' : diff.toString();
      }
      if (!this.isStakingStarted) return new BigNumber(maxBalance).isLessThan(maxStake) ? maxBalance : maxStake;
      const possible = new BigNumber(maxStake).minus(this.userInfo.fullStaked);

      if (new BigNumber(possible).isGreaterThan(maxBalance)) return maxBalance;

      return possible.isLessThan(0) ? possible.toString() : '0';
    },
  },
  async created() {
    await this.updateBalances();
    await this.updateMaxFee();
  },
  methods: {
    maxAmount() {
      this.amount = this.stakeAmountLimit;
    },
    async updateMaxFee() {
      if (this.stakingType !== StakingTypes.WUSD) {
        this.feeForMaxWUSDValue = 0;
        return;
      }
      this.canSubmit = false;
      const balance = this.userStakeBalance;
      if (new BigNumber(balance).isLessThan(this.poolData.fullMinStake)) {
        this.feeForMaxWUSDValue = 0;
        return;
      }
      const txFee = await this.getStakeFeeForAmount(
        balance,
        this.stakingType, this.poolData.poolAddress, this.stakeDays[this.daysValue],
      );
      if (!txFee.ok) this.feeForMaxWUSDValue = 0;
      else this.feeForMaxWUSDValue = txFee.result.fee;
      this.canSubmit = true;
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
      this.CloseModal();

      // Staking WQT
      if (!isNative) {
        this.SetLoader(true);
        const allowance = await this.getAllowance(stakeTokenAddress, poolAddress);
        if (!allowance) {
          this.SetLoader(false);
          return;
        }
        if (new BigNumber(allowance).isLessThan(amount)) {
          await this.approveThenStake(stakeTokenAddress, poolAddress, fullMaxStake, amount, stakingType, days, isStakingStarted);
        } else {
          await this.stake(stakeTokenAddress, poolAddress, amount, stakingType, days, isStakingStarted);
        }
        return;
      }

      // Staking WUSD
      await this.stake(stakeTokenAddress, poolAddress, amount, stakingType);
    },
    async getAllowance(stakeTokenAddress, poolAddress) {
      const [allowance] = await Promise.all([
        this.$store.dispatch('wallet/getAllowance', {
          tokenAddress: stakeTokenAddress,
          spenderAddress: poolAddress,
        }),
        this.updateBalances(),
      ]);
      if (allowance === false) {
        this.ShowToast('get allowance error');
        this.SetLoader(false);
        return null;
      }
      return allowance;
    },
    async approveThenStake(stakeTokenAddress, poolAddress, fullMaxStake, amount, stakingType, days, isStakingStarted) {
      const txFee = await this.$store.dispatch('wallet/getStakingApproveFeeData', {
        stakeTokenAddress, poolAddress, fullMaxStake,
      });
      this.SetLoader(false);
      if (!txFee.ok) {
        this.ShowToast(txFee.message);
        this.CloseModal();
        return;
      }
      this.ShowModal({
        key: modals.transactionReceipt,
        title: this.$t('meta.approve'),
        fields: {
          from: { name: this.$t('meta.fromBig'), value: getWalletAddress() },
          to: { name: this.$t('meta.toBig'), value: poolAddress },
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
            this.ShowToast(this.$t('modals.failed'), this.$t('meta.approve'));
            this.SetLoader(false);
            return error();
          }
          await this.$store.dispatch('main/showToast', { title: this.$t('meta.approve'), text: this.$t('meta.success') });
          return success();
        },
        callback: async () => await this.stake(stakeTokenAddress, poolAddress, amount, stakingType, days, isStakingStarted),
      });
    },
    async stake(stakeTokenAddress, poolAddress, amount, stakingType, days, isStakingStarted) {
      this.SetLoader(true);
      const txFee = await this.getStakeFeeForAmount(amount, stakingType, poolAddress, days);
      this.SetLoader(false);
      if (!txFee.ok) {
        if (txFee.msg.includes('You cannot stake tokens yet')) {
          this.ShowToast(this.$t('staking.cannotStakeYet'), this.$t('meta.btns.stake'));
        } else this.ShowToast(this.$t('modals.failed'), this.$t('meta.btns.stake'));
        return;
      }

      this.ShowModal({
        key: modals.transactionReceipt,
        title: `${this.$t('meta.btns.stake')} ${stakingType}`,
        fields: {
          from: { name: this.$t('meta.fromBig'), value: getWalletAddress() },
          to: { name: this.$t('meta.toBig'), value: poolAddress },
          days: days && !isStakingStarted ? { name: this.$t('staking.stakeDays'), value: days } : null,
          amount: { name: this.$t('modals.amount'), value: amount, symbol: stakingType },
          fee: { name: this.$t('wallet.table.trxFee'), value: txFee.result.fee, symbol: TokenSymbols.WUSD },
        },
        submitMethod: async () => {
          const res = await this.$store.dispatch('wallet/stake', {
            stakingType, amount, poolAddress, duration: days,
          });
          if (!res.ok) {
            await this.$store.dispatch('main/showToast', { title: this.$t('meta.btns.stake'), text: this.$t('modals.failed') });
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
    },
    async getStakeFeeForAmount(amount, stakingType, poolAddress, days) {
      return this.$store.dispatch('wallet/getStakeFeeForAmount', {
        amount, stakingType, poolAddress, days,
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
