<template>
  <ctm-modal-box
    class="messageSend"
    :title="$t('securityCheck.title')"
  >
    <div class="ctm-modal__content">
      <div class="error-msg">
        {{ errorMsg ? $t('errors.incorrectPass') : null }}
      </div>
      <div class="ctm-modal__content-field">
        <base-field
          v-model="securityCode"
          :is-hide-error="true"
          :placeholder="$t('securityCheck.placeholder')"
          :label="$t('securityCheck.confCode')"
          mode="icon"
        />
        <div class="ctm-modal__content-inputDesc">
          {{ $t('securityCheck.confCodeDesc') }}
        </div>
      </div>
      <div class="ctm-modal__content-btns">
        <div class="btn-group">
          <base-btn
            @click="hide()"
          >
            {{ $t('meta.send') }}
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ModalOpenADeposit',
  data() {
    return {
      securityCode: '',
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
      // const payload = {
      //   userName: this.userName_input,
      //   userPassword: this.userPassword_input,
      // };
      // try {
      //   const response = await this.$store.dispatch('user/editUserPassword', payload);
      //   if (response?.ok) {
      //     this.ShowModal({
      //       key: modals.changePassword,
      //     });
      //   }
      // } catch (e) {
      //   this.errorMsg = e;
      //   console.log(e);
      // }
      this.CloseModal();
    },
  },
};
</script>

<style lang="scss" scoped>
.error-msg {
  color:red;
}
.ctm-modal {
  @include modalKit;
  &__content-field {
    margin: 25px 0 0 0;
  }

  &__content-btns {
    .btn-group{
      display: grid;
      grid-gap: 20px;
      gap: 20px;
      margin-top: 25px;
    }
  }
  &__content-inputDesc {
    font-size: 14px;
    margin-top: 10px;
    color: #8D96A2;
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
