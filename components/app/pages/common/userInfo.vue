<template>
  <div class="info-grid">
    <div class="info-grid__left">
      <div class="info-grid__share-left">
        <base-btn
          mode="share-btn"
          @click="shareModal()"
        />
      </div>
      <div class="info-grid__block block block_left">
        <div class="block__avatar avatar">
          <img
            class="avatar__img"
            :src="userData.avatar && userData.avatar.url ? userData.avatar.url : EmptyAvatar()"
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
        <div class="block__data">
          <div class="block__title">
            {{ UserName(userData.firstName, userData.lastName) }}
          </div>
          <item-rating
            v-if="ratingStatistic(userData.ratingStatistic) !== 'noStatus'"
            :rating="ratingStatistic(userData.ratingStatistic)"
          />
        </div>
        <div
          v-if="userData.role === UserRole.EMPLOYER && userData.company"
          class="block__subtitle"
        >
          {{ userData.company }}
        </div>
        <div
          v-if="userData.additionalInfo && userData.additionalInfo.description"
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
              <span
                class="contact__icon"
                :class="data.icon"
              />
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
        :class="userData.role === UserRole.WORKER ? 'right__header_employee' : ''"
      >
        <div
          v-if="userData.role === UserRole.WORKER && userData.wagePerHour"
          class="right__price"
        >
          <div class="price__text">
            {{ $t('settings.costPerHour') }}
          </div>
          <div class="price__value">
            {{ $tc('saving.wusdCount', userData.wagePerHour) }}
          </div>
        </div>
        <div class="right__share-btn">
          <base-btn
            mode="share-btn"
            @click="shareModal()"
          />
        </div>
      </div>
      <div class="right__footer">
        <div
          v-if="mainUser.role === UserRole.WORKER && userId === mainUserData.id"
          class="contact__btn"
        >
          <base-btn
            @click="toRaisedViews()"
          >
            {{ $t('profile.raiseViews') }}
          </base-btn>
        </div>
        <div
          v-else-if="mainUser.role === UserRole.EMPLOYER && userData.role === UserRole.WORKER"
          class="contact__btn"
        >
          <base-btn
            :mode="'approve'"
            @click="sendInvite()"
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
import { UserRole } from '~/utils/enums';
import modals from '~/store/modals/modals';

export default {
  name: 'UserInfo',
  computed: {
    ...mapGetters({
      mainUser: 'user/getUserData',
      tags: 'ui/getTags',
      mainUserData: 'user/getUserData',
      anotherUserData: 'user/getAnotherUserData',
    }),
    isEmptyUserData() {
      return !this.userData.id;
    },
    UserRole() {
      return UserRole;
    },
    socialNetworks() {
      if (this.isEmptyUserData) return [];
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
      if (this.isEmptyUserData) return [];
      const {
        email, tempPhone, phone, additionalInfo: {
          secondMobileNumber, address, company, website,
        },
      } = this.userData;
      const userData = [];
      if (email) {
        userData.push({
          name: email,
          icon: 'icon-mail',
          href: `mailto:${email}`,
        });
      }
      const mainPhone = tempPhone?.fullPhone || phone?.fullPhone;
      if (mainPhone) {
        userData.push({
          name: mainPhone,
          icon: 'icon-phone',
          href: `tel:${mainPhone}`,
        });
      }
      if (secondMobileNumber?.fullPhone) {
        userData.push({
          name: secondMobileNumber.fullPhone,
          icon: 'icon-phone',
          href: `tel:${secondMobileNumber.fullPhone}`,
        });
      }
      if (address) {
        userData.push({
          name: address,
          icon: 'icon-location',
          href: `https://maps.google.com/?q=${address}`,
        });
      }
      if (company) {
        userData.push({
          name: company,
          icon: 'icon-Case',
        });
      }
      if (website) {
        userData.push({
          name: website,
          icon: 'icon-Earth',
          href: `https://${website}`,
        });
      }
      return userData;
    },
    isShowEducations() {
      if (this.isEmptyUserData) return false;
      return this.userData.role === 'worker' && this.userData.additionalInfo.educations.length > 0;
    },
    isShowWorkExp() {
      if (this.isEmptyUserData) return false;
      return this.userData.role === 'worker' && this.userData.additionalInfo.workExperiences.length > 0;
    },
    userId() {
      return this.$route.params.id;
    },
    userData() {
      return this.userId !== this.mainUser.id ? this.anotherUserData : this.mainUser;
    },
    isHaveOpenQuests() {
      return this.mainUserData.questsStatistic && this.mainUserData.questsStatistic.opened > 0;
    },
  },
  watch: {
    async anotherUserData() {
      if (this.mainUser.role === this.UserRole.EMPLOYER && this.userData.role === this.UserRole.WORKER && this.isHaveOpenQuests) {
        await this.$store.dispatch('quests/getAvailableQuests', this.userId);
      }
    },
  },
  methods: {
    ratingStatistic(ratingStatistic) {
      return ratingStatistic?.status || 'noStatus';
    },
    initStarClass(star) {
      const reviewMark = this.userData?.ratingStatistic?.averageMark;
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
    toRaisedViews() {
      this.$router.push('/raised-views');
    },
    sendInvite() {
      if (this.isHaveOpenQuests) {
        this.ShowModal({
          key: modals.invitation,
          userId: this.userData.id,
        });
      } else {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('modals.errorQuests'),
          subtitle: this.$t('modals.emptyOpenQuests'),
        });
      }
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
    grid-gap: 15px;
    &_left {
      max-width: 142px;
    }
  }
  &__left {
    flex-direction: row;
    justify-content: center;
    display: flex;
  }
  &__right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
  }
  &__share-left {
    display: none;
  }
}

.right {
  &__header {
    display: grid;
    justify-content: space-between;
    align-items: center;
    &_employee {
      grid-template-columns: auto auto;
      grid-gap: 30px;
    }
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
  &__data {
    display: flex;
    grid-gap: 10px;
    align-items: center;
  }
  &_left {
    align-self: flex-start;
    max-width: 142px;
  }
  &_right {
    align-self: flex-start;
    margin-left: 30px;
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
    line-height: 130%;
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
  flex-wrap: wrap;
  margin: -5px 0;
  &__container {
    display: flex;
    align-items: flex-end;
    margin: 5px 0;
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
  &__icon {
    @extend .icon;
    color: $black500;
    font-size: 20px;
    margin-right: 5px;
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
      justify-items: end;
      &_employee {
        grid-gap: 15px;
        grid-template-columns: 110px auto;
      }
    }
    &__footer {
      width: 100%;
    }
  }
}

@include _991 {
  .info-grid {
    flex-direction: column;
    align-items: center;
    grid-gap: 0;
    &__left {
      flex-direction: column;
      width: 100%;
    }
    &__right {
      grid-gap: 20px;
      width: 100%;
    }
    &__share-left {
      display: flex;
      height: 0;
      justify-content: flex-end;
    }
  }
  .block {
    &_left {
      align-self: center;
    }
    &_right {
      margin-left: 0;
      margin-top: 30px;
    }
  }
  .right {
    &__share-btn {
      display: none;
    }
    &__header {
      &_employee {
        grid-gap: 0;
        grid-template-columns: auto;
      }
    }
  }
}
</style>
