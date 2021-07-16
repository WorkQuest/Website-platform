<template>
  <ctm-modal-box
    isUnclosable="true"
    :title="$t('modals.securityCheck')"
    class="messageSend"
  >
    <div class="ctm-modal__content">
      <div class="messageSend">
        <div class="messageSend__content">
          <span class="message__top">
            {{ $t('modals.googleConfCode') }}
          </span>
          <base-field
            v-model="codeInput"
            class="message__action"
            :placeholder="$t('modals.googleConfCode')"
          />
          <div class="message__sub">
            {{ $t('modals.enterCode') }}
          </div>
          <div class="btn__container">
            <base-btn
              class="message__action"
              @click="success()"
            >
              {{ $t('meta.send') }}
            </base-btn>
          </div>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'CtmModalChangeRoleWarning',
  data() {
    return {
      codeInput: '',
    };
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    success() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/success.svg'),
        title: 'Success',
        subtitle: 'Your role has been changed',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}

.message {
  &__action {
    width: 100%;
  }
  &__top {
    display: flex;
    justify-self: flex-start;
  }
  &__sub {
    @include text-simple;
    font-weight: 400;
    color: $black400;
    font-size: 14px;
  }
}

.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 0;
    width: 100%;
  }
  &__wrapper {
    width: 45%;
  }
}

.messageSend {
  max-width: 400px !important;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 10px;
  }
  &__action {
    margin-top: 10px;
    width: 100%;
  }
}
</style>
