<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('settings.changePass')"
  >
    <div class="ctm-modal__content">
      <div class="ctm-modal__content-field">
        <label
          for="currentPassword_input"
          class="ctm-modal__label"
        >{{ $t("modals.currentPassword") }}</label>
        <base-field
          id="currentPassword_input"
          v-model="currentPassword_input"
          :is-hide-error="true"
          :placeholder="'******'"
          mode="icon"
        >
          <template v-slot:left>
            <span class="icon-Lock" />
          </template>
        </base-field>
      </div>
      <div class="ctm-modal__content-field">
        <label
          for="newPassword_input"
          class="ctm-modal__label"
        >{{ $t("modals.newPassword") }}</label>
        <base-field
          id="newPassword_input"
          v-model="newPassword_input"
          :is-hide-error="true"
          :placeholder="'******'"
          mode="icon"
        >
          <template v-slot:left>
            <span class="icon-Lock" />
          </template>
        </base-field>
      </div>
      <div class="ctm-modal__content-field">
        <label
          for="confirmNewPassword_input"
          class="ctm-modal__label"
        >{{ $t("modals.confirmNewPassword") }}</label>
        <base-field
          id="confirmNewPassword_input"
          v-model="confirmNewPassword_input"
          :is-hide-error="true"
          :placeholder="'******'"
          mode="icon"
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
      currentPassword_input: '',
      newPassword_input: '',
      confirmNewPassword_input: '',
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
