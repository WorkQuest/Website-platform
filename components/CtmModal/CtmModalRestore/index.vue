<template>
  <ctm-modal-box
    class="restore"
    :title="$t('forgot.title')"
  >
    <div class="restore__content content">
      <ValidationObserver
        v-slot="{ handleSubmit }"
        class="content__observer"
        tag="div"
      >
        <form
          class="restore__body"
          action=""
          @submit.prevent="handleSubmit(restore)"
        >
          <div class="content__field">
            {{ $t('forgot.desc') }}
          </div>
          <base-field
            v-model="emailInput"
            :name="$t('placeholders.email')"
            :placeholder="$t('placeholders.default')"
            rules="required|email"
            class="content__input"
          />
          <base-btn
            class="content__action"
          >
            {{ $t('meta.send') }}
          </base-btn>
        </form>
      </ValidationObserver>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

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
    hide() {
      this.CloseModal();
    },
    async restore() {
      const payload = {
        email: this.emailInput,
      };
      try {
        const response = await this.$store.dispatch('user/passwordSendCode', payload);
        if (response?.ok) {
          this.ShowModal({
            key: modals.emailConfirm,
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
