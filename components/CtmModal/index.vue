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
      <CtmModalMessage v-if="modals.message === currentModalKey" />
      <CtmModalMessageSend v-if="modals.messageSend === currentModalKey" />
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
import CtmModalMessage from './CtmModalMessage';
import CtmModalMessageSend from './CtmModalMessageSend';

export default {
  name: 'ModalBox',
  components: {
    CtmModalConfirmEmail,
    CtmModalRestore,
    CtmModalChangePassword,
    CtmModalPrivacy,
    CtmModalSkills,
    CtmModalMessage,
    CtmModalMessageSend,
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
