<template>
  <ctm-modal-box
    :title="'Confirm access'"
    :is-unclosable="true"
  >
    <ValidationObserver
      v-slot="{ handleSubmit, valid }"
      class="ctm-modal__content"
      tag="form"
      @submit.prevent=""
    >
      <div class="modal__text">
        You need to confirm your password to continue.
      </div>
      <base-field
        v-model="password"
        :placeholder="$t('signUp.password')"
        :name="$t('signUp.password')"
        class="modal__password"
        rules="required_if|min:8"
        type="password"
        vid="confirmation"
        autocomplete="current-password"
      />
      <base-btn :disabled="!valid || isLoading">
        Submit
      </base-btn>
    </ValidationObserver>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ConfirmPassword',
  data() {
    return {
      password: '',
      context: 'default',
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
    }),
  },
  methods: {
    submit() {
      this.SetLoader(true);
      setTimeout(() => this.SetLoader(false), 1000);
      this.context = 'auth';
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  &__text {
  }
  &__password {
    margin-top: 20px;
  }
}
</style>
