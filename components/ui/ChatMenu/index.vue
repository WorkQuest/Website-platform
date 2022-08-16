<template>
  <div
    class="icon-more chat__button_menu"
  >
    <button
      v-click-outside="closeChatMenu"
      class="chat__button "
      @click="toggleChatMenu"
    >
      <span class="icon-more_horizontal" />
    </button>
    <transition name="fade">
      <div
        v-if="isShowChatMenu"
        class="chat-menu"
        :class="menuItems.length?'chat-menu-secondary-position':'chat-menu-main-position'"
      >
        <div class="chat-menu__items">
          <template v-if="menuItems.length">
            <div
              v-for="(item, index) in menuItems"
              :key="index"
              class="chat-menu__item"
              @click="$emit(item)"
            >
              {{ $t(`chat.menu.${item}`) }}
            </div>
          </template>
          <template v-if="$route.name === 'messages'">
            <div
              class="chat-menu__item"
              @click="getStarredMessages"
            >
              {{ $t('chat.starredMessages') }}
            </div>
            <div
              class="chat-menu__item"
              @click="showCreateChatModal"
            >
              {{ $t('chat.createGroupChat') }}
            </div>
          </template>
          <template v-else>
            <div
              v-if="isCanOpenDispute && isOpenDispute"
              class="chat-menu__item"
              @click="showOpenADisputeModal()"
            >
              {{ $t('meta.openDispute') }}
            </div>
            <div
              v-if="canILeave"
              class="chat-menu__item"
              @click="tryLeaveChat"
            >
              {{ $t('chat.leaveChat') }}
            </div>
            <div
              v-if="!hideDeleteChat"
              class="chat-menu__item"
              @click="deleteChat"
            >
              {{ $t('chat.delete') }}
            </div>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';
import { mapGetters } from 'vuex';
import { Path } from '~/utils/enums';
import { ChatType } from '~/utils/сonstants/chat';
import { QuestStatuses } from '~/utils/сonstants/quests';
import modals from '~/store/modals/modals';

export default {
  name: 'ChatMenu',
  directives: {
    ClickOutside,
  },
  props: {
    starred: {
      type: Boolean,
      default: false,
    },
    canILeave: {
      type: Boolean,
      default: false,
    },
    hideDeleteChat: {
      type: Boolean,
      default: false,
    },
    menuItems: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      isShowChatMenu: false,
    };
  },
  computed: {
    ...mapGetters({
      currChat: 'chat/getCurrChatInfo',
      chats: 'chat/getChats',
      userData: 'user/getUserData',
    }),
    isOpenDispute() {
      return !this.canILeave && this.$route.query.type === ChatType.QUEST;
    },
    isCanOpenDispute() {
      const { type, status } = this.$route.query;
      return type === ChatType.QUEST && [QuestStatuses.WaitEmployerConfirm, QuestStatuses.WaitWorker].includes(+status);
    },
  },
  methods: {
    deleteChat() {
      this.ShowModal({
        key: modals.areYouSureNotification,
        title: this.$t('chat.deleteChat'),
        callback: async () => {
          this.SetLoader(true);
          await this.$store.dispatch('chat/removeChat', this.currChat.id);
          await this.$router.push(Path.MESSAGES);
          this.SetLoader(false);
        },
      });
    },
    getStarredMessages() {
      this.$router.push(`${Path.MESSAGES}/starred`);
    },
    showOpenADisputeModal() {
      this.closeChatMenu();
      if (!this.$route.query.disputeStatus) {
        this.ShowModal({
          key: modals.openADispute,
          questId: this.questId,
        });
      } else {
        this.$router.push(`${Path.DISPUTES}/${this.$route.query.id}`);
      }
    },
    toggleChatMenu() {
      this.isShowChatMenu = !this.isShowChatMenu;
    },
    closeChatMenu() {
      this.isShowChatMenu = false;
    },
    tryLeaveChat() {
      this.closeChatMenu();
      this.ShowModal({
        key: modals.areYouSure,
        text: this.$t('modals.sureLeaveChatText'),
        okBtnTitle: this.$t('meta.btns.leave'),
        okBtnFunc: async () => await this.leaveChat(),
      });
    },
    async leaveChat() {
      if (await this.$store.dispatch('chat/leaveFromChat', this.currChat.id)) await this.$router.push(`${Path.MESSAGES}`);
      this.CloseModal();
    },
    showCreateChatModal() {
      this.closeChatMenu();
      this.ShowModal({
        key: modals.chatCreate,
        isCreating: true,
        itsOwner: true,
        isMembersList: false,
        isAdding: false,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.icon-more_horizontal {
  color: #2E3A59;
}

.chat {
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
    width: 43px;
    height: 43px;
    border: 1px solid transparent;
    &:hover {
      border: 1px solid $black100;
    }
    &_menu {
      position: relative;
      width: 40px;
      height: 40px;
    }
  }
}

.chat-menu {
  position: absolute;
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 86px;
  z-index: 1;
  width: max-content;
  &-main-position{
    margin: 0 90px 0 0;
    top: 55px;
  }
  &-secondary-position{
    top: 0;
    right: 0;
  }
  &__items {
    padding: 10px;
    display: grid;
    gap: 10px;
  }
  &__item {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: $black500;
    transition: .5s;
    text-align: left;
    cursor: pointer;
    &:hover {
      color: $black800;
    }
  }
}
@include _1400 {
  .chat-menu {
    width: max-content;
    &-main-position{
      margin: 0 0 0 0;
      top: 55px;
      right:0;
    }
  }
}

</style>
