<template>
  <ValidationObserver
    v-slot="{ handleSubmit }"
    class="restore"
    tag="div"
  >
    <div class="restore__container">
      <div class="restore__text restore__text_title">
        <span>{{ $t('restore.title') }}</span>
      </div>
      <form
        class="restore__fields"
        action=""
        @submit.prevent="handleSubmit(resetPassword)"
      >
        <base-field
          v-model="password"
          :placeholder="$t('signUp.password')"
          mode="icon"
          data-selector="PASSWORD"
          :name="$tc('signUp.password')"
          autocomplete="current-password"
          rules="required_if|min:8"
          :type="isPasswordVisible?'text':'password'"
          vid="confirmation"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/password.svg"
              alt=""
            >
          </template>
          <template
            v-if="password"
            v-slot:right-absolute
            class="field__block"
          >
            <btn-password-visibility
              :data-selector="`IS-VISIBLE-PASS-${isPasswordVisible}`"
              :is-password-visible="isPasswordVisible"
              @toggleVisibility="isPasswordVisible = $event"
            />
          </template>
        </base-field>
        <base-field
          v-model="passwordConfirm"
          :placeholder="$t('signUp.confirmPassword')"
          mode="icon"
          data-selector="CONFIRM-PASSWORD"
          :type="isPasswordConfirmVisible?'text':'password'"
          :name="$tc('signUp.confirmPassword')"
          rules="required_if|min:8|confirmed:confirmation"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/password.svg"
              alt=""
            >
          </template>
          <template
            v-if="passwordConfirm"
            v-slot:right-absolute
            class="field__block"
          >
            <btn-password-visibility
              :data-selector="`IS-VISIBLE-PASS-${isPasswordConfirmVisible}`"
              :is-password-visible="isPasswordConfirmVisible"
              @toggleVisibility="isPasswordConfirmVisible = $event"
            />
          </template>
        </base-field>
        <div class="restore__action">
          <base-btn data-selector="SAVE">
            {{ $t('meta.btns.save') }}
          </base-btn>
        </div>
      </form>
    </div>
  </ValidationObserver>
</template>

<script>
import modals from '~/store/modals/modals';
import { Layout, Path } from '~/utils/enums';

export default {
  name: 'Restore',
  layout: Layout.AUTH,
  data() {
    return {
      password: '',
      passwordConfirm: '',
      isPasswordVisible: false,
      isPasswordConfirmVisible: false,
    };
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    async resetPassword() {
      const payload = {
        newPassword: this.password,
        token: this.$route.query.token,
      };
      try {
        const response = await this.$store.dispatch('user/passwordChange', payload);
        if (response?.ok) {
          this.showChangeModal();
          await this.$router.push(Path.SIGN_IN);
        }
      } catch (e) {
        console.log(e);
      }
    },
    showChangeModal() {
      this.ShowModal({
        key: modals.status,
        img: require('assets/img/ui/password_changed.svg'),
        title: this.$t('restore.modal'),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.restore {
  &__container {
    display: grid;
    grid-template-rows: auto;
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    line-height: 130%;
    &_title {
      font-weight: 600;
      font-size: 34px;
      color: $black800;
    }
    &_simple {
      color: #000000;
      font-weight: 300;
      font-size: 16px;
      padding-top: 15px;
    }
    &_link {
      padding-left: 5px;
      font-weight: 300;
      font-size: 16px;
      color: #0083C7;
      text-decoration: underline;
    }
  }
  &__fields {
    padding-top: 40px;
    display: grid;
    grid-template-columns: 1fr;
  }
  &__action {
    padding-top: 30px;
  }
}
</style>
