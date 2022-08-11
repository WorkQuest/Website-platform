<template>
  <ctm-modal-box
    class="restore"
    :title="$tc('modals.titles.forgotPass')"
  >
    <div class="restore__content content">
      <validation-observer v-slot="{handleSubmit, validated, passed, invalid}">
        <div class="content__field">
          {{ $t('forgot.desc') }}
        </div>
        <base-field
          v-model="emailInput"
          :name="$tc('meta.placeholders.email')"
          data-selector="EMAIL"
          :placeholder="$t('meta.placeholders.email')"
          rules="required|email"
          class="content__input"
          @enter="handleSubmit(restore)"
        />
        <base-btn
          class="content__action"
          :disabled="!validated || !passed || invalid"
          data-selector="SEND"
          @click="handleSubmit(restore)"
        >
          {{ $t('meta.btns.send') }}
        </base-btn>
      </validation-observer>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { Path } from '~/utils/enums';

export default {
  name: 'ModalRestore',
  data() {
    return {
      emailInput: '',
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    async restore() {
      const { ok, msg } = await this.$store.dispatch('user/passwordSendCode', {
        email: this.emailInput,
      });
      if (ok) {
        this.ShowModal({
          key: modals.status,
          path: Path.SIGN_IN,
          img: require('~/assets/img/ui/email.svg'),
          title: this.$t('modals.titles.emailConfirmTitle'),
          subtitle: this.$t('registration.emailConfirm'),
        });
      } else {
        await this.$store.dispatch('main/showToast', {
          title: this.$t('toasts.error'),
          variant: 'warning',
          text: msg,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.restore {
  max-width: 382px !important;

  &__content {
    padding: 25px 28px 30px 28px !important;
  }
}
.content{
  &__field{
    font-size: 16px;
    line-height: 130%;
    color: $black600;
    margin-bottom: 20px;
  }
  &__action{
    margin-top: 3px;
  }
}
</style>
