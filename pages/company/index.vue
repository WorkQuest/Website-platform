<template>
  <div>
    <div
      class="main-section main-section_white"
    >
      <div class="main-container">
        <UserInfo />
      </div>
    </div>

    <div class="information-section">
      <div class="main-container">
        <!-- DATA -->
        <div class="data-grid">
          <div class="data-item">
            <div class="card-title">
              {{ $t('quests.activeQuests') }}
            </div>
            <div class="number number_green">
              {{ payload.quests.activeQuests }}
            </div>
            <nuxt-link
              class="card-subtitle card-subtitle_green"
              to="/company"
            >
              {{ $t('quests.showAllActiveQuests') }}
            </nuxt-link>
          </div>
          <div class="data-item">
            <div class="card-title">
              {{ $t('quests.completedQuests') }}
            </div>
            <div class="number">
              {{ payload.quests.completedQuestsOneTime }}
            </div>
            <div class="card-subtitle">
              {{ $t('quests.oneTime') }}
            </div>
          </div>
          <div class="data-item">
            <div class="card-title">
              {{ $t('quests.completedQuests') }}
            </div>
            <div class="number">
              {{ payload.quests.completedQuestsFullTime }}
            </div>
            <div class="card-subtitle">
              {{ $t('quests.fullTime') }}
            </div>
          </div>
          <div class="data-item">
            <div class="card-title">
              {{ $t('quests.averageRating') }}
            </div>
            <div class="number number__rating">
              {{ payload.quests.averageRating }}
            </div>
            <div class="card-subtitle">
              {{ $t('quests.fromBig') }} {{ payload.quests.reviewCount }} {{ $t('quests.reviews') }}
            </div>
          </div>
        </div>

        <!-- REVIEWS -->
        <div class="title">
          {{ $t('quests.reviewsBig') }}
        </div>
        <Reviews />

        <!-- ACTIVE -->
        <div class="quest__card">
          <QuestCard />
          <div class="button">
            <nuxt-link
              class="more-button"
              to="/company"
            >
              {{ $t('meta.showAllReviews') }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserInfo from '~/components/app/Pages/Common/UserInfo';
import Reviews from '~/components/app/Pages/Profile/Tabs/Reviews';
import QuestCard from '~/components/app/Cards/QuestCard';

export default {
  name: 'Index',
  components: {
    Reviews, UserInfo, QuestCard,
  },
  data() {
    return {
      payload: {
        quests: {
          activeQuests: '12',
          completedQuestsOneTime: '12',
          completedQuestsFullTime: '2',
          averageRating: '4.5',
          reviewCount: '23',
        },
      },
    };
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

//TODO: Удалить лишние стили Review

.card-subtitle {
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  color: #4C5767;
  &_green {
    color: #00AA5B !important;
  }
}
.btn {
  &__common {
    font-size: 16px;
    line-height: 130%;
    text-decoration: none;
    background-repeat: no-repeat;
    color: #0083C7;
  }
}
.simple-button {
  @extend .btn__common;
  position: absolute;
  bottom: 27px;
  right: 27px;
  padding-right: 37px;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a     %3Cpath d='M16.17 13L12.59 16.59L14 18L20 12L14 6L12.59 7.41L16.17 11H4V13H16.17Z' fill='%230083C7'/%3E\a     %3C/svg%3E                                     \a     ");
  background-position: 100% -1px;
}
.button {
  display: flex;
  justify-content: center;
}
.button .more-button {
  @extend .btn__common;
  display: inline-block;
  border: 1px solid rgba(0, 131, 199, 0.1);
  border-radius: 6px;
  padding: 13px 67px 13px 28px;
  background-image: url("data:image/svg+xml,%3Csvg width='11' height='6' viewBox='0 0 11 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a           %3Cpath d='M5.5 5.5L10.5 0.5L0.5 0.5L5.5 5.5Z' fill='%230083C7'/%3E\a           %3C/svg%3E                                                          \a           ");
  background-position: 82% 21px;
}

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

.block {
  background: #FFFFFF;
  border-radius: 6px;
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 230px;

  &__img {
    max-width: 240px;
  }

  &__locate {
    display: grid;
    grid-template-columns: 20px 1fr;
    grid-gap: 5px;
    align-items: center;

    span::before {
      font-size: 20px;
      color: $black500;
    }
  }

  &__status {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 15px;
  }

  &__amount {
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 130%;
    color: #00AA5B;
    text-transform: uppercase;
  }

  &__priority {
    @include text-simple;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    font-size: 12px;
    line-height: 130%;
    height: 24px;
    padding: 0 5px;

    &_low {
      background: rgba(34, 204, 20, 0.1);
      color: #22CC14;
    }

    &_urgent {
      background: rgba(223, 51, 51, 0.1);
      color: #DF3333;
    }

    &_normal {
      background: rgba(232, 210, 13, 0.1);
      color: #E8D20D;
    }
  }

  &__actions {
    @extend .styles__between;
  }

  &__right {
    padding: 20px 20px 20px 30px;
    display: grid;
    grid-template-columns: auto;
    grid-gap: 10px;
  }

  &__head {
    @extend .styles__between;
  }

  &__icon {
    &_fav {
      cursor: pointer;
    }
  }

  &__btn {
    @extend .styles__between;
    padding: 0 10px;
    min-width: 146px;
    height: 34px;
    background: transparent;

    span::before {
      font-size: 24px;
      color: $blue;
    }
  }

  &__text {
    @include text-simple;

    &_details {
      font-size: 16px;
      line-height: 130%;
      color: $blue;
    }

    &_desc {
      font-size: 16px;
      line-height: 130%;
      color: $black700;
    }

    &_blue {
      font-weight: 500;
      font-size: 18px;
      line-height: 130%;
      color: $blue;
    }

    &_title {
      font-weight: 500;
      font-size: 16px;
      line-height: 130%;
      color: $black800;
    }

    &_locate {
      font-size: 14px;
      line-height: 130%;
      color: #7C838D;
    }

    &_grey {
      font-size: 16px;
      line-height: 130%;
      color: #7C838D;
    }
  }
}
.quest{
  &__spec {
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    color: $black800;
    margin: 0 0 0 0;
  }
  &__title {
    @include text-simple;
    font-style: normal;
    font-weight: 500;
    font-size: 30px;
    color: $black800;
    margin: 0 0 10px 0;
  }
  &__description {
    @include text-simple;
    font-style: normal;
    color: $black700;
    font-weight: 400;
    font-size: 16px;
    line-height: 130%;
    /* or 21px */
  }
  &__location {
    @include text-simple;
    color: $black700;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    display: flex;
    align-items: center;
    flex-direction: row;
  }
  &__count {
    @include text-simple;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    color: $black400;
  }
  &__group {
    color:$black800;
    display: flex;
    flex-direction: row;
  }
}

.social {
  &__link {
    text-decoration: none;
  }
}

.icon {
  font-size: 20px;
  cursor: pointer;
  &-LinkedIn::before {
    @extend .icon;
    color: #57A6EF;
  }
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
.info-grid {
  &__avatar {
    max-width: 142px;
    max-height: 142px;
    width: 100%;
    height: 100%;
  }
  &__col {
    &_left {
      max-width: 157px;
      width: 100%;
      padding: 0 15px 0 0;
    }
  }
}
.rating {
  padding: 0 15px 0 0;
}

.col {
  &__header {
    @extend .styles__flex;
    @extend .styles__center;
}
  &__main-header {
    @extend .styles__flex;
    @extend .styles__center;
  }
}

.styles {
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
.background {
  &__common {
    background-repeat: no-repeat;
    background-position: 0 -1px;
    padding-left: 25px;
  }
}

.main-header {
  @extend .styles__flex;
  @extend .styles__center;
}

.header {
  @extend .main-header;
  .col {
    @extend .header;
    @extend .styles__center;
  }
  .logo {
    @extend .main-header;
    height: 30px;
    width: 173px;
    background-image: url("data:image/svg+xml,%3Csvg width='173' height='30' viewBox='0 0 173 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a           %3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M22.8028 15C22.8028 19.6024 19.1567 23.3333 14.6589 23.3333C10.1612 23.3333 6.51509 19.6024 6.51509 15C6.51509 10.3976 10.1612 6.66667 14.6589 6.66667C19.1567 6.66667 22.8028 10.3976 22.8028 15ZM19.5453 15C19.5453 17.7614 17.3576 20 14.6589 20C11.9603 20 9.77263 17.7614 9.77263 15C9.77263 12.2386 11.9603 10 14.6589 10C17.3576 10 19.5453 12.2386 19.5453 15Z' fill='url(%23paint0_linear)'/%3E\a           %3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 15C0 23.2843 6.56304 30 14.6589 30H31.4489L34.7065 26.6667H23.8735C24.5941 26.0699 25.2584 25.4047 25.8568 24.6806H36.6474L40 21.25H27.9887C28.8421 19.3474 29.3179 17.2305 29.3179 15C29.3179 6.71573 22.7549 0 14.6589 0C6.56304 0 0 6.71573 0 15ZM14.6589 26.6667C20.9558 26.6667 26.0604 21.4433 26.0604 15C26.0604 8.55668 20.9558 3.33333 14.6589 3.33333C8.36213 3.33333 3.25754 8.55668 3.25754 15C3.25754 21.4433 8.36213 26.6667 14.6589 26.6667Z' fill='url(%23paint1_linear)'/%3E\a           %3Cpath d='M50.2191 23H53.6658L56.843 12.0636H56.9737L60.1591 23H63.6058L68.392 6.27273H64.5288L61.7599 17.9197H61.6129L58.5664 6.27273H55.2585L52.2038 17.8952H52.065L49.2962 6.27273H45.4329L50.2191 23ZM74.5402 23.245C78.3463 23.245 80.7149 20.6396 80.7149 16.7763C80.7149 12.8885 78.3463 10.2912 74.5402 10.2912C70.7341 10.2912 68.3655 12.8885 68.3655 16.7763C68.3655 20.6396 70.7341 23.245 74.5402 23.245ZM74.5566 20.5497C72.8005 20.5497 71.9021 18.9407 71.9021 16.7518C71.9021 14.5629 72.8005 12.9457 74.5566 12.9457C76.2799 12.9457 77.1784 14.5629 77.1784 16.7518C77.1784 18.9407 76.2799 20.5497 74.5566 20.5497ZM82.9774 23H86.4568V15.9023C86.4568 14.3587 87.5839 13.2969 89.1194 13.2969C89.6013 13.2969 90.2629 13.3786 90.5896 13.4847V10.3974C90.2792 10.3239 89.8463 10.2749 89.4951 10.2749C88.0903 10.2749 86.9387 11.0916 86.4813 12.6435H86.3506V10.4545H82.9774V23ZM92.3885 23H95.8679V19.0142L96.8072 17.9442L100.229 23H104.305L99.4126 15.886L104.068 10.4545H100.074L96.0558 15.2163H95.8679V6.27273H92.3885V23ZM121.212 14.6364C121.212 9.16406 117.814 6.04403 113.379 6.04403C108.92 6.04403 105.547 9.16406 105.547 14.6364C105.547 20.0842 108.92 23.2287 113.379 23.2287C114.425 23.2287 115.413 23.0572 116.311 22.7141L117.659 24.3722H120.959L118.566 21.3665C120.199 19.9045 121.212 17.6175 121.212 14.6364ZM112.154 17.1847L114.294 20.0107C114.008 20.0678 113.698 20.1005 113.379 20.1005C110.806 20.1005 109.132 18.1811 109.132 14.6364C109.132 11.0916 110.806 9.17223 113.379 9.17223C115.944 9.17223 117.626 11.0916 117.626 14.6364C117.626 16.4577 117.177 17.8544 116.401 18.7773L115.16 17.1847H112.154ZM131.812 17.6584C131.82 19.3409 130.668 20.223 129.418 20.223C128.103 20.223 127.254 19.3001 127.246 17.8217V10.4545H123.766V18.4425C123.775 21.3746 125.49 23.1634 128.014 23.1634C129.9 23.1634 131.256 22.1914 131.82 20.7212H131.95V23H135.291V10.4545H131.812V17.6584ZM143.791 23.245C146.895 23.245 148.986 21.734 149.476 19.4062L146.258 19.1939C145.907 20.1495 145.008 20.6477 143.849 20.6477C142.109 20.6477 141.006 19.4961 141.006 17.6257V17.6175H149.55V16.6619C149.55 12.3984 146.969 10.2912 143.653 10.2912C139.961 10.2912 137.568 12.913 137.568 16.7844C137.568 20.7621 139.928 23.245 143.791 23.245ZM141.006 15.4613C141.08 14.032 142.166 12.8885 143.71 12.8885C145.221 12.8885 146.266 13.9666 146.274 15.4613H141.006ZM162.258 14.032C161.948 11.7205 160.086 10.2912 156.917 10.2912C153.707 10.2912 151.591 11.7777 151.6 14.1953C151.591 16.0739 152.776 17.2908 155.226 17.7809L157.399 18.2138C158.493 18.4343 158.991 18.8345 159.008 19.4634C158.991 20.2067 158.183 20.7376 156.966 20.7376C155.724 20.7376 154.899 20.2067 154.687 19.1857L151.265 19.3654C151.591 21.7667 153.633 23.245 156.958 23.245C160.208 23.245 162.536 21.587 162.544 19.1122C162.536 17.299 161.352 16.2127 158.918 15.7145L156.647 15.2571C155.479 15.0039 155.046 14.6037 155.055 13.9993C155.046 13.2479 155.896 12.7578 156.974 12.7578C158.183 12.7578 158.901 13.4194 159.073 14.228L162.258 14.032ZM171.408 10.4545H169.048V7.44886H165.568V10.4545H163.853V13.0682H165.568V19.6023C165.552 22.0607 167.226 23.2777 169.75 23.1715C170.649 23.1388 171.286 22.9592 171.637 22.8448L171.09 20.2557C170.918 20.2884 170.551 20.37 170.224 20.37C169.53 20.37 169.048 20.1087 169.048 19.1449V13.0682H171.408V10.4545Z' fill='%23353C47'/%3E\a           %3Cdefs%3E\a           %3ClinearGradient id='paint0_linear' x1='0' y1='0' x2='28.8' y2='38.4' gradientUnits='userSpaceOnUse'%3E\a           %3Cstop stop-color='%230083C7'/%3E\a           %3Cstop offset='1' stop-color='%2300AA5B'/%3E\a           %3C/linearGradient%3E\a           %3ClinearGradient id='paint1_linear' x1='0' y1='0' x2='28.8' y2='38.4' gradientUnits='userSpaceOnUse'%3E\a           %3Cstop stop-color='%230083C7'/%3E\a           %3Cstop offset='1' stop-color='%2300AA5B'/%3E\a           %3C/linearGradient%3E\a           %3C/defs%3E\a           %3C/svg%3E                   \a           ");
    background-position: 0 0;
    background-repeat: no-repeat;
    margin-right: 35px;
  }
  .navigation {
    @extend .header;
    @extend .styles__center;
  }
  a {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    text-decoration: none;
    color: #8D96A2;
    margin-right: 25px;
  }
  .instruments-btn {
    color: #8D96A2;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a             %3Cpath d='M5 5.5L10 0.5L0 0.5L5 5.5Z' fill='%238D96A2'/%3E\a             %3C/svg%3E                             \a             ");
    background-repeat: no-repeat;
    background-position: 100% 4px;
    padding-right: 24px;
    &:hover {
      cursor: pointer;
    }
  }
  .-btn:hover {
    cursor: pointer;
  }
  .language {
    text-transform: uppercase;
    color: #4C5767;
    font-size: 16px;
    line-height: 130%;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a           %3Cpath d='M5 5.5L10 0.5L0 0.5L5 5.5Z' fill='%238D96A2'/%3E\a           %3C/svg%3E                             \a           ");
    background-repeat: no-repeat;
    background-position: 100% 7px;
    padding-right: 24px;
    margin-right: 40px;
  }
  .communication {
    height: 24px;
    width: 24px;
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a           %3Cpath d='M3 21V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15C21 16.1046 20.1046 17 19 17H9C8.56713 16.9992 8.14582 17.1396 7.8 17.4L3 21ZM5 5V17L7.134 15.4C7.47964 15.1393 7.90107 14.9988 8.334 15H19V5H5Z' fill='%237C838D'/%3E\a           %3C/svg%3E                                             \a           ");
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 36px;
  }
  .notification {
    height: 24px;
    width: 24px;
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a           %3Cpath d='M12 22C10.8954 22 10 21.1046 10 20H14C14 21.1046 13.1046 22 12 22ZM20 19H4V17L6 16V10.5C6 7.038 7.421 4.793 10 4.18V2H13C12.3479 2.86394 11.9967 3.91762 12 5C12 5.25138 12.0187 5.50241 12.056 5.751H12C10.7799 5.67197 9.60301 6.21765 8.875 7.2C8.25255 8.18456 7.94714 9.33638 8 10.5V17H16V10.5C16 10.289 15.993 10.086 15.979 9.9C16.6405 10.0366 17.3226 10.039 17.985 9.907C17.996 10.118 18 10.319 18 10.507V16L20 17V19Z' fill='%237C838D'/%3E\a           %3Cpath d='M15.307 7.477C15.8055 7.81839 16.3958 8.00073 17 8C18.6568 8 20 6.65685 20 5C19.9998 3.5728 18.9942 2.34329 17.5954 2.06004C16.1966 1.77678 14.7919 2.5182 14.2365 3.8329C13.6811 5.1476 14.1288 6.67158 15.307 7.477Z' fill='%23DF3333'/%3E\a           %3C/svg%3E                                                      \a           ");
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 36px;
  }
  .menu {
    height: 24px;
    width: 24px;
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a           %3Cpath d='M21 18H3V16H21V18ZM21 13H3V11H21V13ZM21 8H3V6H21V8Z' fill='%237C838D'/%3E\a           %3C/svg%3E                                                              \a           ");
    background-repeat: no-repeat;
    background-position: center;
  }
}

.info {
  justify-content: initial !important;
}

.data-grid {
  padding: 20px 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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

.title {
  @include text-simple;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 130%;
  color: $black800;
  margin-bottom: 20px;
}

.description {
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 145%;
  color: #4C5767;
}

.card-title {
  font-size: 16px;
  line-height: 130%;
  color: #1D2127;
}

.card-subtitle {
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  color: #4C5767;
}

a:hover {
  opacity: 0.5;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}

.simple-button {
  font-size: 16px;
  line-height: 130%;
  color: #0083C7;
  position: absolute;
  bottom: 27px;
  right: 27px;
  padding-right: 37px;
  text-decoration: none;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a     %3Cpath d='M16.17 13L12.59 16.59L14 18L20 12L14 6L12.59 7.41L16.17 11H4V13H16.17Z' fill='%230083C7'/%3E\a     %3C/svg%3E                                     \a     ");
  background-position: 100% -1px;
  background-repeat: no-repeat;
  &:hover {
    background-color: #0083C7;
    opacity: 1;
    color: $white;
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a     %3Cpath d='M16.17 13L12.59 16.59L14 18L20 12L14 6L12.59 7.41L16.17 11H4V13H16.17Z' fill='white'/%3E\a     %3C/svg%3E                                     \a     ");

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
  .box__skills {
    grid-template-columns: repeat(4, auto);
    grid-gap: 20px;
  }
  .avatar__container {
    width: 50%;
  }
}
@include _991 {
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
  .details {
    width: 100%;
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
</style>
