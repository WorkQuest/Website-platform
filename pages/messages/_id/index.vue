<template>
  <div class="chat-page">
    <div class="chat-page__body">
      <h2 class="chat-page__header">
        {{ $t(`chat.${chatId === 'starred' ? 'starredMessages' : 'messages'}`) }}
      </h2>
      <div class="chat-container">
        <div class="chat-container__header">
          <div
            class="chat-container__arrow-back"
            @click="goBackToChatsList()"
          >
            <span class="icon-short_left" />
            <span>{{ $t('chat.chat') }}</span>
          </div>
          <div class="chat-container__chat-name">
            <div
              v-if="messages.chat && messages.chat.type === 'quest'"
              class="chat-container__quest-link"
              @click="goToQuest"
            >
              {{ messages.chat.questChat.quest.title }}
            </div>
          </div>
          <ChatMenu v-show="chatId !== 'starred'" />
        </div>
        <div
          ref="HandleScrollContainer"
          class="chat-container__scroll-cont"
          :class="{'chat-container__scroll-cont_small' : files.length}"
          @scroll="handleScroll"
        >
          <div
            ref="ScrollContainer"
            class="chat-container__messages"
          >
            <div
              v-if="isTopChatsLoading"
              class="chat-container__loader-cont"
            >
              <loader class="chat-container__loader" />
            </div>
            <div
              v-for="(message, i) in messages.list"
              :key="message.id"
              :ref="message.number === selStarredMessageNumber ? 'starredMessage' : ''"
              class="chat-container__message message"
              :class="[{'message_right' : message.itsMe}, {'message_blink' : message.number === selStarredMessageNumber}, {'message_info' : message.type === 'info'}]"
            >
              <div
                v-if="message.type === 'info'"
                class="info-message"
              >
                <div v-if="message.infoMessage.messageAction === 'employerInviteOnQuest'">
                  {{ $t(`chat.systemMessages.${message.itsMe ? 'youInvitedToTheQuest' : 'invitedYouToAQuest'}`) }}
                </div>
                <div v-if="message.infoMessage.messageAction === 'workerResponseOnQuest'">
                  {{ $t(`chat.systemMessages.${message.itsMe ? 'youHaveRespondedToTheQuest' : 'respondedToTheQuest'}`) }}
                </div>
                <div v-if="message.infoMessage.messageAction === 'employerRejectResponseOnQuest'">
                  {{ $t(`chat.systemMessages.${message.itsMe ? 'youRejectTheResponseOnQuest' : 'rejectedTheResponseToTheQuest'}`) }}
                </div>
                <div v-if="message.infoMessage.messageAction === 'workerRejectInviteOnQuest'">
                  {{ $t(`chat.systemMessages.${message.itsMe ? 'youRejectedTheInviteToTheQuest' : 'rejectedTheInviteToTheQuest'}`) }}
                </div>
                <div v-if="message.infoMessage.messageAction === 'workerAcceptInviteOnQuest'">
                  {{ $t(`chat.systemMessages.${message.itsMe ? 'youAcceptedTheInviteToTheQuest' : 'acceptedTheInviteToTheQuest'}`) }}
                </div>
                <div
                  class="info-message__link"
                  :class="{'info-message__link_left' : !message.itsMe}"
                  @click="openProfile(message.infoMessage.userId, message.itsMe)"
                >
                  {{ message.itsMe ? (message.infoMessage.user.firstName || '') + ' ' + (message.infoMessage.user.lastName || '') : (message.sender.firstName || '') + ' ' + (message.sender.lastName || '') }}
                </div>
              </div>
              <template v-else>
                <img
                  v-if="!message.itsMe"
                  :src="message.sender.avatar ? message.sender.avatar.url : require('~/assets/img/app/avatar_empty.png')"
                  alt=""
                  class="message__avatar"
                  :class="{'message__avatar_hidden' : i && messages.list[i - 1].senderUserId == message.senderUserId && messages.list[i - 1].type !== 'info'}"
                >
                <div class="message__data">
                  <div
                    v-if="!message.itsMe && (!i || (i && messages.list[i - 1].senderUserId != message.senderUserId || messages.list[i - 1].type === 'info'))"
                    class="message__title"
                  >
                    {{ message.sender.firstName + ' ' + message.sender.lastName }}
                  </div>
                  <div
                    class="message__bubble"
                    :class="[{'message__bubble_bl' : message.itsMe}, {'message__bubble_link' : chatId === 'starred'}]"
                    @click="goToCurrChat(message)"
                  >
                    <div class="message__title">
                      {{ message.text }}
                    </div>
                    <div
                      v-if="message.medias.length"
                      class="message__media"
                    >
                      <div
                        v-for="file in message.medias"
                        :key="file.id"
                        class="image-cont image-cont_margin"
                      >
                        <img
                          v-if="file.type === 'image'"
                          :src="file.url"
                          class="image-cont__image"
                          alt=""
                          @click="selFile($event, message.medias, file.url)"
                        >
                        <a
                          v-else
                          :href="file.url"
                          target="_blank"
                          class="image-cont image-cont__other-media image-cont__other-media_block"
                          @click="openFile"
                        >
                          <span :class="[{'icon-play_circle_outline' : file.type === 'video'}, {'icon-file_blank_outline' : file.type !== 'video'}]" />
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
              class="chat-container__loader-cont"
            >
              <loader class="chat-container__loader" />
            </div>
          </div>
        </div>
        <div class="chat-container__footer footer">
          <div
            v-if="isScrollBtnVis"
            class="footer__scroll-btn"
            @click="scrollToBottom"
          >
            <img
              src="~assets/img/ui/arrow-down.svg"
              alt=""
              class="footer__scroll-svg"
            >
          </div>
          <div
            v-show="chatId !== 'starred'"
            class="footer__controls"
          >
            <div class="chat-container__file-cont">
              <ValidationProvider
                v-slot="{validate}"
                rules="required|ext:png,jpeg,jpg,mp4,pdf,doc"
              >
                <input
                  id="input__file"
                  name="file"
                  type="file"
                  class="chat-container__file-input"
                  multiple
                  :disabled="files.length >= 10"
                  @change="getFiles($event, validate)"
                >
              </ValidationProvider>
              <label
                for="input__file"
                class="chat-container__file-button"
              >
                <span class="icon-link" />
              </label>
            </div>
            <base-field
              v-model="messageText"
              :placeholder="$t('chat.writeYouMessage')"
              is-hide-error
              mode="chat"
            />
            <button
              class="chat-container__send-btn"
              :class="{'chat-container__send-btn_active' : messageText}"
              @click="handleSendMessage"
            >
              <span class="icon-send" />
            </button>
          </div>
          <div
            v-if="files.length"
            class="footer__medias"
          >
            <div
              v-for="(file, i) in files"
              :key="file.data.mediaId"
              class="image-cont"
            >
              <img
                v-if="file.type === 'image'"
                :src="file.url"
                class="image-cont__image"
                alt=""
                @click="selFile($event, files, file.url)"
              >
              <a
                v-else
                :href="file.url"
                target="_blank"
                class="image-cont image-cont__other-media"
                :title="file.file.name"
                @click="openFile"
              >
                <span :class="[{'icon-play_circle_outline' : file.type === 'video'}, {'icon-file_blank_outline' : file.type !== 'video'}]" />
                <div class="image-cont__title">
                  {{ file.file.name }}
                </div>
              </a>
              <div
                class="image-cont__remove"
                @click="handleRemoveFile(i)"
              >
                <span
                  class="icon-close_big"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import modals from '~/store/modals/modals';
import ChatMenu from '~/components/ui/ChatMenu';

export default {
  name: 'Messages',
  components: {
    ChatMenu,
  },
  data() {
    return {
      isTopChatsLoading: false,
      isBottomChatsLoading: false,
      isShowFavorite: false,
      messageText: '',
      files: [],
      today: moment(new Date()),
      minScrollDifference: 0,
      isScrollBtnVis: false,
      chatId: this.$route.params.id,
      selStarredMessageNumber: 0,
    };
  },
  computed: {
    ...mapGetters({
      messages: 'data/getMessages',
      userData: 'user/getUserData',
      lastMessageId: 'data/getLastMessageId',
      chats: 'data/getChats',
      filter: 'data/getMessagesFilter',
    }),
  },
  async mounted() {
    this.$watch(
      'lastMessageId',
      (newVal, oldVal) => {
        if (!this.isScrollBtnVis && oldVal) this.scrollToBottom();
      },
      { immediate: true },
    );

    this.SetLoader(true);
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
    if (!direction) await this.readMessages();

    this.scrollToBottom(true);
    this.SetLoader(false);

    const isChatNotificationShown = !!localStorage.getItem('isChatNotificationShown');
    if (!isChatNotificationShown) this.showNoticeModal();
  },
  destroyed() {
    this.$store.commit('data/setMessagesList', { messages: [], count: 0, chat: null });
    this.$store.commit('data/clearMessagesFilter');
  },
  methods: {
    openProfile(userId, itsMe) {
      this.$router.push(`/${itsMe ? 'workers' : 'profile'}/${userId}`);
    },
    goToQuest() {
      const { questId } = this.messages.chat.questChat;
      this.$router.push(`/quests/${questId}`);
    },
    openFile(ev) {
      ev.stopPropagation();
    },
    selFile(ev, files, fileUrl) {
      ev.stopPropagation();

      files = files.filter((file) => file.type === 'image');
      const index = files.findIndex((file) => file.url === fileUrl);

      this.ShowModal({
        key: modals.gallery,
        files,
        index,
        count: files.length,
      });
    },
    handleRemoveFile(index) {
      this.files.splice(index, 1);
    },
    goToCurrChat(message) {
      if (this.chatId !== 'starred') return;
      localStorage.setItem('selStarredMessageNumber', JSON.stringify(message.number));
      this.$router.push(`/messages/${message.chatId}`);
    },
    async handleChangeStarVal(message) {
      const messageId = message.id;
      const { chatId } = this;
      try {
        await this.$store.dispatch(`data/${message.star ? 'removeStarForMessage' : 'setStarForMessage'}`, { messageId, chatId });
        this.$forceUpdate();
      } catch (e) {
        console.log(e);
        this.showToastError(e);
      }
    },
    async readMessages() {
      const messages = this.messages.list;
      const chats = this.chats.list;
      const { chatId } = this;

      if (!messages.length || chatId === 'starred' || chats.some((chat) => chat.id === chatId && !chat.isUnread)) return;

      const payload = {
        config: {
          messageId: messages[messages.length - 1].id,
        },
        chatId,
      };
      await this.$store.dispatch('data/setMessageAsRead', payload);
    },
    async getFiles(ev, validate) {
      const { files } = ev.target;
      const validFiles = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // eslint-disable-next-line no-await-in-loop
        const isValid = await validate(file);
        if (isValid.valid) validFiles.push(file);
      }

      if (validFiles.length < files.length) {
        this.ShowModal({
          key: modals.areYouSureNotification,
          title: this.$t('modals.noticeTitle'),
          text: this.$t('modals.youTryToAttachUnsupportedFileFormat'),
          isFiles: true,
        });
      }

      ev.target.value = null;

      if (this.files.length + validFiles.length > 10) {
        this.ShowModal({
          key: modals.areYouSureNotification,
          title: this.$t('modals.noticeTitle'),
          text: this.$tc('modals.youCanAttachUpToNFiles', 10),
          isFiles: true,
        });

        return;
      }

      if (!validFiles.length) return;

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        const { type } = file;

        // eslint-disable-next-line no-await-in-loop
        const data = await this.$store.dispatch('data/uploadFile', { contentType: type });

        const url = URL.createObjectURL(file);

        this.files.push({
          data, file, url, type: type.split('/')[0],
        });

        reader.onerror = (evt) => {
          console.error(evt);
        };
      }
    },
    async handleScroll({ target: { scrollTop, scrollHeight, clientHeight } }) {
      const { minScrollDifference, filter: { canLoadToBottom, canLoadToTop } } = this;

      const currScrollOffset = scrollHeight - scrollTop;

      this.isScrollBtnVis = currScrollOffset > minScrollDifference;
      const scrollBottom = currScrollOffset - clientHeight;

      if (canLoadToBottom && scrollBottom < 300 && !this.isBottomChatsLoading) {
        this.isBottomChatsLoading = true;
        await this.getMessages(1);
        setTimeout(() => { this.isBottomChatsLoading = false; }, 300);
      } else if (canLoadToTop && scrollTop < 300 && !this.isTopChatsLoading) {
        this.isTopChatsLoading = true;
        await this.getMessages(0);
        setTimeout(() => { this.isTopChatsLoading = false; }, 300);
      }
    },
    async getMessages(direction, currBottomOffset) {
      const {
        filter: {
          topOffset,
          bottomOffset,
        }, chatId, messages: { list, count },
      } = this;

      const offset = direction ? currBottomOffset || bottomOffset : topOffset || count - list[0]?.number + 1 || 0;

      const payload = {
        config: {
          params: {
            limit: 20,
            offset,
            'sort[createdAt]': direction ? 'asc' : undefined,
          },
        },
        chatId,
        direction,
        offset,
      };

      try {
        await this.$store.dispatch('data/getMessagesList', payload);
      } catch (e) {
        console.log(e);
      }
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
    scrollToBottom(isInit) {
      setTimeout(() => {
        const { HandleScrollContainer, ScrollContainer, starredMessage } = this.$refs;

        ScrollContainer.scrollIntoView(isInit === true ? false : { block: 'end', behavior: 'smooth' });
        this.minScrollDifference = (HandleScrollContainer.scrollHeight - HandleScrollContainer.scrollTop) * 2;

        if (starredMessage && isInit) HandleScrollContainer.scrollTo(0, starredMessage[0].offsetTop - HandleScrollContainer.offsetTop - 20);
      }, 100);
    },
    showNoticeModal() {
      this.ShowModal({
        key: modals.notice,
      });
    },
    isRating(type) {
      return (type === 1 || type === 2);
    },
    goBackToChatsList() {
      this.$router.push('/messages');
    },
    async handleSendMessage() {
      const {
        messageText, files, isScrollBtnVis, chatId,
      } = this;
      if (!messageText) return;

      const text = messageText;

      this.messageText = '';

      const msgFiles = [];

      await Promise.all(files.map(async ({
        data, file, url, type,
      }, i) => {
      await Promise.all(files.map(async ({ data, file }) => {
        const cData = {
          url: data.url,
          formData: file,
          type: file.type,
        };
        msgFiles.push({
          url, id: i + 1, type,
        });

        try {
          await this.$store.dispatch('data/setImage', cData);
        } catch (e) {
          console.log(e);
          this.showToastError(e);
        }
      }));

      const medias = files.map(({ data }) => data.mediaId);
      this.files = [];

      const payload = {
        config: {
          text,
          medias,
        },
        chatId,
      };

      try {
        await this.$store.dispatch('data/handleSendMessage', payload);

        if (!isScrollBtnVis) this.scrollToBottom();
      } catch (e) {
        console.log(e);
        this.showToastError(e);
      }
    },
    onEnter(e, callback) {
      if (!e.ctrlKey) {
        e.preventDefault();
        callback(this.handleSendMessage);
      }
    },
  },
};
</script>

<style lang="scss">
  .template {
    &__content {
      grid-template-rows: 72px 1fr 72px !important;
    }

    &__main {
      padding-bottom: 50px !important;
    }
  }
  .footer {
    &__body {
      justify-content: flex-end !important;
    }
    &__top {
      display: none !important;
    }
  }
</style>

<style lang="scss" scoped>
.chat-page {
  @include main;

  &__header {
    padding: 20px 0;
  }
}

.chat-container {
  background-color: $white;
  border: 1px solid #E9EDF2;
  border-radius: 6px;

  &__header {
    border-bottom: 1px solid #E9EDF2;
    padding: 15px;
    font-weight: 500;
    font-size: 18px;
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    align-items: center;
    height: 71px;
  }

  &__arrow-back {
    display: flex;
    cursor: pointer;
    transition: .5s;
    &:hover {
      filter: drop-shadow(4px 4px 3px rgba(34, 60, 80, 0.4));
    }
  }

  &__chat-name {
    justify-self: center;
  }

  &__quest-link {
    color: #0083C7;
    cursor: pointer;
  }

  &__scroll-cont {
    overflow: auto;
    padding: 20px 20px 0;
    height: calc(100vh - 420px);
    min-height: 400px;
    display: grid;
    align-items: end;

    &_small {
      height: calc(100vh - 535px);
    }
  }

  &__footer {

  }

  &__file-cont {
    height: 40px;
  }

  &__file-button {
    height: 40px;
    background: #F7F8FA;
    color: #fff;
    font-size: 1.125rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    cursor: pointer;
    transition: .2s;
    &:hover {
      box-shadow: 0 0 6px rgba(0,0,0,0.2);
    }
  }

  &__file-input {
    display: none;
  }

  &__send-btn {
    height: 40px;
    border-radius: 6px;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.5;
    transition: .2s;
    background-color: $black0;
    &_active {
      pointer-events: all;
      opacity: 1;
      &:hover {
        box-shadow: 0 0 6px rgba(0,0,0,0.2);
      }
    }
  }

  &__messages {
    display: grid;
    gap: 20px;
  }

  &__loader-cont {
    height: 70px;
    position: relative;
  }

  &__loader {
    position: absolute !important;
    background: rgba(255, 255, 255, 1) !important;
  }
}

.footer {
  position: relative;

  &__scroll-btn {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #E9EDF2;
    right: 20px;
    top: -50px;
    opacity: .5;
    transition: .3s;
    cursor: pointer;

    &:hover {
      background-color: #F7F8FA;
      opacity: .8;
      box-shadow: 0 0 10px 2px rgba(34, 60, 80, 0.3);
    }
  }
  &__scroll-svg {
    height: 20px;
    width: 20px;
  }
  &__controls {
    height: 70px;
    padding: 0 15px;
    border-top: 1px solid #E9EDF2;
    display: grid;
    grid-template-columns: 40px 1fr 40px;
    gap: 10px;
    align-items: center;
  }

  &__medias {
    padding: 0 0 10px 10px;
    width: calc(100% - 10px);
    overflow: auto;
    display: grid;
    grid-auto-flow: column;
    gap: 10px;
    justify-content: start;
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
  }

  &_margin {
    margin: 10px 10px 0 0;
  }

  &__other-media {
    padding: 10px;
    display: grid;
    grid-template-rows: 1fr 20px;
    border: 1px solid #E9EDF2;
    text-decoration: unset;

    &_block {
      grid-template-rows: 1fr;
    }
  }

  &__title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 400;
    color: #4C5767;
  }

  &__remove {
    display: none;
    position: absolute;
    height: 30px;
    width: 30px;
    background-color: #ffffff59;
    border-radius: 6px;
    top: 4px;
    right: 4px;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: #fff;
    }
  }

  &:hover {
    .image-cont__remove {
      display: grid;
    }
  }
}

.icon-close_big {
  &:before {
    color: #1D2127;
    font-size: 25px;
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

.message {
  width: 70%;
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
50%{opacity: .5;}
100%{opacity: 1;}
}

&_right {
grid-template-columns: max-content minmax(auto, max-content);
justify-content: flex-end;
margin-left: 30%;
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
}

&__avatar {
height: 43px;
width: 43px;
border-radius: 50%;

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
background-color: #F7F8FA;

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
  grid-template-columns: repeat(2, max-content);
  gap: 5px;

  &__link {
    text-decoration: underline #1D2127;
    color: #1D2127;
    cursor: pointer;

    &_left {
      grid-column: 1;
      grid-row: 1;
    }
  }
}

.styles {
&__between {
display: flex;
align-items: center;
justify-content: space-between;
}
&__flex {
display: -webkit-box;
display: -ms-flexbox;
display: flex;
}
&__center {
-webkit-box-align: center;
-ms-flex-align: center;
align-items: center;
}
}

.arrow-back {
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;

}

.icon {
cursor: pointer;
font-size: 26px;
&-send::before {
@extend .icon;
content: "\ea6b";
font-size: 30px;
color: $blue;
}
&-link::before {
@extend .icon;
content: "\ea20";
color: $black700;
font-size: 30px;
}
&-short_left::before {
@extend .icon;
content: "\ea6d";
color: $black800;
}
&-more_horizontal::before {
@extend .icon;
content: "\e951";
color: $black500;
}
}

.input {
&__wrapper {
height: 40px;
}
&__file {
opacity: 0;
visibility: hidden;
position: absolute;
}
&__file-icon-wrapper {
@extend .styles__flex;
@extend .styles__center;
height: 60px;
width: 60px;
margin-right: 15px;
-webkit-box-pack: center;
-ms-flex-pack: center;
justify-content: center;
border-right: 1px solid #fff;
}
&__file-button-text {
line-height: 1;
margin-top: 1px;
}
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

.block {
background: #FFFFFF;
border-radius: 6px;
display: grid;
grid-template-columns: 240px 1fr;
min-height: 100%;
&__icon {
&_fav {
  cursor: pointer;
}
&_perf {
  display: grid;
  grid-template-columns: 25px 25px 25px 25px 25px;
}
}
}

.quest {
&__info {
background: rgba(0, 131, 199, 0.1);
width: 100%;
max-width: 215px;
border-radius: 6px;
display: flex;
}
&__name {
padding: 15px;
color: $blue;
}
}

.event {
margin: 20px 0 0 0;
font-size: 16px;
color: $black600;
font-weight: 400;
}

.name {

}

.input {
width: 100%;
margin: 11px;
}
.row {
&__container {
display: flex;
flex-direction: row;
align-items: center;
}
}

.profile {
&__img {
height: 30px;
width: 30px;
border-radius: 84px;
object-fit: cover;
}
&__name {
color: $black800;
font-size:16px;
font-weight: 500;
margin: 0 10px 0 10px;
}
}

.chat {
&__header {
border: 1px solid #E9EDF2;
border-radius: 6px 0 0 0;
}
&__panel {
height: 100%;
max-height: 70px;
width: 100%;
display: grid;
grid-template-columns: 1fr 20fr 1fr;
align-items: center;
justify-items: center;
border: 1px solid #E9EDF2;
border-radius: 0 0 6px 6px;
}
&__name-container {
display: flex;
flex-direction: row;
width: 100%;
justify-content: space-between;
}
&__title {
background-color: $white;
margin: 15px 0 15px 15px;
align-items: center;
font-weight: 500;
font-size: 18px;
display: flex;
flex-direction: row;
justify-content: space-between;
}
&__body {
background-color: $white;
border: 1px solid #E9EDF2;
border-radius: 6px;
width: 100%;
max-width: 1180px;
}
&__message {
cursor: pointer;
margin: 0 0 20px 0;
display: inline-block;
}
&__messages {
overflow-y: scroll;
height: 100%;
width: 100%;
max-height: 722px;
overflow: -moz-scrollbars-none;
-ms-overflow-style: none;
}
&__messages::-webkit-scrollbar {
width: 0;
}
&__img {
width: 100%;
height: 100%;
max-height: 30px;
max-width: 30px;
border-radius: 84px;
margin: 10px 10px 10px 20px;
}
&__name {
padding: 0 0 0 12px;
}
&__star {
margin: 0 20px 0 0;
}
}
.page {
&__title {
margin: 20px 0 20px 0;
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

@include _991 {
.chat {
&__panel {
  grid-template-columns: 1fr 15fr 1fr;
}
}
}
@include _575 {
.chat {
&__panel {
  grid-template-columns: 1fr 10fr 1fr;
}
}
}
@include _480 {
.chat {
&__panel {
  grid-template-columns: 1fr 7fr 1fr;
}
}
}
</style>
