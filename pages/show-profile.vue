<template>
  <div>
    <div
      class="main-section main-section_white"
    >
      <div class="main-container">
        <UserInfo :selected="selected" />
      </div>
    </div>
    <div class="information-section">
      <div class="main-container">
        <!-- DATA -->
        <UserStatistic />

        <!-- REVIEWS -->
        <div
          class="title"
        >
          {{ $t('quests.reviewsBig') }}
        </div>

        <div
          class="tab__container"
        >
          <ReviewsTab />
        </div>
        <div>
          <div class="title">
            {{ $t('quests.activeQuests') }}
          </div>
          <Card />
        </div>
        <div
          class="button"
        >
          <nuxt-link
            v-if="selected === 1"
            class="button__more"
            to="/profile"
          >
            {{ $t('meta.showAllReviews') }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ReviewsTab from '~/components/app/Pages/Profile/Tabs/Reviews';
import UserInfo from '~/components/app/Pages/Common/UserInfoOther';
import UserStatistic from '~/components/app/Panels/UserStatistic';
import Card from '~/components/app/Cards/QuestCard';
import modals from '~/store/modals/modals';

export default {
  name: 'Index',
  components: {
    ReviewsTab,
    UserInfo,
    UserStatistic,
    Card,
  },
  data() {
    return {
      selected: 1,
    };
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
    }),
    cardLevelClass(idx) {
      const { cards } = this;
      return [
        { card__level_reliable: cards[idx].level.code === 2 },
        { card__level_checked: cards[idx].level.code === 3 },
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
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

.main-section {
  &_white {
    background-color: $white;
  }
}
.main-container {
  width: 1180px;
  margin: 0 auto;
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
