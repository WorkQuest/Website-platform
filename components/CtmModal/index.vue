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
      <CtmModalAreYouSure v-if="modals.areYouSure === currentModalKey" />
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
      <CtmModalWelcome v-if="modals.welcome === currentModalKey" />
      <CtmModalOpenADispute v-if="modals.openADispute === currentModalKey" />
      <CtmModalNotice v-if="modals.notice === currentModalKey" />
      <CtmModalTransfer v-if="modals.transfer === currentModalKey" />
    </div>
  </transition>
</template>
<script>
import { mapGetters } from 'vuex';
import modals from '@/store/modals/modals';
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
import CtmModalAreYouSure from './CtmModalAreYouSure';
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
import CtmModalWelcome from './CtmModalWelcome';
import CtmModalOpenADispute from './CtmModalOpenADispute';
import CtmModalNotice from './CtmModalNotice';
import CtmModalTransfer from './CtmModalTransfer';

export default {
  name: 'ModalBox',
  components: {
    CtmModalConfirmEmail,
    CtmModalRestore,
    CtmModalChangePassword,
    CtmModalPrivacy,
    CtmModalSkills,
    CtmModalMessageSend,
    CtmModalSendARequest,
    CtmModalRequestSend,
    CtmModalQuestAgreed,
    CtmModalAreYouSure,
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
    CtmModalWelcome,
    CtmModalOpenADispute,
    CtmModalNotice,
    CtmModalTransfer,
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
