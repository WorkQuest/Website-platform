<template>
  <div
    class="info-grid"
    data-selector="COMPONENT-INFO-USER"
  >
    <div class="info-grid__left">
      <div class="info-grid__share-left">
        <base-btn
          mode="share-btn"
          data-selector="SHARE-USER-PROFILE"
          @click="shareModal()"
        />
      </div>
      <div class="info-grid__block block block_left">
        <div class="block__avatar avatar">
          <img
            class="avatar__img"
            :src="userData.avatar && userData.avatar.url ? userData.avatar.url : $options.images.EMPTY_AVATAR"
            :alt="userData.avatar && userData.avatar.url ? userData.avatar.url : 'avatar_empty'"
            loading="lazy"
          >
        </div>
        <div class="block__rating rating">
          <div
            v-for="(star,idx) in 5"
            :key="idx"
            :data-selector="`STAR-RATING-STAR-${idx}`"
            class="rating__star"
            :class="initStarClass(star)"
          />
        </div>
        <div class="block__reviews">
          {{ `${userData.ratingStatistic ? userData.ratingStatistic.reviewCount : 0} ${$t('meta.reviewsSmall')}` }}
        </div>
      </div>
      <div class="info-grid__block block block_right">
        <div class="block__data">
          <div class="block__title">
            {{ UserName(userData.firstName, userData.lastName) }}
          </div>
          <item-rating
            v-if="userData.ratingStatistic && userData.ratingStatistic.status >= 0"
            :rating="userData.ratingStatistic.status"
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
            {{ $t('meta.educations') }}
          </div>
          <div
            v-if="userData.additionalInfo.educations"
            class="knowledge__container"
          >
            <div
              v-for="(item, i) in userData.additionalInfo.educations"
              :key="i"
              :data-selector="`EDUCATIONS-EDUCATION-${i}`"
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
              :data-selector="`WORK-EXP-EXP-${i}`"
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
            :data-selector="`SOCIALS-SOCIAL-${key}`"
            class="social__container"
          >
            <a
              class="social__link"
              :data-selector="`SOCIALS-LINK-https://${key}.com/${i}`"
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
              :data-selector="`CONTACT-DATA-${key}`"
              class="contact__container"
            >
              <span
                class="contact__icon"
                :class="data.icon"
              />
              <a
                :href="data.href"
                :data-selector="`CONTACT-DATA-LINK-${data.href}`"
                target="_blank"
                class="contact__link"
              >{{ data.name }}</a>
            </div>
          </div>
        </div>
        <div
          v-if="mainUser.id !== userId"
          class="info-grid__report"
        >
          <base-btn
            data-selector="TO-REPORT-MODAL-VIEW"
            mode="goToChat"
            @click="showReportModal"
          >
            {{ $t('report.btn.report') }}
          </base-btn>
        </div>
      </div>
    </div>
    <div class="info-grid__right right">
      <div
        class="right__header"
        :class="userData.role === UserRole.WORKER ? 'right__header_employee' : ''"
      >
        <div
          v-if="userData.role === UserRole.WORKER && userData.costPerHour"
          class="right__price"
        >
          <div class="price__text">
            {{ $t('meta.costPerHour') }}
          </div>
          <div class="price__value">
            {{ $tc('meta.coins.count.WUSDCount', userData.costPerHour) }}
          </div>
        </div>
        <div class="right__share-btn">
          <base-btn
            data-selector="SHARE-MODAL"
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
            data-selector="TO-RAISE-VIEWS"
            @click="toRaisedViews()"
          >
            {{ $t('meta.raiseViews') }}
          </base-btn>
        </div>
        <div
          v-else-if="mainUser.role === UserRole.EMPLOYER && userData.role === UserRole.WORKER"
          class="contact__btn"
        >
          <base-btn
            mode="approve"
            data-selector="GIVE-A-QUEST"
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
import moment from 'moment';
import {
  UserRole, UserRating, Path, RaiseViewStatus, EntityType,
} from '~/utils/enums';
import modals from '~/store/modals/modals';
import { images } from '~/utils/images';

export default {
  name: 'UserInfo',
  images,
  computed: {
    ...mapGetters({
      mainUser: 'user/getUserData',
      tags: 'ui/getTags',
      mainUserData: 'user/getUserData',
      anotherUserData: 'user/getAnotherUserData',
      availableQuests: 'quests/getAvailableQuests',
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
    raiseViewsName() {
      return {
        0: this.$t('quests.levels.1.title'),
        1: this.$t('quests.levels.2.title'),
        2: this.$t('quests.levels.3.title'),
        3: this.$t('quests.levels.4.title'),
      };
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
      return UserRating[ratingStatistic.status];
    },
    initStarClass(star) {
      const reviewMark = Number(this.userData?.ratingStatistic?.averageMark).toFixed(1);
      const a = this.Floor(star - reviewMark, 2);
      return [
        { rating__star_full: star <= reviewMark },
        { rating__star_half: (a >= 0.3 && a <= 0.7) },
      ];
    },
    shareModal() {
      this.ShowModal({
        key: modals.sharingQuest,
        mode: 'profile',
        itemId: this.userData.id,
      });
    },
    toRaisedViews() {
      if (this.userData.raiseView && RaiseViewStatus[this.userData.raiseView.status]) {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/questAgreed.svg'),
          title: this.$t('quests.active'),
          text: this.raiseViewsName[this.userData.raiseView.type],
          subtitle: `${this.$t('modals.until')} ${moment(this.userData.raiseView.entedAt).format('Do MMMM YYYY, hh:mm a')}`,
        });
      } else {
        this.$router.push(Path.RAISED_VIEWS);
      }
    },
    sendInvite() {
      if (this.availableQuests.length > 0) {
        this.ShowModal({
          key: modals.invitation,
          userId: this.userData.id,
          avatar: this.userData.avatar,
          firstName: this.userData.firstName,
          lastName: this.userData.lastName,
          ratingStatistic: this.userData.ratingStatistic,
        });
      } else {
        this.ShowModal({
          key: modals.status,
          img: require('~/assets/img/ui/warning.svg'),
          title: this.$t('modals.errors.errorQuests'),
          subtitle: this.$t('modals.errors.emptyOpenQuests'),
        });
      }
    },
    showReportModal() {
      const { firstName, lastName, id } = this.anotherUserData;

      this.ShowModal({
        key: modals.report,
        title: `${firstName} ${lastName}`,
        entityId: id,
        entityType: EntityType.USER,
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
    flex-wrap: wrap;
  }

  &_left {
    align-self: flex-start;
    max-width: 142px;
  }

  &_right {
    align-self: flex-start;
    margin-left: 30px;
    max-width: 630px;
    word-break: break-word;
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
      max-width: 720px;
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
