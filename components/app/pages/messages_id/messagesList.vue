<template>
  <div
    ref="HandleScrollContainer"
    class="messages-list"
    @scroll="handleScroll"
  >
    <div
      v-if="messages.list.length"
      ref="ScrollContainer"
      class="messages-list__messages"
    >
      <div
        v-if="isTopChatsLoading"
        class="messages-list__loader-cont"
      >
        <loader class="messages-list__loader" />
      </div>
      <div
        v-for="(message, i) in messages.list"
        :key="message.id"
        :ref="message.number === selStarredMessageNumber ? 'starredMessage' : ''"
        class="message"
        :class="[
          {'message_right' : message.itsMe},
          {'message_blink' : message.number === selStarredMessageNumber},
          {'message_info' : message.type === MessageType.INFO}
        ]"
      >
        <div
          v-if="message.type === MessageType.INFO && message.infoMessage"
          class="info-message"
        >
          <div class="info-message__title">
            {{ setInfoMessageText(message.infoMessage.messageAction, message.itsMe) }}
          </div>
          <template v-if="canShowActionUsers(message.infoMessage.messageAction, message.itsMe)">
            <div
              class="info-message__link"
              :class="{'info-message__link_left' : !message.itsMe}"
              @click="openProfile( message.sender.userId)"
            >
              {{ setFullName(message) }}
            </div>
            <div
              v-if="!message.itsMe && [MessageAction.GROUP_CHAT_ADD_USERS, MessageAction.GROUP_CHAT_DELETE_USER].includes(message.infoMessage.messageAction) && message.infoMessage.user"
              class="info-message__link"
              @click="openProfile(message.sender.userId)"
            >
              {{ senderFullNameById(message.sender.userId) }}
            </div>
          </template>
        </div>
        <template v-else>
          <img
            v-if="!message.itsMe"
            :src="setSenderAvatar(message)"
            alt=""
            class="message__avatar"
            :class="{'message__avatar_hidden' : isPrevMessageSameSender(i, message)}"
          >
          <div class="message__data">
            <div
              v-if="!message.itsMe && !isPrevMessageSameSender(i, message)"
              class="message__title message__title_name"
            >
              {{ senderFullNameById(message.sender.userId) }}
            </div>
            <div
              class="message__bubble"
              :class="[
                {'message__bubble_bl' : message.itsMe},
                {'message__bubble_link' : chatId === 'starred'}
              ]"
              @click="goToCurrChat(message)"
            >
              <div class="message__title message__title_user-text">
                {{ message.text }}
              </div>
              <div
                v-if="message.medias && message.medias.length"
                class="message__media"
              >
                <div
                  v-for="file in message.medias"
                  :key="file.id"
                  class="image-cont image-cont_margin"
                >
                  <img
                    v-if="file.type === $options.FileTypes.IMAGE"
                    :src="file.url"
                    class="image-cont__image"
                    alt=""
                    @click="selFile($event, message.medias, file.url)"
                  >
                  <div v-else-if="file.type === $options.FileTypes.VIDEO">
                    <video
                      preload="metadata"
                      class="image-cont image-cont__other-media"
                      @click="selFile($event, message.medias, file.url)"
                    >
                      <source
                        :src="file.url"
                        :type="file.contentType"
                      >
                    </video>
                    <span
                      class="icon-play_circle_outline "
                      @click="selFile($event, message.medias, file.url)"
                    />
                  </div>

                  <a
                    v-else
                    :href="file.url"
                    target="_blank"
                    class="image-cont image-cont__other-media"
                    @click="openFile"
                  >
                    <span class="icon-file_blank_outline" />
                  </a>
                </div>
              </div>
              <div
                class="message__time message__title message__title_gray"
                :class="{'message__title_white' : message.itsMe}"
              >
                {{ setCurrDate(message.createdAt) }}
              </div>
            </div>
          </div>
          <div
            class="message__star-cont"
            :class="{'message__star-cont_left' : message.itsMe}"
          >
            <div
              v-show="chatId !== 'starred'"
              class="star"
              @click="handleChangeStarVal(message)"
            >
              <img
                class="star__hover"
                src="~assets/img/ui/star_hover.svg"
                alt=""
              >
              <img
                v-if="message.star"
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
        </template>
      </div>
      <div
        v-if="isBottomChatsLoading"
        class="messages-list__loader-cont"
      >
        <loader class="messages-list__loader" />
      </div>
    </div>
    <div
      v-else
      class="messages-list__no-msgs"
    >
      {{ $t('chat.noMessages') }}
    </div>
    <div
      v-if="isScrollBtnVis"
      class="messages-list__scroll-btn"
      @click="scrollToBottom(false)"
    >
      <img
        src="~assets/img/ui/arrow-down.svg"
        alt=""
        class="messages-list__scroll-svg"
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import modals from '~/store/modals/modals';
import { Path } from '~/utils/enums';
import {
  MessageAction, MessageType, UserRoles, FileTypes, GetInfoMessageText,
} from '~/utils/сonstants/chat';
import { images } from '~/utils/images';

export default {
  name: 'MessagesList',
  FileTypes,
  props: {
    chatId: {
      type: String,
      default: '',
    },
    isHideFooter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isTopChatsLoading: false,
      isBottomChatsLoading: false,
      selStarredMessageNumber: 0,
      today: moment(new Date()),
      isScrollBtnVis: false,
      minScrollDifference: 0,
    };
  },
  computed: {
    ...mapGetters({
      filter: 'chat/getMessagesFilter',
      messages: 'chat/getMessages',
      lastMessageId: 'chat/getLastMessageId',
      userData: 'user/getUserData',
      currChat: 'chat/getCurrChatInfo',
      chats: 'chat/getChats',
      currChatIsUnread: 'chat/currChatIsUnread',
    }),
    MessageAction() {
      return MessageAction;
    },
    MessageType() {
      return MessageType;
    },
  },
  watch: {
    lastMessageId(newVal, oldVal) {
      if (!this.isScrollBtnVis && oldVal) this.scrollToBottom();
    },
    currChatIsUnread(newVal, oldVal) {
      if (newVal && this.lastMessageId) this.readMessages();
    },
  },

  async mounted() {
    const selStarredMessageNumber = +localStorage.getItem('selStarredMessageNumber');

    let direction = 0;
    let bottomOffset = 0;

    if (selStarredMessageNumber) {
      bottomOffset = selStarredMessageNumber >= 20 ? selStarredMessageNumber - 10 : 0;
      direction = 1;

      this.selStarredMessageNumber = selStarredMessageNumber;

      localStorage.setItem('selStarredMessageNumber', '0');
    }
    await this.getMessages(direction, bottomOffset);
    this.scrollToBottom(true);
  },
  destroyed() {
    this.$store.commit('chat/setMessagesList', { messages: [], count: 0, chat: null });
    this.$store.commit('chat/clearMessagesFilter');
  },
  methods: {
    canShowActionUsers(messageAction, itsMe) {
      const isGroupChatCreateAction = messageAction === MessageAction.GROUP_CHAT_CREATE;
      return !isGroupChatCreateAction || (isGroupChatCreateAction && !itsMe);
    },
    isPrevMessageSameSender(i, message) {
      const { list } = this.messages;
      const prevMessage = i ? list[i - 1] : null;

      return prevMessage?.sender?.user?.id === message.sender?.user?.id && prevMessage?.type !== MessageType.INFO;
    },
    setSenderAvatar({ sender }) {
      if (sender.type === UserRoles.ADMIN) return images.WQ_LOGO;
      return sender.user?.avatar ? sender.user?.avatar.url : images.EMPTY_AVATAR;
    },
    async getMessages(direction, currBottomOffset) {
      const {
        filter: {
          topOffset,
          bottomOffset,
        }, chatId, messages: { list, count },
      } = this;

      const offset = direction ? currBottomOffset || bottomOffset : topOffset || (count - list[0]?.number + 1) || 0;

      const payload = {
        config: {
          params: {
            limit: 25,
            offset,
            'sort[createdAt]': direction ? 'asc' : undefined,
          },
        },
        chatId,
        direction,
        offset,
        isHideFooter: this.isHideFooter,
      };
      await this.$store.dispatch('chat/getMessagesList', payload);
      this.SetLoader(false);
    },
    scrollToBottom(isInit) {
      setTimeout(() => {
        const { HandleScrollContainer, ScrollContainer, starredMessage } = this.$refs;

        if (ScrollContainer) {
          ScrollContainer.scrollIntoView(isInit === true ? false : {
            block: 'end',
            behavior: 'smooth',
          });
        }
        if (!this.minScrollDifference) this.minScrollDifference = (HandleScrollContainer.scrollHeight - HandleScrollContainer.scrollTop) * 2;

        if (starredMessage && isInit) HandleScrollContainer.scrollTo(0, starredMessage[0].offsetTop - HandleScrollContainer.offsetTop - 20);
      }, 200);
    },
    async handleScroll({ target: { scrollTop, scrollHeight, clientHeight } }) {
      const { minScrollDifference, filter: { canLoadToBottom, canLoadToTop } } = this;

      const currScrollOffset = scrollHeight - scrollTop;

      this.isScrollBtnVis = currScrollOffset > minScrollDifference;
      const scrollBottom = currScrollOffset - clientHeight;

      if (scrollBottom < 300) {
        if (canLoadToBottom && !this.isBottomChatsLoading) {
          this.isBottomChatsLoading = true;
          await this.getMessages(1);
          setTimeout(() => {
            this.isBottomChatsLoading = false;
          }, 300);
        }
        return;
      }

      if (canLoadToTop && scrollTop < 300 && !this.isTopChatsLoading) {
        this.isTopChatsLoading = true;
        await this.getMessages(0);
        setTimeout(() => {
          this.isTopChatsLoading = false;
        }, 300);
      }
    },
    setInfoMessageText(action, itsMe) {
      return this.$t(GetInfoMessageText(action, itsMe));
    },
    openProfile(userId) {
      this.$router.push(`${Path.PROFILE}/${userId}`);
    },
    setFullName({ itsMe, infoMessage: { user }, sender }) {
      return itsMe
        ? this.UserName(user.firstName, user?.lastName)
        : this.UserName(sender.user.firstName, sender.user?.lastName);
    },
    goToCurrChat(message) {
      if (this.chatId !== 'starred') return;
      localStorage.setItem('selStarredMessageNumber', JSON.stringify(message.number));
      this.$router.push(`${Path.MESSAGES}/${message.chatId}`);
    },
    selFile(ev, files, fileUrl) {
      ev.preventDefault();
      ev.stopPropagation();

      files = files.filter((file) => file.type === FileTypes.IMAGE || file.type === FileTypes.VIDEO);
      const index = files.findIndex((file) => file.url === fileUrl);

      this.ShowModal({
        key: modals.gallery,
        files,
        index,
        count: files.length,
      });
    },
    openFile(ev) {
      ev.stopPropagation();
    },
    setCurrDate(msgDate) {
      const { today } = this;
      const momentDate = moment(msgDate);
      let format = '';
      if (momentDate.format('DD MM YY') !== today.format('DD MM YY')) {
        format += 'DD MMM';
        if (momentDate.format('YYYY') > today.format('YYYY')) {
          format += ' YY';
        }
        format += ', ';
      }

      return momentDate.format(`${format}HH:mm`);
    },
    async handleChangeStarVal(message) {
      const messageId = message.id;
      const { chatId } = this;

      await this.$store.dispatch(`chat/${message.star ? 'removeStarForMessage' : 'setStarForMessage'}`, {
        messageId,
        chatId,
      });
      this.$forceUpdate();
    },
    async readMessages() {
      const { chatId, lastMessageId } = this;

      const payload = {
        config: {
          messageId: lastMessageId,
        },
        chatId,
      };

      await this.$store.dispatch('chat/setMessageAsRead', payload);
    },
    getSenderInfoById(userId) {
      return this.currChat.members.find((el) => el.userId === userId);
    },
    senderFullNameById(userId) {
      const sender = this.getSenderInfoById(userId);
      if (!sender) return '-';
      if (sender.type === UserRoles.USER) return this.UserName(sender.user?.firstName, sender.user?.lastName);
      return this.$t('chat.workquestAdmin');
    },
  },
};
</script>

<style lang="scss" scoped>
.messages-list {
  background-color: $white;
  height: inherit;
  overflow: auto;
  position: relative;
  display: grid;
  align-items: flex-end;

  &__no-msgs {
    display: flex;
    padding: 50px 10px;
    justify-content: center;
    color: #8D96A2;
    height: 100%;
    align-items: center;
  }

  &__messages {
    display: grid;
    gap: 20px;
    padding: 20px 20px 0;
  }

  &__loader-cont {
    height: 70px;
    position: relative;
  }

  &__loader {
    position: absolute !important;
    background: rgba(255, 255, 255, 1) !important;
  }

  &__scroll-btn {
    position: sticky;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #E9EDF2;
    margin-left: calc(100% - 62px);
    bottom: 20px;
    opacity: .5;
    transition: .3s;
    cursor: pointer;

    &:hover {
      background-color: $black0;
      opacity: .8;
      box-shadow: 0 0 10px 2px rgba(34, 60, 80, 0.3);
    }
  }

  &__scroll-svg {
    height: 20px;
    width: 20px;
  }
}

.message {
  display: grid;
  grid-template-columns: 43px minmax(auto, max-content) max-content;
  gap: 20px;
  height: max-content;

  &__media {
    display: flex;
    flex-wrap: wrap;
  }

  &_blink {
    animation: blink 1s;
  }

  @keyframes blink {
    50% {
      opacity: .5;
    }
    100% {
      opacity: 1;
    }
  }

  &_right {
    grid-template-columns: max-content minmax(auto, max-content);
    justify-content: flex-end;
  }

  &__star-cont {
    &_left {
      grid-column: 1;
      grid-row: 1;
    }
  }

  &_info {
    display: flex;
    grid-template-columns: unset;
    justify-content: center;
    margin: 0;
    width: 100%;
  }

  &:last-child {
    padding-bottom: 20px;
  }

  &__time {
    justify-self: end;
  }

  &__title {
    font-weight: 400;
    font-size: 16px;
    line-height: 1.2;

    &_gray {
      color: #AAB0B9;
      font-size: 14px;
    }

    &_white {
      color: #fff;
    }
    &_user-text {
      word-break: break-all
    }
  }

  &__avatar {
    height: 43px;
    width: 43px;
    border-radius: 50%;
    object-fit: cover;
    background-color: $black100;
    border: 1px solid $black200;
    &_hidden {
      visibility: hidden;
    }
  }

  &__data {
    display: grid;
    gap: 10px;
  }

  &__bubble {
    display: grid;
    gap: 10px;
    padding: 15px;
    border-radius: 6px;
    background-color: $black0;

    &_bl {
      background-color: #0083C7;
      color: #fff;
    }

    &_link {
      cursor: pointer;
    }
  }
}

.info-message {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 5px;
  grid-template-areas: "owner system sender";

  &__link {
    text-decoration: underline #1D2127;
    color: #1D2127;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: start;
    grid-area: sender;

    &_left {
      grid-column: 1;
      grid-row: 1;
      text-align: end;
      grid-area: owner;
    }
  }

  &__title {
    white-space: nowrap;
    text-align: center;
    grid-area: system;
  }
}

.image-cont {
  position: relative;
  cursor: pointer;
  height: 105px;
  width: 130px;
  border-radius: 6px;

  &__image {
    height: 105px;
    width: 130px;
    border-radius: 6px;
    min-width: 130px;
    object-fit: cover;
  }

  &_margin {
    margin: 10px 10px 0 0;
  }

  &__other-media {
    padding: 10px;
    display: grid;
    grid-template-rows: 1fr;
    border: 1px solid #E9EDF2;
    text-decoration: unset;
  }

  &__title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 400;
    color: #4C5767;
  }
}

.icon-play_circle_outline,
.icon-file_blank_outline {
  display: flex;
  justify-content: center;
  align-items: center;

  &:before {
    color: #AAB0B9;
    font-size: 60px;
  }
}
.icon-play_circle_outline{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.star {
  cursor: pointer;

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

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  border-radius: 2px;
  -webkit-box-shadow: inset 0 0 24px rgba(0, 131, 199, 1);
}

@include _1199 {
  .info-message {
    &__title {
      white-space: nowrap;
      color: $black600;
    }

    &__link {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .message {
    &__bubble{
      width: 100%;
    }
    &__title {
      &_name {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      &_user-text {
        word-break: break-all
      }
    }
  }
}

@include _767 {
  .info-message {
    &__title {
      white-space: nowrap;
    }

    &__link {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
