<template>
  <div class="confirm">
    <div class="confirm__title">
      Confirm access
    </div>
    <div class="confirm__text">
      You need to confirm your password to continue.
    </div>
    <ValidationObserver
      v-slot="{ handleSubmit, valid }"
      tag="form"
      @submit.prevent="submit"
    >
      <base-field
        v-model="password"
        :placeholder="$t('signUp.password')"
        :name="$t('signUp.password')"
        class="confirm__password"
        rules="required_if|min:8"
        type="password"
        vid="confirmation"
        autocomplete="current-password"
      />
      <base-btn :disabled="!valid || isLoading">
        Submit
      </base-btn>
    </ValidationObserver>
  </div>
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
    async submit() {
      // TODO: check password from api
      this.$nuxt.setLayout('default');
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm {
  border: 1px solid $blue;
  width: 400px;
  padding: 20px;
  margin: 40px auto;
  border-radius: 16px;

  &__title {
    font-size: 28px;
    text-align: center;
  }
  &__text {
    font-size: 18px;
  }
  &__password {
    margin-top: 20px;
  }
}
</style>
