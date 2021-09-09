<template>
  <div class="chat-page">
    <div class="chat-page__body">
      <h2 class="chat-page__header">
        {{ $t('chat.messages') }}
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
            {{}}
          </div>
          <ChatMenu />
        </div>
        <div class="chat-container__scroll-cont">
          <div class="chat-container__messages">
            <div
              v-for="message in messages.list"
              :key="message.id"
              class="chat-container__message message"
            >
              <img
                src=""
                alt=""
                class="message__avatar"
              >
              <div class="message__data">
                <div class="message__title">
                  {{}}
                </div>
                <div class="message__bubble">
                  <div class="message__title">
                    {{ message.text }}
                  </div>
                  <div
                    v-if="message.medias.length"
                    class="message__media"
                  >
                    {{}}
                  </div>
                  <div class="message__time message__title message__title_gray">
                    {{ setCurrDate(message.createdAt) }}
                  </div>
                </div>
              </div>
              <div class="message__star-cont">
                {{}}
              </div>
            </div>
            <!--          <div class="chat__info-message">-->
            <!--            <div class="name__underline">-->
            <!--              Samantha Sparcs-->
            <!--            </div>-->
            <!--            <div class="event">-->
            <!--              {{ $t('chat.invitedYou') }}-->
            <!--            </div>-->
            <!--          </div>-->
            <!--          <div class="info">-->
            <!--            <div class="quest__info">-->
            <!--              <div class="quest__name">-->
            <!--                Paint the garage quickly-->
            <!--              </div>-->
            <!--            </div>-->
            <!--          </div>-->
            <!--          <div-->
            <!--            v-for="(item, i) in messages"-->
            <!--            :key="i"-->
            <!--          >-->
            <!--            <div-->
            <!--              class="chat__message"-->
            <!--            >-->
            <!--              <div>-->
            <!--                <div class="row__container">-->
            <!--                  <div class="chat__img-container">-->
            <!--                    <img-->
            <!--                      class="chat__img"-->
            <!--                      src="~/assets/img/temp/profile.svg"-->
            <!--                    >-->
            <!--                  </div>-->
            <!--                  <div class="chat__name-container">-->
            <!--                    <div class="chat__name">-->
            <!--                      {{ item.userName }}-->
            <!--                    </div>-->
            <!--                    <div class="chat__star">-->
            <!--                      <div-->
            <!--                        class="block__icon block__icon_fav star"-->
            <!--                        @click="favoritesHandler(item)"-->
            <!--                      >-->
            <!--                        <img-->
            <!--                          v-if="!item.isFavourite"-->
            <!--                          class="star__hover"-->
            <!--                          src="~assets/img/ui/star_hover.svg"-->
            <!--                          alt=""-->
            <!--                        >-->
            <!--                        <img-->
            <!--                          v-if="!item.isFavourite"-->
            <!--                          class="star__default"-->
            <!--                          src="~assets/img/ui/star_simple.svg"-->
            <!--                          alt=""-->
            <!--                        >-->
            <!--                        <img-->
            <!--                          v-if="item.isFavourite"-->
            <!--                          class="star__checked"-->
            <!--                          src="~assets/img/ui/star_checked.svg"-->
            <!--                          alt=""-->
            <!--                        >-->
            <!--                      </div>-->
            <!--                    </div>-->
            <!--                  </div>-->
            <!--                </div>-->
            <!--                <div-->
            <!--                  class="message__interlocutor"-->
            <!--                  :class="{ message__owner: +item.type === 2 }"-->
            <!--                >-->
            <!--                  <span class="message__body">-->
            <!--                    {{ item.body }}-->
            <!--                  </span>-->
            <!--                  <div class="message__time">-->
            <!--                    {{ item.messageTime }}-->
            <!--                  </div>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </div>-->
            <!--          </div>-->
          </div>
        </div>
        <div class="chat-container__footer">
          <div class="input__wrapper">
            <input
              id="input__file"
              name="file"
              type="file"
              class="input input__file chat__btn_add"
              multiple
            >
            <label
              for="input__file"
              class="input__file-button"
            >
              <span class="icon-link" />
            </label>
          </div>
          <base-field
            v-model="messageText"
            :placeholder="$t('chat.writeYouMessage')"
          />
          <button
            class="chat__btn_spend"
            @click="handleSendMessage()"
          >
            <span class="icon-send" />
          </button>
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
      isShowFavourite: false,
      messageText: '',
      filter: {
        offset: 0,
        limit: 20,
      },
      today: moment(new Date()),
    };
  },
  computed: {
    ...mapGetters({
      messages: 'data/getMessages',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    await this.getMessages();
    this.SetLoader(false);
    const isChatNotificationShown = !!localStorage.getItem('isChatNotificationShown');
    if (!isChatNotificationShown) this.showNoticeModal();
  },
  methods: {
    getMessages() {
      const payload = {
        params: this.filter,
        chatId: this.$route.params.id,
      };
      try {
        this.$store.dispatch('data/getMessagesList', payload);
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
    scrollChat() {
      const chat = this.$el.querySelector('#chat__messages');
      setTimeout(() => {
        chat.scrollTop = chat.scrollHeight;
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
    handleSendMessage() {
      const payload = {
        config: {
          text: this.messageText,
          medias: [],
        },
        userId: '8407b757-95b3-4862-95b6-e6d8d6d03341',
      };
      this.messageText = '';

      try {
        this.$store.dispatch('data/handleCreateChat', payload);
      } catch (e) {
        console.log(e);
      }

      if (!this.messageText) return;

      const message = {
        userName: 'Rosalia Vanse',
        type: 2,
        body: this.messageText,
        isFavourite: false,
        messageTime: moment().format('HH:mm'),
      };
      this.messageText = '';
      this.scrollChat();
    },
    onEnter(e, callback) {
      if (!e.ctrlKey) {
        e.preventDefault();
        callback(this.handleSendMessage);
      }
    },
    favoritesHandler(item) {
      // TODO replace with mutation
      if (item.isFavourite) {
        console.log('remove from favorites', item);
      } else {
        console.log('add to favorites', item);
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

  &__scroll-cont {
    overflow: auto;
    padding: 20px;
    height: calc(100vh - 420px);
    display: grid;
    align-items: end;
  }

  &__footer {
    height: 70px;
    border-top: 1px solid #E9EDF2;
    display: grid;
  }

  &__messages {
    display: grid;
    gap: 20px;
  }
}

.message {
  display: grid;
  grid-template-columns: 43px 0.7fr max-content;
  gap: 10px;
  height: max-content;

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
    width: 100%;
    position: relative;
    text-align: center;
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
  &__file-button {
    width: 100%;
    max-width: 40px;
    height: 40px;
    background: #F7F8FA;
    color: #fff;
    font-size: 1.125rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    cursor: pointer;
    margin: 0 0 0 10px;
    transition: .2s;
    &:hover {
      @extend .input__file-button;
      box-shadow: 0 0 6px rgba(0,0,0,0.2);
    }
  }
}

.star {
  &__default {

    display: flex;
  }
  &__hover {
    width: 22px !important;
    display: none;
  }
  &__checked {
    width: 22px !important;
  }
  &:hover {
    .star {
      &__hover {
        display: block;
      }
      &__default {
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

.info {
  display: flex;
  justify-content: center;
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
  &__underline {
    text-decoration: underline;
    margin: 20px 10px 20px 0;
    font-size: 16px;
    color: $black800;
    font-weight: 400;
  }
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
  &__info-message {
    display: flex;
    justify-content: center;
  }
  &__header {
    border: 1px solid #E9EDF2;
    border-radius: 6px 0 0 0;
  }
  &__btn {
    width: 100%;
    height: 100%;
    max-width:40px;
    max-height: 40px;
    border-radius: 6px;
    transition: .2s;
    background-color: $black0;
    &_spend {
      @extend .chat__btn;
      margin: 0 11px 0 0;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        @extend .chat__btn_spend;
        box-shadow: 0 0 6px rgba(0,0,0,0.2);
      }
    }
    &_add {
      @extend .chat__btn;
      margin: 0 -11px 0 0;
      &:hover {
        @extend .chat__btn_add;
        box-shadow: 0 0 6px rgba(0,0,0,0.2);
      }
    }
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
