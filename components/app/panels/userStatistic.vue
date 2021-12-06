<template>
  <div>
    <div
      class="data-grid"
    >
      <div class="data-item">
        <div class="card-title">
          {{ $t('quests.completedQuests') }}
        </div>
        <div class="number">
          {{ reviewData.completedQuests }}
        </div>
        <div class="card-subtitle">
          {{ $t('quests.oneTime') }}
        </div>
      </div>
      <div class="data-item">
        <div class="card-title">
          {{ $t('quests.openedQuests') }}
        </div>
        <div class="number">
          {{ reviewData.openedQuests }}
        </div>
        <!--        <div-->
        <!--          class="card-subtitle"-->
        <!--        >-->
        <!--          {{ $t('quests.showAll') }}-->
        <!--        </div>-->
      </div>
      <!--      <div class="data-item">-->
      <!--        <div class="card-title">-->
      <!--          {{ $t('quests.completedQuests') }}-->
      <!--        </div>-->
      <!--        <div class="number">-->
      <!--          {{ questData.completedQuestsFullTime }}-->
      <!--        </div>-->
      <!--        <div class="card-subtitle">-->
      <!--          {{ $t('quests.fullTime') }}-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="data-item">
        <div class="card-title">
          {{ $t('quests.averageRating') }}
        </div>
        <div class="number number__rating">
          {{ reviewData.averageMark }}
        </div>
        <div class="card-subtitle">
          {{ $t('quests.fromBig') }} {{ reviewData.reviewCount }} {{ $t('quests.reviews') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'UserStatistic',
  props: {
    reviewData: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      questData: 'data/getQuest',
    }),
  },
};
</script>

<style lang="scss" scoped>

.number {
  font-weight: bold;
  font-size: 30px;
  line-height: 130%;
  color: #0083C7;
  margin: 9px 0;
  &_green {
    color: #00AA5B !important;
  }
  &__rating {
    color: #353C47;
    background-image: url("data:image/svg+xml,%3Csvg width='28' height='26' viewBox='0 0 28 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a             %3Cpath d='M14 0.5L18.1145 8.83688L27.3148 10.1738L20.6574 16.6631L22.229 25.8262L14 21.5L5.77101 25.8262L7.3426 16.6631L0.685208 10.1738L9.8855 8.83688L14 0.5Z' fill='%23E8D20D'/%3E\a             %3C/svg%3E                           \a             ");
    background-position: 55px 4px;
    background-repeat: no-repeat;
  }
}

.card {
  &-title {
    font-size: 16px;
    line-height: 130%;
    color: #1D2127;
  }
  &-subtitle {
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;
    color: #4C5767;
  }
}

.data-grid {
  padding: 20px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  .data-item {
    display: grid;
    border-radius: 6px;
    background-color: #fff;
    padding: 20px;
  }
  .data-item .number {
    @include text-simple;
    font-weight: bold;
    font-size: 30px;
    line-height: 130%;
    color: #0083C7;
    margin: 9px 0;
  }
  .data-item .number.-raiting {
    @include text-simple;
    color: #353C47;
    background-image: url("data:image/svg+xml,%3Csvg width='28' height='26' viewBox='0 0 28 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a             %3Cpath d='M14 0.5L18.1145 8.83688L27.3148 10.1738L20.6574 16.6631L22.229 25.8262L14 21.5L5.77101 25.8262L7.3426 16.6631L0.685208 10.1738L9.8855 8.83688L14 0.5Z' fill='%23E8D20D'/%3E\a             %3C/svg%3E                           \a             ");
    background-position: 55px 4px;
    background-repeat: no-repeat;
  }
}

@include _575 {
  .data-grid {
    grid-template-columns: repeat(2, auto);
  }
}

</style>
