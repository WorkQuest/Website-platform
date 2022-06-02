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
        data-selector="SUPPORT-EMAIL"
        rules="email|required|max:50"
        name="Email"
      />
      <base-field
        v-model="title"
        :label="$t('modals.title')"
        data-selector="SUPPORT-TITLE"
        rules="required|max:50"
        name="Title"
      />
      <base-textarea
        v-model="description"
        :label="$t('modals.description')"
        name="Description"
        rules="required|max:1000"
      />
      <div class="support__buttons">
        <base-btn
          data-selector="SUPPORT-CLOSE"
          type="button"
          @click="CloseModal"
        >
          {{ $t('meta.btns.cancel') }}
        </base-btn>
        <base-btn
          data-selector="SUPPORT-SUBMIT"
          @click="handleSubmit(submit)"
        >
          {{ $t('meta.btns.submit') }}
        </base-btn>
      </div>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>

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
    submit() {
      console.log('SOME ACTION');
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
