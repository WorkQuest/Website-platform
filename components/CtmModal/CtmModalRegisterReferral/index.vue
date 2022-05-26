<template>
  <ctm-modal-box
    class="registration-ref"
    :is-header="false"
  >
    <div class="registration-ref__content">
      <div class="registration-ref__title">
        {{ options.title }}
      </div>
      <div class="registration-ref__desc">
        <span v-if="options.subtitle">
          {{ options.subtitle }}
        </span>
      </div>
      <div
        v-if="options.text"
        class="registration-ref__text"
      >
        <span>
          {{ options.text }}
        </span>
      </div>
      <div
        v-if="options.itemList"
        class="registration-ref__list"
      >
        <div
          v-for="(item, index) in options.itemList"
          :key="index"
        >
          <img
            class="registration-ref__img"
            :src="item['referralUser.avatar.url'] ? item['referralUser.avatar.url'] : $options.images.EMPTY_AVATAR"
            alt=""
          >
          <span>
            {{ item.firstName }} {{ item.lastName }}
          </span>
        </div>
      </div>
      <div class="registration-ref__wrap">
        <div v-if="options.cancel">
          <base-btn
            class="registration-ref__btn"
            mode="outline"
            selector="CANCEL"
            @click="hide()"
          >
            <span class="registration-ref__text">
              {{ options.cancel }}
            </span>
          </base-btn>
        </div>
        <div>
          <base-btn
            class="registration-ref__btn"
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
  name: 'ModalRegisterReferral',
  images,
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isLoading: 'main/getIsLoading',
      userAddress: 'user/getUserWalletAddress',
    }),
  },
  methods: {
    hide() {
      if (this.options.path) this.$router.push(this.options.path);
      this.CloseModal();
    },
    async handleSubmit() {
      try {
        if (this.isLoading) return;
        this.SetLoader(true);
        if (this.options.callback) await this.options.callback();
        if (!this.options.isNotClose) this.hide();
        await this.$store.dispatch('referral/addReferrals', this.userAddress);
        await this.$store.dispatch('referral/setIsNeedRegistration', false);
      } catch (e) {
        console.error(e);
      } finally {
        this.SetLoader(false);
      }
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

.registration-ref {
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
