<template>
  <div class="info-grid">
    <div class="info-grid__left">
      <div class="info-grid__block block block_left">
        <div class="block__avatar avatar">
          <img
            class="avatar__img"
            :src="userData.avatar && userData.avatar.url ? userData.avatar.url : require('~/assets/img/app/avatar_empty.png')"
            :alt="userData.avatar && userData.avatar.url ? userData.avatar.url : 'avatar_empty'"
            loading="lazy"
          >
        </div>
        <div class="block__rating rating">
          <div
            v-for="(star,idx) in 5"
            :key="idx"
            class="rating__star"
            :class="initStarClass(star)"
          />
        </div>
        <div class="block__reviews">
          {{ `${userData.ratingStatistic ? userData.ratingStatistic.reviewCount : 0} ${$t('quests.reviews')}` }}
        </div>
      </div>
      <div class="info-grid__block block block_right">
        <div
          v-if="userData.firstName && userData.lastName"
          class="block__title"
        >
          {{ `${userData.firstName} ${userData.lastName}` }}
        </div>
        <div
          v-if="userData.role === 'employer' && userData.company"
          class="block__subtitle"
        >
          {{ userData.company }}
        </div>
        <div
          v-if="userData.additionalInfo.description"
          class="block__description"
        >
          {{ userData.additionalInfo.description }}
        </div>
        <div
          v-if="isShowEducations"
          class="block__knowledge knowledge"
        >
          <div class="knowledge__text">
            {{ $t('profile.educations') }}
          </div>
          <div
            v-if="userData.additionalInfo.educations"
            class="knowledge__container"
          >
            <div
              v-for="(item, i) in userData.additionalInfo.educations"
              :key="i"
              class="knowledge__item"
            >
              <span class="knowledge__place">{{ item.place }}</span>
              <span class="knowledge__term">{{ `${item.from} - ${item.to}` }}</span>
            </div>
          </div>
        </div>
        <div
          v-if="isShowWorkExp"
          class="block__work-exp work-exp"
        >
          <div class="work-exp__text">
            {{ $t('profile.prevWorkExp') }}
          </div>
          <div class="work-exp__container">
            <div
              v-for="(item, i) in userData.additionalInfo.workExperiences"
              :key="i"
              class="work-exp__item"
            >
              <span class="work-exp__place">{{ item.place }}</span>
              <span class="work-exp__term">{{ `${item.from} - ${item.to}` }}</span>
            </div>
          </div>
        </div>
        <div
          v-if="Object.keys(socialNetworks).length > 0"
          class="block__socials social"
        >
          <span
            v-for="(i, key) in socialNetworks"
            :key="key"
            class="social__container"
          >
            <a
              class="social__link"
              :href="`https://${key}.com/${i}`"
              target="_blank"
            >
              <span :class="`icon-${key}`" />
            </a>
          </span>
        </div>
        <div class="block__contacts contacts">
          <div class="contacts__contact contact">
            <div
              v-for="(data, key) in contactData"
              :key="key"
              class="contact__container"
            >
              <span :class="data.icon" />
              <a
                :href="data.href"
                target="_blank"
                class="contact__link"
              >{{ data.name }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="info-grid__right right">
      <div
        class="right__header"
      >
        <div
          v-if="userData.role === 'worker' && userInfo.wagePerHour"
          class="right__price"
        >
          <div class="price__text">
            {{ $t('settings.costPerHour') }}
          </div>
          <div class="price__value">
            {{ $tc('saving.wusdCount', userInfo.wagePerHour) }}
          </div>
        </div>
        <base-btn
          mode="share-btn"
          @click="shareModal()"
        />
      </div>
      <div class="right__footer">
        <div
          v-if="userRole === 'worker' && userId === mainUserData.id"
          class="contact__btn"
        >
          <base-btn
            @click="toRaisedViews()"
          >
            {{ $t('profile.raiseViews') }}
          </base-btn>
        </div>
        <div
          v-else-if="userRole === 'employer' && userData.role === 'worker'"
          class="contact__btn"
        >
          <base-btn
            :mode="'approve'"
            :disabled="mainUserData.questsStatistic ? mainUserData.questsStatistic.opened <= 0 : true"
            @click="sendInvait()"
          >
            {{ $t('workers.giveAQuest') }}
          </base-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'UserInfo',
  props: {
    userInfo: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      mainUserData: 'user/getUserData',
      userRole: 'user/getUserRole',
    }),
    socialNetworks() {
      if (!Object.keys(this.userData).length) return [];
      const socialNetworksData = this.userData.additionalInfo.socialNetwork;
      const filledNetworks = {};
      if (socialNetworksData) {
        Object.keys(socialNetworksData).forEach((key) => {
          if (socialNetworksData[key]) {
            filledNetworks[key] = socialNetworksData[key];
          }
        });
      }
      return filledNetworks;
    },
    contactData() {
      if (!Object.keys(this.userData).length) return [];
      const userData = [];
      if (this.userData.email) {
        userData.push({
          name: this.userData.email,
          icon: 'icon-mail',
          href: `mailto:${this.userData.email}`,
        });
      }
      const secondNumber = this.userData.tempPhone?.fullPhone || this.userData.phone?.fullPhone;
      if (secondNumber) {
        userData.push({
          name: secondNumber,
          icon: 'icon-phone',
          href: `tel:${secondNumber}`,
        });
      }
      if (this.userData.additionalInfo.address) {
        userData.push({
          name: this.userData.additionalInfo.address,
          icon: 'icon-location',
          href: `https://maps.google.com/?q=${this.userData.additionalInfo.address}`,
        });
      }
      if (this.userData.additionalInfo.company) {
        userData.push({
          name: this.userData.additionalInfo.company,
          icon: 'icon-Earth',
          href: `https://${this.userData.additionalInfo.company}`,
        });
      }
      return userData;
    },
    userData() {
      if (!Object.keys(this.userInfo).length) {
        return {
          avatar: { url: '' },
          additionalInfo: {
            company: '',
            address: '',
            description: '',
            secondMobileNumber: { fullNumber: '' },
            educations: { length: 0 },
            workExperiences: { length: 0 },
          },
          phone: {},
          tempPhone: {},
          questsStatistic: { opened: 0 },
          ratingStatistic: { averageMark: 0, reviewCount: 0 },
          role: 'employer',
        };
      }
      return this.userInfo;
    },
    isShowEducations() {
      if (!Object.keys(this.userInfo).length) return false;
      return this.userInfo.role === 'worker' && this.userInfo.additionalInfo.educations.length > 0;
    },
    isShowWorkExp() {
      if (!Object.keys(this.userInfo).length) return false;
      return this.userInfo.role === 'worker' && this.userInfo.additionalInfo.workExperiences.length > 0;
    },
    userId() {
      return this.$route.params.id;
    },
  },
  methods: {
    initStarClass(star) {
      const reviewMark = this.userInfo?.ratingStatistic?.averageMark;
      const a = this.Floor(star - reviewMark, 2);
      return [
        { rating__star_full: star <= reviewMark },
        { rating__star_half: (a >= 0.3 && a <= 0.7) },
      ];
    },
    shareModal() {
      this.ShowModal({
        key: modals.sharingQuest,
      });
    },
    showMessages() {
      this.$router.push('/messages/1');
    },
    toRaisedViews() {
      this.$router.push('/rised-views');
    },
    sendInvait() {
      this.ShowModal({
        key: modals.invitation,
        userId: this.userData.id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.styles {
  &__flex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
}

.info-grid {
  @extend .styles__flex;
  padding: 25px 0 0 0;
  grid-gap: 20px;
  justify-content: space-between;
  &__block {
    @extend .styles__flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    grid-gap:15px;
    &_left {
      max-width: 142px;
    }
  }
  &__left {
    flex-direction: row;
    justify-content: center;
    display: flex;
    grid-gap: 15px;
  }
  &__right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
  }
}
.right {
  &__header {
    display: flex;
    grid-gap: 30px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  &__footer {
    width: 280px;
  }
  &__price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
}
.price {
  &__text {
    font-size: 14px;
    color: #353C47;
  }
  &__value {
    font-weight: 500;
    font-size: 18px;
    line-height: 130%;
    color: #00AA5B;
  }
}
.block {
  &_left {
    align-self: flex-start;
    max-width: 142px;
  }
  &_right {
    align-self: flex-start;
  }
  &__rating {
    height: 20px;
    display: flex;
    width: 142px;
  }
  &__reviews {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 130%;
    text-decoration: none;
    color: #7C838D;
    text-align: center;
  }
  &__title {
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    color: $black800;
  }
  &__description {
    font-weight: 400;
    font-size: 16px;
    color: $black600;
  }
  &__socials {
    display: flex;
    grid-gap: 5px;
    .icon {
      font-size: 20px;
      cursor: pointer;
      &-facebook::before {
        @extend .icon;
        color: #0A7EEA;
      }
      &-twitter::before {
        @extend .icon;
        color: #24CAFF;
      }
      &-instagram::before {
        @extend .icon;
        color: #C540F3;
      }
      &-linkedin:before {
        @extend .icon;
        content: "\e9ed";
        color: #57A6EF;
      }
    }
    .social {
      &__link {
        text-decoration: none;
      }
    }
  }
}
.contact {
  display: flex;
  &__container {
    display: flex;
    align-items: baseline;
    grid-gap: 5px;
  }
  &__link {
    text-decoration: none;
    font-size: 14px;
    line-height: 130%;
    color: #7C838D;
    margin-right: 30px;
    justify-content: center;
    align-items: center;
  }
  &__btn {
    width: 100%;
    display: flex;
    align-items: flex-end;
    height: 43px;
  }
}
.rating {
  &__star {
    width: inherit;
    background-image: url('~assets/img/ui/star-empty.svg');
    background-repeat: no-repeat;
    background-position: center;
    &_half {
      background-image: url('~assets/img/ui/star-half.svg');
    }
    &_full {
      background-image: url('~assets/img/ui/star-small.svg');
    }
  }
}
.avatar {
  &__img {
    width: 142px;
    height: 142px;
    object-fit: cover;
    border-radius: 50%;
  }
}
.work-exp, .knowledge {
  &__text {
    @include text-simple;
    font-weight: 500;
    font-size: 16px;
    color: $black700;
  }
  &__container {
    display: flex;
    flex-direction: column;
  }
  &__place {
    @include text-simple;
    font-weight: 400;
    font-size: 14px;
    color: $black500;
  }
  &__term {
    @include text-simple;
    font-weight: 400;
    font-size: 14px;
    color: $black300;
  }
}

@include _1199 {
  .contacts {
    margin: 0 0 20px 0;
    .contact {
      display: flex;
      flex-direction: column;
    }
  }
  .right {
    &__header {
      grid-gap: 15px;
    }
    &__footer {
      width: 100%;
    }
  }
}
@include _575 {
  .info-grid {
    flex-direction: column;
    align-items: center;
    &__left {
      flex-direction: column;
    }
    &__right {
      grid-gap:20px;
      width: 100%;
    }
  }
  .block {
    &_left {
      align-self: center;
    }
  }
}

</style>
