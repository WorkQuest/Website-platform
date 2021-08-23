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
    <div>
      My Modals
    </div>
    <base-btn
      @click="showPaymentOptions()"
    >
      PaymentOptions
    </base-btn>
    <base-btn
      @click="showPrice()"
    >
      Price
    </base-btn>
    <base-btn
      @click="showQuestQreated()"
    >
      Quest created
    </base-btn>
    <base-btn
      @click="showRiseViews()"
    >
      Rise views
    </base-btn>
    <base-btn
      @click="showRemoveLiquidityNew()"
    >
      Remove liquidity
    </base-btn>
    <base-btn
      @click="showRestore()"
    >
      Restore password
    </base-btn>
    <base-btn
      @click="showReviewEmployer()"
    >
      Review Employer
    </base-btn>
    <base-btn
      @click="showSecurityCheck()"
    >
      Security check
    </base-btn>
    <base-btn
      @click="showSmsVerification()"
    >
      Sms verification
    </base-btn>
    <base-btn
      @click="showStatus()"
    >
      Status
    </base-btn>
    <base-btn
      @click="showSwap()"
    >
      Swap
    </base-btn>
    <base-btn
      @click="showSwapInfo()"
    >
      Swap Info
    </base-btn>
    <base-btn
      @click="showTakeWithdraw()"
    >
      Take withdraw
    </base-btn>
    <base-btn
      @click="showTransactionSend()"
    >
      Transaction Send
    </base-btn>
    <base-btn
      @click="showWelcome()"
    >
      Welcome
    </base-btn>
    <base-btn
      @click="showWithdrawAbout()"
    >
      Withdraw about
    </base-btn>
    <base-btn
      @click="showWithdrawAOptions()"
    >
      Withdraw options
    </base-btn>
    <base-btn
      @click="showWithdrawInfo()"
    >
      Withdraw info
    </base-btn>
    <base-btn
      @click="showAddLiquidityNew()"
    >
      Add Liquidity
    </base-btn>
    <base-btn
      @click="showAddingCardNew()"
    >
      Adding card
    </base-btn>
    <base-btn
      @click="showApplyForAPension()"
    >
      Apply For A Pension
    </base-btn>

    <base-btn
      @click="showAreYouSureDelete()"
    >
      Are you sure delete?
    </base-btn>
    <base-btn
      @click="showAreYouSureNotification()"
    >
      Are you sure notification?
    </base-btn>
    <base-btn
      @click="showCardAdded()"
    >
      Card added
    </base-btn>
    <base-btn
      @click="showChangePassword()"
    >
      Change password
    </base-btn>
    <base-btn
      @click="showChangePercent()"
    >
      Change percent
    </base-btn>
    <base-btn
      @click="showClaim()"
    >
      Claim
    </base-btn>
    <base-btn
      @click="showConfirmDetails()"
    >
      Confirm details
    </base-btn>
    <base-btn
      @click="showConfirmLoanDetails()"
    >
      Confirm loan details
    </base-btn>
    <base-btn
      @click="showCopiedSuccess()"
    >
      Copied success
    </base-btn>
    <base-btn
      @click="showCreditingLoan()"
    >
      Crediting Loan
    </base-btn>
    <base-btn
      @click="showCreditingDepositNew()"
    >
      Crediting deposit
    </base-btn>
    <base-btn
      @click="showDepositOptions()"
    >
      Deposit options
    </base-btn>
    <base-btn
      @click="showGiveDeposit()"
    >
      Give deposit
    </base-btn>
    <base-btn
      @click="showTransfer()"
    >
      Transfer
    </base-btn>
    <base-btn
      @click="showInsureCase()"
    >
      Insure case
    </base-btn>
    <base-btn
      @click="showInvitation()"
    >
      Invitation
    </base-btn>
    <base-btn
      @click="showMakeDepositNew()"
    >
      Make deposit
    </base-btn>
    <base-btn
      @click="showNoticeChat()"
    >
      Notice chat
    </base-btn>
    <base-btn
      @click="showOpenADeposit()"
    >
      Open a deposit
    </base-btn>
    <base-btn
      @click="showOpenADispute()"
    >
      Open a dispute
    </base-btn>
    <base-btn
      @click="showChangePasswordNew()"
    >
      Change password
    </base-btn>
    <base-btn
      @click="show2Fa()"
    >
      2 FA
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
    showPaymentOptions() {
      this.ShowModal({
        key: modals.paymentOptions,
        step: 1,
      });
    },
    showPrice() {
      this.ShowModal({
        key: modals.priceSearch,
      });
    },
    showQuestQreated() {
      this.ShowModal({
        key: modals.questCreated,
      });
    },
    showRiseViews() {
      this.ShowModal({
        key: modals.raiseViews,
      });
    },
    showRemoveLiquidityNew() {
      this.ShowModal({
        key: modals.removeLiquidity,
      });
    },
    showRestore() {
      this.ShowModal({
        key: modals.restore,
      });
    },
    showReviewEmployer() {
      this.ShowModal({
        key: modals.review,
      });
    },
    showSecurityCheck() {
      this.ShowModal({
        key: modals.securityCheck,
      });
    },
    showSmsVerification() {
      this.ShowModal({
        key: modals.smsVerification,
      });
    },
    showStatus() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/dispute.svg'),
        title: this.$t('modals.requestSend'),
        subtitle: this.$t('modals.openDisputeText'),
      });
    },
    showSwap() {
      this.ShowModal({
        key: modals.swap,
      });
    },
    showSwapInfo() {
      this.ShowModal({
        key: modals.swapInfo,
        amount: '10 000 WQT',
        sender: '0xnf8o29837hrvbn42o37hsho3b74thb3',
        recepient: '0xnf8o29837hrvbn42o37hsho3b74thb3',
        worknetFee: '0,5 WQT',
        binanceFee: '0,0009 BNB',
      });
    },
    showTakeWithdraw() {
      this.ShowModal({
        key: modals.takeWithdraw,
        branch: 'withdraw',
      });
    },
    showTransactionSend() {
      this.ShowModal({
        key: modals.transactionSend,
        branch: 'withdraw',
      });
    },
    showWelcome() {
      this.ShowModal({
        key: modals.welcome,
        branch: 'withdraw',
      });
    },
    showWithdrawAbout() {
      this.ShowModal({
        key: modals.withdrawAbout,
        branch: 'withdraw',
      });
    },
    showWithdrawAOptions() {
      this.ShowModal({
        key: modals.withdrawOptions,
        branch: 'withdraw',
      });
    },
    showWithdrawInfo() {
      this.ShowModal({
        key: modals.withdrawInfo,
      });
    },
    showAddLiquidityNew() {
      this.ShowModal({
        key: modals.addLiquidity,
      });
    },
    showAddingCardNew() {
      this.ShowModal({
        key: modals.addingCard,
      });
    },
    showApplyForAPension() {
      this.ShowModal({
        key: modals.applyForAPension,
      });
    },

    showAreYouSureDelete() {
      this.ShowModal({
        key: modals.areYouSureDelete,
      });
    },
    showAreYouSureNotification() {
      this.ShowModal({
        key: modals.areYouSureNotification,
      });
    },
    showCardAdded() {
      this.ShowModal({
        key: modals.cardAdded,
      });
    },
    showChangePassword() {
      this.ShowModal({
        key: modals.changePassword,
      });
    },
    showClaim() {
      this.ShowModal({
        key: modals.claim,
      });
    },
    showConfirmDetails() {
      this.ShowModal({
        key: modals.confirmDetails,
      });
    },
    showConfirmLoanDetails() {
      this.ShowModal({
        key: modals.confirmLoanDetails,
      });
    },
    showCopiedSuccess() {
      this.ShowModal({
        key: modals.copiedSuccess,
      });
    },
    showCreditingLoan() {
      this.ShowModal({
        key: modals.creditingLoan,
      });
    },
    showCreditingDepositNew() {
      this.ShowModal({
        key: modals.creditingDeposit,
      });
    },
    showDepositOptions() {
      this.ShowModal({
        key: modals.depositOptions,
      });
    },
    showGiveDeposit() {
      this.ShowModal({
        key: modals.giveDeposit,
      });
    },
    showTransfer() {
      this.ShowModal({
        key: modals.giveTransfer,
      });
    },
    showInsureCase() {
      this.ShowModal({
        key: modals.insureCase,
      });
    },
    showInvitation() {
      this.ShowModal({
        key: modals.invitation,
      });
    },
    showMakeDepositNew() {
      this.ShowModal({
        key: modals.makeDeposit,
      });
    },
    showNoticeChat() {
      this.ShowModal({
        key: modals.noticeChat,
      });
    },
    showOpenADeposit() {
      this.ShowModal({
        key: modals.openADeposit,
      });
    },
    showOpenADispute() {
      this.ShowModal({
        key: modals.openADispute,
      });
    },
    showChangePasswordNew() {
      this.ShowModal({
        key: modals.changePassInSettings,
      });
    },
    show2Fa() {
      this.ShowModal({
        key: modals.twoFAAuth,
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
