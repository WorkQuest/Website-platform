<template>
  <div>
    <div class="section section__container section__container_white">
      <div class="container container__block">
        <userInfo
          :selected="selected"
          :user-info="userData"
        />

        <div class="block__routes routes">
          <button
            v-for="(item, i) in pageTabs"
            :key="i"
            class="routes__btn"
            :class="{routes__btn_active: selected === item.number}"
            @click="selected = item.number"
          >
            {{ item.title }}
          </button>
        </div>
      </div>
    </div>
    <div class="section section__container">
      <div class="container container__block">
        <div
          v-if="selected === 1"
          class="block__statistic statistic"
        >
          <div
            v-for="(item, key) in statisticsData"
            :key="key"
            class="statistic__card card"
          >
            <div class="card__title">
              {{ item.title }}
            </div>
            <div
              class="card__number"
              :class="item.ratingMode ? 'card__number_rating' : ''"
            >
              {{ item.number }}
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
          v-if="userData.userSpecializations && userData.userSpecializations.length && selected === 1"
          class="block__skills-spec skills-spec"
        >
          <div class="skills-spec__title">
            {{ $t('skills.title') }}
          </div>
          <div class="skills-spec__container skills-spec__container_white">
            <div
              v-for="(skills, specialization) in getSkillTitle()"
              :key="specialization"
              class="skills-spec__spec skills-spec__spec_white spec"
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
        <div
          v-if="selected === 2 || selected === 1"
          class="block__quests quests"
        >
          <div
            v-if="selected === 1"
            class="quests__title"
          >
            {{ $t('quests.activeQuests') }}
          </div>
          <quests
            v-if="questsObjects.count !== 0"
            :object="questsObjects"
            :page="'quests'"
          />
          <emptyData
            v-else
            :description="$t('errors.emptyData.emptyQuests')"
          />
          <div class="quests__pager pager">
            <div class="pager__block">
              <base-pager
                v-if="selected === 2 && totalPages > 1"
                v-model="page"
                :total-pages="totalPages"
              />
            </div>
          </div>
          <div
            v-if="selected === 1 && questsObjects.count > 2"
            class="quests__button button"
          >
            <div
              class="button__more"
              @click="selected = 2"
            >
              {{ $t('meta.showAllQuests') }}
            </div>
          </div>
        </div>
        <div
          v-if="selected === 1 || selected === 3"
          class="block__reviews reviews"
        >
          <div
            v-if="selected === 1"
            class="reviews__title"
          >
            {{ $t('quests.reviewsBig') }}
          </div>
          <template v-if="userStatistics.reviewCount > 0">
            <div
              class="reviews__container"
            >
              <reviewsTab />
            </div>
            <div
              v-if="selected === 1"
              class="reviews__button button"
            >
              <div
                class="button__more"
                @click="selected = 3"
              >
                {{ $t('meta.showAllReviews') }}
              </div>
            </div>
          </template>
          <emptyData
            v-else
            :description="$t('errors.emptyData.emptyReviews')"
          />
        </div>
        <div
          v-if="(selected === 1 || selected === 4) && userData.role === 'worker'"
          class="block__portfolio portfolio"
        >
          <div
            v-if="selected === 1"
            class="portfolio__title"
          >
            {{ $t('profile.portfolio') }}
          </div>
          <div
            v-if="selected === 4"
            class="portfolio__add-btn"
          >
            <base-btn
              @click="showAddCaseModal()"
            >
              {{ $t('ui.profile.addCase') }}
              <template v-slot:right>
                <span class="icon-plus" />
              </template>
            </base-btn>
          </div>
          <portfolioTab />
          <div
            v-if="selected === 1 && portfoliosCount > 0"
            class="portfolio__button button"
          >
            <div
              class="button__more"
              @click="selected = 4"
            >
              {{ $t('meta.showAllPortfolios') }}
            </div>
          </div>
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
import quests from '~/components/app/pages/common/quests';
import emptyData from '~/components/app/info/emptyData';
import modals from '~/store/modals/modals';

export default {
  name: 'Index',
  components: {
    reviewsTab,
    quests,
    userInfo,
    emptyData,
    portfolioTab,
  },
  data() {
    return {
      selected: 1,
      questLimits: 100,
      questsObjects: {},
      userStatistics: {
        reviewCount: 0,
        averageMark: 0,
        completedQuests: 0,
        openedQuests: 0,
      },
      userSpecializations: [],
      userData: {},
      page: 1,
      perPager: 11,
      totalPagesValue: 1,
      portfoliosCount: 0,
    };
  },
  computed: {
    ...mapGetters({
      mainUser: 'user/getUserData',
      questUserData: 'quests/getUserInfoQuests',
      portfolios: 'user/getUserPortfolios',
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
    totalPages() {
      return Math.ceil(this.questsObjects.count / this.perPager);
    },
    statisticsData() {
      const { ratingStatistic } = this.userData;
      const { questStatistic } = this.userData;
      return [
        {
          title: this.$t('quests.completedQuests'),
          number: questStatistic ? questStatistic.completed : 0,
          ratingMode: false,
          subtitle: this.$t('quests.oneTime'),
        },
        {
          title: this.$t('quests.openedQuests'),
          number: questStatistic ? questStatistic.opened : 0,
          ratingMode: false,
          subtitle: '',
        },
        {
          title: this.$t('quests.averageRating'),
          number: ratingStatistic && ratingStatistic.averageMark ? ratingStatistic.averageMark : 0,
          ratingMode: true,
          subtitle: `${this.$t('quests.fromBig')} ${ratingStatistic ? ratingStatistic.reviewCount : 0} ${this.$t('quests.reviews')}`,
        },
      ];
    },
  },
  watch: {
    async selected() {
      this.SetLoader(true);
      if (this.selected === 2) {
        await this.changeQuestsData();
      } else if (this.selected === 1) {
        await this.changeQuestsData(2);
      }
      this.SetLoader(false);
    },
    async page() {
      this.SetLoader(true);
      await this.changeQuestsData();
      this.SetLoader(false);
    },
    portfolios() {
      this.portfoliosCount = this.portfolios.count;
    },
  },
  async mounted() {
    if (this.$route.params.id !== this.mainUser.id) {
      this.userData = await this.$store.dispatch('user/getAnotherUserData', this.$route.params.id);
      this.userData = this.userData.result;
    } else {
      this.userData = this.mainUser;
    }
    await this.changeQuestsData(2);
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
    async changeQuestsData(limit) {
      const payload = {
        userId: this.userData.id,
        role: this.userData.role,
        query: limit ? `limit=${limit}` : `limit=${this.perPager}&offset=${(this.page - 1) * this.perPager}`,
      };
      await this.$store.dispatch('quests/getUserQuests', payload);
      this.totalPagesValue = this.totalPages;
      this.questsObjects = this.questUserData;
    },
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
.portfolio {
  &__add-btn {
    width: 154px;
    margin: 20px 0 20px 0;
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
