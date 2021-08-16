<template>
  <div>
    <div
      class="main-section main-section_white"
    >
      <div class="main-container">
        <userInfo selected="1" />
      </div>
    </div>

    <div class="information-section">
      <div class="main-container">
        <userStatistic />

        <div class="title">
          {{ $t('quests.reviewsBig') }}
        </div>
        <reviews />

        <div class="title">
          {{ $t('quests.activeQuests') }}
        </div>
        <div class="button__container">
          <nuxt-link
            class="button__more"
            to="/company"
          >
            {{ $t('meta.showAllReviews') }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userInfo from '~/components/app/pages/common/userInfo';
import reviews from '~/components/app/pages/profile/tabs/reviews';
import userStatistic from '~/components/app/panels/userStatistic';

export default {
  name: 'Index',
  components: {
    reviews, userInfo, userStatistic,
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    getPriority(index) {
      const priority = {
        0: this.$t('priority.low'),
        1: this.$t('priority.normal'),
        2: this.$t('priority.urgent'),
      };
      return priority[index] || 'None';
    },
    getPriorityClass(index) {
      const priority = {
        0: 'block__priority_low',
        1: 'block__priority_normal',
        2: 'block__priority_urgent',
      };
      return priority[index] || '';
    },
  },
};
</script>

<style lang="scss" scoped>

.styles {
  &__full {
    width: 100%;
    height: 100%;
  }
  &__between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__flex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
  &__center {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
}

.button {
  @extend .styles__flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
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
    margin: 20px 0 0 0;
  }
  &__container {
    display: flex;
    justify-content: center;
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

.title {
  @include text-simple;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 130%;
  color: $black800;
  margin: 20px 0 20px 0;
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
