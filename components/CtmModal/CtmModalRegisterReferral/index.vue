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
          class="registration-ref__item"
        >
          <div
            class="registration-ref__avatar"
            @click="redirectToProfile(item.id)"
          >
            <img
              class="registration-ref__img"
              :src="item['referralUser.avatar.url'] ? item['referralUser.avatar.url'] : $options.images.EMPTY_AVATAR"
              alt=""
            >
            <span :class="{'registration-ref__name': options.status}">
              {{ item.firstName }} {{ item.lastName }}
            </span>
          </div>
          <div
            v-if="options.status"
            :class="`registration-ref__item--${item.referralUser.referralStatus}`"
          >
            {{ $t(`referral.referralStatus.${item.referralUser.referralStatus}`) }}
          </div>
        </div>
      </div>
      <div class="registration-ref__wrap">
        <div v-if="options.cancel">
          <base-btn
            class="registration-ref__btn"
            mode="outline"
            selector="CANCEL"
            @click="CloseModal"
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
import { Path } from '~/utils/enums';

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
    async handleSubmit() {
      if (this.options?.submit) this.options.submit();
    },
    redirectToProfile(id) {
      this.CloseModal();
      this.$router.push(`${Path.PROFILE}/${id}`);
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
  &__list{
    width: 100%;
    max-height:500px;
    overflow: auto;
  }
  &__item {
    display: grid;
    grid-template-columns: 1fr auto;
    &--created {
      color: $red;
    }
    &--registered {
      color: $yellow100;
    }
    &--paid {
      color: $green;
    }

    span {
      font-size: 14px;
    }
  }

  &__avatar{
    display: flex;
    width:fit-content;
    gap: 10px;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    &:hover{
      text-decoration: underline;
    }
  }
  &__name{
    max-width:130px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  &__img {
    display: inline;
    width: 33px;
    height: 33px;
    border-radius: 50%;
  }
}
</style>
