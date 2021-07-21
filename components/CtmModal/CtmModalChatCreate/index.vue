<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('modals.chatCreate.title')"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__content-desc">
        {{ $t('modals.chatCreate.desc') }}
      </div>
      <div class="ctm-modal__content-field">
        <base-field
          v-model="chatName"
          :is-hide-error="true"
          :label="$t('modals.chatCreate.chatName')"
          :placeholder="$t('placeholders.default')"
        />
      </div>
      <div class="ctm-modal__content-participants participants">
        <div class="participants__title">
          {{ $t('modals.chatCreate.participants') }}
        </div>
        <div class="participants__content">
          <div
            v-for="(item,i) in userFriends"
            :key="i"
            class="participants__contact friends"
            :class="Number(i) === Object.keys(userFriends).length ? '' : 'participants__contact_border'"
          >
            <div class="friends__data">
              <img
                class="friends__img"
                src="~/assets/img/temp/profile.svg"
              >
              <span
                class="friends__name"
              >{{ item.name }}</span>
            </div>
            <input
              :id="`friendsCheckbox${i}`"
              type="checkbox"
              class="friends__checkbox_custom"
            >
            <label
              :for="`friendsCheckbox${i}`"
            />
          </div>
        </div>
      </div>
      <div class="ctm-modal__content-btns">
        <div class="btn-group">
          <base-btn
            class="btn"
            @click="hide()"
          >
            {{ $t('meta.cancel') }}
          </base-btn>
          <base-btn
            class="btn_bl"
            @click="showChat()"
          >
            {{ $t('meta.next') }}
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
  name: 'ModalApplyForAPension',
  data() {
    return {
      chatName: '',
      userFriends: {
        1: {
          img: '~assets/img/temp/profile.svg',
          name: 'Test Testovich',
        },
        2: {
          img: '~assets/img/temp/profile.svg',
          name: 'Alex Danila',
        },
        3: {
          img: '~assets/img/temp/profile.svg',
          name: 'Lice Batman',
        },
        4: {
          img: '~assets/img/temp/profile.svg',
          name: 'Barry Alen',
        },
        5: {
          img: '~assets/img/temp/profile.svg',
          name: 'Pieter Spider',
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    showChat() {
      this.$router.push('/messages/1');
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
      &__contact {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        &_border {
          border-bottom-width: 1px;
          border-bottom-style: solid;
          border-bottom-color: #F7F8FA;
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
  }
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
