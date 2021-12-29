<template>
  <div class="page">
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
      toDecrypt: null,
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      userAddress: 'wallet/userAddress',
      callbackLayout: 'wallet/callbackLayout',
    }),
  },
  mounted() {
    // Try to find mnemonic in storage by user wallet address
    // Checking session storage
    const session = JSON.parse(sessionStorage.getItem('mnemonic'));
    if (!session) {
      this.disconnect();
      return;
    }
    let mnemonic = session[this.userAddress];
    if (mnemonic) {
      this.toDecrypt = mnemonic;
      return;
    }
    // Checking local storage
    const storage = JSON.parse(localStorage.getItem('mnemonic'));
    if (!storage) {
      this.disconnect();
      return;
    }
    mnemonic = storage[this.userAddress];
    if (!mnemonic) {
      this.disconnect();
      return;
    }
    this.toDecrypt = mnemonic;
  },
  methods: {
    async submit() {
      // TODO: check password from api, then =>
      const res = await this.$store.dispatch('wallet/connectWallet', this.password);
      if (res?.ok) this.$nuxt.setLayout(this.callbackLayout);
    },
    disconnect() {
      this.$store.dispatch('main/showToast', {
        title: 'Secret phrase not found',
        text: 'Please login with secret phrase',
      });
      this.$store.dispatch('user/logout');
      this.$store.dispatch('wallet/disconnect');
      this.$nuxt.setLayout('auth');
      this.$router.push('sign-in');
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  background: $black0 !important;
  height: 100vh !important;
  width: 100vw !important;
  padding: 40px
}
.confirm {
  border: 1px solid $blue;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.15);
  background: white;
  width: 400px;
  padding: 20px;
  margin: 0 auto;
  border-radius: 16px;
  &__title {
    font-size: 28px;
    text-align: center;
  }
  &__text {
    margin-top: 20px;
    font-size: 18px;
  }
  &__password {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>
