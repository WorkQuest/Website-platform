<template>
  <div
    v-if="Object.keys(item).length"
    v-click-outside="closeQuestMenu"
    :data-selector="`COMPONENT-QUEST-DD-${questIndex}`"
    class="quest quest__menu"
  >
    <button
      class="quest__button quest__button_menu"
      :data-selector="`ACTION-BTN-TOGGLE-QUEST-MENU-${questIndex}`"
      @click="toggleQuestMenu()"
    >
      <span class="icon-more_vertical" />
    </button>
    <transition name="fade">
      <div
        v-if="isShowQuestMenu"
        class="quest menu"
      >
        <div class="menu menu__items">
          <div class="menu__container">
            <!-- <div
              v-if="canRaiseViews"
              class="menu__item"
              :data-selector="`ACTION-BTN-TO-RAISING-VIEWS-${questIndex}`"
              @click="toRaisingViews"
            >
              <div class="menu__text">
                {{ $t('meta.raiseViews') }}
              </div>
            </div> -->
            <div
              class="menu__item"
              :data-selector="`ACTION-BTN-SHARE-MODAL-${questIndex}`"
              @click="shareModal"
            >
              <div class="menu__text">
                {{ $t('modals.share') }}
              </div>
            </div>
            <div
              v-if="canEditOrDelete"
              class="menu__item"
              :data-selector="`ACTION-BTN-TO-EDIT-QUEST-${questIndex}`"
              @click="toEditQuest"
            >
              <div class="menu__text">
                {{ $t('meta.btns.edit') }}
              </div>
            </div>
            <div
              v-if="canEditOrDelete"
              class="menu__item"
              :data-selector="`ACTION-BTN-DELETE-QUEST-${questIndex}`"
              @click="showAreYouSureDeleteQuestModal"
            >
              <div class="menu__text">
                {{ $t('meta.btns.closeQuest') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ClickOutside from 'vue-click-outside';
import { Path } from '~/utils/enums';
import { QuestStatuses } from '~/utils/сonstants/quests';
import modals from '~/store/modals/modals';
import { images } from '~/utils/images';
import walletOperations from '~/plugins/mixins/walletOperations';

export default {
  name: 'QuestDD',
  directives: { ClickOutside },
  QuestStatuses,
  mixins: [walletOperations],
  props: {
    mode: {
      type: String,
      default: '',
    },
    questIndex: {
      type: Number,
      default: 0,
    },
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isShowQuestMenu: false,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      userRole: 'user/getUserRole',
      questData: 'quests/getQuest',
    }),
    canRaiseViews() {
      return [QuestStatuses.Created, QuestStatuses.WaitWorkerOnAssign].includes(this.item.status || this.questData.status);
    },
    canEditOrDelete() {
      return this.item ? this.item.status === QuestStatuses.Created : this.questData.status === QuestStatuses.Created;
    },
  },
  methods: {
    toEditQuest() {
      if (!this.userData.totpIsActive) {
        this.ShowModal({
          key: modals.status,
          img: images.ERROR,
          title: this.$t('modals.errors.error'),
          subtitle: this.$t('modals.2FA.youCantEditQuest'),
          button: this.$t('meta.btns.close'),
        });
        return;
      }

      this.ShowModal({
        key: modals.securityCheck,
        actionMethod: async () => this.editAction(),
      });
    },
    editAction() {
      const { status, id } = this.item;
      if (![QuestStatuses.Closed, QuestStatuses.Dispute].includes(status)) {
        this.$router.push(`${Path.EDIT_QUEST}/${id}`);
        this.setCurrentStepEditQuest(1);
      } else this.showToastWrongStatusEdit();
    },
    showAreYouSureDeleteQuestModal() {
      if (!this.userData.totpIsActive) {
        this.ShowModal({
          key: modals.status,
          img: images.ERROR,
          title: this.$t('modals.errors.error'),
          subtitle: this.$t('modals.2FA.youCantCloseQuest'),
          button: this.$t('meta.btns.close'),
        });
        return;
      }
      this.ShowModal({
        key: modals.securityCheck,
        actionMethod: () => {
          this.CloseModal();
          this.DeleteQuest(this.item);
        },
      });
    },
    toRaisingViews() {
      const { status, id } = this.item;

      if (![QuestStatuses.Closed, QuestStatuses.Dispute].includes(status)) {
        this.$router.push({ path: `${Path.EDIT_QUEST}/${id}`, query: { mode: 'raise' } });
        this.setCurrentStepEditQuest(2);
      } else this.showToastWrongStatusRaisingViews();
    },
    setCurrentStepEditQuest(step) {
      this.$store.commit('quests/setCurrentStepEditQuest', step);
    },
    showToastWrongStatusEdit() {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('meta.questInfo'),
        variant: 'warning',
        text: this.$t('toasts.questCantEdit'),
      });
    },
    showToastWrongStatusRaisingViews() {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('meta.questInfo'),
        variant: 'warning',
        text: this.$t('toasts.questCantRaisingViews'),
      });
    },
    shareModal() {
      this.ShowModal({
        key: modals.sharingQuest,
        itemId: this.item.id,
        mode: 'quest',
      });
    },
    closeQuestMenu() {
      this.isShowQuestMenu = false;
    },
    showOpenADisputeModal() {
      this.ShowModal({ key: modals.openADispute });
    },
    toggleQuestMenu() {
      this.isShowQuestMenu = !this.isShowQuestMenu;
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  color: $black200;
  font-size: 25px;
  cursor: pointer;
  transition: .5s;
  &:hover {
    color: $black500;
  }
  &-more_vertical {
    @extend .icon;
  }
  &-share_outline {
    @extend .icon;
  }
}

.quest {
  &__button {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black600;
    display: flex;
    justify-content: center;
    align-content: center;
    border-radius: 6px;
    width: 24px;
    height: 24px;
    border: 1px solid transparent;
    opacity: 0.5;
    &:hover {
      color: $black800;
      opacity: 1;
    }
    &_menu {
      display: flex;
      width: 30px;
      height: 30px;
      align-items: flex-start;
    }
  }
  &__menu {
    position: relative;
  }
}

.menu {
  position: absolute;
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 120px;
  right: 2px;
  &__container {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: flex-start;

  }
  &__item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-height: 20px;
    cursor: pointer;
    width: 100%;
    border-bottom: 1px solid $black100;
    &:hover {
      .menu__text {
        color: $black800;
      }
    }
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: $black500;
    transition: .5s;
    padding: 12px 15px;
    &:last-child {
      border: none;
    }
  }
}

@include _991 {
  .quest {
    &-menu {
      width: max-content;
    }
  }
}
</style>
