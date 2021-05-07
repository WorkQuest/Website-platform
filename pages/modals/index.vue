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
    <!-- New -->
    <base-btn
      @click="showTransactionSendModal()"
    >
      showTransactionSendModal
    </base-btn>
    <base-btn
      @click="showCardHasBeenAddedModal()"
    >
      showCardHasBeenAddedModal
    </base-btn>
    <base-btn
      @click="showDepositModal()"
    >
      showDepositModal
    </base-btn>
    <base-btn
      @click="showAddCardModal()"
    >
      showAddCardModal
    </base-btn>
    <base-btn
      @click="showWidthrawModal()"
    >
      showWidthrawModal
      <base-btn
        @click="showThanksModal()"
      >
        showThanksModal
      </base-btn>
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
    showWidthrawModal() {
      this.ShowModal({
        key: modals.widthraw,
      });
    },
    showDepositModal() {
      this.ShowModal({
        key: modals.deposit,
      });
    },
    showAddCardModal() {
      this.ShowModal({
        key: modals.addCard,
      });
    },
    showCardHasBeenAddedModal() {
      this.ShowModal({
        key: modals.cardHasBeenAdded,
      });
    },
    showTransactionSendModal() {
      this.ShowModal({
        key: modals.transactionSend,
      });
    },
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
        key: modals.thanks,
      });
    },
  },
};
</script>
