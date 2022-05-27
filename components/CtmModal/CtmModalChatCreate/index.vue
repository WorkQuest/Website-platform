<template>
  <ctm-modal-box
    class="messageSend"
    :title="$tc(`modals.chatCreate.${setLocale}`)"
  >
    <div class="ctm-modal__content">
      <template v-if="options.isCreating">
        <div class="ctm-modal__content-desc">
          {{ $t('modals.chatCreate.desc') }}
        </div>
        <div class="ctm-modal__content-field">
          <base-field
            v-model="name"
            data-selector="CHAT-NAME"
            :is-hide-error="true"
            :label="$tc('modals.chatCreate.chatName')"
            :placeholder="$t('modals.chatCreate.chatName')"
          />
        </div>
      </template>
      <div class="ctm-modal__content-participants participants">
        <base-btn
          v-if="options.isMembersList && options.itsOwner"
          class="button"
          data-selector="ADD-NEW-MEMBERS"
          @click="addNewMembers"
        >
          {{ $t('modals.chatCreate.addNewMembers') }}
          <span class="icon-plus_circle_outline" />
        </base-btn>
        <div class="participants__content">
          <div
            v-for="user in members"
            :key="user.id"
            class="participants__contact"
          >
            <div class="friends__data">
              <img
                class="friends__img"
                alt=""
                :src="user.avatar && user.avatar.url ? user.avatar.url : require('~/assets/img/app/avatar_empty.png')"
              >
              <span class="friends__name">
                {{ (user.firstName || '') + ' ' + (user.lastName || '') }}
              </span>
            </div>
            <div
              v-if="options.isCreating || options.isAdding"
              class="checkbox-field"
            >
              <label
                :for="user.id"
                class="checkbox solid-blue"
              >
                <input
                  :id="user.id"
                  type="checkbox"
                  class="checkbox-input"
                  @change="changeSelStatus($event, user)"
                >
                <span class="checkmark" />
              </label>
            </div>
            <div
              v-if="options.isMembersList && options.itsOwner"
              class="friends__menu"
            >
              <chat-menu
                class="friends__btn-menu"
                :menu-items="isCurrentUserEmployer?['giveAQuest','removeFromChat']:['removeFromChat']"
                @giveAQuest="sendInvite(user)"
                @removeFromChat="tryRemoveUser(user.id)"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!options.isMembersList"
        class="ctm-modal__content-btns"
      >
        <div class="btn-group">
          <base-btn
            class="btn"
            data-selector="CANCEL"
            @click="hide()"
          >
            {{ $t('meta.btns.cancel') }}
          </base-btn>
          <base-btn
            class="btn_bl"
            data-selector="APPLY"
            :disabled="options.isCreating && (!memberUserIds.length || !name)"
            @click="applyChanges"
          >
            {{ $t('meta.btns.save') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import { Path, UserRole } from '~/utils/enums';
import modals from '~/store/modals/modals';
import ChatMenu from '~/components/ui/ChatMenu';

export default {
  name: 'ModalChatUsers',
  components: { ChatMenu },
  data() {
    return {
      name: '',
      memberUserIds: [],
      members: [],
      filter: {
        offset: 0,
        limit: 100,
      },
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      users: 'chat/getGroupChatUsers',
      chatMembers: 'chat/getChatMembers',
      chatId: 'chat/getCurrChatId',
      currentUser: 'user/getUserData',
    }),
    setLocale() {
      const { isMembersList, isAdding } = this.options;
      if (isMembersList) return 'members';
      if (isAdding) return 'addMember';
      return 'title';
    },
    isCurrentUserEmployer() {
      return this.currentUser.role === UserRole.EMPLOYER;
    },
  },
  async mounted() {
    const { options: { isMembersList }, chatMembers } = this;
    if (isMembersList) this.members = chatMembers;
    else await this.getUsers();
  },
  methods: {
    async addNewMembers() {
      this.members = [];
      const optionsArr = [
        { key: 'isAdding', val: true },
        { key: 'isMembersList', val: false },
      ];
      this.changeOptions(optionsArr);
      await this.getUsers();
    },
    changeOptions(optionsArr) {
      this.$store.commit('modals/setCurrOptionByKey', optionsArr);
    },
    tryRemoveUser(userId) {
      this.ShowModal({
        key: modals.areYouSure,
        text: this.$t('modals.sureDeleteMemberText'),
        okBtnTitle: this.$t('meta.btns.delete'),
        okBtnFunc: async () => await this.removeMember(userId),
      });
    },
    async removeMember(userId) {
      await this.$store.dispatch('chat/removeMember', { userId, chatId: this.chatId });
      this.CloseModal();
      this.ShowModal({
        key: modals.chatCreate,
        itsOwner: true,
        isCreating: false,
        isMembersList: true,
        isAdding: false,
      });
    },
    changeSelStatus({ target }, { id }) {
      if (target.checked) this.memberUserIds.push(id);
      else this.memberUserIds = this.memberUserIds.filter((userId) => userId !== id);
    },
    async getUsers() {
      const { filter, chatId, users } = this;
      const config = {
        params: { ...filter, excludeMembersChatId: chatId || undefined },
      };
      await this.$store.dispatch('chat/getUsersForGroupChat', config);
      this.members = users.list;
    },
    hide() {
      const { options: { isAdding }, chatMembers } = this;
      if (isAdding) {
        const optionsArr = [
          { key: 'isAdding', val: false },
          { key: 'isMembersList', val: true },
        ];
        this.changeOptions(optionsArr);
        this.members = chatMembers;
        return;
      }
      this.CloseModal();
    },
    async applyChanges() {
      const {
        name, memberUserIds, chatId, options: { isCreating, isAdding },
      } = this;
      if (isCreating) {
        const config = { name, memberUserIds };
        const { ok, result } = await this.$store.dispatch('chat/handleCreateGroupChat', config);
        if (ok) await this.$router.push(`${Path.MESSAGES}/${result.id}`);
      } else if (isAdding && memberUserIds.length) {
        const payload = { config: { userIds: memberUserIds }, chatId };
        this.memberUserIds = [];
        await this.$store.dispatch('chat/addNewMembers', payload);
      }
      this.hide();
    },
    async sendInvite(user) {
      const { count } = await this.$store.dispatch('quests/getAvailableQuests', user.id);
      if (count > 0) {
        this.ShowModal({
          key: modals.invitation,
          userId: user.id,
          avatar: user.avatar,
          firstName: user.firstName,
          lastName: user.lastName,
          ratingStatistic: user.ratingStatistic,
        });
      } else {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('modals.errors.errorQuests'),
          subtitle: this.$t('modals.errors.emptyOpenQuests'),
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
  &__content-desc {
    color: #AAB0B9;
    margin: 25px 0;
  }
  &__content-participants {
    margin: 25px 0 0 0;
    .participants {
      &__content {
        max-height: 500px;
        overflow: visible auto;
        padding-bottom: 30px;
      }
      &__contact {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;

        &:not(:last-child) {
          border-bottom: 1px solid $black0;
        }

        .friends {
          &__data {
            display: flex;
            align-items: center;
            grid-gap: 10px;
          }
          &__img {
            height: 50px;
            width: 50px;
            border-radius: 50%;
            -o-object-fit: cover;
            object-fit: cover;
          }
          &__name {
            font-size: 18px;
          }
        }
      }
    }
  }
  &__content-btns {
    .btn-group {
      display: grid;
      grid-template-columns: repeat(2, calc(50% - 10px));
      grid-gap: 20px;
      gap: 20px;
      margin-top: 25px;

      &_solo {
        grid-template-columns: 1fr;
      }

      .btn {
        box-sizing: border-box;
        font-weight: 400;
        font-size: 16px;
        color: #0083C7;
        border: 1px solid #0083C71A;
        border-radius: 6px;
        transition: .3s;
        background-color: #fff;

        &:hover {
          background-color: #0083C71A;
          border: 0;
        }

        &_bl {
          @extend .btn;
          background-color: #0083C7;
          border: unset;
          color: #fff;

          &:hover {
            background-color: #103d7c;
          }
        }
      }
    }
  }

  &__label {
    margin-bottom: 5px;
  }

  &__content {
    padding-top: 0 !important;

    .button {
      box-sizing: border-box;
      font-weight: 400;
      font-size: 16px;
      color: #0083C7;
      border: 1px solid #0083C71A;
      border-radius: 6px;
      transition: .3s;
      background-color: #fff;

      &:hover {
        background-color: #0083C71A;
        border: 0;
      }
    }
  }
}

.icon-plus_circle_outline {
  margin-left: 10px;

  &:before {
    color: #0083C7;
    font-size: 20px;
  }
}

.icon-minus_circle_outline:before {
  color: #DF3333;
  font-size: 22px;
}

.checkbox {
  flex-shrink: 0;
  &__label {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black600;
    cursor: pointer;
  }
}
.checkbox-field {
  position: relative;
  display: flex;
  align-items: center;
  .checkbox {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    margin-bottom: 0;
  }
  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  .checkmark {
    transition: .3s;
    position: absolute;
    width: 24px;
    height: 24px;
    background: $black0;
    border-radius: 3px;
    cursor: pointer;
    border: 1px solid transparent;
    &:hover {
      border: 1px solid $black100;
    }
  }
  .checkmark::after {
    content: "";
    transition: all 300ms;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 3px;
    background: $blue url('~assets/img/ui/checked.svg') no-repeat 50% 50%;
    opacity: 0;
  }
  input:checked ~ .checkmark::after {
    opacity: 1;
  }
  .checkbox_label {
    font-size: inherit;
  }
}

.friends {
  &__menu {
    display: flex;
    justify-items: center;
    align-items: center;
    gap: 5px;
  }
  &__del-cont {
    margin-top: 4px;
    cursor: pointer;
  }
  &__btn-menu{
    margin-right:3px ;
  }
}
.messageSend {
  max-width: 495px !important;
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
