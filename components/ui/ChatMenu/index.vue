<template>
  <div class="icon-more">
    <button
      class="chat__button chat__button_menu"
      @click="showChatMenu()"
    >
      <span class="icon-more_horizontal" />
      <transition name="fade">
        <div
          v-if="isShowChatMenu"
          class="chat-menu"
        >
          <div class="chat-menu__items">
            <span
              v-if="$route.path === '/messages/1'"
              class="chat-menu__container"
            >
              <div
                class="chat-menu__item"
              >
                <div
                  class="chat-menu__text"
                  @click="showOpenADisputeModal()"
                >
                  {{ $t('chat.openDispute') }}
                </div>
              </div>
              <div
                class="chat-menu__item"
              >
                <div
                  class="chat-menu__text"
                >
                  {{ $t('chat.approveQuest') }}
                </div>
              </div>
            </span>
            <span
              v-if="$route.path === '/messages'"
              class="chat-menu__container"
            >
              <div
                class="chat-menu__item"
              >
                <div
                  class="chat-menu__text"
                >
                  {{ $t('chat.starredMessage') }}
                </div>
              </div>
              <div
                class="chat-menu__item"
              >
                <div
                  class="chat-menu__text"
                >
                  {{ $t('chat.starredChats') }}
                </div>
              </div>
              <div
                class="chat-menu__item"
              >
                <div
                  class="chat-menu__text"
                >
                  {{ $t('chat.favorite') }}
                </div>
              </div>
              <div
                class="chat-menu__item"
              >
                <div
                  class="chat-menu__text"
                >
                  {{ $t('chat.createGroupChat') }}
                </div>
              </div>
            </span>
          </div>
        </div>
      </transition>
    </button>
  </div>
</template>

<script>
import modals from '~/store/modals/modals';

export default {
  name: 'ChatMenu',
  data() {
    return {
      isShowChatMenu: false,
    };
  },
  methods: {
    showOpenADisputeModal() {
      this.ShowModal({
        key: modals.openADispute,
      });
    },
    showChatMenu() {
      this.isShowChatMenu = !this.isShowChatMenu;
    },
  },
};
</script>

<style lang="scss" scoped>

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
      width: 40px;
      height: 40px;
    }
  }
}

.chat-menu {
  position: absolute;
  top: calc(210px + 5px);
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 86px;
  z-index: 10000000;
  margin: 0 90px 0 0;
  &__container {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 10px;

  }
  &__items {
    padding: 10px 15px;
  }
  &__item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-height: 20px;
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: $black500;
    transition: .5s;
    &:hover {
      color: $black800;
    }
  }
}
@include _991 {
  .chat {
    &-menu {
      width: max-content;
    }
  }
}
</style>
