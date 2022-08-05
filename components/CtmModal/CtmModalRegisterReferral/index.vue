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
        v-if="items"
        class="registration-ref__list"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="registration-ref__item"
        >
          <div
            class="registration-ref__avatar"
            @click="redirectToProfile(item.id)"
          >
            <img
              class="registration-ref__img"
              :src="item.avatar && item.avatar.url ? item.avatar.url : $options.images.EMPTY_AVATAR"
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
        <base-btn
          v-if="isShowLoadMore"
          class="registration-ref__more"
          :disabled="isFetching"
          mode="outline"
          @click="loadMoreReferrals"
        >
          {{ $t('chat.loadMore') }}
        </base-btn>
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
import { REFERRAL_FETCH_LIMIT, REFERRAL_STATUS } from '~/utils/сonstants/referral';

export default {
  name: 'ModalRegisterReferral',
  images,
  data() {
    return {
      isFetching: false,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      isLoading: 'main/getIsLoading',
      userAddress: 'user/getUserWalletAddress',

      referralsList: 'referral/getReferralsList',
      referralsCount: 'referral/getReferralsListCount',

      unregisteredList: 'referral/getUnregisteredReferralsList',
      unregisteredCount: 'referral/getUnregisteredReferralsCount',
    }),
    isNeedToFetchUnregistered() {
      return !this.options.status;
    },
    isShowLoadMore() {
      if (this.isNeedToFetchUnregistered) return this.unregisteredList?.length < this.unregisteredCount;
      return this.referralsList?.length < this.referralsCount;
    },
    items() {
      if (this.isNeedToFetchUnregistered) return this.unregisteredList;
      return this.referralsList;
    },
  },
  methods: {
    async loadMoreReferrals() {
      if (this.isFetching) return;
      this.isFetching = true;

      if (this.isNeedToFetchUnregistered) {
        await this.$store.dispatch('referral/fetchReferralsToRegister', {
          params: {
            limit: REFERRAL_FETCH_LIMIT,
            offset: this.unregisteredList?.length,
            referralStatus: REFERRAL_STATUS.Created,
          },
          isLoadingMore: true,
        });
      } else {
        await this.$store.dispatch('referral/fetchReferralsList', {
          params: {
            limit: REFERRAL_FETCH_LIMIT,
            offset: this.referralsList?.length,
          },
          isLoadingMore: true,
        });
      }
      this.isFetching = false;
    },
    async handleSubmit() {
      if (this.options?.submit) this.options.submit();
      this.CloseModal();
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
  min-width: 337px !important;
  max-width: 400px !important;
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
    align-items: center;
    padding-bottom: 5px;
    margin-right: 5px;
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

  &__more {
    width: 50% !important;
    margin: 0 auto;
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
    border: 1px solid $black0;
    display: inline;
    width: 33px;
    height: 33px;
    object-fit: cover;
    border-radius: 50%;
  }
}
</style>
