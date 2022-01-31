<template>
  <ctm-modal-box
    :is-unclosable="true"
    :title="step === 1 ? $t('modals.reason') : $t('modals.securityCheck')"
    class="modal ctm-modal"
  >
    <div class="ctm-modal ctm-modal__content modal">
      <div
        v-if="step === 1"
        class="modal"
      >
        <span class="modal__title">{{ $t('modals.pleaseDescribe') }}</span>
        <div class="modal__content message">
          <base-field
            v-model="reasonInput"
            class="message message__action btn"
            :placeholder="$t('modals.reason')"
          />
          <div class="btn btn__container">
            <div class="btn__wrapper">
              <base-btn
                class="message__action"
                @click="nextStep()"
              >
                {{ $t('meta.change') }}
              </base-btn>
            </div>
            <div class="btn__wrapper">
              <base-btn
                :mode="'outline'"
                class="message__action"
                @click="hide()"
              >
                {{ $t('meta.cancel') }}
              </base-btn>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="step === 2"
        class="modal"
      >
        <div class="modal modal__content">
          <base-field
            v-model="codeInput"
            :label="$t('modals.googleConfCode')"
            class="content message__action"
            :placeholder="$t('modals.googleConfCode')"
          />
          <div class="content message__sub">
            {{ $t('modals.enterCode') }}
          </div>
          <div class="content btn__container">
            <base-btn
              class="content message__action"
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
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'CtmModalChangeRoleReason',
  data() {
    return {
      step: 1,
      reasonInput: '',
      codeInput: '',
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
    }),
  },
  methods: {
    nextStep() {
      this.step += 1;
    },
    hide() {
      this.CloseModal();
    },
    async changeRole() {
      // TODO: Сделать смену роли
      const response = await this.$store.dispatch('user/setUserRole');
      if (response?.ok) this.success();
    },
    success() {
      this.ShowModal({
        key: modals.status, img: require('~/assets/img/ui/success.svg'), title: 'Success', subtitle: 'Your role has been changed',
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

.modal {
  max-width: 400px !important;
  display: flex;
  flex-direction: column;

  &__title {
    letter-spacing: -0.025em;
    margin-bottom: 13px;
    color: #212529;
  }

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

.modal__content div div {
  height: auto !important;
}
</style>
