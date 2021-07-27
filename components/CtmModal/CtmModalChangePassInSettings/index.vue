<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('settings.changePass')"
  >
    <div class="ctm-modal__content">
      <div class="error-msg">
        {{ errorMsg ? $t('errors.incorrectPass') : null }}
      </div>
      <div class="ctm-modal__content-field">
        <base-field
          v-model="currentPasswordInput"
          :is-hide-error="true"
          :placeholder="'******'"
          :label="$t('modals.currentPassword')"
          mode="icon"
          type="password"
        >
          <template v-slot:left>
            <span class="icon-Lock" />
          </template>
        </base-field>
      </div>
      <div class="ctm-modal__content-field">
        <base-field
          v-model="newPasswordInput"
          :is-hide-error="true"
          :placeholder="'******'"
          :label="$t('modals.newPassword')"
          mode="icon"
          type="password"
        >
          <template v-slot:left>
            <span class="icon-Lock" />
          </template>
        </base-field>
      </div>
      <div class="ctm-modal__content-field">
        <base-field
          v-model="confirmNewPasswordInput"
          :is-hide-error="true"
          :placeholder="'******'"
          :label="$t('modals.confirmNewPassword')"
          mode="icon"
          type="password"
        >
          <template v-slot:left>
            <span class="icon-Lock" />
          </template>
        </base-field>
      </div>
      <div class="ctm-modal__content-btns">
        <div class="btn-group">
          <base-btn
            @click="hide()"
          >
            {{ $t('modals.change') }}
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
  name: 'ModalOpenADeposit',
  data() {
    return {
      currentPasswordInput: '',
      newPasswordInput: '',
      confirmNewPasswordInput: '',
      errorMsg: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    async hide() {
      const payload = {
        oldPassword: this.currentPasswordInput,
        newPassword: this.confirmNewPasswordInput,
      };
      try {
        const response = await this.$store.dispatch('user/editUserPassword', payload);
        if (response?.ok) {
          this.ShowModal({
            key: modals.changePassword,
          });
        }
      } catch (e) {
        this.errorMsg = e;
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.icon {
  &-Lock:before {
    content: "\ea24";
    color: $blue;
    font-size: 25px;
  }
}
.error-msg {
  color:red;
}
.ctm-modal {
  @include modalKit;
  &__content-field {
    margin: 15px 0 0 0;
  }

  &__content-btns {
    .btn-group{
      display: grid;
      grid-gap: 20px;
      gap: 20px;
      margin-top: 25px;
    }
  }

  &__label {
    margin-bottom: 5px;
  }

  &__content {
    padding-top: 0 !important;
  }
}

.messageSend {
  max-width: 382px !important;
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
