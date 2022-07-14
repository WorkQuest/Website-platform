<template>
  <transition name="fade">
    <div
      v-if="isShow"
      class="ctm-modal"
      @mousedown.self="backgroundClick"
    >
      <component :is="currentModalKey" />
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '@/store/modals/modals';

export default {
  name: 'ModalBox',
  components: {
    [modals.questAgreed]: () => import('./CtmModalQuestAgreed'),
    [modals.inviteSend]: () => import('./CtmModalInviteSend'),
    [modals.cardAdded]: () => import('./CtmModalCardAdded'),
    [modals.thanks]: () => import('./CtmModalThanksSend'),
    [modals.transactionSend]: () => import('./CtmModalTransactionSend'),
    [modals.emailConfirm]: () => import('./CtmModalConfirmEmail'),
    [modals.neededToEnable2FA]: () => import('./CtmModalNeededToEnable2FA'),
    [modals.messageSend]: () => import('./CtmModalMessageSend'),
    [modals.status]: () => import('./CtmModalStatus'),
    [modals.skills]: () => import('./CtmModalSkills'),
    [modals.downloadApp]: () => import('./CtmModalDownloadApp'),
    [modals.collateralTransaction]: () => import('./CtmModalCollateralTransaction'),
    [modals.getWUSD]: () => import('./CtmModalGetWUSD'),
    [modals.buyAuction]: () => import('./CtmModalBuyAuction'),
    [modals.stake]: () => import('./CtmModalStake'),
    [modals.transactionReceipt]: () => import('./CtmModalTransactionReceipt'),
    [modals.questFilterFull]: () => import('./CtmModalQuestFilterFull'),
    [modals.restore]: () => import('./CtmModalRestore'),
    [modals.privacy]: () => import('./CtmModalPrivacy'),
    [modals.sendARequest]: () => import('./CtmModalSendARequest'),
    [modals.deposit]: () => import('./CtmModalDeposit'),
    [modals.addCard]: () => import('./CtmModalAddCard'),
    [modals.withdraw]: () => import('./CtmModalWithdraw'),
    [modals.review]: () => import('./CtmModalReviewEmployer'),
    [modals.invitation]: () => import('./CtmModalInvitation'),
    [modals.raiseViews]: () => import('./CtmModalRaiseViews'),
    [modals.applyForAPension]: () => import('./CtmModalApplyForAPension'),
    [modals.changePercent]: () => import('./CtmModalChangePercent'),
    [modals.openADeposit]: () => import('./CtmModalOpenADeposit'),
    [modals.addLiquidity]: () => import('./CtmModalAddLiquidity'),
    [modals.removeLiquidity]: () => import('./CtmModalRemoveLiquidity'),
    [modals.creditingDeposit]: () => import('./CtmModalCreditingDeposit'),
    [modals.confirmDetails]: () => import('./CtmModalConfirmDetails'),
    [modals.insureCase]: () => import('./CtmModalInsureCase'),
    [modals.withdrawAbout]: () => import('./CtmModalWithdrawAbout'),
    [modals.addCase]: () => import('./CtmModalAddCase'),
    [modals.openADispute]: () => import('./CtmModalOpenADispute'),
    [modals.notice]: () => import('./CtmModalNotice'),
    [modals.noticeChat]: () => import('./CtmModalNoticeChat'),
    [modals.transfer]: () => import('./CtmModalTransfer'),
    [modals.changePassInSettings]: () => import('./CtmModalChangePassInSettings'),
    [modals.twoFAAuth]: () => import('./CtmModalTwoFAAuth'),
    [modals.creditingLoan]: () => import('./CtmModalCreditingLoan'),
    [modals.signWorkQuest]: () => import('./CtmModalSignWorkQuest'),
    [modals.securityCheck]: () => import('./CtmModalSecurityCheck'),
    [modals.sharingQuest]: () => import('./CtmModalSharing'),
    [modals.support]: () => import('./CtmModalSupport'),
    [modals.changeRoleWarning]: () => import('./CtmModalChangeRoleWarning'),
    [modals.changeRoleReason]: () => import('./CtmModalChangeRoleReason'),
    [modals.chooseNecessarySkills]: () => import('./CtmModalChooseNecessarySkills'),
    [modals.smsVerification]: () => import('./CtmModalSmsVerification'),
    [modals.reviewDetails]: () => import('./CtmModalReviewDetails'),
    [modals.chatCreate]: () => import('./CtmModalChatCreate'),
    [modals.payment]: () => import('./CtmModalPayment'),
    [modals.disable2FA]: () => import('./CtmModalDisable2FA'),
    [modals.showImage]: () => import('./CtmModalShowImage'),
    [modals.giveDeposit]: () => import('./CtmModalGiveDeposit'),
    [modals.addingCard]: () => import('./CtmModalAddingCard'),
    [modals.depositOptions]: () => import('./CtmModalDepositOptions'),
    [modals.takeWithdraw]: () => import('./CtmModalTakeWithdraw'),
    [modals.withdrawInfo]: () => import('./CtmModalWithdrawInfo'),
    [modals.withdrawOptions]: () => import('./CtmModalWithdrawOptions'),
    [modals.walletWithdraw]: () => import('./CtmModalWalletWithdraw'),
    [modals.paymentOptions]: () => import('./CtmModalPaymentOptions'),
    [modals.areYouSureDelete]: () => import('./CtmModalAreYouSureDelete'),
    [modals.swap]: () => import('./CtmModalSwap'),
    [modals.swapInfo]: () => import('./CtmModalSwapInfo'),
    [modals.areYouSureNotification]: () => import('./CtmModalAreYouSureNotification'),
    [modals.priceSearch]: () => import('./CtmModalPrice'),
    [modals.editCase]: () => import('./CtmModalEditCase'),
    [modals.deleteCase]: () => import('./CtmModalDeleteCase'),
    [modals.swapTokens]: () => import('./CtmModalSwapTokens'),
    [modals.gallery]: () => import('./CtmModalGallery'),
    [modals.areYouSure]: () => import('./CtmModalAreYouSure'),
    [modals.referralClaim]: () => import('./CtmModalReferralClaim'),
    [modals.valueSend]: () => import('./CtmModalValueSend'),
    [modals.claimRewards]: () => import('./CtmModalClaimRewards'),
    [modals.buyWQT]: () => import('./CtmModalBuyWQT'),
    [modals.referralRegistration]: () => import('./CtmModalRegisterReferral'),
    [modals.report]: () => import('./CtmModalReport'),
    [modals.pendingHash]: () => import('./CtmModalPendingHashStatus'),
  },
  data: () => ({ modals }),
  computed: {
    ...mapGetters({
      isShow: 'modals/getIsShow',
      currentModalKey: 'modals/getCurrentModalKey',
      options: 'modals/getOptions',
    }),
  },
  methods: {
    backgroundClick() {
      if (!this.options.isUnclosable) this.$store.dispatch('modals/hide');
    },
  },
};
</script>
<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}
</style>
