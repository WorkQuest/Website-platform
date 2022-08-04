<template>
  <ctm-modal-box
    class="messageSend"
    :title="$tc('modals.titles.signWorkQuest')"
  >
    <div class="ctm-modal__content sign">
      <div class="sign sign__description">
        {{ $t('signWorkQuest.description') }}
      </div>
      <div class="error-msg">
        {{ errorMsg ? $t('errors.incorrectPass') : null }}
      </div>
      <div class="ctm-modal__content-field">
        <base-field
          v-model="userName"
          data-selector="USER-NAME"
          :is-hide-error="true"
          :placeholder="$t('signWorkQuest.daoUsername')"
          mode="icon"
        >
          <template v-slot:left>
            <span class="icon-user" />
          </template>
        </base-field>
      </div>
      <div class="ctm-modal__content-field">
        <base-field
          v-model="userPassword"
          data-selector="USER-PASSWORD"
          :is-hide-error="true"
          :placeholder="$t('signWorkQuest.daoPass')"
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
            data-selector="SIGN-IN"
            @click="hide()"
          >
            {{ $t('meta.signIn') }}
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
  name: 'CtmModalSignWorkQuest',
  data() {
    return {
      userName: '',
      userPassword: '',
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
      // if (response?.ok) {
      //   this.ShowModal({
      //     key: modals.status,
      //     img: require('assets/img/ui/password_changed.svg'),
      //     title: this.$t('restore.modal'),
      //   });
      // }
      // } catch (e) {
      //   this.errorMsg = e;
      //   console.log(e);
      // }
      this.ShowModal({
        key: modals.securityCheck,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sign__description {
  padding-top: 15px;
  padding-bottom: 10px;
}
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
  max-width: 450px !important;
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
