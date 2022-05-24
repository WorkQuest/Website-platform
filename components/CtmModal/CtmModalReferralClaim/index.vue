<template>
  <ctm-modal-box
    class="info"
    :title="$tc('modals.claim')"
  >
    <div class="info__content content">
      <div
        v-if="options.desc"
        class="content__desc"
      >
        <p>{{ options.desc }}</p>
      </div>
      <div class="content__fields">
        <div
          v-for="(item, i) of options.fields"
          :key="i"
          class="content__items-container"
        >
          <div
            v-if="item != null"
            class="item"
          >
            <div class="item__title">
              {{ item.name }}
            </div>
            <div class="item__subtitle">
              {{ item.value }}
              <span v-if="item.symbol">{{ item.symbol }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="content__buttons buttons">
        <div class="buttons__group">
          <base-btn
            class="buttons__button"
            mode="outline"
            selector="CANCEL"
            @click="CloseModal"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="buttons__button"
            selector="CONFIRM"
            @click="handleSubmit"
          >
            {{ $t('meta.btns.submit') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import { TokenSymbols } from '~/utils/enums';

export default {
  name: 'ReferralClaim',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userAddress: 'user/getUserWalletAddress',
    }),
  },
  beforeMount() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  methods: {
    async handleSubmit() {
      this.CloseModal();
      await this.$store.dispatch('oracle/setCurrentPriceToken', { symbol: TokenSymbols.WQT });
      await this.$store.dispatch('referral/claimReferralReward', this.userAddress);
    },
  },
};
</script>

<style lang="scss" scoped>

.item {
  margin-bottom: 15px;
  &:last-child{
    margin-bottom: 0;
  }
  &__title {
    color: $black500;
  }
  &__subtitle{
    &_red {
      color: $red;
    }
  }
}
.error {
  color: $red;
  font-size: 12px;
  margin: 10px 0;
}
.content{
  padding: 0 28px 30px 28px!important;
  &__fields,
  &__desc {
    margin-top: 20px;
  }
}
.buttons{
  &__group{
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 10px));
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }
}
.header{
  &__title{
    font-size: 16px;
    line-height: 130%;
    color: $black800;
  }
  &__icon:before{
    font-size: 16px;
    color: $black500;
    vertical-align: middle;
    margin-left: 6px;
  }
  &__button{
    width: 16px!important;
    height: 16px!important;
  }
}
</style>
