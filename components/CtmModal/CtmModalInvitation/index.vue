<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('modals.invitation')"
  >
    <div class="ctm-modal__content">
      <validation-observer tag="div">
        <div class="grid__field grid__field_top">
          <div class="ctm-modal__content-field">
            <div class="avatar__container">
              <div>
                <img
                  class="ctm-modal__img"
                  :src="userData.avatar && userData.avatar.url ? userData.avatar.url : require('~/assets/img/app/avatar_empty.png')"
                  :alt="userData.avatar && userData.avatar.url ? userData.avatar.url : 'avatar_empty'"
                >
              </div>
              <div>
                {{ userData.firstName ? userData.firstName : "Nameless worker" }}
                {{ userData.lastName ? userData.lastName : "" }}
              </div>
              <div>
                <div
                  class="card__level"
                  :class="{'card__level_disabled': card.level.code === '0'}"
                >
                  <span
                    class="card__level_higher"
                    :class="cardsLevels()"
                  >{{ card.level.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid__field">
          <div class="ctm-modal__content-field">
            <base-dd
              v-model="questIndex"
              type="gray"
              data-type="object"
              :items="questFiltered"
              :label="$t('modals.chooseQuest')"
            />
          </div>
        </div>
        <div class="ctm-modal__content-field grid__field">
          <label for="message_input">{{ $t('modals.message') }}</label>
          <textarea
            id="message_input"
            v-model="message_input"
            class="message__textarea"
            :placeholder="$t('modals.hello')"
          />
        </div>
        <div class="btn__container">
          <div class="btn__wrapper">
            <base-btn
              class="message__action"
              @click="inviteOnQuest(questIndex)"
            >
              {{ $t('meta.send') }}
            </base-btn>
          </div>
          <div class="btn__wrapper">
            <base-btn
              class="message__action"
              :mode="'outline'"
              @click="hide()"
            >
              {{ $t('meta.cancel') }}
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

export default {
  name: 'ModalInvitation',
  data() {
    return {
      questFiltered: [],
      questIndex: 0,
      message_input: '',
      chooseQuest_input: '',
      card: {
        level: {
          title: 'HIGHER LEVEL',
          code: '1',
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      questList: 'quests/getQuestListForInvitation',
      userData: 'user/getUserData',
    }),
    cardLevelClass() {
      const { code } = this.card.level;
      return [
        { card__level_reliable: code === '2' },
        { card__level_checked: code === '3' },
      ];
    },
  },
  async beforeMount() {
    await this.getQuestList();
    await this.questFilter();
  },
  methods: {
    async getQuestList() {
      await this.$store.dispatch('quests/questListForInvitation', this.userData.id);
    },
    async questFilter() {
      this.questFiltered = this.questList.quests.filter((quest) => quest.status === 0);
    },
    async inviteOnQuest(questIndex) {
      const questId = this.questFiltered[questIndex].id || '';
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
    cardsLevels() {
      const { card } = this;
      return [
        { card__level_reliable: card.level.code === '2' },
        { card__level_checked: card.level.code === '3' },
        { card__level_disabled: card.level.code === '0' },
      ];
    },
    hide() {
      this.CloseModal();
    },
    showTransactionSendModal() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/inviteSend.svg'),
        title: this.$t('modals.inviteSend'),
        subtitle: this.$t('modals.invitationSendText'),
        type: 'goToChat',
        button: this.$t('btn.goToChat'),
      });
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

.avatar {
  &__container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

.message {
  &__textarea {
    border-radius: 6px;
    padding: 11px 20px 11px 15px;
    height: 214px;
    width: 100%;
    border: 0;
    background-color: $black0;
    resize: none;

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
  &__img {
    width: 61px;
    height: 61px;
    border-radius:73px;
    margin: 0 10px 0 0;
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
