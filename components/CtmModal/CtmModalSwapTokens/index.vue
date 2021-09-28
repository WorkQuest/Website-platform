<template>
  <ctm-modal-box
    class="claim"
    :title="$t('mining.swapTokens.title')"
  >
    <div class="claim__content content">
      <validation-observer
        v-slot="{invalid}"
      >
        <base-field
          v-model="oldTokens"
          class="content__field"
          :placeholder="3500"
          :type="'number'"
          :label="$t('mining.swapTokens.oldTokens')"
          rules="required"
          :name="$t('mining.swapTokens.oldTokens')"
        >
          <template
            v-slot:right-absolute
            class="content__max max"
          >
            <base-btn
              mode="max"
              class="max__button"
              :disabled="balance === 0"
              @click="maxBalance()"
            >
              <span class="max__text">{{ $t('modals.maximum') }}</span>
            </base-btn>
          </template>
        </base-field>
        <div class="content__subtitle">
          {{ $t('mining.swapTokens.balance') }}
          <span class="content__subtitle_blue">
            {{ balance }} {{ currency }}
          </span>
        </div>
        <base-field
          v-model="newTokens"
          class="content__field"
          :placeholder="3500"
          :label="$t('mining.swapTokens.newTokens')"
          :disabled="true"
          :name="$t('mining.swapTokens.newTokens')"
        />
        <div class="content__container">
          <base-btn
            :mode="'outline'"
            :disabled="statusBusy"
            @click="hide()"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            :disabled="invalid || statusBusy"
            @click="initSwap()"
          >
            {{ $t('mining.swapTokens.swap') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CtmModalSwapTokens',
  data() {
    return {
      oldTokens: '',
      newTokens: '',
      balance: 0,
      currency: 'WQT',
    };
  },
  computed: {
    ...mapGetters({
      tokensData: 'web3/getBSCTokensData',
      options: 'modals/getOptions',
      statusBusy: 'web3/getStatusBusy',
    }),
  },
  watch: {
    oldTokens() {
      this.newTokens = this.oldTokens;
    },
    async tokensData() {
      await this.initBalanceAndCurrency();
    },
  },
  async mounted() {
    await this.$store.dispatch('web3/initTokensData');
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    maxBalance() {
      this.oldTokens = this.tokensData.userPurse.oldTokenBalance;
    },
    initBalanceAndCurrency() {
      this.balance = parseInt((this.tokensData.userPurse.oldTokenBalance) * 10000, 10) / 10000;
      this.currency = this.tokensData.userPurse.oldTokenSymbol;
    },
    async initSwap() {
      this.SetLoader(true);
      this.hide();
      await this.$store.dispatch('web3/swap', {
        decimals: this.tokensData.decimals.oldTokenDecimal,
        amount: this.oldTokens,
      });
      await this.$store.dispatch('web3/initTokensData');
      this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.max {
  &__button {
    margin-right: 10px !important;
    background: #f3f7fa !important;
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
    margin-bottom: 10px;
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
