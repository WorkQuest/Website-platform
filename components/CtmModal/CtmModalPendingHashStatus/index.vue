<template>
  <ctm-modal-box
    class="status"
    :is-header="false"
  >
    <div class="status__content">
      <img
        v-if="img"
        :src="img"
        alt="Status"
        class="content__picture"
        width="90"
        height="90"
      >
      <div class="status__title">
        {{ $t('modals.transactionSent') }}
      </div>
      <a
        v-if="options.firstTxLink"
        :href="options.firstTxLink"
        target="_blank"
      >
        {{ $t('modals.transactionCheck') }}
      </a>

      <div
        v-if="!hashLink"
        class="status__loader loader"
      >
        <span class="loader__text">
          {{ $t('modals.txIsPending') }}
        </span>
        <span class="loader__wrapper">
          <loader
            is-mini-loader
            class="loader__points"
          />
        </span>
      </div>
      <a
        v-if="hashLink"
        :href="hashLink"
        target="_blank"
      >
        {{ $t('modals.transactionCheck') }}
      </a>

      <base-btn
        class="status__btn"
        :mode="options.submitMode"
        selector="SUBMIT"
        :disabled="isLoading"
        @click="handleSubmit()"
      >
        <span v-if="options.button">
          {{ options.button }}
        </span>
        <span v-else>
          {{ $t('meta.btns.close') }}
        </span>
      </base-btn>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import { images } from '~/utils/images';

export default {
  name: 'ModalStatus',
  images,
  data() {
    return {
      img: images.TRANSACTION_SEND,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isLoading: 'main/getIsLoading',
      hashLink: 'wallet/getPendingHashLink',
    }),
  },
  methods: {
    hide() {
      if (this.options.path) this.$router.push(this.options.path);
      this.$store.commit('wallet/setPendingHashLink', null);
      this.CloseModal();
    },
    async handleSubmit() {
      const { submitMethod, callback, isNotClose } = this.options;
      if (this.isLoading) return;
      this.SetLoader(true);
      if (submitMethod) await submitMethod();
      if (callback) await callback();
      if (!isNotClose) this.hide();
      this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>

.button {
  &_to-chat {
    width: 100%;
  }
}

.status {
  max-width: 337px !important;
  height: auto !important;
  padding: 0 !important;

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 20px;
    padding: 30px !important;
  }

  &__title {
    text-align: center;
    margin-top: 10px;
    font-weight: 500;
    font-size: 23px;
    line-height: 130%;
  }

  &__action {
    margin-top: 10px;
  }

  &__desc {
    font-size: 16px;
    line-height: 130%;
    text-align: center;
    color: $black600;
  }

  &__btn {
    width: 100%;
    padding: 0 10px;
  }

  &__img {
    display: inline;
    width: 33px;
    height: 33px;
    border-radius: 50%;
  }
}
.loader {
  &__wrapper {
    margin-top: 4px;
    margin-bottom: 20px;
    position: relative;
  }

  &__points {
    position: absolute !important;
    background: none !important;
    left: 12px !important;;
    top: -12px !important;
  }
}
</style>
