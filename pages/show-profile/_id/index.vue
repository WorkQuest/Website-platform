<template>
  <div>
    <div class="main-section main-section_white">
      <div class="main-container">
        <userInfo
          :selected="selected"
          :user-info="userData"
        />

        <div class="main-container__routes">
          <button
            v-for="(item, i) in pageTabs"
            :key="i"
            class="tab__btn"
            :class="{tab__btn_active: selected === item.number}"
            @click="selected = item.number"
          >
            {{ item.title }}
          </button>
        </div>
      </div>
    </div>
    <div class="information-section">
      <div class="main-container">
        <userStatistic
          v-if="selected === 1"
          :review-data="userStatistics"
        />
        <div
          v-if="userData.userSpecializations && selected === 1"
          class="skills-block"
        >
          <div class="skills-block__title">
            {{ $t('skills.title') }}
          </div>
          <div class="skills-block__container skills-block__container_white">
            <div
              v-for="(skills, specialization) in getSkillTitle()"
              :key="specialization"
              class="skills-block__spec skills-block__spec_white"
            >
              <div class="spec__title">
                {{ $t(`filters.items.${specialization}.title`) }}
              </div>
              <ul class="spec__skills">
                <li
                  v-for="(skill, key) in skills"
                  :key="key"
                  class="skills__item skills__item_blue"
                >
                  {{ $t(`filters.items.${specialization}.sub.${skill}`) }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-if="selected === 2">
          <div class="title">
            {{ $t('quests.activeQuests') }}
          </div>
        </div>
        <div
          v-if="selected === 3 || (selected === 1 && userData.role === 'employer' && userStatistics.reviewCount > 0)"
          class="title"
        >
          {{ $t('quests.reviewsBig') }}
        </div>

        <div
          v-if="selected === 3 || (selected === 1 && userData.role === 'employer')"
          class="tab__container"
        >
          <reviewsTab :user-id="userData.id" />
        </div>
        <div
          v-if="selected === 3 && userStatistics.reviewCount > 0"
          class="button"
        >
          <div class="button__more">
            {{ $t('meta.showAllReviews') }}
          </div>
        </div>
        <div v-if="selected === 4 || (selected === 1 && userData.role === 'worker')">
          <portfolioTab :user-id="userData.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import reviewsTab from '~/components/app/pages/profile/tabs/reviews';
import portfolioTab from '~/components/app/pages/profile/tabs/portfolio';
import userInfo from '~/components/app/pages/common/userInfo';
import userStatistic from '~/components/app/panels/userStatistic';
import modals from '~/store/modals/modals';

export default {
  name: 'Index',
  components: {
    reviewsTab,
    userStatistic,
    userInfo,
    portfolioTab,
  },
  data() {
    return {
      selected: 1,
      userStatistics: {
        reviewCount: 0,
        averageMark: 0,
        completedQuests: 0,
        openedQuests: 0,
      },
      userSpecializations: [],
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getAnotherUserData',
    }),
    cardLevelClass(idx) {
      const { cards } = this;
      return [
        { card__level_reliable: cards[idx].level.code === 2 },
        { card__level_checked: cards[idx].level.code === 3 },
      ];
    },
    pageTabs() {
      const tabs = [
        {
          number: 1,
          title: this.$t('profile.common'),
        },
        {
          number: 2,
          title: this.$t('profile.quests'),
        },
        {
          number: 3,
          title: this.$t('profile.reviews'),
        },
      ];

      if (this.userData.role === 'worker') {
        tabs.push({
          number: 4,
          title: this.$t('profile.portfolio'),
        });
      }

      return tabs;
    },
  },
  async beforeCreate() {
    await this.$store.dispatch('user/getAnotherUserData', this.$route.params.id);
    const { ratingStatistic } = this.userData;
    const { questStatistic } = this.userData;

    if (questStatistic) {
      this.userStatistics = {
        reviewCount: ratingStatistic.reviewCount,
        averageMark: ratingStatistic.averageMark,
        completedQuests: questStatistic.completed,
        openedQuests: questStatistic.opened,
      };
    }
  },
  async beforeDestroy() {
    await this.$store.dispatch('user/clearAnotherUserData');
  },
  methods: {
    getSkillTitle() {
      const specData = {};
      this.userData.userSpecializations.forEach((data) => {
        const [spec, skill] = data.path.split('.');
        if (!specData[spec]) specData[spec] = [];
        specData[spec].push(skill);
      });
      return specData;
    },
    isRating(type) {
      return (type === 3);
    },
    showAddCaseModal() {
      this.ShowModal({
        key: modals.addCase,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.button {
  @extend .styles__flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin: 20px 0 0 0;
  &__more {
    @extend .button;
    display: inline-block;
    text-decoration: none;
    font-size: 16px;
    line-height: 130%;
    color: #0083C7;
    border: 1px solid rgba(0, 131, 199, 0.1);
    border-radius: 6px;
    padding: 13px 67px 13px 28px;
    background-image: url("data:image/svg+xml,%3Csvg width='11' height='6' viewBox='0 0 11 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a           %3Cpath d='M5.5 5.5L10.5 0.5L0.5 0.5L5.5 5.5Z' fill='%230083C7'/%3E\a           %3C/svg%3E                                                          \a           ");
    background-position: 82% 21px;
    background-repeat: no-repeat;
  }
}
.tab {
  &__container {
    margin: 20px 0 20px 0;
  }
  &__btn {
    color: $black500;
    font-size: 16px;
    padding: 10px;
    &_active {
      color: $black800;
      font-size: 16px;
      border-bottom: 1px solid $blue;
      padding: 10px;
    }
  }
}
.main-section {
  &_white {
    background-color: $white;
  }
}
.main-container {
  width: 1180px;
  margin: 0 auto;
  padding-top: 10px;
  display: grid;
  gap: 20px;
}

.styles {
  &__flex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
}

.title {
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 130%;
  color: #1D2127;
  margin: 0 0 20px 0;
}

.right {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}

.btn {
  &__container {
    width: 100%;
    display: flex;
    align-items: flex-end;
  }
}

.icon {
  &-chat:before {
    content: "\e9ba";
    font-size: 14px;
    color: $green;
  }
  &-btn {
    &_right {
      margin: 0 5px 0 0;
    }
  }
}

.contacts {
  margin-bottom: 15px;
  display: grid;
  grid-template-columns: 7fr 1fr;
}

.knowledge {
  &__text {
    @extend .work-exp__text;
  }
  &__term {
    @include text-simple;
    font-weight: 400;
    font-size: 14px;
    color: $black500;
  }
}

.work-exp {
  &__text {
    @include text-simple;
    font-weight: 500;
    font-size: 16px;
    color: $black700;
    margin: 15px 0 0 0;
  }
  &__container {
    display: flex;
    flex-direction: column;
  }
  &__company {
    @extend .knowledge__term;
  }
  &__term {
    @extend .knowledge__term;
    color: $black300;
  }
}

.title {
  @include text-simple;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  color: $black800;
}

.styles {
  &__flex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
}

.information-grid {
  @extend .styles__flex;
  padding: 25px 0 0 0;
  position: relative;

  .share-btn {
    height: 24px;
    width: 24px;
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a         %3Cpath d='M17.5 22C16.4179 22.0125 15.3923 21.5181 14.7282 20.6637C14.0641 19.8094 13.8379 18.6935 14.117 17.648L7.85697 14.07C6.77525 15.0611 5.18965 15.2708 3.88746 14.5951C2.58526 13.9194 1.84384 12.5023 2.03134 11.0472C2.21883 9.5922 3.2953 8.40926 4.72625 8.08577C6.15719 7.76227 7.63783 8.36714 8.43297 9.60002L14.116 6.35102C14.0424 6.07321 14.0035 5.78738 14 5.50002C13.9856 3.82674 15.1478 2.37316 16.7832 2.01884C18.4186 1.66452 20.0781 2.50676 20.7576 4.03594C21.4371 5.56511 20.95 7.36125 19.5909 8.33753C18.2319 9.31381 16.3742 9.20211 15.142 8.07002L8.99097 11.585C8.98488 11.8443 8.94863 12.1021 8.88297 12.353L15.142 15.93C16.2942 14.8726 18.0087 14.7093 19.3399 15.5303C20.671 16.3514 21.2946 17.9568 20.8668 19.461C20.439 20.9653 19.0639 22.0023 17.5 22ZM17.5 17C16.6715 17 16 17.6716 16 18.5C16 19.3284 16.6715 20 17.5 20C18.3284 20 19 19.3284 19 18.5C19 17.6716 18.3284 17 17.5 17ZM5.49997 10C4.67154 10 3.99997 10.6716 3.99997 11.5C3.99997 12.3284 4.67154 13 5.49997 13C6.3284 13 6.99997 12.3284 6.99997 11.5C6.99997 10.6716 6.3284 10 5.49997 10ZM17.5 4.00002C16.6715 4.00002 16 4.67159 16 5.50002C16 6.32845 16.6715 7.00002 17.5 7.00002C18.3284 7.00002 19 6.32845 19 5.50002C19 4.67159 18.3284 4.00002 17.5 4.00002Z' fill='%237C838D'/%3E\a         %3C/svg%3E                                                                   \a         ");
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    right: 0;
    top: 28px;

    &:hover {
      cursor: pointer;
    }
  }

  .col {
    @extend .styles__flex;
    align-self: flex-start;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .avatar {
    border-radius: 89px;
    object-fit: cover;
  }

  .rating {
    height: 20px;
    display: flex;
    //background-image: url("data:image/svg+xml,%3Csvg width='120' height='20' viewBox='0 0 120 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a           %3Cpath d='M10 0L12.9389 5.95492L19.5106 6.90983L14.7553 11.5451L15.8779 18.0902L10 15L4.12215 18.0902L5.24472 11.5451L0.489435 6.90983L7.06107 5.95492L10 0Z' fill='%23E8D20D'/%3E\a           %3Cpath d='M35 0L37.9389 5.95492L44.5106 6.90983L39.7553 11.5451L40.8779 18.0902L35 15L29.1221 18.0902L30.2447 11.5451L25.4894 6.90983L32.0611 5.95492L35 0Z' fill='%23E8D20D'/%3E\a           %3Cpath d='M60 0L62.9389 5.95492L69.5106 6.90983L64.7553 11.5451L65.8779 18.0902L60 15L54.1221 18.0902L55.2447 11.5451L50.4894 6.90983L57.0611 5.95492L60 0Z' fill='%23E8D20D'/%3E\a           %3Cpath d='M85 0L87.9389 5.95492L94.5106 6.90983L89.7553 11.5451L90.8779 18.0902L85 15L79.1221 18.0902L80.2447 11.5451L75.4894 6.90983L82.0611 5.95492L85 0Z' fill='%23E8D20D'/%3E\a           %3Cpath d='M110 0L112.939 5.95492L119.511 6.90983L114.755 11.5451L115.878 18.0902L110 15L104.122 18.0902L105.245 11.5451L100.489 6.90983L107.061 5.95492L110 0Z' fill='%23E9EDF2'/%3E\a           %3C/svg%3E                                                              \a           ");
    //background-repeat: no-repeat;
    //background-position: center;
    margin-top: 20px;
    width: 142px;
    .star {
      width: inherit;
      background-image: url('~assets/img/ui/star-empty.svg');
      background-repeat: no-repeat;
      background-position: center;
      &__half {
        background-image: url('~assets/img/ui/star-half.svg');
      }
      &__full {
        background-image: url('~assets/img/ui/star-small.svg');
      }
    }
  }

  .reviews-amount {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 130%;
    text-decoration: none;
    color: #7C838D;
    text-align: center;
    margin-top: 5px;
  }

  .description {
    margin: 15px 0 0 0;
    font-weight: 400;
    font-size: 16px;
    color: $black600;
  }

  .socials {
    margin: 15px 0;
  }

  .socials a {
    display: inline-block;
  }

  .col .socials .icon {
    height: 24px;
    width: 24px;
    background-position: center;
    background-repeat: no-repeat;
    margin-right: 5px;
  }
}

.info-grid {
  &__avatar {
    width: 142px;
    height: 142px;
    border-radius: 50%;
  }
  &__col {
    &_left {
      max-width: 142px;
      padding: 0 15px 0 0;
    }
  }
}

.icon {
  color: #7C838D;
  font-size: 16px;
  cursor: pointer;
  padding-right: 5px;
  &-phone:before {
    @extend .icon;
    content: "\ea2d";
  }
  &-location:before {
    @extend .icon;
    content: "\ea23";
  }
  &-mail:before {
    @extend .icon;
    content: "\ea27";
  }
  &-Earth:before {
    @extend .icon;
    content: "\ea11";
  }
}

.contacts {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.contact {
  display: flex;
  &__container {
    display: flex;
    align-items: center;
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
}

.skills-block {
  &__container {
    padding: 20px;
    display: flex;
    grid-gap: 20px;
    flex-direction: column;
    &_white {
      background: #FFFFFF;
      border-radius: 6px;
    }
  }
  &__title {
    font-size: 16px;
    line-height: 130%;
    margin-bottom: 10px;
  }
  &__spec {
    display: flex;
    flex-direction: column;
    grid-gap: 10px;
  }
}
.spec {
  &__container {
    display: flex;
    flex-direction: column;
    grid-gap: 10px;
  }
  &__title {
    font-size: 14px;
    line-height: 130%;
  }
  &__skills {
    display: flex;
    grid-gap: 8px;
    flex-wrap: wrap;
  }
}
.skills {
  &__item {
    font-size: 16px;
    line-height: 130%;
    &_blue {
      background-color: rgba(0, 131, 199, 0.1);
      border-radius: 44px;
      padding: 5px;
      color: #0083C7;
    }
  }
}
  @include _1199 {
  .contact {
    display: flex;
    flex-direction: column;
  }
  .template {
    &__main {
      padding-left: 20px;
      padding-right: 20px;
    }
  }
  .main-container {
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
  }
  .contacts {
    grid-template-columns: 4fr 1fr;
    margin: 0 0 20px 0;
  }
}
  @include _575 {
    .contacts {
      grid-template-columns: 1fr;
    }
    .information-grid {
      flex-direction: column;
      align-items: center;
      .col {
        margin-bottom: 10px;
      }
    }
  }

</style>
