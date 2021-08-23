<template>
  <ctm-modal-box
    class="password"
    :title="$t('settings.changePass')"
  >
    <div class="password__content content">
      <div class="content__error">
        {{ errorMsg ? $t('errors.incorrectPass') : null }}
      </div>
      <div class="content__field field">
        <base-field
          v-model="currentPasswordInput"
          :is-hide-error="true"
          :placeholder="'******'"
          :label="$t('modals.currentPassword')"
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
            v-slot:right-absolute
            class="field__block"
          >
            <base-btn
              mode="max"
              class="field__button"
              :disabled="currentPasswordInput===''"
              @click="isVisibleCurrent=!isVisibleCurrent"
            >
              <span
                class="field__picture"
                :class="{'icon-show': isVisibleCurrent, 'icon-hide': !isVisibleCurrent }"
              />
            </base-btn>
          </template>
        </base-field>
      </div>
      <base-field
        v-model="newPasswordInput"
        :is-hide-error="true"
        :placeholder="'******'"
        :label="$t('modals.newPassword')"
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
          v-slot:right-absolute
          class="field__block"
        >
          <base-btn
            mode="max"
            class="field__button"
            :disabled="newPasswordInput===''"
            @click="isVisible=!isVisible"
          >
            <span
              class="field__picture"
              :class="{'icon-show': isVisible, 'icon-hide': !isVisible }"
            />
          </base-btn>
        </template>
      </base-field>
      <base-field
        v-model="confirmNewPasswordInput"
        :is-hide-error="true"
        :placeholder="'******'"
        :label="$t('modals.confirmNewPassword')"
        mode="icon"
        :type="isVisibleConfirm ? 'text': 'password'"
      >
        <template v-slot:left>
          <span class="icon-Lock" />
        </template>
        <template
          v-slot:right-absolute
          class="field__block"
        >
          <base-btn
            mode="max"
            class="field__button"
            :disabled="confirmNewPasswordInput===''"
            @click="isVisibleConfirm=!isVisibleConfirm"
          >
            <span
              class="field__picture"
              :class="{'icon-show': isVisibleConfirm, 'icon-hide': !isVisibleConfirm }"
            />
          </base-btn>
        </template>
      </base-field>
      <div class="content__buttons buttons">
        <div class="buttons__group">
          <base-btn
            class="buttons__button"
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
.password {
  max-width: 382px !important;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px;
    padding: 0 28px 30px 28px;
  }
}
.content{
  &__error{
    color:red;
  }
}
.icon {
  &-Lock:before {
    content: "\ea24";
    color: $blue;
    font-size: 25px;
  }
}

.buttons {
    &__group{
      display: grid;
      grid-gap: 20px;
      gap: 20px;
      margin-top: 25px;
    }
}
.field{
  &__button{
    background-color: transparent!important;
  }
}

</style>
