<template>
  <ctm-modal-box
    class="claim"
    :title="$t('mining.swapTokens.title')"
  >
    <div class="claim__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
      >
        <base-field
          v-model="oldTokens"
          class="content__field"
          :placeholder="3500"
          :label="$t('mining.swapTokens.oldTokens')"
          rules="required|decimal"
          :name="$t('mining.swapTokens.oldTokens')"
        />
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
          rules="required|decimal"
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
            :disabled="!validated || !passed || invalid || statusBusy"
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
      balance: 10,
      currency: 'WUSD',
    };
  },
  computed: {
    ...mapGetters({
      accountData: 'web3/getAccountData',
      options: 'modals/getOptions',
      statusBusy: 'web3/getStatusBusy',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>
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
