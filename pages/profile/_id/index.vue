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
          v-if="userData.userSpecializations && userData.userSpecializations.length && selected === 1"
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
        <div
          v-if="selected === 2 || selected === 1"
          class="quests-block"
        >
          <div
            v-if="selected === 1"
            class="title"
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
          <div class="pager__block">
            <base-pager
              v-if="selected === 2 && totalPages > 1"
              v-model="page"
              :total-pages="totalPages"
            />
          </div>
          <div
            v-if="selected === 1 && questsObjects.count > 2"
            class="button"
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
          class="reviews-block"
        >
          <div
            v-if="selected === 1"
            class="title"
          >
            {{ $t('quests.reviewsBig') }}
          </div>
          <template v-if="userStatistics.reviewCount > 0">
            <div
              class="tab__container"
            >
              <reviewsTab />
            </div>
            <div
              v-if="selected === 1"
              class="button"
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
          class="portfolio-block"
        >
          <div
            v-if="selected === 1"
            class="title"
          >
            {{ $t('profile.portfolio') }}
          </div>
          <div
            v-if="selected === 4"
            class="add-btn__container"
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
            class="button"
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
import userStatistic from '~/components/app/panels/userStatistic';
import quests from '~/components/app/pages/common/quests';
import emptyData from '~/components/app/info/emptyData';
import modals from '~/store/modals/modals';

export default {
  name: 'Index',
  components: {
    reviewsTab,
    userStatistic,
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
.add-btn {
  &__container {
    width: 154px;
    margin: 20px 0 20px 0;
  }
}
.button {
  @extend .styles__flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin: 20px 0 0 0;
  &__more {
    margin: 0 0 0 0;
    @extend .button;
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
  display: grid;
  gap: 20px;
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
.pager {
  &__block {
    width: auto;
  }
}
@include _1199 {
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
}
</style>
