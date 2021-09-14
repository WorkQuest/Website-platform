<template>
  <ctm-modal-box
    class="claim"
    :title="$t('mining.claimRewards')"
  >
    <div class="claim__content content">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
      >
        <base-field
          v-model="amount"
          class="content__field"
          :placeholder="3500"
          :label="$t('modals.amount')"
          rules="required|decimal"
          :name="$t('modals.amount')"
        />
        <div class="content__subtitle">
          {{ $t('modals.yourRewardBalance') }}
          <span class="content__subtitle_blue">
            {{ balance }} {{ currency }}
          </span>
        </div>
        <div class="content__container">
          <base-btn
            :mode="'outline'"
            @click="hide()"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            :disabled="!validated || !passed || invalid"
            @click="handleSubmit(hide)"
          >
            {{ $t('meta.submit') }}
          </base-btn>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
export default {
  name: 'CtmModalClaimRewards',
  data() {
    return {
      amount: '',
      balance: 10,
      currency: 'WUSD',
    };
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
