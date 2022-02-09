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
        {{ $t('modals.sureDeleteText') }}
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
          @click="deleteQuest()"
        >
          {{ $t('meta.delete') }}
        </base-btn>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import { QuestStatuses } from '~/utils/enums';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalAreYouSureDelete',
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    async deleteQuest() {
      const { id, status } = this.options.item;
      if ([QuestStatuses.Closed, QuestStatuses.Created].includes(status)) {
        await this.$store.dispatch('quests/deleteQuest', { id });
        await this.$store.dispatch('quests/getUserQuests', { userId: this.userData.id, role: this.userRole, query: {} });
        this.showToastDeleted();
      } else this.showToastWrongStatus();
      this.hide();
    },
    showToastWrongStatus() {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.questInfo'),
        variant: 'warning',
        text: this.$t('toasts.questCantDelete'),
      });
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

.sure {
  max-width: 337px !important;
  &__content {
    padding: 30px!important;
  }
}
.content {
  &__title {
    font-weight: 500;
    font-size: 23px;
    line-height: 130%;
    margin: 30px 0 20px 0;
    text-align: center;
  }
  &__desc {
    color: #4C5767;
    font-size: 16px;
    line-height: 130%;
    text-align: center;
  }
  &__picture {
    margin-left: auto;
    margin-right: auto;
  }

}
.action {
  display: grid;
  grid-gap: 20px;
  gap: 20px;
  margin-top: 30px;
  grid-auto-flow: column;
  &__button {
    max-width: 129px!important;
  }
}
</style>
