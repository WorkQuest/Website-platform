<template>
  <ctm-modal-box :title="$tc('modals.titles.forgotPass')">
    <ValidationObserver
      v-slot="{ handleSubmit }"
      class="ctm-modal__content content"
      tag="div"
    >
      <form
        class="content__form"
        action=""
        @submit.prevent="handleSubmit(restore)"
      >
        <div class="content__desc">
          {{ $t('forgot.desc') }}
        </div>
        <base-field
          v-model="emailInput"
          class="content__field"
          data-selector="EMAIL"
          rules="required|email"
          :name="$tc('meta.placeholders.email').toLowerCase()"
          :placeholder="$t('meta.placeholders.email').toLowerCase()"
        />
        <base-btn class="content__action">
          {{ $t('meta.btns.send') }}
        </base-btn>
      </form>
    </ValidationObserver>
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
        this.ShowToast({
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
.ctm-modal {
  @include modalKit;
  &__box {
    max-width: 382px !important;
  }
}

.content {
  &__form {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px;
  }
}
</style>
