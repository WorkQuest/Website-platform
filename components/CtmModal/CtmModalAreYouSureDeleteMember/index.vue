<template>
  <ctm-modal-box
    class="sure"
    :is-header="false"
  >
    <div class="sure__content content">
      <img
        src="~assets/img/ui/message.svg"
        alt="Are you sure to delete?"
        class="content__picture"
      >
      <div class="content__title">
        {{ $t('modals.areYouSure') }}
      </div>
      <div class="content__desc">
        {{ $t('modals.sureDeleteMemberText') }}
      </div>
      <div class="content__action action">
        <base-btn
          class="action__button"
          mode="outline"
          @click="hide()"
        >
          {{ $t('meta.cancel') }}
        </base-btn>
        <base-btn
          class="action__button"
          @click="removeUser"
        >
          {{ $t('meta.delete') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalAreYouSureDeleteMember',
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      questData: 'quests/getQuest',
      chatId: 'chat/getCurrChatId',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();

      this.ShowModal({
        key: modals.chatCreate,
        itsOwner: true,
        isCreating: false,
        isMembersList: true,
        isAdding: false,
      });
    },
    async removeUser() {
      const { options: { userId }, chatId } = this;

      await this.$store.dispatch('chat/removeMember', { userId, chatId });

      this.hide();
    },
    async deleteQuest() {
      try {
        const questId = this.questData.id;
        await this.$store.dispatch('quests/deleteQuest', { questId });
        this.hide();
        this.toMyQuests();
        this.showToastDeleted();
      } catch (e) {
        console.log(e);
        this.showToastError(e);
      }
    },
    toMyQuests() {
      this.$router.push('/my');
    },
    showToastDeleted() {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.questDeleted'),
        variant: 'success',
        text: this.$t('toasts.questDeleted'),
      });
    },
    showToastError(e) {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.error'),
        variant: 'warning',
        text: e.response?.data?.msg,
      });
    },
    showErrorModal() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/error.svg'),
        title: this.$t('modals.error'),
        subtitle: this.$t('modals.youCan’tDeleteActiveQuest'),
        button: this.$t('modals.close'),
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.sure{
  max-width: 337px !important;
  &__content {
    padding: 30px!important;
  }
}
.content{
  &__title{
    font-weight: 500;
    font-size: 23px;
    line-height: 130%;
    margin: 30px 0 20px 0;
    text-align: center;
  }
  &__desc{
    color: #4C5767;
    font-size: 16px;
    line-height: 130%;
    text-align: center;
  }
  &__picture{
    margin-left: auto;
    margin-right: auto;
  }

}
.action{
  display: grid;
  grid-gap: 20px;
  gap: 20px;
  margin-top: 30px;
  grid-auto-flow: column;
  &__button{
    max-width: 129px!important;
  }
}
</style>
