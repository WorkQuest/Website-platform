<template>
  <ctm-modal-box
    class="password"
    :title="$tc('modals.titles.changePass')"
  >
    <form
      class="password__content content"
      autocomplete="off"
      @submit.prevent="changePass"
    >
      <div class="content__error">
        {{ errorMsg || null }}
      </div>
      <base-field
        v-for="(field, i) in fields"
        :key="i"
        v-model="field.pass"
        mode="icon"
        is-hide-error
        placeholder="******"
        class="content__field"
        :data-selector="`PASSWORD-${i}`"
        :label="field.label"
        :type="field.isVisible ? 'text': 'password'"
      >
        <template v-slot:left>
          <span class="content__icon icon-Lock" />
        </template>
        <template
          v-if="field.pass"
          v-slot:right-absolute
          class="field__block"
        >
          <btn-password-visibility
            :is-password-visible="field.isVisible"
            @toggleVisibility="field.isVisible = $event"
          />
        </template>
      </base-field>
      <base-btn
        class="content__button"
        data-selector="CHANGE"
      >
        {{ $t('meta.btns.change') }}
      </base-btn>
    </form>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { images } from '~/utils/images';
import { decryptStringWithKey, encryptStringWithKey } from '~/utils/wallet';

export default {
  name: 'ModalChangePassSetting',
  data() {
    return {
      fields: {
        current: {
          pass: '',
          isVisible: false,
          label: this.$t('modals.currentPassword'),
        },
        new: {
          pass: '',
          isVisible: false,
          label: this.$t('modals.newPassword'),
        },
        confirmNew: {
          pass: '',
          isVisible: false,
          label: this.$t('modals.confirmNewPassword'),
        },
      },
      errorMsg: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      email: 'user/getUserEmail',
      userWalletAddress: 'user/getUserWalletAddress',
    }),
  },
  methods: {
    async changePass() {
      const currPass = this.fields.current.pass.trim();
      const newPass = this.fields.new.pass.trim();
      const confirmNew = this.fields.confirmNew.pass.trim();

      if (newPass !== confirmNew || newPass === '') {
        this.errorMsg = 'Error! Passwords do not match.';
        return;
      }

      if (currPass === newPass) {
        this.errorMsg = 'Error! The password cannot be the same as the previous one.';
        return;
      }

      if (newPass.length <= 7) {
        this.errorMsg = 'Error! New password should contain at least 8 characters.';
        return;
      }

      this.SetLoader(true);
      try {
        const response = await this.$store.dispatch('user/editUserPassword', {
          oldPassword: currPass,
          newPassword: newPass,
        });
        if (response?.ok) {
          // updating decrypted wal in storage
          const storageData = JSON.parse(localStorage.getItem('wal'));
          const key = this.userWalletAddress.toLowerCase();
          const m = decryptStringWithKey(storageData[key], currPass);
          if (m) {
            localStorage.setItem('wal', JSON.stringify({
              ...storageData,
              [key]: encryptStringWithKey(m, newPass),
            }));
          }

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
}

.content {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
  padding: 0 28px 30px 28px;

  &__error {
    color: $errorText;
  }

  &__icon {
    color: $blue;
    font-size: 24px;
  }
}

</style>
