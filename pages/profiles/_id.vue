<template>
  <div>
    <div
      class="main-section main-section_white"
    >
      <div class="main-container">
        <UserInfo />
      </div>
    </div>
    <section class="information-section">
      <div class="main-container">
        <!-- DATA -->
        <UserStatistic />

        <!-- REVIEWS -->
        <div class="title">
          {{ $t('quests.reviewsBig') }}
        </div>
        <Reviews />
        <div class="button__container">
          <nuxt-link
            class="button__more"
            to="/profile"
          >
            {{ $t('meta.showAllReviews') }}
          </nuxt-link>
        </div>

        <!-- ACTIVE -->
        <QuestCard />
      </div>
    </section>
  </div>
</template>

<script>
import UserInfo from '~/components/app/Pages/Common/UserInfo';
import UserStatistic from '~/components/app/Panels/UserStatistic';
import Reviews from '~/components/app/Pages/Profile/Tabs/Reviews';
import QuestCard from '~/components/app/Cards/QuestCard';

export default {
  name: 'ProfileID',
  components: {
    UserInfo,
    UserStatistic,
    Reviews,
    QuestCard,
  },
  data() {
    return {};
  },
  computed: {},
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {},
};
</script>

<style lang="scss" scoped>

//TODO: Почистить стили

.title {
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 130%;
  color: #1D2127;
  margin: 0 0 20px 0;
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

.button {
  &__container {
    @extend .header;
    margin: 5px 0 0 0;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center
  }
  &__more {
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

@include _1199 {
  .quests {
    padding: 10px;
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
  .box__skills {
    grid-template-columns: repeat(4, auto);
    grid-gap: 20px;
  }
  .avatar__container {
    width: 50%;
  }
}
@include _991 {
  .quests {
    .limit__container {
      display: grid;
      grid-template-columns: auto;
    }
    &__content {
      grid-template-columns: 1fr;
    }
    .block {
      &__img {
        height: 100%;
        width: 100%;
        img {
          border-radius: 6px;
        }
      }
    }
  }
  .box {
    grid-template-columns: 1fr;
    .data-grid {
      grid-template-columns: repeat(2, auto);
    }
  }
  .data-grid {
    grid-template-columns: repeat(2, auto);
  }
  .information-grid {
    .col .contacts {
      display: grid;
      grid-template-columns: auto 1fr;
    }
  }
  .information-section {
    .reviews-grid {
      grid-template-columns: auto;
    }
  }
  .avatar__container {
    text-align: center;
    width: 100%;
  }
}
@include _767 {
  .quests {
    .limit__container {
      display: grid;
      grid-template-columns: auto;
    }
    .block {
      grid-template-columns: auto;
      &__img {
        max-width: 100%;
        img {
          height: 200px;
          object-fit: cover;
          width: 100%;
        }
      }
    }
  }
  .quests {
    &__tools {
      padding: 0;
    }
  }
  .tools {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    justify-content: initial;
    &__left {
      grid-template-columns: repeat(2, 1fr);
      grid-column: 1/3;
      grid-row: 2/3;
    }
    &__right {
      min-width: 100%;
      grid-column: 1/3;
      grid-row: 1/2;
    }
  }
  .dd {
    grid-column: 1/3;
  }
  .search {
    grid-template-columns: auto auto;
    padding: 0 10px;
    grid-gap: 10px;
    &__toggle, &__dd {
      display: none;
    }
    &__actions {
      border: none;
    }
  }
  .main-section .information-grid .col .contacts {
    display: grid;
    grid-template-columns: auto;
  }
  .quests {
    .limit__container {
      display: grid;
      grid-template-columns: auto;
    }
    .block {
      grid-template-columns: auto;
      margin-bottom:20px;
      &__img {
        max-width: 100%;
        img {
          border-radius: 6px;
          height: 200px;
          object-fit: cover;
          width: 100%;
        }
      }
    }
  }
  .quests {
    &__tools {
      padding: 0;
    }
  }
  .active-quests-grid .active-quests-item {
    grid-template-columns: auto;
    .active-quests-img {
      border-radius: 6px;
      height: 200px;
      object-fit: cover;
      width: 100%;
    }
  }
}
@include _575 {
  .block {
    &__actions {
      display: grid;
      grid-template-columns: 1fr;
    }
    &__btn {
      margin-top: 10px;
      padding: 0;
    }
  }
  .information-grid {
    display: flex;
  }
  .footer {
    .details {
      width: 100%;
    }
  }
  .quests {
    .block__actions {
      align-items: flex-start;
      justify-content: space-between;
      flex-direction: column;
    }
  }
  .header {
    align-items: flex-start;
  }
  .active-quests-grid {
    margin-top: 20px;
  }
  .quests__content {
    grid-template-columns: repeat(2, auto);
  }
  .reviews-grid {
    .reviews-item .header {
      flex-direction: column;
    }
  }
  .information-grid {
    flex-direction: column;
    align-items: center;
    .col {
      margin-bottom: 10px;
    }
  }
  .reviews-item {
    .name {
      margin-top: 10px;
    }
  }
  .box__profile {
    flex-direction: column;
    align-items: center;
  }
  .portfolio__items {
    grid-template-columns: repeat(2, auto);
    margin-bottom: 20px;
  }
}

@include _480 {
  .quests {
    &__top {
      min-height: 125px;
    }
    .block {
      &__right {
        padding: 10px;
      }
      &__amount_green {
        font-size: 18px;
      }
    }
  }
  .dd__btn {
    justify-content: space-around;
  }
  .search {
    display: flex;
    &__actions {
      width: 50%;
    }
  }
  .base-btn {
    justify-content: space-between;
  }
}

@include _380 {
  .quests {
    .block {
      &__amount_green {
        font-size: 16px;
      }
    }
  }
  .search {
    &__actions {
      width: 60%;
      padding: 10px;
    }
  }
}

</style>
