<template>
  <div class="container">
    <h2>New Modals</h2>
    <base-btn
      @click="modalShowReviewDetails()"
    >
      showModalShowReviewDetails
    </base-btn>
    <base-btn
      @click="modalEnableSmsVerification()"
    >
      showModalEnableSmsVerification
    </base-btn>
    <base-btn
      @click="modalChooseNecessarySkills()"
    >
      showModalChooseNecessarySkills
    </base-btn>
    <base-btn
      @click="modalChangeRoleSecure()"
    >
      showModalChangeRoleSecure
    </base-btn>
    <base-btn
      @click="modalChangeRoleReason()"
    >
      showModalChangeRoleReason
    </base-btn>
    <base-btn
      @click="modalChangeRoleWarning()"
    >
      showModalChangeRoleWarning
    </base-btn>
    <h2>Old Modals</h2>
    <base-btn
      @click="ModalTwoFAAuth()"
    >
      showModalTwoFAAuth
    </base-btn>
    <base-btn
      @click="ModalChangePassword()"
    >
      showModalChangePassword
    </base-btn>
    <base-btn
      @click="showSkillsModal()"
    >
      showSkillsModal
    </base-btn>
    <base-btn
      @click="showTransferModal()"
    >
      showTransferModal
    </base-btn>
    <base-btn
      @click="showNoticeModal()"
    >
      showNoticeModal
    </base-btn>
    <base-btn
      @click="showOpenADisputeModal()"
    >
      showOpenADisputeModal
    </base-btn>
    <base-btn
      @click="showWelcomeModal()"
    >
      showWelcomeModal
    </base-btn>
    <base-btn
      @click="showAddCaseModal()"
    >
      showAddCaseModal
    </base-btn>
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
      @click="showWithdrawModal()"
    >
      showWithdrawModal
    </base-btn>
    <base-btn
      @click="showThanksModal()"
    >
      showThanksModal
    </base-btn>
    <base-btn
      @click="showInviteSendModal()"
    >
      showInviteSendModal
    </base-btn>
    <base-btn
      @click="showQuestCreatedModal()"
    >
      showQuestCreatedModal
    </base-btn>
    <base-btn
      @click="showInvitationModal()"
    >
      showInvitationModal
    </base-btn>
    <base-btn
      @click="showRaiseViewsModal()"
    >
      showRaiseViewsModal
    </base-btn>
    <base-btn
      @click="showApplyForAPensionModal()"
    >
      showApplyForAPensionModal
    </base-btn>
    <base-btn
      @click="showMakeDeposit()"
    >
      showMakeDeposit
    </base-btn>
    <base-btn
      @click="showChangePercent()"
    >
      showChangePercent
    </base-btn>
    <base-btn
      @click="showAddLiquidity()"
    >
      showAddLiquidity
    </base-btn>
    <base-btn
      @click="showRemoveLiquidity()"
    >
      showRemoveLiquidity
    </base-btn>
    <base-btn
      @click="showCreditingDeposit()"
    >
      showCreditingDeposit
    </base-btn>
  </div>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  data() {
    return {};
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    modalShowReviewDetails() {
      this.ShowModal({
        key: modals.reviewDetails,
      });
    },
    modalEnableSmsVerification() {
      this.ShowModal({
        key: modals.smsVerification,
      });
    },
    modalChooseNecessarySkills() {
      this.ShowModal({
        key: modals.chooseNecessarySkills,
      });
    },
    modalChangeRoleSecure() {
      this.ShowModal({
        key: modals.changeRoleSecureCheck,
      });
    },
    modalChangeRoleReason() {
      this.ShowModal({
        key: modals.changeRoleReason,
      });
    },
    modalChangeRoleWarning() {
      this.ShowModal({
        key: modals.changeRoleWarning,
      });
    },
    ModalTwoFAAuth() {
      this.ShowModal({
        key: modals.twoFAAuth,
      });
    },
    ModalChangePassword() {
      this.ShowModal({
        key: modals.changePassInSettings,
      });
    },
    showSkillsModal() {
      this.ShowModal({
        key: modals.skills,
      });
    },
    showTransferModal() {
      this.ShowModal({
        key: modals.transfer,
      });
    },
    showNoticeModal() {
      this.ShowModal({
        key: modals.notice,
      });
    },
    showOpenADisputeModal() {
      this.ShowModal({
        key: modals.openADispute,
      });
    },
    showWelcomeModal() {
      this.ShowModal({
        key: modals.welcome,
      });
    },
    showAddCaseModal() {
      this.ShowModal({
        key: modals.addCase,
      });
    },
    showRaiseViewsModal() {
      this.ShowModal({
        key: modals.raiseViews,
      });
    },
    showTransactionSendModal() {
      this.ShowModal({
        key: modals.transactionSend,
      });
    },
    showCardHasBeenAddedModal() {
      this.ShowModal({
        key: modals.cardHasBeenAdded,
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
    showWithdrawModal() {
      this.ShowModal({
        key: modals.withdraw,
      });
    },
    showInvitationModal() {
      this.ShowModal({
        key: modals.invitation,
      });
    },
    showQuestCreatedModal() {
      this.ShowModal({
        key: modals.questCreated,
      });
    },
    showInviteSendModal() {
      this.ShowModal({
        key: modals.inviteSend,
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
    showApplyForAPensionModal() {
      this.ShowModal({
        key: modals.applyForAPension,
      });
    },
    showMakeDeposit() {
      this.ShowModal({
        key: modals.makeDeposit,
      });
    },
    showChangePercent() {
      this.ShowModal({
        key: modals.changePercent,
      });
    },
    showAddLiquidity() {
      this.ShowModal({
        key: modals.addLiquidity,
      });
    },
    showRemoveLiquidity() {
      this.ShowModal({
        key: modals.removeLiquidity,
      });
    },
    showCreditingDeposit() {
      this.ShowModal({
        key: modals.creditingDeposit,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  overflow-y: auto;
  height: 1000px;
}

</style>
