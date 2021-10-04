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
          :placeholder="3500"
          :label="$t('modals.amount')"
          rules="required|decimal"
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
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    maxBalance() {
      this.amount = this.options.type === 1 ? this.userBalance : this.userStake;
    },
    async tokensDataUpdate() {
      const tokensData = await this.$store.dispatch('web3/getTokensData', { stakeDecimal: this.accountData.decimals.stakeDecimal, rewardDecimal: this.accountData.decimals.rewardDecimal });
      this.rewardAmount = this.Floor(tokensData.rewardTokenAmount);
      this.stakedAmount = this.Floor(tokensData.stakeTokenAmount);
    },
    async staking() {
      this.SetLoader(true);
      this.hide();
      await this.$store.dispatch('web3/stake', {
        decimals: this.accountData.decimals.stakeDecimal,
        amount: this.amount,
      });
      await this.tokensDataUpdate();
      this.SetLoader(false);
    },
    async unstaking() {
      this.SetLoader(true);
      this.hide();
      await this.$store.dispatch('web3/unstake', {
        decimals: this.accountData?.decimals?.stakeDecimal,
        amount: this.amount,
      });
      await this.tokensDataUpdate();
      this.SetLoader(false);
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
