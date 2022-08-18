<template>
  <ctm-modal-box
    class="password"
    :title="$tc('modals.titles.changePass')"
  >
    <div class="password__content content">
      <div class="content__error">
        {{ errorMsg ? $t('errors.incorrectPass') : null }}
      </div>
      <div class="content__field field">
        <base-field
          v-model="currentPasswordInput"
          :is-hide-error="true"
          placeholder="******"
          data-selector="CURRENT-PASSWORD"
          :label="$tc('modals.currentPassword')"
          mode="icon"
          :type="isVisibleCurrent ? 'text': 'password'"
          class="field__input"
        >
          <template
            v-slot:left
            class="field__template"
          >
            <span class="icon-Lock field__picture" />
          </template>
          <template
            v-if="currentPasswordInput"
            v-slot:right-absolute
            class="field__block"
          >
            <btn-password-visibility
              :data-selector="`IS-VISIBLE-CURRENT-PASS-${isVisibleCurrent}`"
              :is-password-visible="isVisibleCurrent"
              @toggleVisibility="isVisibleCurrent = $event"
            />
          </template>
        </base-field>
      </div>
      <base-field
        v-model="newPasswordInput"
        :is-hide-error="true"
        placeholder="******"
        data-selector="NEW-PASSWORD"
        :label="$tc('modals.newPassword')"
        mode="icon"
        :type="isVisible ? 'text': 'password'"
        class="field__input"
      >
        <template
          v-slot:left
          class="field__template"
        >
          <span class="icon-Lock field__picture" />
        </template>
        <template
          v-if="newPasswordInput"
          v-slot:right-absolute
          class="field__block"
        >
          <btn-password-visibility
            :data-selector="`IS-VISIBLE-PASS-${isVisible}`"
            :is-password-visible="isVisible"
            @toggleVisibility="isVisible = $event"
          />
        </template>
      </base-field>
      <base-field
        v-model="confirmNewPasswordInput"
        :is-hide-error="true"
        placeholder="******"
        data-selector="CONFIRM-NEW-PASSWORD"
        :label="$tc('modals.confirmNewPassword')"
        mode="icon"
        :type="isVisibleConfirm ? 'text': 'password'"
      >
        <template v-slot:left>
          <span class="icon-Lock field__picture" />
        </template>
        <template
          v-if="confirmNewPasswordInput"
          v-slot:right-absolute
          class="field__block"
        >
          <btn-password-visibility
            :data-selector="`IS-VISIBLE-PASS-${isVisibleConfirm}`"
            :is-password-visible="isVisibleConfirm"
            @toggleVisibility="isVisibleConfirm = $event"
          />
        </template>
      </base-field>
      <div class="content__buttons buttons">
        <div class="buttons__group">
          <base-btn
            class="buttons__button"
            data-selector="CHANGE"
            @click="hide()"
          >
            {{ $t('meta.btns.change') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { images } from '~/utils/images';

export default {
  name: 'ModalChangePassSetting',
  data() {
    return {
      isVisible: false,
      isVisibleCurrent: false,
      isVisibleConfirm: false,
      currentPasswordInput: '',
      newPasswordInput: '',
      confirmNewPasswordInput: '',
      errorMsg: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      email: 'user/getUserEmail',
    }),
  },
  methods: {
    async hide() {
      if (this.newPasswordInput.trim() !== this.confirmNewPasswordInput.trim() || this.newPasswordInput === '') {
        this.errorMsg = true;
        return;
      }
      this.SetLoader(true);
      try {
        const response = await this.$store.dispatch('user/editUserPassword', {
          oldPassword: this.currentPasswordInput.trim(),
          newPassword: this.newPasswordInput.trim(),
        });
        if (response?.ok) {
          await this.$store.dispatch('user/signIn', {
            params: {
              email: this.email,
              password: this.confirmNewPasswordInput,
            },
          });
          this.ShowModal({
            key: modals.status,
            img: images.PASSWORD_CHANGED,
            title: this.$t('restore.modal'),
          });
        }
      } catch (e) {
        this.errorMsg = e;
        console.log(e);
      }
      this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.password {
  max-width: 382px !important;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px;
    padding: 0 28px 30px 28px;
  }
}
.content {
  &__error {
    color:red;
  }
}

.buttons {
    &__group {
      display: grid;
      grid-gap: 20px;
      gap: 20px;
      margin-top: 25px;
    }
}
.field {
  &__button {
    background-color: transparent !important;
  }
  &__picture {
    color: $blue;
    font-size: 24px;
  }
}

</style>
