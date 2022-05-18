<template>
  <ctm-modal-box
    class="deposit"
    :class="{'deposit_small': step === 2}"
    :title="$tc('modals.titles.deposit')"
  >
    <div class="deposit__content content">
      <div class="content__step">
        <div
          class="content__panel"
          :class="{'content__panel_active': step === 1}"
          data-selector="PREVIOUS-STEP"
          @click="setStep(1)"
        >
          {{ $t('modals.walletAddress') }}
        </div>
        <div
          class="content__panel"
          :class="{'content__panel_active': step === 2}"
          data-selector="NEXT-STEP"
          @click="setStep(2)"
        >
          {{ $t('meta.bankCard') }}
        </div>
      </div>
      <div
        v-if="step === 1"
        class="content__container"
      >
        <div class="content__image">
          <img
            alt="qr"
            src="~/assets/img/temp/qr.svg"
            class="content__qr"
          >
        </div>
        <span class="content__text_gray">
          {{ $t('modals.scanQr') }}
        </span>
        <div class="content__code code">
          <div class="code__container">
            <span class="code__text">
              {{ modifyAddress(walletAddress) }}
            </span>
            <button
              type="code__copy"
              @click="showSuccessCopied"
            >
              <span
                v-clipboard:copy="walletAddress"
                v-clipboard:success="ClipboardSuccessHandler"
                v-clipboard:error="ClipboardErrorHandler"
                class="icon-copy code__icon"
              />
            </button>
          </div>
          <base-btn
            class="code__share"
            mode="share"
            data-selector="SHOW-SHARE-MODAL"
            @click="showShareModal"
          >
            <span class="icon-share_outline code__chain" />
          </base-btn>
        </div>
      </div>
      <div
        v-if="step === 2"
        class="content__container"
      >
        <div>
          <img
            alt="card"
            src="~assets/img/ui/creditCard.svg"
            class="content__card"
          >
        </div>
        <span class="content__text_light">
          {{ $t('modals.addYourCard') }}
        </span>
      </div>
      <div class="content_buttons buttons">
        <div class="buttons__container">
          <!--          TODO: Зарефакторить!-->
          <div class="buttons__wrapper">
            <span
              v-if="step === 1"
              class="buttons__step"
            >
              <base-btn
                class="buttons__action"
                data-selector="CLOSE"
                @click="hide"
              >
                {{ $t('meta.btns.close') }}
              </base-btn>
            </span>
            <span
              v-if="step === 2"
              class="buttons__step"
            >
              <base-btn
                class="buttons__button"
                mode="outline"
                data-selector="CANCEL"
                @click="hide"
              >
                {{ $t('meta.btns.cancel') }}
              </base-btn>
              <base-btn
                class="buttons__button"
                data-selector="CARD-ADD"
                @click="showAddingCard"
              >
                {{ $t('meta.cardAdd') }}
              </base-btn>
            </span>
          </div>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'ModalGiveDeposit',
  data() {
    return {
      step: 1,
      walletAddress: '0xnf8o29837hrvbn42o37hsho3b74thb3',
    };
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    setStep(step) {
      this.step = step;
    },
    // TODO: Зарефакторить
    showSuccessCopied() {
      this.ShowModal({
        key: modals.status,
        img: require('assets/img/ui/questAgreed.svg'),
        title: this.$t('modals.textCopy'),
      });
    },
    showShareModal() {
      this.ShowModal({
        key: modals.sharingQuest,
      });
    },
    showAddingCard() {
      this.ShowModal({
        key: modals.addingCard,
      });
    },
    modifyAddress(address) {
      return `${address.substr(0, 7)}...${address.substr(address.length - 8, 8)}`;
    },
  },
};
</script>

<style lang="scss" scoped>

.code {
  &__container {
    display: flex;
    border: 1px solid $black0;
    border-radius: 6px;
    justify-content: space-between;
    padding: 12px;
    width: 268px;
    height: 46px;
  }
  &__text {
    font-weight: 400;
    font-size: 16px;
    color: $black800;
    line-height: 20.8px;
  }
  &__share{
    width: 46px!important;
    height: 46px!important;
    border-radius: 6px;
    margin-left: 10px;
  }
  &__chain:before{
    color: $blue;
    font-size: 25px!important;
  }
  &__icon:before{
    font-size: 25px!important;
    padding-bottom: 15px!important;
    color: $blue!important;
  }
}

.content {
  &__step {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }
  &__panel{
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    margin: 0 20px 0 0;
    cursor: pointer;
    &_active {
      color: $black800;
      border-bottom: 2px solid $blue;
      padding: 0 0 12px 0;
    }
  }
  &__text{
    &_gray{
      @include text-simple;
      font-weight: 400;
      font-size: 16px;
      color: $black500;
    }
    &_light{
      font-size: 16px;
      line-height: 130%;
      color: $grey100;
    }
  }
  &__qr{
    margin:20px auto;
  }
  &__code{
    display: flex;
    justify-content: space-between;
    margin: 10px 0 25px 0;
  }
  &__card{
    margin: 30px auto;
  }
}

.buttons {
  &__container {
    margin: 15px 0 0 0;
  }
  &__wrapper {
    width: 100%;
  }
  &__step{
    display: flex;
    justify-content: space-between;
  }
  &__button{
    width: 137px!important;
  }
}

.deposit {
  max-width: 380px !important;
  &_small{
    max-width: 355px !important;
  }
  &__content{
    padding: 20px 30px 28px 30px;
  }
}
.code__share:hover .code__chain:before{
  color: $white!important;
}

</style>
