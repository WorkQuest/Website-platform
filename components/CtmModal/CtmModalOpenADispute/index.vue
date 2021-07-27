<template>
  <ctm-modal-box
    class="message"
    :title="$t('modals.openADispute')"
  >
    <div class="ctm-modal__content">
      <div class="message">
        <div class="message__content">
          <div class="modal__desc">
            <div>
              <base-dd
                id="reason-dd"
                type="gray"
                :items="items"
                :label="$t('modals.reason')"
              />
            </div>
            <div class="btn__container">
              <div class="btn__wrapper">
                <base-btn
                  class="message__action"
                  @click="showRequestSendModal() "
                >
                  {{ $t('meta.send') }}
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
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalOpenADispute',
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
    items() {
      return [
        this.$t('modals.badService'),
        this.$t('modals.otherReason'),
      ];
    },
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    showRequestSendModal() {
      this.ShowModal({
        key: modals.requestSend,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 15px 0 0 0;
  }
  &__wrapper {
    width: 45%;
  }
}

</style>
