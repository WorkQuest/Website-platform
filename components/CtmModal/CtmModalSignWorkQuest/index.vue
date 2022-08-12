<template>
  <ctm-modal-box
    class="messageSend"
    :title="$tc('modals.titles.signWorkQuest')"
  >
    <ValidationObserver
      v-slot="{ handleSubmit }"
      class="auth__content"
      tag="div"
    >
      <div class="auth__description">
        {{ $t('signWorkQuest.description') }}
      </div>
      <form
        class="auth__fields"
        action=""
        @submit.prevent="handleSubmit(submit)"
      >
        <base-field
          v-model="model.email"
          class="auth__input"
          rules="required|email"
          :name="$t('signUp.email')"
          :placeholder="$t('signUp.email')"
          mode="icon"
          autocomplete="username"
          data-selector="EMAIL"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/email.svg"
              alt=""
            >
          </template>
        </base-field>
        <base-field
          v-model="model.password"
          class="auth__input"
          :placeholder="$t('signUp.password')"
          mode="icon"
          :name="$t('signUp.password')"
          autocomplete="current-password"
          rules="required_if|min:8"
          type="password"
          vid="confirmation"
          data-selector="PASSWORD"
        >
          <template v-slot:left>
            <img
              src="~assets/img/icons/password.svg"
              alt=""
            >
          </template>
        </base-field>
        <div class="auth__tools">
          <base-checkbox
            v-model="isRememberMeSelected"
            name="rememberMe"
            :label="$t('signIn.remember')"
          />
          <div
            class="auth__text auth__text_link"
            data-selector="ACTION-BTN-FORGOT-PASSWORD"
            @click="showRestoreModal"
          >
            {{ $t('meta.btns.forgot') }}
          </div>
        </div>
        <div class="auth__action">
          <base-btn
            :disabled="inProgress"
            selector="LOGIN"
          >
            {{ $t('meta.login') }}
          </base-btn>
        </div>
      </form>
    </ValidationObserver>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalSignWorkQuest',
  data() {
    return {
      model: { email: '', password: '' },
      isRememberMeSelected: false,
      inProgress: false,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    async submit() {
      const { submitMethod } = this.options;
      this.inProgress = true;
      await submitMethod(this.model, this.isRememberMeSelected);
      this.inProgress = false;
    },
    showRestoreModal() {
      this.ShowModal({ key: modals.restore });
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  font-size: 25px;
  color: $blue;
  align-items: center;

  &-Lock:before {
    @extend .icon;
    content: "\ea24";
  }

  &-user::before {
    @extend .icon;
    content: "\e90c";
  }
}

.error-msg {
  color: red;
}

.auth {
  @include modalKit;
  max-width: 450px !important;
  height: fit-content !important;

  &__content-field {
    margin: 15px 0 0 0;
  }

  &__content-btns {
    display: grid;
    grid-gap: 20px;
    gap: 20px;
    margin-top: 25px;
  }

  &__content {
    padding: 25px !important;
  }

  &__action {
    margin-top: 20px;
  }

  &__description {
    padding-top: 15px;
    padding-bottom: 10px;
  }
  &__tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    line-height: 130%;

    &_link {
      padding-left: 5px;
      font-weight: 300;
      font-size: 16px;
      color: #0083C7;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
