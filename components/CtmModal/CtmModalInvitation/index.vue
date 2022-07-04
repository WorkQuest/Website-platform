<template>
  <ctm-modal-box
    class="messageSend"
    :title="$tc('modals.titles.invitation')"
  >
    <div class="ctm-modal__content">
      <validation-observer tag="div">
        <div class="grid__field grid__field_top">
          <div class="ctm-modal__content-field">
            <div class="ctm-modal__user-data">
              <img
                class="user-data__img"
                :src="options.avatar && options.avatar.url ? options.avatar.url : $options.images.EMPTY_AVATAR"
                alt="avatar"
              >
              <div class="user-data__name">
                {{ UserName(options.firstName, options.lastName) }}
              </div>
              <item-rating
                class="user-data__status"
                :rating="userData.ratingStatistic.status"
              />
            </div>
          </div>
        </div>
        <div class="grid__field">
          <div class="ctm-modal__content-field">
            <base-dd
              v-model="questIndex"
              type="gray"
              data-type="object"
              mode="small"
              class="base-dd_available-quests"
              :items="availableQuests"
              :label="$t('modals.chooseQuest')"
              :data-selector="`QUEST-${questIndex}`"
            />
          </div>
        </div>
        <div class="ctm-modal__content-field grid__field">
          <label for="message_input">{{ $t('modals.message') }}</label>
          <base-textarea
            id="message_input"
            v-model="message_input"
            rules="required"
            data-selector="MESSAGE"
            class="message__textarea"
            :name="$t('modals.message')"
            :placeholder="$t('meta.typeYourMessage')"
          />
        </div>
        <div class="btn__container">
          <div class="btn__wrapper">
            <base-btn
              class="message__action"
              :disabled="!message_input.trim()"
              data-selector="INVITE-ON-QUEST"
              @click="inviteOnQuest()"
            >
              {{ $t('meta.btns.send') }}
            </base-btn>
          </div>
          <div class="btn__wrapper">
            <base-btn
              class="message__action"
              mode="outline"
              data-selector="CANCEL"
              @click="CloseModal"
            >
              {{ $t('meta.btns.cancel') }}
            </base-btn>
          </div>
        </div>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { Path } from '~/utils/enums';
import { images } from '~/utils/images';

export default {
  name: 'ModalInvitation',
  images,
  data() {
    return {
      questIndex: 0,
      message_input: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userData: 'user/getUserData',
      availableQuests: 'quests/getAvailableQuests',
      chatInfoInviteOnQuest: 'quests/getChatInfoInviteOnQuest',
    }),
  },
  methods: {
    async inviteOnQuest() {
      const questId = this.availableQuests[this.questIndex].id || '';
      const payload = {
        invitedUserId: this.options.userId || '',
        message: this.message_input || null,
      };
      try {
        await this.$store.dispatch('quests/inviteOnQuest', { questId, payload });
        this.showTransactionSendModal();
      } catch (e) {
        console.log(e);
      }
    },
    showTransactionSendModal() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/inviteSend.svg'),
        title: this.$t('modals.titles.inviteSend'),
        subtitle: '',
        button: this.$t('meta.btns.goToChat'),
        submitMode: 'agree',
        callback: () => this.goToChat(),
      });
    },
    goToChat() {
      const { chatId } = this.chatInfoInviteOnQuest;
      this.$router.push(`${Path.MESSAGES}/${chatId}`);
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>

.card {
  &__level {
    margin: 0 0 0 15px;
    font-size: 12px;
    justify-content: center;
    align-items: center;
    display: flex;
    &_higher {
      display: block;
      margin: 0 0 0 7px;
      padding: 2px 4px 2px 4px;
      background-color: $yellow100;
      border-radius: 3px;
      color: $white;
    }
    &_reliable {
      display: block;
      margin: 0 0 0 7px;
      padding: 2px 4px 2px 4px;
      background-color: $grey200;
      border-radius: 3px;
      color: $white;
    }
    &_checked {
      display: block;
      margin: 0 0 0 7px;
      padding: 2px 4px 2px 4px;
      background-color: $brown;
      border-radius: 3px;
      color: $white;
    }
    &_disabled {
      display: none;
    }
  }
}

.message {
  &__textarea {
    height: 214px;
    width: 100%;
    &::placeholder {
      color: $black200;
    }
  }
}

.ctm-modal {
  @include modalKit;
  &__content-field {
    display: grid;
  }
  &__user-data {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

.user-data {
  &__img {
    width: 61px;
    height: 61px;
    border-radius: 73px;
    margin: 0 10px 0 0;
  }
  &__status {
    margin-left: 10px;
  }
}

.input {
  &_white {
    border-radius: 6px;
    border: 1px solid $black0;
    padding: 11px 20px 11px 15px;
    height: 46px;
    width: 100%;
    background-color: $white;
    resize: none;
    &::placeholder {
      color: $black800;
    }
  }
}

.grid {
  &__field {
    display: grid;
    margin-top: 25px;
    &_top {
      margin: 0;
    }
  }
}

.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin-top: 25px;
  }
  &__wrapper {
    width: 45%;
  }
}

.messageSend {
  max-width: 680px !important;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
  }
  &__action {
    margin-top: 10px;
  }
}
</style>
