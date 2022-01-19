<template>
  <transition name="fade">
    <div
      v-if="isShow"
      class="ctm-modal"
      @mousedown.self="backgroundClick"
    >
      <ctm-modal-box
        v-if="modals.default === currentModalKey"
      >
        <div class="ctm-modal__content ctm-modal__text">
          {{ options.text }}
        </div>
      </ctm-modal-box>
      <CtmModalConfirmPassword v-if="modals.confirmPassword === currentModalKey" />
      <CtmModalConfirmEmail v-if="modals.emailConfirm === currentModalKey" />
      <CtmModalRestore v-if="modals.restore === currentModalKey" />
      <CtmModalChangePassword v-if="modals.changePassword === currentModalKey" />
      <CtmModalPrivacy v-if="modals.privacy === currentModalKey" />
      <CtmModalSkills v-if="modals.skills === currentModalKey" />
      <CtmModalMessageSend v-if="modals.messageSend === currentModalKey" />
      <CtmModalSendARequest v-if="modals.sendARequest === currentModalKey" />
      <CtmModalRequestSend v-if="modals.requestSend === currentModalKey" />
      <CtmModalThanksSend v-if="modals.thanks === currentModalKey" />
      <CtmModalQuestAgreed v-if="modals.questAgreed === currentModalKey" />
      <CtmModalTransactionSend v-if="modals.transactionSend === currentModalKey" />
      <CtmModalCardHasBeenAdded v-if="modals.cardHasBeenAdded === currentModalKey" />
      <CtmModalDeposit v-if="modals.deposit === currentModalKey" />
      <CtmModalAddCard v-if="modals.addCard === currentModalKey" />
      <CtmModalWithdraw v-if="modals.withdraw === currentModalKey" />
      <CtmModalReviewEmployer v-if="modals.review === currentModalKey" />
      <CtmModalInviteSend v-if="modals.inviteSend === currentModalKey" />
      <CtmModalQuestCreated v-if="modals.questCreated === currentModalKey" />
      <CtmModalRaiseViews v-if="modals.raiseViews === currentModalKey" />
      <CtmModalInvitation v-if="modals.invitation === currentModalKey" />
      <CtmModalApplyForAPension v-if="modals.applyForAPension === currentModalKey" />
      <CtmModalMakeDeposit v-if="modals.makeDeposit === currentModalKey" />
      <CtmModalChangePercent v-if="modals.changePercent === currentModalKey" />
      <CtmModalOpenADeposit v-if="modals.openADeposit === currentModalKey" />
      <CtmModalStatus v-if="modals.status === currentModalKey" />
      <CtmModalAddLiquidity v-if="modals.addLiquidity === currentModalKey" />
      <CtmModalRemoveLiquidity v-if="modals.removeLiquidity === currentModalKey" />
      <CtmModalCreditingDeposit v-if="modals.creditingDeposit === currentModalKey" />
      <CtmModalConfirmDetails v-if="modals.confirmDetails === currentModalKey" />
      <CtmModalInsureCase v-if="modals.insureCase === currentModalKey" />
      <CtmModalWithdrawAbout v-if="modals.withdrawAbout === currentModalKey" />
      <CtmModalAddCase v-if="modals.addCase === currentModalKey" />
      <CtmModalOpenADispute v-if="modals.openADispute === currentModalKey" />
      <CtmModalNotice v-if="modals.notice === currentModalKey" />
      <CtmModalNoticeChat v-if="modals.noticeChat === currentModalKey" />
      <CtmModalTransfer v-if="modals.transfer === currentModalKey" />
      <CtmModalChangePassInSettings v-if="modals.changePassInSettings === currentModalKey" />
      <CtmModalTwoFAAuth v-if="modals.twoFAAuth === currentModalKey" />
      <CtmModalSignWorkQuest v-if="modals.signWorkQuest === currentModalKey" />
      <CtmModalSecurityCheck v-if="modals.securityCheck === currentModalKey" />
      <CtmModalSharing v-if="modals.sharingQuest === currentModalKey" />
      <CtmModalCopiedSuccess v-if="modals.copiedSuccess === currentModalKey" />
      <CtmModalChangeRoleWarning v-if="modals.changeRoleWarning === currentModalKey" />
      <CtmModalChangeRoleReason v-if="modals.changeRoleReason === currentModalKey" />
      <CtmModalChooseNecessarySkills v-if="modals.chooseNecessarySkills === currentModalKey" />
      <CtmModalCreditingLoan v-if="modals.creditingLoan === currentModalKey" />
      <CtmModalConfirmLoanDetails v-if="modals.confirmLoanDetails === currentModalKey" />
      <CtmModalSmsVerification v-if="modals.smsVerification === currentModalKey" />
      <CtmModalReviewDetails v-if="modals.reviewDetails === currentModalKey" />
      <CtmModalChatCreate v-if="modals.chatCreate === currentModalKey" />
      <CtmModalPayment v-if="modals.payment === currentModalKey" />
      <CtmModalDisable2FA v-if="modals.disable2FA === currentModalKey" />
      <CtmModalQuestFilterFull v-if="modals.questFilterFull === currentModalKey" />
      <CtmModalShowImage v-if="modals.showImage === currentModalKey" />
      <CtmModalPriceSearch v-if="modals.priceSearch === currentModalKey" />
      <CtmModalGiveDeposit v-if="modals.giveDeposit === currentModalKey" />
      <CtmModalAddingCard v-if="modals.addingCard === currentModalKey" />
      <CtmModalDepositOptions v-if="modals.depositOptions === currentModalKey" />
      <CtmModalCardAdded v-if="modals.cardAdded === currentModalKey" />
      <CtmModalTakeWithdraw v-if="modals.takeWithdraw === currentModalKey" />
      <CtmModalWithdrawInfo v-if="modals.withdrawInfo === currentModalKey" />
      <CtmModalWithdrawOptions v-if="modals.withdrawOptions === currentModalKey" />
      <CtmModalGiveTransfer v-if="modals.giveTransfer === currentModalKey" />
      <CtmModalPaymentOptions v-if="modals.paymentOptions === currentModalKey" />
      <CtmModalAreYouSureDelete v-if="modals.areYouSureDelete === currentModalKey" />
      <CtmModalAreYouSureNotification v-if="modals.areYouSureNotification === currentModalKey" />
      <CtmModalSwap v-if="modals.swap === currentModalKey" />
      <CtmModalSwapInfo v-if="modals.swapInfo === currentModalKey" />
      <CtmModalClaim v-if="modals.claim === currentModalKey" />
      <CtmModalAreYouSureDeleteQuest v-if="modals.areYouSureDeleteQuest === currentModalKey" />
      <CtmModalEditCase v-if="modals.editCase === currentModalKey" />
      <CtmModalDeleteCase v-if="modals.deleteCase === currentModalKey" />
      <CtmModalClaimRewards v-if="modals.claimRewards === currentModalKey" />
      <CtmModalSwapTokens v-if="modals.swapTokens === currentModalKey" />
      <CtmModalGallery v-if="modals.gallery === currentModalKey" />
      <CtmModalAreYouSureDeleteMember v-if="modals.areYouSureDeleteMember === currentModalKey" />
      <CtmModalAreYouSureLeaveChat v-if="modals.areYouSureLeaveChat === currentModalKey" />
      <CtmModalTransactionReceipt v-if="modals.transactionReceipt === currentModalKey" />
    </div>
  </transition>
</template>
<script>
import { mapGetters } from 'vuex';
import modals from '@/store/modals/modals';
import CtmModalTransactionReceipt from './CtmModalTransactionReceipt';
import CtmModalConfirmPassword from './CtmModalConfirmPassword';
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
import CtmModalConfirmLoanDetails from './CtmModalConfirmLoanDetails';
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
import CtmModalAreYouSureDeleteQuest from './CtmModalAreYouSureDeleteQuest';
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
import CtmModalAreYouSureDeleteMember from './CtmModalAreYouSureDeleteMember';
import CtmModalAreYouSureLeaveChat from './CtmModalAreYouSureLeaveChat';

export default {
  name: 'ModalBox',
  components: {
    CtmModalTransactionReceipt,
    CtmModalConfirmPassword,
    CtmModalQuestFilterFull,
    CtmModalConfirmEmail,
    CtmModalRestore,
    CtmModalChangePassword,
    CtmModalPrivacy,
    CtmModalSkills,
    CtmModalMessageSend,
    CtmModalSendARequest,
    CtmModalRequestSend,
    CtmModalQuestAgreed,
    CtmModalTransactionSend,
    CtmModalCardHasBeenAdded,
    CtmModalDeposit,
    CtmModalAddCard,
    CtmModalWithdraw,
    CtmModalReviewEmployer,
    CtmModalThanksSend,
    CtmModalInvitation,
    CtmModalInviteSend,
    CtmModalQuestCreated,
    CtmModalRaiseViews,
    CtmModalApplyForAPension,
    CtmModalMakeDeposit,
    CtmModalChangePercent,
    CtmModalOpenADeposit,
    CtmModalStatus,
    CtmModalAddLiquidity,
    CtmModalRemoveLiquidity,
    CtmModalCreditingDeposit,
    CtmModalConfirmDetails,
    CtmModalInsureCase,
    CtmModalWithdrawAbout,
    CtmModalAddCase,
    CtmModalOpenADispute,
    CtmModalNotice,
    CtmModalNoticeChat,
    CtmModalTransfer,
    CtmModalChangePassInSettings,
    CtmModalTwoFAAuth,
    CtmModalCreditingLoan,
    CtmModalConfirmLoanDetails,
    CtmModalSignWorkQuest,
    CtmModalSecurityCheck,
    CtmModalSharing,
    CtmModalCopiedSuccess,
    CtmModalChangeRoleWarning,
    CtmModalChangeRoleReason,
    CtmModalChooseNecessarySkills,
    CtmModalSmsVerification,
    CtmModalReviewDetails,
    CtmModalChatCreate,
    CtmModalPayment,
    CtmModalDisable2FA,
    CtmModalShowImage,
    CtmModalGiveDeposit,
    CtmModalAddingCard,
    CtmModalDepositOptions,
    CtmModalCardAdded,
    CtmModalTakeWithdraw,
    CtmModalWithdrawInfo,
    CtmModalWithdrawOptions,
    CtmModalGiveTransfer,
    CtmModalPaymentOptions,
    CtmModalAreYouSureDelete,
    CtmModalSwap,
    CtmModalSwapInfo,
    CtmModalAreYouSureNotification,
    CtmModalClaim,
    CtmModalAreYouSureDeleteQuest,
    CtmModalPriceSearch,
    CtmModalEditCase,
    CtmModalDeleteCase,
    CtmModalClaimRewards,
    CtmModalSwapTokens,
    CtmModalGallery,
    CtmModalAreYouSureDeleteMember,
    CtmModalAreYouSureLeaveChat,
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
