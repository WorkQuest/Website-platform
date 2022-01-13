<template>
  <div
    v-click-outside="closeQuestMenu()"
    class="quest quest__menu"
  >
    <button
      class="quest__button quest__button_menu"
      @click="toggleQuestMenu()"
    >
      <span
        :class="[
          { 'icon-more_horizontal': userRole === 'employer' && mode === null },
          { 'icon-more_vertical': userRole === 'employer' && mode === 'vertical' },
          { 'icon-share_outline': userRole === 'worker' },
        ]"
      />
    </button>
    <transition name="fade">
      <div
        v-if="isShowQuestMenu"
        class="quest menu"
      >
        <div class="menu menu__items">
          <span class="menu__container">
            <div
              v-if="['employer'].includes(userRole)"
              class="menu__item"
              @click="toRaisingViews()"
            >
              <div class="menu__text">
                {{ $t('modals.raiseViews') }}
              </div>
            </div>
            <div
              class="menu__item"
              @click="shareModal()"
            >
              <div class="menu__text">
                {{ $t('modals.share') }}
              </div>
            </div>
            <div
              v-if="['employer'].includes(userRole)"
              class="menu__item"
              @click="toEditQuest()"
            >
              <div class="menu__text">
                {{ $t('modals.edit') }}
              </div>
            </div>
            <div
              v-if="['employer'].includes(userRole)"
              class="menu__item"
              @click="showAreYouSureDeleteQuestModal()"
            >
              <div class="menu__text">
                {{ $t('modals.delete') }}
              </div>
            </div>
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ClickOutside from 'vue-click-outside';
import { QuestStatuses } from '~/utils/enums';
import modals from '~/store/modals/modals';

export default {
  name: 'ChatMenu',
  directives: {
    ClickOutside,
  },
  props: {
    mode: {
      type: [String],
      default: null,
    },
    itemId: {
      type: String,
      default: '',
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
      if (![QuestStatuses.Closed, QuestStatuses.Dispute].includes(this.questData.status)) {
        this.$router.push(`/edit-quest/${this.itemId}`);
        this.$store.dispatch('quests/getCurrentStepEditQuest', 1);
      } else {
        this.showToastWrongStatusEdit();
      }
    },
    toRaisingViews() {
      // TODO: Добавить тост или модалку
      if (![QuestStatuses.Closed, QuestStatuses.Dispute].includes(this.questData.status)) {
        this.$router.push(`/edit-quest/${this.itemId}`);
        this.$store.dispatch('quests/getCurrentStepEditQuest', 2);
      } else {
        this.showToastWrongStatusRaisingViews();
      }
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
      this.ShowModal({
        key: modals.sharingQuest,
        itemId: this.itemId,
      });
    },
    closeQuestMenu() {
      this.isShowQuestMenu = false;
    },
    showAreYouSureDeleteQuestModal() {
      this.ShowModal({
        key: modals.areYouSureDeleteQuest,
      });
    },
    showOpenADisputeModal() {
      this.ShowModal({
        key: modals.openADispute,
      });
    },
    toggleQuestMenu() {
      this.isShowQuestMenu = !this.isShowQuestMenu;
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  color: $black500;
  font-size: 19px;
  &-more_horizontal {
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
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    width: 20px;
    height: 20px;
    border: 1px solid transparent;
    &:hover {
      color: $black800;
    }
    &_menu {
      display: flex;
      justify-self: flex-end;
      width: 30px;
      height: 30px;
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
