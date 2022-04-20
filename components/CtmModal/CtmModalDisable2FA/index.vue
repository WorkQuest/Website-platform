<template>
  <ctm-modal-box
    class="messageSend"
    :title="$tc('modals.titles.2FA.disable')"
  >
    <div class="ctm-modal__content">
      <validation-observer
        v-slot="{ handleSubmit, validated, passed, invalid }"
        ref="twoFA"
      >
        <div class="step__container">
          <div class="ctm-modal__content-field">
            <base-field
              id="twoFACode"
              ref="totp"
              v-model="twoFACode"
              data-selector="GOOGLE-CONF-CODE"
              vid="totp"
              :placeholder="errorMessage || $t('meta.googleConfCodeDesc')"
              rules="required|min:6|numeric"
              name="disable 2FA"
              :is-hide-error="false"
            />
          </div>
        </div>
        <div class="btn__container">
          <div class="btn__wrapper">
            <span class="step__container">
              <base-btn
                class="message__action"
                :disabled="!validated || !passed || invalid"
                data-selector="DISABLE-2FA"
                @click="handleSubmit(disable2FA)"
              >
                {{ $t('meta.btns.disable') }}
              </base-btn>
            </span>
          </div>
          <div class="btn__wrapper">
            <base-btn
              mode="outline"
              class="message__action"
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

export default {
  name: 'ModalDeposit',
  data() {
    return {
      twoFACode: '',
      errorMessage: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userData: 'user/getUserData',
    }),
  },
  methods: {
    async disable2FA() {
      const response = await this.$store.dispatch('user/disable2FA', { totp: this.twoFACode });
      if (response.ok) {
        this.CloseModal();
        this.showModalSuccess();
      } else this.validationErrorFields(response.data);
    },
    showModalSuccess() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.$t('modals.2FA.status'),
        subtitle: this.$t('modals.2FA.disabled'),
      });
    },
    validationErrorFields(data) {
      data.forEach(async (obj) => {
        const { field } = obj;
        const { name } = this.$refs.totp.name;
        const err = { [field]: [this.$t('messages.excluded', { _field_: name })] };
        await this.$refs.twoFA.setErrors(err);
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.flex {
  &__two-cols {
    display: flex;
    justify-content: space-between;
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
