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
          />
        </div>
        <base-dd
          v-model="selectedTabIndex"
          :items="filterDD"
          type="gray"
          class="show-on-mobile chat-tab-dd"
          data-selector="FILTER-MOB"
          @input="setFilterTabs(filterTabs[$event].value,$event)"
        />
        <div
          class="chat-tab-filters show-on-desktop"
        >
          <base-btn
            v-for="(item, i) in filterTabs"
            :key="i"
            :data-selector="`${item.name}`"
            :mode="selectedTabIndex === i ? '' : 'outline'"
            @click="setFilterTabs(item.value, i)"
          >
            {{ item.name }}
          </base-btn>
        </div>
        <div class="chats-container__search">
          <base-field
            v-model="searchValue"
            class="chats-container__search-input"
            is-search
            is-hide-error
            :is-busy-search="isChatsSearching"
            :placeholder="$t('chat.searchTitle')"
            data-selector="INPUT-SEARCH"
            @input="handleSetSearchValue"
          >
            <template v-slot:right-absolute>
              <div
                v-if="isChatsSearching"
                class="loader-cont"
              >
                <loader
                  class="loader-cont__loader"
                  is-mini-loader
                />
              </div>
            </template>
          </base-field>
        </div>
        <div
          v-if="chats.list && chats.list.length"
          class="chats-container__list"
        >
          <div
            v-for="chat in chats.list"
            :key="chat.id"
            class="chats-container__chat chat"
            @click="handleSelChat(chat)"
          >
            <div class="chat__body">
              <div class="chat__data">
                <div class="chat__row">
                  <div
                    class="chat__avas-cont"
                    :class="[{'chat__avas-cont_couple' : chat.type === ChatType.QUEST || chat.type === ChatType.PRIVATE }]"
                  >
                    <div
                      v-if="chat.type === 'Group'"
                      class="chat__avatar-group"
                    >
                      {{ chat.groupChat.name.charAt(0).toUpperCase() }}
                    </div>
                    <div
                      v-for="(user, i) in chat.members"
                      v-else
                      :key="`avatar-${i}`"
                      class="chat__ava-cont"
                    >
                      <img
                        v-if="i < 2"
                        class="chat__avatar"
                        :src="getUserAvatar(user)"
                        alt=""
                      >
                    </div>
                  </div>

                  <div
                    v-if="isGroupChat(chat.type)"
                    class="chat__title chat__title_bold"
                  >
                    {{ chat.groupChat.name }}
                  </div>

                  <div
                    v-if="!isGroupChat(chat.type)"
                    class="chat__title chat__title_bold chat__title_hov"
                    @click="toUserProfile($event, chat.correspondent)"
                  >
                    {{ getFullName(chat.correspondent) }}
                  </div>
                  <div
                    v-if="isGroupChat(chat.type) || isQuestChat(chat.type)"
                    class="chat__title"
                    :class="[
                      {'chat__title_gray' : isGroupChat(chat.type)},
                      {'chat__title_link' : isQuestChat(chat.type)}
                    ]"
                    @click="isQuestChat(chat.type) ? goToQuest($event, chat.questChat.questId) : handleSelChat(chat.id)"
                  >
                    {{ isGroupChat(chat.type) ? $t('chat.group') : ` ${$t('chat.quest')} ${(chat.questChat && chat.questChat.quest.title)} ` }}
                  </div>
                </div>
                <div
                  v-if="chat.meMember && chat.meMember.deletionData"
                  class="chat__row"
                >
                  {{ $t('chat.systemMessages.youHaveRemovedFromChat') }}
                </div>
                <div
                  v-else-if="chat.chatData.lastMessage"
                  class="chat__row"
                >
                  <div
                    v-if=" isItMyLastMessage(chat.chatData.lastMessage.sender.userId) || chat.chatData.lastMessage.sender.type === $options.UserRoles.ADMIN || isGroupChat(chat.type)"
                    class="chat__title"
                  >
                    {{ isItMyLastMessage(chat.chatData.lastMessage.sender.userId) ? $t('chat.you') : getFullName(chat.chatData.lastMessage.sender)+':' }}
                  </div>
                  <div class="chat__title chat__title_gray chat__title_ellipsis">
                    {{ setCurrMessageText(chat.chatData.lastMessage, userData.id === chat.chatData.lastMessage.memberId) }}
                  </div>
                </div>
              </div>
              <div class="chat__status">
                <div class="chat__status_flex">
                  <span
                    class="icon-close_big chat__delete"
                    @click="deleteChat($event, chat)"
                  />
                  <div
                    v-if="chat.isUnread"
                    class="chat__unread-dot"
                  />
                </div>
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
        <base-btn
          :selector="`${$t('chat.loadMore')}`"
          data-selector="LOAD-MORE-CHATS"
          @click="loadMoreChats"
        >
          {{ $t('chat.loadMore') }}
        </base-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ChatMenu from '~/components/ui/ChatMenu';
import { Path } from '~/utils/enums';
import {
  ChatType, MessageType, MessageAction, QuestChatStatus, UserRoles, GetInfoMessageText,
} from '~/utils/сonstants/chat';
import { images } from '~/utils/images';
import modals from '~/store/modals/modals';

export default {
  name: 'Messages',
  images,
  UserRoles,
  components: {
    ChatMenu,
  },
  data() {
    return {
      searchValue: '',
      isChatsSearching: false,
      delayId: null,
      selectedTab: undefined,
      selectedTabIndex: 0,
    };
  },
  computed: {
    ...mapGetters({
      chats: 'chat/getChats',
      userData: 'user/getUserData',
      filter: 'chat/getChatsFilter',
    }),
    ChatType() {
      return ChatType;
    },
    canLoadMoreChats() {
      const { count, list } = this.chats;

      return count > list?.length;
    },
    filterTabs() {
      return [
        { name: this.$t('chat.tabs.all'), value: undefined },
        { name: this.$t('chat.tabs.private'), value: ChatType.PRIVATE },
        { name: this.$t('chat.tabs.groups'), value: ChatType.GROUP },
        { name: this.$t('chat.tabs.activeQuests'), value: QuestChatStatus.Active },
        { name: this.$t('chat.tabs.completedQuests'), value: QuestChatStatus.Closed },
        { name: this.$t('chat.tabs.starred'), value: 'starred' },
      ];
    },
    filterDD() {
      return [
        this.$t('chat.tabs.all'),
        this.$t('chat.tabs.private'),
        this.$t('chat.tabs.groups'),
        this.$t('chat.tabs.activeQuests'),
        this.$t('chat.tabs.completedQuests'),
        this.$t('chat.tabs.starred'),
      ];
    },
    isFilterChatQuestStatus() {
      return +this.selectedTab === QuestChatStatus.Closed || +this.selectedTab === QuestChatStatus.Active;
    },
  },
  destroyed() {
    this.$store.commit('chat/changeChatsFilterValue', [
      { key: 'offset', val: 0 },
      { key: 'q', val: undefined },
      { key: 'starred', val: false },
      { key: 'type', val: undefined },
      { key: 'questChatStatus', val: undefined },
    ]);
  },
  async mounted() {
    await this.getChats();
    this.SetLoader(false);
  },
  methods: {
    deleteChat(ev, chat) {
      ev.stopPropagation();
      this.ShowModal({
        key: modals.areYouSureNotification,
        title: this.$t('chat.deleteChat'),
        callback: async () => {
          this.SetLoader(true);
          await this.$store.dispatch('chat/removeChat', chat.id);
          this.SetLoader(false);
        },
      });
    },
    toUserProfile(ev, user) {
      if (user.type === UserRoles.ADMIN) return;
      ev.stopPropagation();
      this.$router.push(`${Path.PROFILE}/${user.userId}`);
    },
    handleSetSearchValue() {
      this.isChatsSearching = true;

      this.delayId = this.SetDelay(async () => {
        this.isChatsSearching = false;

        await this.$store.commit('chat/changeChatsFilterValue',
          [
            { key: 'q', val: this.searchValue.trim() || undefined },
            { key: 'offset', val: 0 },
          ]);

        await this.getChats();
      }, 500, this.delayId);
    },
    isItMyLastMessage(senderId) {
      return this.userData.id === senderId;
    },
    isGroupChat(chatType) {
      return chatType === ChatType.GROUP;
    },
    isQuestChat(chatType) {
      return chatType === ChatType.QUEST;
    },
    async loadMoreChats() {
      const { offset, limit } = this.filter;

      await this.$store.commit('chat/changeChatsFilterValue', [{ key: 'offset', val: offset + limit }]);

      this.SetLoader(true);
      await this.getChats();
      this.SetLoader(false);
    },
    setCurrMessageText({
      text, type, infoMessage, sender,
    }, itsMe) {
      if (type === MessageType.INFO) {
        return this.$t(GetInfoMessageText(infoMessage.messageAction, itsMe));
      }

      return text;
    },
    goToQuest(ev, questId) {
      ev.stopPropagation();
      this.$router.push(`${Path.QUESTS}/${questId}`);
    },
    handleChangeStarVal(ev, chat) {
      ev.stopPropagation();
      const chatId = chat.id;

      this.$store.dispatch(`chat/${chat.star ? 'removeStarForChat' : 'setStarForChat'}`, chatId);
    },
    async getChats() {
      this.SetLoader(true);
      await this.$store.dispatch('chat/getChatsList');

      this.SetLoader(false);
    },
    handleSelChat(chat) {
      const { id, type, questChat } = chat;
      const openDispute = questChat?.quest.openDispute;
      const disputeStatus = openDispute?.status;
      const disputeId = openDispute?.id;
      if (type === ChatType.QUEST) {
        const status = questChat?.quest.status;
        this.$router.push({
          path: `${Path.MESSAGES}/${id}`,
          query: {
            disputeStatus, id: disputeId, type, status,
          },
        });
      } else {
        this.$router.push({
          path: `${Path.MESSAGES}/${id}`,
        });
      }
    },
    async setFilterTabs(val, i) {
      this.selectedTab = val;
      this.selectedTabIndex = i;
      if (val === 'starred') {
        await this.$store.commit('chat/changeChatsFilterValue',
          [
            { key: 'offset', val: 0 },
            { key: 'q', val: undefined },
            { key: 'type', val: undefined },
            { key: 'starred', val: true },
          ]);
      } else {
        await this.$store.commit('chat/changeChatsFilterValue',
          [
            { key: 'offset', val: 0 },
            { key: 'q', val: undefined },
            { key: 'type', val: this.isFilterChatQuestStatus ? ChatType.QUEST : val },
            { key: 'questChatStatus', val: this.isFilterChatQuestStatus ? +val : undefined },
            { key: 'starred', val: false },
          ]);
      }
      this.searchValue = '';
      await this.getChats();
    },
    getFullName(user) {
      if (!user) return '-';
      if (user.type === UserRoles.USER) return this.UserName(user.user?.firstName, user.user?.lastName);
      return this.$t('chat.workquestAdmin');
    },
    getUserAvatar(user) {
      if (user.type === UserRoles.ADMIN) return images.WQ_LOGO_ROUNDED;
      return user.user?.avatar ? user.user?.avatar.url : images.EMPTY_AVATAR;
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

.loader-cont {
  height: 20px;
  width: 20px;
  position: relative;

  &__loader {
    position: absolute !important;
    background: transparent !important;
  }
}
.chat-tab-filters{
  display: grid;
  align-items: center;
  grid-template-columns: repeat(6, auto);
  grid-gap: 10px;
  margin: 10px 20px 20px;
}
.chat-tab-dd{
  display: grid;
  grid-template-columns: 100%;
  margin: 10px 20px 20px;
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

  &__search {
    padding: 20px 30px;
  }

  &__search-input {
    border: 1px solid #E9EDF2;
    border-radius: 6px;
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

    &_flex {
      display: flex;
      align-items: center;
    }
  }

  &__delete {
    color: $black300;
    font-size: 22px;
    &:hover {
      color: $red;
    }
  }

  &__unread-dot {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background-color: $blue;
    margin-left: 30px;
    margin-bottom: 40px;
    position: absolute;
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
    object-fit: cover;
    z-index: 3;
    background-color: $black0;
    border: 1px solid $black100;
    &-group{
      color: $blue;
      background-color: $black0;
      border: 1px solid $black100;
      font-weight: 500;
      width: 43px;
      height: 43px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__title {
    font-weight: 400;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: .3s;
    color: $black800;

    &_hov:hover {
      color: $blue
    }

    &_bold {
      font-weight: 500;
    }

    &_gray {
      color: #7C838D;
    }

    &_link {
      color: $blue;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

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
  .chats-page {
    &__header {
      padding-left: 15px;
    }
  }
}
@include _991 {
  .chat-tab-filters{
    grid-template-columns: repeat(3, auto);
  }
}
@include _767 {
  .show-on-desktop { display: none !important; }

  .chat__body, .chats-container__search {
    padding: 10px 15px;
  }
  .chat-tab-dd {
    margin: 10px 15px 20px;
  }
  .chat {
    &__ava-cont {
      display: flex;
      align-items: center;
    }
    &__avas-cont_couple {
      width: 55px;
    }
    &__avatar {
      width: 30px;
      height: 30px;
    }
    &__title {
      font-size: 14px;
    }
  }
  .chat__unread-dot {
    margin-left: 25px;
    margin-bottom: 35px;
  }
}
@media (min-width: 767px) {
  .show-on-mobile { display: none !important; }
}
@include _575 {
  .chat {
    &__unread-dot {
      margin-left: 25px;
    }
    &__body {
      gap: 15px
    }
    &__row {
      gap: 10px;
      width: calc(100vw - 120px);
      grid-auto-flow: row;
    }
    &__title {
      &_bold {
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}

</style>
