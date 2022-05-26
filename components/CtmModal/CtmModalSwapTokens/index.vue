<template>
  <ctm-modal-box
    class="claim"
    :title="$tc('modals.titles.swapTokens')"
  >
    <validation-observer
      v-slot="{handleSubmit, invalid}"
      class="claim__content content"
      tag="div"
    >
      <base-field
        v-model="amount"
        type="number"
        placeholder="3500"
        class="content__field"
        data-selector="OLD-TOKENS"
        :name="$tc('mining.swapTokens.oldTokens')"
        :label="$tc('mining.swapTokens.oldTokens')"
        :rules="`required|decimal|min_value:0.00001|max_value:${balance}`"
      >
        <template
          v-slot:right-absolute
          class="content__max max"
        >
          <base-btn
            mode="max"
            class="max__button"
            data-selector="MAX"
            :disabled="!oldToken.balance"
            @click="maxBalance"
          >
            <span class="max__text">
              {{ $t('modals.maximum') }}
            </span>
          </base-btn>
        </template>
      </base-field>
      <div class="content__subtitle">
        {{ $t('mining.swapTokens.balance') }}
        <span class="content__subtitle_blue">
          {{ Floor(balance) }} {{ oldToken.symbol }}
        </span>
      </div>
      <base-field
        :value="amount"
        class="content__field"
        placeholder="3500"
        data-selector="NEW-TOKENS"
        :label="$tc('mining.swapTokens.newTokens')"
        :disabled="true"
        :name="$tc('mining.swapTokens.newTokens')"
      />
      <div class="content__container">
        <base-btn
          mode="outline"
          data-selector="CANCEL"
          @click="CloseModal"
        >
          {{ $t('meta.btns.cancel') }}
        </base-btn>
        <base-btn
          :disabled="invalid"
          data-selector="SWAP"
          @click="handleSubmit(initSwap)"
        >
          {{ $t('mining.swapTokens.swap') }}
        </base-btn>
      </div>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';

export default {
  name: 'CtmModalSwapTokens',
  data() {
    return {
      amount: 0,
      oldToken: {
        balance: 0,
        decimals: 0,
        symbol: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    balance() {
      return new BigNumber(this.oldToken.balance).shiftedBy(-this.oldToken.decimals).toString();
    },
  },
  async mounted() {
    this.oldToken = await this.fetchTokenInfo(process.env.BSC_OLD_WQT_TOKEN);
  },
  methods: {
    ...mapActions({
      fetchTokenInfo: 'mining/fetchTokenInfo',
    }),
    maxBalance() {
      this.amount = this.balance;
    },
    async initSwap() {
      const {
        amount, balance, oldToken: { decimals }, options: { submit },
      } = this;
      if (new BigNumber(balance).isGreaterThanOrEqualTo(amount)) {
        await submit(amount, decimals);
      } else {
        this.ShowModalFail({
          title: this.$t('modals.transactionFail'),
          subtitle: this.$t('modals.incorrectAmount'),
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.max {
  &__button {
    margin-right: 10px !important;
    background: transparent !important;
  }
}

.claim {
  max-width: 487px !important;

  &__content {
    padding: 22px 28px 30px 28px !important;
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
