<template>
  <div>
    <base-btn
      @click="showMessageSendModal()"
    >
      showMessageSendModal
    </base-btn>
    <base-btn
      @click="showQuestAgreedModal()"
    >
      showQuestAgreedModal
    </base-btn>
    <base-btn
      @click="showRequestSendModal()"
    >
      showRequestSendModal
    </base-btn>
    <base-btn
      @click="showSendARequestModal()"
    >
      showSendARequestModal
    </base-btn>
    <base-btn
      @click="showAreYouSureModal()"
    >
      showAreYouSureModal
    </base-btn>
    <base-btn
      @click="showThsanksModal()"
    >
      showThanksModal
    </base-btn>
  </div>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    showQuestAgreedModal() {
      this.ShowModal({
        key: modals.questAgreed,
      });
    },
    showMessageSendModal() {
      this.ShowModal({
        key: modals.messageSend,
      });
    },
    showRequestSendModal() {
      this.ShowModal({
        key: modals.requestSend,
      });
    },
    showSendARequestModal() {
      this.ShowModal({
        key: modals.sendARequest,
      });
    },
    showAreYouSureModal() {
      this.ShowModal({
        key: modals.areYouSure,
      });
    },
    showThanksModal() {
      this.ShowModal({
        key: modals.thanksSend,
      });
    },
  },
};
</script>
