<template>
  <div class="chats-page">
    <div class="chats-page__body">
      <h2 class="chats-page__header">
        {{ $t('chat.messages') }}
      </h2>
      <div class="chats-container">
        <div class="chats-container__header">
          <div>{{ $t('chat.chat') }}</div>
          <chat-menu
            :starred="filter.starred"
            @change="handleSortedChats"
          />
        </div>
        <div
          v-if="chats.list.length"
          class="chats-container__list"
        >
          <div
            v-for="chat in chats.list"
            :key="chat.id"
            class="chats-container__chat chat"
            @click="handleSelChat(chat.id)"
          >
            <div class="chat__body">
              <div class="chat__data">
                <div class="chat__row">
                  <div
                    class="chat__avas-cont"
                    :class="[{'chat__avas-cont_couple' : chat.userMembers.length === 2 }, {'chat__avas-cont_triplet' : chat.userMembers.length > 2 }]"
                  >
                    <div
                      v-for="user in chat.userMembers.slice(0, 3)"
                      :key="user.userId"
                      class="chat__ava-cont"
                    >
                      <img
                        class="chat__avatar"
                        :src="user.avatar ? user.avatar.url : require('~/assets/img/app/avatar_empty.png')"
                        alt=""
                      >
                    </div>
                  </div>
                  <div class="chat__title chat__title_bold">
                    {{ chat.type === 'group' ? chat.name : (chat.userMembers[0].firstName || '') + ' ' + (chat.userMembers[0].lastName || '') }}
                  </div>
                  <div
                    v-if="chat.type === 'group' || chat.type === 'quest'"
                    class="chat__title"
                    :class="[{'chat__title_gray' : chat.type === 'group'}, {'chat__title_link' : chat.type === 'quest'}]"
                    @click="goToQuest($event,chat.type === 'quest' ? chat.questChat.questId : '')"
                  >
                    {{ chat.type === 'group' ? $t('chat.group') : chat.questChat.quest.title }}
                  </div>
                </div>
                <div class="chat__row">
                  <div
                    v-if="userData.id === chat.lastMessage.sender.id || chat.type === 'group'"
                    class="chat__title"
                  >
                    {{ userData.id === chat.lastMessage.sender.id ? $t('chat.you') : `${chat.lastMessage.sender.firstName || ''} ${chat.lastMessage.sender.lastName || ''}:` }}
                  </div>
                  <div class="chat__title chat__title_gray chat__title_ellipsis">
                    {{ setCurrMessageText(chat.lastMessage, userData.id === chat.lastMessage.sender.id) }}
                  </div>
                </div>
              </div>
              <div class="chat__status">
                <div
                  v-if="chat.isUnread"
                  class="chat__unread-dot"
                />
                <div
                  class="block__icon block__icon_fav star"
                  @click="handleChangeStarVal($event, chat)"
                >
                  <img
                    class="star__hover"
                    src="~assets/img/ui/star_hover.svg"
                    alt=""
                  >
                  <img
                    v-if="chat.star"
                    class="star__checked"
                    src="~assets/img/ui/star_checked.svg"
                    alt=""
                  >
                  <img
                    v-else
                    class="star__default"
                    src="~assets/img/ui/star_simple.svg"
                    alt=""
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="chats-container__no-chats"
        >
          {{ $t('chat.noChats') }}
        </div>
      </div>
      <div
        v-if="canLoadMoreChats"
        class="chats-page__footer"
      >
        <base-btn @click="loadMoreChats">
          load more
        </base-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ChatMenu from '~/components/ui/ChatMenu';

export default {
  name: 'Messages',
  components: {
    ChatMenu,
  },
  data() {
    return {
      filter: {
        limit: 15,
        offset: 0,
        starred: false,
      },
    };
  },
  computed: {
    ...mapGetters({
      chats: 'chat/getChats',
      userData: 'user/getUserData',
    }),
    canLoadMoreChats() {
      const { count, list } = this.chats;

      return count > list.length;
    },
  },
  async mounted() {
    await this.getChats();
    this.SetLoader(false);
  },
  methods: {
    async loadMoreChats() {
      this.filter.offset += this.filter.limit;

      this.SetLoader(true);
      await this.getChats();
      this.SetLoader(false);
    },
    setCurrMessageText({
      text, type, infoMessage, sender,
    }, itsMe) {
      if (type === 'info') {
        text = 'chat.systemMessages.';
        switch (infoMessage.messageAction) {
          case 'employerInviteOnQuest': {
            text += itsMe ? 'youInvitedToTheQuest' : 'invitedYouToAQuest';
            break;
          }
          case 'workerResponseOnQuest': {
            text += itsMe ? 'youHaveRespondedToTheQuest' : 'respondedToTheQuest';
            break;
          }
          case 'employerRejectResponseOnQuest': {
            text += itsMe ? 'youRejectTheResponseOnQuest' : 'rejectedTheResponseToTheQuest';
            break;
          }
          case 'workerRejectInviteOnQuest': {
            text += itsMe ? 'youRejectedTheInviteToTheQuest' : 'rejectedTheInviteToTheQuest';
            break;
          }
          case 'workerAcceptInviteOnQuest': {
            text += itsMe ? 'youAcceptedTheInviteToTheQuest' : 'acceptedTheInviteToTheQuest';
            break;
          }
          case 'groupChatCreate': {
            text += 'createdAGroupChat';
            break;
          }
          case 'groupChatDeleteUser': {
            text += 'userRemovedFromChat';
            break;
          }
          case 'groupChatAddUser': {
            text += 'userAddedToChat';
            break;
          }
          case 'groupChatLeaveUser': {
            text += 'leftTheChat';
            break;
          }
          default: {
            text = '';
            break;
          }
        }

        return this.$t(text);
      }

      return text;
    },
    goToQuest(ev, questId) {
      ev.stopPropagation();

      this.$router.push(`/quests/${questId}`);
    },
    handleSortedChats() {
      this.filter = {
        limit: 15,
        offset: 0,
        starred: !this.filter.starred,
      };
      this.getChats();
    },
    handleChangeStarVal(ev, chat) {
      ev.stopPropagation();
      const chatId = chat.id;
      try {
        this.$store.dispatch(`chat/${chat.star ? 'removeStarForChat' : 'setStarForChat'}`, chatId);
      } catch (e) {
        console.log(e);
        this.showToastError(e);
      }
    },
    async getChats() {
      try {
        await this.$store.dispatch('chat/getChatsList', this.filter);
      } catch (e) {
        console.log(e);
        this.showToastError(e);
      }
    },
    handleSelChat(chatId) {
      this.$router.push(`/messages/${chatId}`);
    },
    showToastError(e) {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.error'),
        variant: 'warning',
        text: e.response?.data?.msg,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.chats-page {
  @include main;

  &__header {
    padding: 20px 0;
  }

  &__footer {
    margin-top: 20px;
    display: flex;
    justify-content: center;

    .base-btn {
      width: 200px;
    }
  }
}

.chats-container {
  background-color: $white;
  border: 1px solid #E9EDF2;
  border-radius: 6px;

  &__header {
    border-bottom: 1px solid #E9EDF2;
    padding: 15px;
    font-weight: 500;
    font-size: 18px;
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: center;
  }

  &__no-chats {
    display: flex;
    padding: 50px 10px;
    justify-content: center;
    color: #8D96A2;
  }
}

.chat {
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 1px solid #E9EDF2;
  }
  &__body {
    padding: 20px 30px;
    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 30px;
  }
  &__data {
    display: grid;
    gap: 15px;
  }
  &__status {
    display: grid;
    align-content: space-around;
    justify-items: center;
  }
  &__unread-dot {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background-color: #0083C7;
    top: 0;
  }
  &__row {
    display: grid;
    grid-auto-flow: column;
    gap: 5px;
    justify-content: start;
    align-items: center;
  }
  &__avas-cont {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    height: 43px;
    min-width: 43px;

    &_couple {
      width: 68px;
    }

    &_triplet {
      width: 93px;
    }
  }
  &__ava-cont {
    width: 25px;
  }
  &__avatar {
    width: 43px;
    height: 43px;
    border-radius: 50%;
    flex: none;
    position: absolute;
  }
  &__title {
    font-weight: 400;
    font-size: 16px;

    &_bold {
      font-weight: 500;
    }

    &_gray {
      color: #7C838D;
    }

    &_link {
      color: #0083C7;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    &_ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.star {
  &__default {
    display: flex;
  }
  &__hover {
    display: none;
  }
  &:hover {
    .star {
      &__hover {
        display: flex;
      }
      &__default,
      &__checked {
        display: none;
      }
    }
  }
}
.icon {
  color: $black500;
  font-size: 26px;
  &-more_vertical::before {
    @extend .icon;
    content: "\e952";
    color: $blue;
  }
  &-more_horizontal::before {
    @extend .icon;
    content: "\e951";
  }
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  border-radius: 2px;
  -webkit-box-shadow: inset 0 0 24px rgba(0, 131, 199, 1);
}

@include _1199 {
}
@include _991 {
}

@include _480 {
}

@include _380 {
}
</style>
