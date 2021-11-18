<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t(`modals.chatCreate.${options.isMembersList ? 'members' : options.isAdding ? 'addMember' : 'title'}`)"
  >
    <div class="ctm-modal__content">
      <template v-if="options.isCreating">
        <div class="ctm-modal__content-desc">
          {{ $t('modals.chatCreate.desc') }}
        </div>
        <div class="ctm-modal__content-field">
          <base-field
            v-model="name"
            :is-hide-error="true"
            :label="$t('modals.chatCreate.chatName')"
            :placeholder="$t('modals.chatCreate.chatName')"
          />
        </div>
      </template>
      <div class="ctm-modal__content-participants participants">
        <base-btn
          v-if="options.isMembersList && options.itsOwner"
          class="button"
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
                :src="user.avatar && user.avatar.url ? user.avatar.url : require('~/assets/img/app/avatar_empty.png')"
              >
              <span class="friends__name">
                {{ (user.firstName || '') + ' ' + (user.lastName || '') }}
              </span>
            </div>
            <template v-if="options.isCreating || options.isAdding">
              <input
                :id="user.id"
                type="checkbox"
                class="friends__checkbox_custom"
                :checked="memberUserIds.findIndex((id) => id === user.id) >= 0"
                @change="changeSelStatus($event, user.id)"
              >
              <label :for="user.id" />
            </template>
            <div
              v-if="options.isMembersList && options.itsOwner"
              class="friends__del-cont"
              @click="tryRemoveUser(user.id)"
            >
              <span class="icon-minus_circle_outline" />
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
            @click="hide()"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="btn_bl"
            :disabled="options.isCreating && (!memberUserIds.length || !name)"
            @click="applyChanges"
          >
            {{ $t('meta.save') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalChatUsers',
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
    }),
  },
  async mounted() {
    const { options: { isMembersList }, chatMembers } = this;

    if (isMembersList) {
      this.members = chatMembers;
    } else {
      await this.getUsers();
    }
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
        key: modals.areYouSureDeleteMember,
        userId,
      });
    },
    changeSelStatus({ target }, userId) {
      if (target.checked) {
        this.memberUserIds.push(userId);
      } else {
        this.memberUserIds = this.memberUserIds.filter((id) => id !== userId);
      }
    },
    async getUsers() {
      const { filter, chatId, users } = this;

      const config = {
        params: {
          ...filter,
          excludeMembersChatId: chatId || undefined,
        },
      };

      try {
        await this.$store.dispatch('chat/getUsersForGroupChat', config);
        this.members = users.list;
      } catch (e) {
        console.log(e);
        this.showToastError(e);
      }
    },
    showToastError(e) {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.error'),
        variant: 'warning',
        text: e.response?.data?.msg,
      });
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
        name, memberUserIds, options: { isCreating, isAdding },
      } = this;

      if (isCreating) {
        const config = {
          name,
          memberUserIds,
        };
        try {
          await this.$store.dispatch('chat/handleCreateGroupChat', config);
        } catch (e) {
          console.log(e);
          this.showToastError(e);
        }
      } else if (isAdding) {
        console.log();
      }

      this.hide();
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
        overflow: auto;
        &::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
      }
      &__contact {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;

        &:not(:last-child) {
          border-bottom: 1px solid #F7F8FA;
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
          border: 0px;
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
        border: 0px;
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

.friends {
  &__checkbox_custom {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }
  &__checkbox_custom+label {
    display: inline-flex;
    align-items: center;
    user-select: none;
    background: #F7F8FA;
    border-radius: 3px;
  }
  &__checkbox_custom+label::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    flex-grow: 0;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 50% 50%;
  }
  &__checkbox_custom:checked+label::before {
    border-color: #0b76ef;
    background-color: #0b76ef;
    border-radius: 3px;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
  }

  &__del-cont {
    cursor: pointer;
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
