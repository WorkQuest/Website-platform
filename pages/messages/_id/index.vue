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
            <span>
              {{ $t('chat.chat') }}
            </span>
          </div>
          <div class="chat-container__chat-name">
            <template v-if="currChat">
              <div
                v-if="currChat.type === ChatType.QUEST"
                class="chat-container__quest-link"
                @click="goToQuest"
              >
                {{ currChat && currChat.questChat && currChat.questChat.quest.title }}
              </div>
              <div
                v-if="currChat.type === ChatType.PRIVATE && privateCorrespondentMember.type === $options.UserRoles.USER"
                class="chat-container__quest-link"
                @click="$router.push(`${$options.Path.PROFILE}/${privateCorrespondentMember.userId}`)"
              >
                {{ privateCorrespondentFullName || '-' }}
              </div>
              <div v-else-if="currChat.type === ChatType.PRIVATE && privateCorrespondentMember.type === $options.UserRoles.ADMIN">
                <div class="chat-container__group-name">
                  {{ $t('chat.workquestAdmin') }}
                </div>
              </div>
              <div
                v-if="isGroupChat"
                class="chat-container__group-chat-cont"
              >
                <div class="chat-container__group-name">
                  {{ currChat.groupChat && currChat.groupChat.name }}
                </div>
                <div
                  v-if="currChat.members"
                  class="chat-container__quest-link chat-container__quest-link_small"
                  @click="goToMembersList"
                >
                  {{ $tc('chat.membersNum', currChat.members.length) }}
                </div>
              </div>
            </template>
          </div>
          <ChatMenu
            v-show="canShowMenu"
            :can-i-leave="canLeave"
          />
        </div>
        <messages-list
          :chat-id="chatId"
          class="chat-container__body"
          :class="[
            {'chat-container__body_small' : files.length},
            {'chat-container__body_big' : chatId === 'starred' || isClosedQuestChat}]"
        />
        <div class="chat-container__footer footer">
          <validation-observer
            v-show="chatId !== 'starred' && !isClosedQuestChat"
            v-slot="{ invalid }"
            tag="div"
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
              ref="chatInput"
              v-model="messageText"
              mode="chat"
              rules="max:1600"
              :name="$t('modals.message')"
              :auto-focus="true"
              :placeholder="$t('chat.writeYouMessage')"
              :on-enter-press="handleSendMessage"
              :disabled="isDisabledSendMessage"
              data-selector="INPUT-MESSAGE"
            />
            <button
              class="chat-container__send-btn"
              :class="{'chat-container__send-btn_active' : messageText || files}"
              data-selector="SEND-MESSAGE"
              :disabled="isDisabledSendMessage || invalid"
              @click="handleSendMessage"
            >
              <span class="icon-send" />
            </button>
          </validation-observer>
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
                v-if="file.type === $options.FileTypes.IMAGE"
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
                <video
                  v-if="file.type === $options.FileTypes.VIDEO"
                  preload="metadata"
                  class="image-cont__video"
                >
                  <source
                    :src="file.url"
                    :type="file.contentType"
                  >
                </video>
                <span
                  :class="[
                    {'icon-play_circle_outline' : file.type === $options.FileTypes.VIDEO},
                    {'icon-file_blank_outline' : file.type !== $options.FileTypes.VIDEO}
                  ]"
                />
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
import modals from '~/store/modals/modals';
import ChatMenu from '~/components/ui/ChatMenu';
import { QuestStatuses } from '~/utils/сonstants/quests';
import { Path } from '~/utils/enums';
import {
  ChatType, QuestChatStatus, UserRoles, FileTypes,
} from '~/utils/сonstants/chat';

export default {
  name: 'Messages',
  components: {
    ChatMenu,
  },
  Path,
  UserRoles,
  FileTypes,
  data() {
    return {
      messageText: '',
      files: [],
      chatId: this.$route.params.id,
      isDisabledSendMessage: false,
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      currChat: 'chat/getCurrChatInfo',
      infoDataMode: 'quests/getInfoDataMode',
      isLoading: 'main/getIsLoading',
    }),
    ChatType() {
      return ChatType;
    },
    isGroupChat() {
      return this.currChat?.type === ChatType.GROUP;
    },
    isPrivateChat() {
      return this.currChat?.type === ChatType.PRIVATE;
    },
    canShowMenu() {
      const {
        isClosedQuestChat, isGroupChat, amIOwner, isPrivateChat,
      } = this;
      if (this.chatId === 'starred') return false;
      return (!isClosedQuestChat ? (!isGroupChat && !isPrivateChat)
        || (isGroupChat && !amIOwner) : false);
    },
    isClosedQuestChat() {
      return ((this.currChat?.questChat?.status === QuestChatStatus.Closed)
        || [QuestStatuses.Done, QuestStatuses.Closed, QuestStatuses.Rejected].includes(+this.$route.query.status));
    },
    canLeave() {
      return this.isGroupChat && !this.amIOwner;
    },
    amIOwner() {
      const currMemeberData = this.currChat?.members && this.currChat?.members.find((el) => el.userId === this.userData.id);
      if (!currMemeberData) return false;
      return this.currChat?.groupChat?.ownerMemberId === currMemeberData.id;
    },
    privateCorrespondentMember() {
      return this.currChat?.members && this.currChat?.members.find((el) => el.userId !== this.userData.id);
    },
    privateCorrespondentFullName() {
      if (!this.privateCorrespondentMember.user) return '-';
      return `${this.privateCorrespondentMember.user?.firstName} ${this.privateCorrespondentMember.user?.lastName}`;
    },

  },
  async mounted() {
    this.SetLoader(true);

    if (this.currChat?.questChat?.status === QuestChatStatus.Closed) this.isClosedQuestChat = true;

    const isChatNotificationShown = !!localStorage.getItem('isChatNotificationShown');
    if (!isChatNotificationShown) this.showNoticeModal();
  },
  destroyed() {
    this.$store.commit('chat/setIsChatOpened', false);
  },
  methods: {
    goToMembersList() {
      this.ShowModal({
        key: modals.chatCreate,
        itsOwner: this.amIOwner,
        isCreating: false,
        isMembersList: true,
        isAdding: false,
        sendPrivateMsg: (userId) => {
          this.ShowModal({
            key: modals.sendARequest,
            title: this.$tc('modals.titles.sendPrivateMessage'),
            callbackSend: async (files, text) => {
              if (this.isLoading) return;
              this.SetLoader(true);
              const medias = await this.uploadFiles(files);
              const { ok: isChatCreated, result } = await this.$store.dispatch('chat/handleCreatePrivateChat', { userId, medias, text });
              this.SetLoader(false);
              if (isChatCreated) {
                await this.$router.push(`${Path.MESSAGES}/${result.chat.id}`);
                this.CloseModal();
              }
            },
          });
        },
      });
    },
    goToQuest() {
      const { questId } = this.currChat.questChat;
      this.$router.push(`/quests/${questId}`);
    },
    openFile(ev) {
      ev.stopPropagation();
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
    handleRemoveFile(index) {
      this.files.splice(index, 1);
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
          title: this.$t('modals.titles.noticeTitle'),
          text: this.$t('modals.youTryToAttachUnsupportedFileFormat'),
          isFiles: true,
        });
      }

      ev.target.value = null;

      if (this.files.length + validFiles.length > 10) {
        this.ShowModal({
          key: modals.areYouSureNotification,
          title: this.$t('modals.titles.noticeTitle'),
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
        const data = await this.$store.dispatch('chat/uploadFile', { contentType: type });

        if (!data) return;

        const url = URL.createObjectURL(file);

        this.files.push({
          data, file, url, type: type.split('/')[0],
        });

        reader.onerror = (e) => {
          console.log(e);
          this.showToastError(e);
        };
      }
    },
    showNoticeModal() {
      this.ShowModal({
        key: modals.notice,
      });
    },
    goBackToChatsList() {
      if (window.history.length > 2) {
        this.$router.go(-1);
      } else {
        this.$router.push(`${Path.MESSAGES}`);
      }
    },
    async handleSendMessage() {
      const {
        messageText, files, chatId,
      } = this;
      this.isDisabledSendMessage = true;

      if (!messageText && !files.length) {
        this.isDisabledSendMessage = false;
        return;
      }

      const text = messageText;

      this.messageText = '';

      const msgFiles = [];

      await Promise.all(files.map(async ({
        data, file, url, type,
      }, i) => {
        const cData = {
          url: data.url,
          formData: file,
          type: file.type,
        };
        msgFiles.push({
          url, id: i + 1, type,
        });
        await this.$store.dispatch('chat/setImage', cData);
      }));

      const medias = files.map(({ data }) => data.mediaId);
      this.files = [];

      const payload = {
        config: {
          text,
          mediaIds: medias,
        },
        chatId,
      };
      await this.$store.dispatch('chat/handleSendMessage', payload);
      this.isDisabledSendMessage = false;
      this.$nextTick(() => this.$refs.chatInput.focus());
    },
    onEnter(e, callback) {
      if (!e.ctrlKey) {
        e.preventDefault();
        callback(this.handleSendMessage);
      }
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
    padding: 0 15px;
    font-weight: 500;
    font-size: 18px;
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    align-items: center;
    height: 71px;
  }

  &__body {
    height: calc(100vh - 370px);
    min-height: 400px;

    &_small {
      height: calc(100vh - 485px);
    }

    &_big {
      height: calc(100vh - 295px);
    }
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
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 50%;
    white-space: nowrap;
  }

  &__quest-link {
    color: #0083C7;
    cursor: pointer;
    justify-self: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &_small {
      font-size: 14px;
      font-weight: 500;
    }
  }

  &__group-chat-cont {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__file-cont {
    height: 40px;
  }

  &__file-button {
    height: 40px;
    background: $black0;
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
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
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
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
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

  &__controls {
    height: 70px;
    padding: 20px 15px 0;
    border-top: 1px solid #E9EDF2;
    display: grid;
    grid-template-columns: 40px 1fr 40px;
    gap: 10px;
    align-items: start;
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
    object-fit: cover;
  }

  &__other-media {
    padding: 10px;
    display: grid;
    grid-template-rows: 1fr 20px;
    border: 1px solid #E9EDF2;
    text-decoration: unset;
  }

  &__video{
    position: relative;
    height: 73px;
    width: 105px;
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
.icon-play_circle_outline{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  .chat-page {
    &__header {
      padding-left: 15px;
    }
  }
}

@include _991 {
  .chat {
    &__panel {
      grid-template-columns: 1fr 15fr 1fr;
    }
  }
}

@include _575 {
  .chat-page {
    &__header {
      display: none;
    }
  }

  .chat-container {
    &__body {
      height: calc(100vh - 295px);

      &_small {
        height: calc(100vh - 410px);
      }

      &_big {
        height: calc(100vh - 220px);
      }
    }
  }
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
