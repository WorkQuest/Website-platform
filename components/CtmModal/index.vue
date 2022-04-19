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
import CtmModalCollateralTransaction from './CtmModalCollateralTransaction';
import CtmModalStake from './CtmModalStake';
import CtmModalTransactionReceipt from './CtmModalTransactionReceipt';
import CtmModalConfirmEmail from './CtmModalConfirmEmail';
import CtmModalChangePassword from './CtmModalChangePassword';
import CtmModalRestore from './CtmModalRestore';
import CtmModalPrivacy from './CtmModalPrivacy';
import CtmModalSkills from './CtmModalSkills';
import CtmModalMessageSend from './CtmModalMessageSend';
import CtmModalSendARequest from './CtmModalSendARequest';
import CtmModalRequestSend from './CtmModalRequestSend';
import CtmModalThanksSend from './CtmModalThanksSend';
import CtmModalQuestAgreed from './CtmModalQuestAgreed';
import CtmModalReviewEmployer from './CtmModalReviewEmployer';
import CtmModalTransactionSend from './CtmModalTransactionSend';
import CtmModalCardHasBeenAdded from './CtmModalCardHasBeenAdded';
import CtmModalDeposit from './CtmModalDeposit';
import CtmModalAddCard from './CtmModalAddCard';
import CtmModalWithdraw from './CtmModalWithdraw';
import CtmModalInvitation from './CtmModalInvitation';
import CtmModalInviteSend from './CtmModalInviteSend';
import CtmModalQuestCreated from './CtmModalQuestCreated';
import CtmModalRaiseViews from './CtmModalRaiseViews';
import CtmModalApplyForAPension from './CtmModalApplyForAPension';
import CtmModalMakeDeposit from './CtmModalMakeDeposit';
import CtmModalChangePercent from './CtmModalChangePercent';
import CtmModalOpenADeposit from './CtmModalOpenADeposit';
import CtmModalStatus from './CtmModalStatus';
import CtmModalAddLiquidity from './CtmModalAddLiquidity';
import CtmModalRemoveLiquidity from './CtmModalRemoveLiquidity';
import CtmModalCreditingDeposit from './CtmModalCreditingDeposit';
import CtmModalConfirmDetails from './CtmModalConfirmDetails';
import CtmModalInsureCase from './CtmModalInsureCase';
import CtmModalWithdrawAbout from './CtmModalWithdrawAbout';
import CtmModalAddCase from './CtmModalAddCase';
import CtmModalOpenADispute from './CtmModalOpenADispute';
import CtmModalNotice from './CtmModalNotice';
import CtmModalNoticeChat from './CtmModalNoticeChat';
import CtmModalTransfer from './CtmModalTransfer';
import CtmModalChangePassInSettings from './CtmModalChangePassInSettings';
import CtmModalTwoFAAuth from './CtmModalTwoFAAuth';
import CtmModalCreditingLoan from './CtmModalCreditingLoan';
import CtmModalSignWorkQuest from './CtmModalSignWorkQuest';
import CtmModalSecurityCheck from './CtmModalSecurityCheck';
import CtmModalSharing from './CtmModalSharing';
import CtmModalCopiedSuccess from './CtmModalCopiedSuccess';
import CtmModalChatCreate from './CtmModalChatCreate';
import CtmModalChangeRoleWarning from './CtmModalChangeRoleWarning';
import CtmModalChangeRoleReason from './CtmModalChangeRoleReason';
import CtmModalChooseNecessarySkills from './CtmModalChooseNecessarySkills';
import CtmModalSmsVerification from './CtmModalSmsVerification';
import CtmModalReviewDetails from './CtmModalReviewDetails';
import CtmModalPayment from './CtmModalPayment';
import CtmModalDisable2FA from './CtmModalDisable2FA';
import CtmModalQuestFilterFull from './CtmModalQuestFilterFull';
import CtmModalShowImage from './CtmModalShowImage';
import CtmModalGiveDeposit from './CtmModalGiveDeposit';
import CtmModalAddingCard from './CtmModalAddingCard';
import CtmModalDepositOptions from './CtmModalDepositOptions';
import CtmModalCardAdded from './CtmModalCardAdded';
import CtmModalTakeWithdraw from './CtmModalTakeWithdraw';
import CtmModalWithdrawInfo from './CtmModalWithdrawInfo';
import CtmModalWithdrawOptions from './CtmModalWithdrawOptions';
import CtmModalGiveTransfer from './CtmModalGiveTransfer';
import CtmModalPaymentOptions from './CtmModalPaymentOptions';
import CtmModalAreYouSureDelete from './CtmModalAreYouSureDelete';
import CtmModalSwap from './CtmModalSwap';
import CtmModalSwapInfo from './CtmModalSwapInfo';
import CtmModalAreYouSureNotification from './CtmModalAreYouSureNotification';
import CtmModalClaim from './CtmModalClaim';
import CtmModalPriceSearch from './CtmModalPrice';
import CtmModalEditCase from './CtmModalEditCase';
import CtmModalDeleteCase from './CtmModalDeleteCase';
import CtmModalClaimRewards from './CtmModalClaimRewards';
import CtmModalSwapTokens from './CtmModalSwapTokens';
import CtmModalGallery from './CtmModalGallery';
import CtmModalAreYouSure from './CtmModalAreYouSure';
import CtmModalGetWUSD from './CtmModalGetWUSD';
import CtmModalBuyAuction from './CtmModalBuyAuction';
import CtmModalNeededToEnable2FA from './CtmModalNeededToEnable2FA';
import CtmModalReferralClaim from './CtmModalReferralClaim';
import CtmModalDownloadApp from '~/components/CtmModal/CtmModalDownloadApp';
import CtmModalValueSend from '~/components/CtmModal/CtmModalValueSend';

export default {
  name: 'ModalBox',
  components: {
    [modals.downloadApp]: CtmModalDownloadApp,
    [modals.collateralTransaction]: CtmModalCollateralTransaction,
    [modals.neededToEnable2FA]: CtmModalNeededToEnable2FA,
    [modals.getWUSD]: CtmModalGetWUSD,
    [modals.buyAuction]: CtmModalBuyAuction,
    [modals.stake]: CtmModalStake,
    [modals.transactionReceipt]: CtmModalTransactionReceipt,
    [modals.questFilterFull]: CtmModalQuestFilterFull,
    [modals.emailConfirm]: CtmModalConfirmEmail,
    [modals.restore]: CtmModalRestore,
    [modals.changePassword]: CtmModalChangePassword,
    [modals.privacy]: CtmModalPrivacy,
    [modals.skills]: CtmModalSkills,
    [modals.messageSend]: CtmModalMessageSend,
    [modals.sendARequest]: CtmModalSendARequest,
    [modals.requestSend]: CtmModalRequestSend,
    [modals.questAgreed]: CtmModalQuestAgreed,
    [modals.transactionSend]: CtmModalTransactionSend,
    [modals.cardHasBeenAdded]: CtmModalCardHasBeenAdded,
    [modals.deposit]: CtmModalDeposit,
    [modals.addCard]: CtmModalAddCard,
    [modals.withdraw]: CtmModalWithdraw,
    [modals.review]: CtmModalReviewEmployer,
    [modals.thanks]: CtmModalThanksSend,
    [modals.invitation]: CtmModalInvitation,
    [modals.inviteSend]: CtmModalInviteSend,
    [modals.questCreated]: CtmModalQuestCreated,
    [modals.raiseViews]: CtmModalRaiseViews,
    [modals.applyForAPension]: CtmModalApplyForAPension,
    [modals.makeDeposit]: CtmModalMakeDeposit,
    [modals.changePercent]: CtmModalChangePercent,
    [modals.openADeposit]: CtmModalOpenADeposit,
    [modals.status]: CtmModalStatus,
    [modals.addLiquidity]: CtmModalAddLiquidity,
    [modals.removeLiquidity]: CtmModalRemoveLiquidity,
    [modals.creditingDeposit]: CtmModalCreditingDeposit,
    [modals.confirmDetails]: CtmModalConfirmDetails,
    [modals.insureCase]: CtmModalInsureCase,
    [modals.withdrawAbout]: CtmModalWithdrawAbout,
    [modals.addCase]: CtmModalAddCase,
    [modals.openADispute]: CtmModalOpenADispute,
    [modals.notice]: CtmModalNotice,
    [modals.noticeChat]: CtmModalNoticeChat,
    [modals.transfer]: CtmModalTransfer,
    [modals.changePassInSettings]: CtmModalChangePassInSettings,
    [modals.twoFAAuth]: CtmModalTwoFAAuth,
    [modals.creditingLoan]: CtmModalCreditingLoan,
    [modals.signWorkQuest]: CtmModalSignWorkQuest,
    [modals.securityCheck]: CtmModalSecurityCheck,
    [modals.sharingQuest]: CtmModalSharing,
    [modals.copiedSuccess]: CtmModalCopiedSuccess,
    [modals.changeRoleWarning]: CtmModalChangeRoleWarning,
    [modals.changeRoleReason]: CtmModalChangeRoleReason,
    [modals.chooseNecessarySkills]: CtmModalChooseNecessarySkills,
    [modals.smsVerification]: CtmModalSmsVerification,
    [modals.reviewDetails]: CtmModalReviewDetails,
    [modals.chatCreate]: CtmModalChatCreate,
    [modals.payment]: CtmModalPayment,
    [modals.disable2FA]: CtmModalDisable2FA,
    [modals.showImage]: CtmModalShowImage,
    [modals.giveDeposit]: CtmModalGiveDeposit,
    [modals.addingCard]: CtmModalAddingCard,
    [modals.depositOptions]: CtmModalDepositOptions,
    [modals.cardAdded]: CtmModalCardAdded,
    [modals.takeWithdraw]: CtmModalTakeWithdraw,
    [modals.withdrawInfo]: CtmModalWithdrawInfo,
    [modals.withdrawOptions]: CtmModalWithdrawOptions,
    [modals.giveTransfer]: CtmModalGiveTransfer,
    [modals.paymentOptions]: CtmModalPaymentOptions,
    [modals.areYouSureDelete]: CtmModalAreYouSureDelete,
    [modals.swap]: CtmModalSwap,
    [modals.swapInfo]: CtmModalSwapInfo,
    [modals.areYouSureNotification]: CtmModalAreYouSureNotification,
    [modals.claim]: CtmModalClaim,
    [modals.priceSearch]: CtmModalPriceSearch,
    [modals.editCase]: CtmModalEditCase,
    [modals.deleteCase]: CtmModalDeleteCase,
    [modals.claimRewards]: CtmModalClaimRewards,
    [modals.swapTokens]: CtmModalSwapTokens,
    [modals.gallery]: CtmModalGallery,
    [modals.areYouSure]: CtmModalAreYouSure,
    [modals.referralClaim]: CtmModalReferralClaim,
    [modals.valueSend]: CtmModalValueSend,
  },
  data: () => ({
    modals,
  }),
  computed: {
    ...mapGetters({
      isShow: 'modals/getIsShow',
      currentModalKey: 'modals/getCurrentModalKey',
      options: 'modals/getOptions',
    }),
  },
  methods: {
    backgroundClick() {
      if (!this.options.isUnclosable) {
        this.close();
      }
    },
    close() {
      this.$store.dispatch('modals/hide');
    },
  },
};
</script>
<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}
</style>
