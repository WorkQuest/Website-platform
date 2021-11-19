<template>
  <div class="chats-page">
    <div class="chats-page__body">
      <h2 class="chats-page__header">
        {{ $t('chat.messages') }}
      </h2>
      <!--      <base-btn @click="testCreateChat">-->
      <!--        Test create chat-->
      <!--      </base-btn>-->
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
                  <div class="chat__avas-cont">
                    <div
                      v-for="user in chat.userMembers"
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
                    {{ chat.userMembers.length > 1 ? 'Group Chat' : chat.userMembers[0].firstName + ' ' + chat.userMembers[0].lastName }}
                  </div>
                  <div
                    v-if="chat.type === 'group' || chat.type === 'quest'"
                    class="chat__title"
                    :class="[{'chat__title_gray' : chat.type === 'group'}, {'chat__title_link' : chat.type === 'quest'}]"
                    @click="goToQuest($event,chat.type === 'quest' ? chat.questChat.questId : '')"
                  >
                    {{ chat.type === 'group' > 1 ? $t('chat.group') : chat.questChat.quest.title }}
                  </div>
                </div>
                <!--                <div class="chat__row">-->
                <!--                  <div class="chat__title">-->
                <!--                    {{ $t('chat.quest') }}-->
                <!--                  </div>-->
                <!--                  <a-->
                <!--                    href="#"-->
                <!--                    class="chat__title"-->
                <!--                  >-->
                <!--                    questName-->
                <!--                  </a>-->
                <!--                </div>-->
                <div class="chat__row">
                  <div
                    v-if="userData.id === chat.lastMessage.sender.id"
                    class="chat__title"
                  >
                    {{ $t('chat.you') }}
                  </div>
                  <div class="chat__title chat__title_gray chat__title_ellipsis">
                    {{ chat.lastMessage.text }}
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
        limit: 10,
        offset: 0,
        starred: false,
      },
    };
  },
  computed: {
    ...mapGetters({
      chats: 'data/getChats',
      userData: 'user/getUserData',
    }),
  },
  async mounted() {
    await this.getChats();
    this.SetLoader(false);
  },
  methods: {
    goToQuest(ev, questId) {
      ev.stopPropagation();

      this.$router.push(`/quests/${questId}`);
    },
    handleSortedChats() {
      this.filter = {
        limit: 10,
        offset: 0,
        starred: !this.filter.starred,
      };
      this.getChats();
    },
    handleChangeStarVal(ev, chat) {
      ev.stopPropagation();
      const chatId = chat.id;
      this.$store.dispatch(`data/${chat.star ? 'removeStarForChat' : 'setStarForChat'}`, chatId);
    },
    testCreateChat() {
      const payload = {
        config: {
          text: 'Hello! It is test message',
          medias: [],
        },
        userId: '128ddf57-94d3-4b66-867b-550652172ac0',
        // userId: '8407b757-95b3-4862-95b6-e6d8d6d03341', // исполнитель
      };
      try {
        this.$store.dispatch('data/handleCreateChat', payload);
      } catch (e) {
        console.log(e);
      }
    },
    async getChats() {
      await this.$store.dispatch('data/getChatsList', this.filter);
    },
    handleSelChat(chatId) {
      this.$router.push(`/messages/${chatId}`);
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
