<template>
  <ctm-modal-box
    class="support"
    :title="$tc('modals.titles.support')"
  >
    <validation-observer
      v-slot="{ handleSubmit }"
      class="ctm-modal__content"
      tag="div"
    >
      <base-field
        v-model="email"
        :label="$t('modals.email')"
        data-selector="SUPPORT-MODAL-EMAIL"
        rules="email|required|max:50"
        :name="$t('meta.email')"
      />
      <base-field
        v-model="title"
        :label="$t('modals.title')"
        data-selector="SUPPORT-MODAL-TITLE"
        rules="required|max:50"
        :name="$t('meta.title')"
      />
      <base-textarea
        v-model="description"
        :label="$t('modals.description')"
        :name="$t('meta.description')"
        rules="required|max:1000"
      />
      <div class="support__buttons">
        <base-btn
          data-selector="SUPPORT-MODAL-CLOSE"
          type="button"
          @click="CloseModal"
        >
          {{ $t('meta.btns.cancel') }}
        </base-btn>
        <base-btn
          data-selector="SUPPORT-MODAL-SUBMIT"
          @click="handleSubmit(submit)"
        >
          {{ $t('meta.btns.submit') }}
        </base-btn>
      </div>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'SupportModal',
  data() {
    return {
      email: '',
      title: '',
      description: '',
    };
  },
  methods: {
    ...mapActions({
      sendSupportMessage: 'support/sendSupportMessage',
    }),
    async submit() {
      this.SetLoader(true);
      const payload = {
        email: this.email,
        title: this.title,
        description: this.description,
      };
      const r = await this.sendSupportMessage(payload);
      if (r && r.ok) {
        this.$store.dispatch('main/showToast', {
          title: this.$t('toasts.sent'),
          variant: 'success',
          text: this.$t('toasts.sendToSupport'),
        });
      }
      this.CloseModal();
      this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}
.support {
  &__buttons {
    display: flex;
    gap: 30px;
  }
}
</style>
