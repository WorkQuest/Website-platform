<template>
  <ctm-modal-box
    class="messageSend"
    :is-header="false"
  >
    <div class="ctm-modal__content">
      <div class="messageSend">
        <div class="messageSend__content">
          <img
            v-if="step === 1"
            src="~assets/img/ui/message.svg"
            alt="AreYouSure"
          >
          <img
            v-if="step === 2"
            src="~assets/img/ui/error.svg"
            alt="error"
          >
          <div
            v-if="step === 1"
            class="ctm-modal__title"
          >
            {{ $t('modals.areYouSure') }}
          </div>
          <div
            v-if="step === 2"
            class="ctm-modal__title"
          >
            {{ $t('modals.error') }}
          </div>
          <div
            v-if="step === 1"
            class="ctm-modal__desc"
          >
            {{ $t('modals.doYouWantToDeleteThisQuest') }}
          </div>
          <div
            v-if="step === 2"
            class="ctm-modal__desc"
          >
            {{ $t('modals.youCantDeleteActiveQuest') }}
          </div>
          <div
            v-if="step === 1"
            class="messageSend__container"
          >
            <base-btn
              mode="outline"
              @click="hide()"
            >
              {{ $t('meta.cancel') }}
            </base-btn>
            <base-btn
              @click="nextStep()"
            >
              {{ $t('meta.delete') }}
            </base-btn>
          </div>
          <base-btn
            v-if="step === 2"
            mode="outline"
            @click="hide()"
          >
            {{ $t('meta.close') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalAreYouSure',
  data() {
    return {
      step: 1,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    nextStep() {
      this.step += 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}

.messageSend {
  max-width: 337px !important;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
  }
  &__container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    width: 100%;
  }
}
</style>
