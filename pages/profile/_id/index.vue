<template>
  <div data-selector="PAGE-PROFILE">
    <div class="section section__container section__container_white">
      <div class="container container__block">
        <userInfo />
        <div class="block__routes routes">
          <button
            v-for="(item, i) in pageTabs"
            :key="i"
            :data-selector="`PAGE-TABS-${item.tabName}`"
            class="routes__btn"
            :class="{routes__btn_active: selectedTab === item.tabName}"
            @click="selectTab(item.tabName)"
          >
            {{ item.title }}
          </button>
        </div>
      </div>
    </div>
    <div class="section section__container">
      <div class="container container__block">
        <div
          v-if="selectedTab === 'commonInfo'"
          :data-selector="`PAGE-TAB-${selectedTab}`"
          class="block__statistic statistic"
        >
          <div
            v-for="(item, key) in statisticsData"
            :key="key"
            :data-selector="`PAGE-TAB-CARDS-${key}`"
            class="statistic__card card"
          >
            <div class="card__title">
              {{ item.title }}
            </div>
            <div
              class="card__number"
              :class="{'card__number_rating' : item.ratingMode}"
            >
              {{ numberValidate(item.number) }}
            </div>
            <div
              v-if="item.subtitle"
              class="card__subtitle"
            >
              {{ item.subtitle }}
            </div>
          </div>
        </div>
        <div
          v-if="userData.userSpecializations && userData.userSpecializations.length && selectedTab === 'commonInfo'"
          class="block__skills-spec skills-spec"
        >
          <div class="skills-spec__title">
            {{ $t('meta.skills') }}
          </div>
          <div class="skills-spec__container">
            <skills :specializations="userData.userSpecializations" />
          </div>
        </div>
        <div
          v-if="selectedTab === 'quests' || selectedTab === 'commonInfo'"
          class="block__quests quests"
        >
          <div
            v-if="selectedTab === 'commonInfo'"
            class="quests__title"
          >
            {{ $t('meta.questsBig') }}
          </div>
          <div
            v-if="questsCount > 0"
            class="quests__cards"
          >
            <card-quest
              v-for="(quest,i) in quests"
              :key="i"
              :data-selector="`QUEST-CARD-${i}`"
              :quest-index="i"
              :quest="quest"
              @clickFavoriteStar="updateQuests"
            />
          </div>
          <empty-data
            v-else
            :description="$tc('errors.emptyData.emptyQuests')"
          />
          <div class="quests__pager pager">
            <div class="pager__block">
              <base-pager
                v-if="selectedTab === 'quests' && totalQuestsPages > 1"
                v-model="pageQuests"
                :total-pages="totalQuestsPages"
              />
            </div>
          </div>
          <div
            v-if="selectedTab === 'commonInfo' && questsCount > 2"
            class="quests__button button"
          >
            <div
              class="button__more"
              data-selector="ACTION-BTN-TABS-SHOW-ALL-QUEST"
              @click="selectTab('quests')"
            >
              {{ $t('meta.btns.showAllQuests') }}
            </div>
          </div>
        </div>
        <div
          v-if="selectedTab === 'commonInfo' || selectedTab === 'reviews'"
          class="block__reviews reviews"
        >
          <div
            v-if="selectedTab === 'commonInfo'"
            class="reviews__title"
          >
            {{ $t('meta.reviewsBig') }}
          </div>
          <template v-if="reviewsObject.count > 0">
            <div class="reviews__container">
              <reviewsTab :object="reviewsObject" />
            </div>
            <div
              v-if="selectedTab === 'reviews' && totalReviewsPages > 1"
              class="reviews__pager pager"
            >
              <div class="pager__block">
                <base-pager
                  v-model="pageReviews"
                  :total-pages="totalReviewsPages"
                />
              </div>
            </div>
            <div
              v-if="selectedTab === 'commonInfo'"
              class="reviews__button button"
            >
              <div
                v-if="reviewsObject.count > 4"
                class="button__more"
                data-selector="ACTION-BTN-SHOW-ALL-REVIEWS"
                @click="selectTab('reviews')"
              >
                {{ $t('meta.btns.showAllReviews') }}
              </div>
            </div>
          </template>
          <empty-data
            v-else
            :description="$t('errors.emptyData.emptyReviews')"
          />
        </div>
        <div
          v-if="(selectedTab === 'commonInfo' || selectedTab === 'portfolio') && userData.role === $options.UserRole.WORKER"
          class="block__portfolio portfolio"
        >
          <div
            v-if="selectedTab === 'commonInfo'"
            class="portfolio__title"
          >
            {{ $t('meta.portfolio') }}
          </div>
          <div
            v-if="selectedTab === 'portfolio' && userId === mainUser.id"
            class="portfolio__add-btn"
          >
            <base-btn
              data-selector="ADD-PORTFOLIO-CASE"
              @click="showAddCaseModal()"
            >
              {{ $t('meta.addCase') }}
              <template v-slot:right>
                <span class="icon-plus_white" />
              </template>
            </base-btn>
          </div>
          <portfolioTab
            class="profile__portfolio"
            :object="portfolios"
          />
          <div
            v-if="selectedTab === 'portfolio' && totalPortfoliosPages > 1"
            class="portfolio__pager pager"
          >
            <div class="pager__block">
              <base-pager
                v-model="pagePortfolios"
                :total-pages="totalPortfoliosPages"
              />
            </div>
          </div>
          <div
            v-if="selectedTab === 'commonInfo' && portfolios.count > 3"
            class="portfolio__button button"
          >
            <div
              class="button__more"
              data-selector="ACTION-BTN-SHOW-ALL-PORTFOLIOS"
              @click="selectTab('portfolio')"
            >
              {{ $t('meta.btns.showAllPortfolios') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import reviewsTab from '~/components/app/pages/profile/tabs/reviews';
import portfolioTab from '~/components/app/pages/profile/tabs/portfolio';
import userInfo from '~/components/app/pages/common/userInfo';
import modals from '~/store/modals/modals';
import skills from '~/components/app/pages/common/skills';
import { UserRole } from '~/utils/enums';

export default {
  name: 'Index',
  UserRole,
  components: {
    reviewsTab,
    userInfo,
    portfolioTab,
    skills,
  },
  data() {
    return {
      userId: null,
      selectedTab: 'commonInfo',
      reviewsObject: {},
      userStatistics: {
        reviewCount: 0,
        averageMark: 0,
        completedQuests: 0,
        openedQuests: 0,
      },
      userSpecializations: [],
      userData: {},
      pageQuests: 1,
      pageReviews: 1,
      pagePortfolios: 1,
      perPagerQuests: 11,
      perPagerReviews: 8,
      perPagerPortfolios: 6,
    };
  },
  computed: {
    ...mapGetters({
      mainUser: 'user/getUserData',
      quests: 'quests/getAllQuests',
      questsCount: 'quests/getAllQuestsCount',
      portfolios: 'user/getUserPortfolios',
      reviews: 'user/getAllUserReviews',
      anotherUserData: 'user/getAnotherUserData',
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
          tabName: 'commonInfo',
          title: this.$t('profile.common'),
        },
        {
          number: 2,
          tabName: 'quests',
          title: this.$t('meta.questsBig'),
        },
        {
          number: 3,
          tabName: 'reviews',
          title: this.$t('meta.reviewsBig'),
        },
      ];

      if (this.userData.role === UserRole.WORKER) {
        tabs.push({
          number: 4,
          tabName: 'portfolio',
          title: this.$t('meta.portfolio'),
        });
      }
      return tabs;
    },
    totalQuestsPages() {
      return Math.ceil(this.questsCount / this.perPagerQuests);
    },
    totalReviewsPages() {
      return Math.ceil(this.reviews.count / this.perPagerReviews);
    },
    totalPortfoliosPages() {
      return Math.ceil(this.portfolios.count / this.perPagerPortfolios);
    },
    statisticsData() {
      return [
        {
          title: this.$t('quests.completedQuests'),
          number: this.userData?.questsStatistic?.completed || 0,
          ratingMode: false,
          subtitle: this.$t('quests.oneTime'),
        },
        {
          title: this.$t('meta.openedQuests'),
          number: this.userData?.questsStatistic?.opened || 0,
          ratingMode: false,
          subtitle: '',
        },
        {
          title: this.$t('quests.averageRating'),
          number: this.userData?.ratingStatistic?.averageMark || 0,
          ratingMode: true,
          subtitle: `${this.$t('meta.fromBig')} ${this.userData?.ratingStatistic?.reviewCount || 0} ${this.$t('meta.reviewsSmall')}`,
        },
      ];
    },
  },
  watch: {
    async selectedTab() {
      this.SetLoader(true);
      if (this.selectedTab === 'quests') {
        await this.changeQuestsData();
      } else if (this.selectedTab === 'reviews') {
        await this.changeReviewsData();
      } else if (this.selectedTab === 'portfolio') {
        await this.changePortfoliosData(this.perPagerPortfolios);
      } else if (this.selectedTab === 'commonInfo') {
        this.pagePortfolios = 1;
        await this.changeQuestsData(2);
        await this.changeReviewsData(2);
        if (this.userData.role === UserRole.WORKER) {
          await this.changePortfoliosData(3);
        }
      }
      this.SetLoader(false);
    },
    async pageQuests() {
      this.SetLoader(true);
      await this.changeQuestsData();
      this.ScrollToTop();
      this.SetLoader(false);
    },
    async pageReviews() {
      this.SetLoader(true);
      await this.changeReviewsData();
      this.ScrollToTop();
      this.SetLoader(false);
    },
    async pagePortfolios() {
      this.SetLoader(true);
      await this.changePortfoliosData(this.perPagerPortfolios);
      this.ScrollToTop();
      this.SetLoader(false);
    },
  },
  destroyed() {
    sessionStorage.removeItem('questsListFilter');
  },
  async mounted() {
    this.userId = this.$route.params.id;
    if (this.userId !== this.mainUser.id) {
      await this.$store.dispatch('user/getAnotherUserData', this.userId);
      this.userData = this.anotherUserData;
    } else {
      await this.$store.dispatch('user/getMainData');
      this.userData = this.mainUser;
    }
    await this.changeQuestsData(2);
    await this.changeReviewsData(2);
    if (this.userData.role === UserRole.WORKER) await this.changePortfoliosData(3);
    const { ratingStatistic } = this.userData;
    const { questStatistic } = this.userData;
    this.userStatistics = {
      reviewCount: ratingStatistic ? ratingStatistic.reviewCount : 0,
      averageMark: ratingStatistic && ratingStatistic.averageMark ? ratingStatistic.averageMark : 0,
      completedQuests: questStatistic ? questStatistic.completed : 0,
      openedQuests: questStatistic ? questStatistic.opened : 0,
    };
  },
  async beforeDestroy() {
    await this.$store.dispatch('user/clearAnotherUserData');
  },
  methods: {
    selectTab(tab) {
      this.selectedTab = tab;
      this.ScrollToTop();
    },
    async updateQuests(item) {
      this.SetLoader(true);
      if (!item.star) await this.$store.dispatch('quests/setStarOnQuest', item.id);
      else await this.$store.dispatch('quests/takeAwayStarOnQuest', item.id);

      if (this.selectedTab === 'quests') await this.changeQuestsData();
      else await this.changeQuestsData(2);
      this.SetLoader(false);
    },
    numberValidate(number) {
      const fixedNumber = number.toFixed(1);
      if (number - fixedNumber !== 0) return fixedNumber;
      return number;
    },
    async changeQuestsData(limit) {
      const payload = {
        role: this.userData.role,
        userId: this.userData.id,
        query: {
          limit: limit || this.perPagerQuests,
          offset: (this.pageQuests - 1) * this.perPagerQuests,
          'sort[createdAt]': 'desc',
        },
      };

      sessionStorage.setItem('questsListFilter', JSON.stringify(payload));

      await this.$store.dispatch('quests/getUserQuests', payload);
    },
    async changeReviewsData(limit) {
      await this.$store.dispatch('user/getAllUserReviews', {
        userId: this.userId,
        params: {
          limit: limit || this.perPagerReviews,
          offset: (this.pageReviews - 1) * this.perPagerReviews,
        },
      });
      this.reviewsObject = this.reviews;
    },
    async changePortfoliosData(limit) {
      const payload = {
        userId: this.userId,
        query: {
          limit,
          offset: (this.pagePortfolios - 1) * this.perPagerPortfolios,
        },
      };
      await this.$store.dispatch('user/getUserPortfolios', payload);
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
.quests__cards {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
  margin-top: 20px;
}

.routes {
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
.section {
  &__container {
    &_white {
      background-color: $white;
    }
  }
}
.container {
  width: 1180px;
  margin: 0 auto;
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

.pager {
  &__block {
    width: auto;
    margin-top: 25px;
  }
}

.block {
  &__statistic {
    padding: 20px 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
  }
}
.skills-spec {
  &__container {
    padding: 20px;
    flex-direction: column;
    background: #FFFFFF;
    border-radius: 6px;
  }
  &__title {
    font-size: 16px;
    line-height: 130%;
    margin-bottom: 10px;
  }
}
.statistic {
  &__card {
    display: grid;
    border-radius: 6px;
    background-color: #fff;
    padding: 20px;
    border: 0;
    .card {
      &__title {
        font-size: 16px;
        line-height: 130%;
        color: #1D2127;
      }
      &__number {
        @include text-simple;
        font-weight: bold;
        font-size: 30px;
        line-height: 130%;
        color: #0083C7;
        margin: 9px 0;
        &_rating {
          background-image: url("data:image/svg+xml,%3Csvg width='28' height='26' viewBox='0 0 28 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a             %3Cpath d='M14 0.5L18.1145 8.83688L27.3148 10.1738L20.6574 16.6631L22.229 25.8262L14 21.5L5.77101 25.8262L7.3426 16.6631L0.685208 10.1738L9.8855 8.83688L14 0.5Z' fill='%23E8D20D'/%3E\a             %3C/svg%3E                           \a             ");
          background-position: 55px 4px;
          background-repeat: no-repeat;
        }
      }
      &__subtitle {
        font-weight: 500;
        font-size: 12px;
        line-height: 130%;
        color: #4C5767;
      }
    }
  }
}
.quests, .portfolio, .reviews {
  &__button {
    @extend .styles__flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    margin: 20px 0 0 0;
    .button {
      &__more {
        @extend .styles__flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        cursor: pointer;
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
  }
  &__title {
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 130%;
    color: #1D2127;
    margin: 0 0 20px 0;
  }
}
.reviews {
  &__container {
    margin-top: 20px;
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
.portfolio {
  &__add-btn {
    width: 154px;
    margin: 20px 0 20px 0;
  }
}
.profile {
  &__portfolio {
    margin-top: 28px;
  }
}
@include _1199 {
  .container {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
  }
}
@include _575 {
  .container {
    padding-left: 20px;
    padding-right: 20px;
  }
  .block__statistic {
    grid-template-columns: repeat(2, auto);
  }
}
</style>
