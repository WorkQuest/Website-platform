<template>
  <div
    v-click-outside="closeQuestMenu"
    :data-selector="`COMPONENT-QUEST-DD`"
    class="quest quest__menu"
  >
    <button
      class="quest__button quest__button_menu"
      :data-selector="`ACTION-BTN-TOGGLE-QUEST-MENU`"
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
            <div
              class="menu__item"
              :data-selector="`ACTION-BTN-TO-RAISING-VIEWS`"
              @click="toRaisingViews"
            >
              <div class="menu__text">
                {{ $t('modals.raiseViews') }}
              </div>
            </div>
            <div
              class="menu__item"
              :data-selector="`ACTION-BTN-SHARE-MODAL`"
              @click="shareModal()"
            >
              <div class="menu__text">
                {{ $t('modals.share') }}
              </div>
            </div>
            <div
              class="menu__item"
              :data-selector="`ACTION-BTN-TO-EDIT-QUEST`"
              @click="toEditQuest()"
            >
              <div class="menu__text">
                {{ $t('modals.edit') }}
              </div>
            </div>
            <div
              class="menu__item"
              :data-selector="`ACTION-BTN-DELETE-QUEST`"
              @click="showAreYouSureDeleteQuestModal()"
            >
              <div class="menu__text">
                {{ $t('modals.delete') }}
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
import { QuestStatuses, Path } from '~/utils/enums';
import modals from '~/store/modals/modals';

export default {
  name: 'QuestDD',
  directives: { ClickOutside },
  props: {
    mode: {
      type: String,
      default: '',
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
      userRole: 'user/getUserRole',
      questData: 'quests/getQuest',
    }),
  },
  methods: {
    toEditQuest() {
      // TODO: Исправить логику editQuest
      // if (![QuestStatuses.Closed, QuestStatuses.Dispute].includes(this.item.status)) {
      //   this.$router.push(`${Path.EDIT_QUEST}/${this.item.id}`);
      //   this.setCurrentStepEditQuest(1);
      // } else this.showToastWrongStatusEdit();
    },
    showAreYouSureDeleteQuestModal() {
      // TODO: Исправить логику deleteQuest
      // this.ShowModal({ key: modals.areYouSureDeleteQuest, item: this.item });
    },
    toRaisingViews() {
      if (![QuestStatuses.Closed, QuestStatuses.Dispute].includes(this.item.status)) {
        this.$router.push({ path: `${Path.EDIT_QUEST}/${this.item.id}`, query: { mode: 'raise' } });
        this.setCurrentStepEditQuest(2);
      } else this.showToastWrongStatusRaisingViews();
    },
    setCurrentStepEditQuest(step) {
      this.$store.commit('quests/setCurrentStepEditQuest', step);
    },
    showToastWrongStatusEdit() {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.questInfo'),
        variant: 'warning',
        text: this.$t('toasts.questCantEdit'),
      });
    },
    showToastWrongStatusRaisingViews() {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.questInfo'),
        variant: 'warning',
        text: this.$t('toasts.questCantRaisingViews'),
      });
    },
    shareModal() {
      this.ShowModal({ key: modals.sharingQuest, itemId: this.item.id });
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
