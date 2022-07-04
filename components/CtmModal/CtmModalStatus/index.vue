<template>
  <ctm-modal-box
    class="status"
    :is-header="false"
  >
    <div class="status__content">
      <img
        v-if="options.img"
        :src="options.img"
        alt="Status"
        class="content__picture"
        width="90"
        height="90"
      >
      <img
        v-if="options.type === 'installMetamask'"
        src="~/assets/img/ui/warning.svg"
        alt="Status"
        class="content__picture"
      >
      <div class="status__title">
        {{ options.title }}
      </div>
      <div class="status__desc">
        <span v-if="options.subtitle">
          {{ options.subtitle }}
        </span>
      </div>
      <div
        v-if="options.text"
        class="status__text"
      >
        <span>
          {{ options.text }}
        </span>
      </div>
      <div
        v-if="options.itemList"
        class="status__list"
      >
        <div
          v-for="(item, index) in options.itemList"
          :key="index"
        >
          <img
            class="status__img"
            :src="item['referralUser.avatar.url'] ? item['referralUser.avatar.url'] : $options.images.EMPTY_AVATAR"
            alt=""
          >
          <span>
            {{ UserName(item.firstName, item.lastName) }}
          </span>
        </div>
      </div>
      <a
        v-if="options.link"
        :href="options.link"
        target="_blank"
      >
        {{ $t('modals.transactionCheck') }}
      </a>
      <div class="status__wrap">
        <div v-if="options.cancel">
          <base-btn
            class="status__btn"
            mode="outline"
            selector="CANCEL"
            @click="hide()"
          >
            <span class="status__text">
              {{ options.cancel }}
            </span>
          </base-btn>
        </div>
        <div>
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
              {{ $t('meta.btns.ok') }}
            </span>
          </base-btn>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import { images } from '~/utils/images';

export default {
  name: 'ModalStatus',
  images,
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isLoading: 'main/getIsLoading',
    }),
  },
  methods: {
    hide() {
      if (this.options.path) this.$router.push(this.options.path);
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

  &__text {
    font-size: 16px;
    line-height: 130%;
    text-align: center;
    font-weight: 500;
    color: $black800;
  }

  &__wrap {
    display: flex;
    gap: 10px;
    width: 100%;

    div {
      width: 100%;
    }
  }

  &__btn {
    padding: 0 10px;
  }

  &__list {
    width: 100%;

    span {
      font-size: 14px;
    }
  }

  &__img {
    display: inline;
    width: 33px;
    height: 33px;
    border-radius: 50%;
  }
}
</style>
