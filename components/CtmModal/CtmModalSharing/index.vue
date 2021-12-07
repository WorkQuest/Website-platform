<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('sharing.title')"
  >
    <div class="ctm-modal__content">
      <span>{{ $t('sharing.socialText') }}</span>
      <div class="social__icons">
        <button class="social__btn social__btn_telegram">
          <img
            class="social__btn_telegram"
            alt=""
            src="~assets/img/icons/telegram.png"
          >
        </button>
        <button class="social__btn social__btn_twitter">
          <span class="icon-twitter" />
        </button>
        <button class="social__btn social__btn_facebook">
          <span class="icon-facebook" />
        </button>
        <button class="social__btn social__btn_LinkedIn">
          <span class="icon-LinkedIn" />
        </button>
      </div>
      <span class="content__text">{{ $t('sharing.share') }}</span>
      <div class="flex__two-cols">
        <div class="code__container">
          <span class="code__text">{{ code }}</span>
        </div>
        <div>
          <button
            v-clipboard:copy="code"
            v-clipboard:success="ClipboardSuccessHandler"
            v-clipboard:error="ClipboardErrorHandler"
            class="btn__copy"
            type="button"
          >
            <span class="icon-copy" />
          </button>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalOpenADeposit',
  data() {
    return {
      code: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  mounted() {
    this.getSharingLink();
  },
  methods: {
    hide() {
      this.CloseModal();
    },
    getSharingLink() {
      const baseUrl = process.env.BASE_URL.slice(0, -5);
      const { itemId } = this.options;
      this.code = baseUrl + /quests/ + itemId;
    },
    showDepositIsOpenedModal() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/transactionSend.svg'),
        title: this.$t('saving.depositIsOpened'),
        subTitle: '',
        path: '/savings/1',
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.ctm-modal {
  @include modalKit;
  &__content {
    margin: 25px 0 0 0;
  }

  &__content-btns {
    .btn-group{
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
  }
}

.social {
  &__icons {
    display: grid;
    grid-template-columns: repeat(5, 40px);
    grid-gap: 30px;
    margin-bottom: 25px;
  }
  &__btn {
    transition: .5s;
    width: 40px;
    height: 40px;
    background: #F7F8FA;
    margin-top: 10px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background: #0083C7;
    }
    &:hover {
      span:before {
        background: white;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      img {
        transition: 0.5s;
        filter: brightness(1000%) grayscale(100%);
      }
    }
    &_telegram {
      img {
        height: 14px;
        width: 16px;
      }
    }
    &_instagram {
      span:before {
        font-size: 18px;
        background: linear-gradient(180deg, #C540F3 0%, #FF8C05 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    &_twitter {
      span:before {
        font-size: 18px;
        color: #24CAFF;
      }
    }
    &_facebook {
      span:before {
        font-size: 18px;
        color: #3B67D7;
      }
    }
    &_LinkedIn {
      span:before {
        font-size: 18px;
        color: #0A7EEA;
      }
    }
    &_workQuest {
      img {
        width: 60%;
      }
    }
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

.flex {
  &__two-cols {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.content {
  &__text {
    @include text-simple;
    margin: 20px 0;
    font-weight: 400;
    color: $black700;
    font-size: 18px;
    &_grey {
      @extend .content__text;
      font-size: 16px;
      color: $black400;
    }
  }
}

.icon {
  &-copy:before {
    content: "\e996";
    color: $blue;
    font-size: 20px;
  }
}

.qr {
  &__container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
}

.code {
  &__container {
    display: flex;
    border: 1px solid $black0;
    border-radius: 6px;
    justify-content: space-between;
    padding: 12px;
    margin: 5px 10px 0 0;
    width: 100%;
  }
  &__text {
    font-weight: 400;
    font-size: 16px;
    color: $black800;
  }
}

.hide {
  display: none;
}

.grid {
  &__2col {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-content: space-between;
    align-items: flex-end;
    grid-gap: 10px;
  }
  &__3col {
    display: grid;
    grid-template-columns: 6fr 1fr 6fr;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.step {
  &__number {
    padding: 10px;
  }
  &__container {
    &_grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

.step-panel {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  &__step {
    @include text-simple;
    background: rgba(0, 131, 199, 0.1);
    border-radius: 6px;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    padding: 10px;
    &_active {
      @extend .step-panel__step;
      color: $white;
      background: $blue;
    }
  }
}
.line {
  display: block;
  height: 1px;
  border-top: 1px solid rgba(0, 131, 199, 0.1);
  margin: auto 0;
  padding: 0;
  width: 33px;
  &__active {
    @extend .line;
    border-top: 1px solid $blue;
  }
}
.ctm-modal {
  &__content-field {
    margin: 15px 0 0 0;
  }
  &__equal {
    margin: 0 0 35px 10px;
  }
}

.ctm-modal {
  @include modalKit;
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
.btn {
  &__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin: 15px 0 0 0;
  }
  &__wrapper {
    width: 45%;
  }
  &__onebtn {
    width: 100%;
  }
  &__copy {
    background: $white;
    border: 1px solid $black0;
    padding: 11px;
    border-radius: 6px;
  }
}

.messageSend {
  max-width: 430px !important;
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
