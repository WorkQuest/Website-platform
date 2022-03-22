<template>
  <ctm-modal-box
    class="messageSend"
    :is-header="false"
  >
    <div class="ctm-modal__content">
      <div class="messageSend">
        <div class="messageSend__content">
          <img
            alt=""
            src="~/assets/img/ui/notice.svg"
            class="modal__icon"
          >
          <div class="modal__title">
            {{ $t('modals.areYouSure') }}
          </div>
          <div class="modal__wrap">
            <div class="modal__btn">
              <base-btn
                class="email__action"
                mode="outline"
                selector="CANCEL"
                @click="hide()"
              >
                {{ $t('meta.btns.cancel') }}
              </base-btn>
            </div>
            <div class="modal__btn">
              <base-btn
                class="email__action"
                selector="CONFIRM"
                @click="handleSubmit()"
              >
                {{ $t('meta.btns.submit') }}
              </base-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ReferralRegistration',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userAddress: 'user/getUserWalletAddress',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async handleSubmit() {
      let res;
      this.hide();
      this.SetLoader(true);
      try {
        res = await this.$store.dispatch('referral/addReferrals', this.userAddress);
      } catch (err) {
        console.log('addReferrals err', err);
      }

      if (res && res.transactionHashion) {
        this.SetLoader(false);
        this.hide();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
  &__box {
    background: $black0;
  }
}

.modal {
  &__icon {
    display: flex;
    justify-self: flex-start;
  }
  &__title {
    @include text-simple;
    font-weight: 600;
    font-size: 18px;
    color: $black800;
    display: flex;
    justify-self: flex-start;
  }
  &__desc {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
  }
  &__wrap {
    display: flex;
    flex-direction: row;
    gap: 20px;
    width: 100%;
  }
  &__btn {
    width: 100%;
  }
}

.messageSend {
  max-width: 337px !important;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
  }
  &__action {
    margin-top: 10px;
  }
}
</style>
