<template>
  <ctm-modal-box
    :title="$t('modals.review')"
    class="messageSend"
  >
    <div class="ctm-modal__content">
      <div class="messageSend">
        <div class="messageSend__content">
          <div class="reviews-item">
            <div class="reviews-item__header">
              <div class="reviews-item__user-data">
                <div class="reviews-item__avatar">
                  <img
                    class="reviews-item__img"
                    :src="options.userAvatar"
                    alt=""
                  >
                </div>
                <div class="name__container">
                  <div class="card-subtitle__name">
                    {{ options.userFullName }}
                  </div>
                  <div class="card-subtitle_green">
                    {{ $t('role.worker') }}
                  </div>
                </div>
              </div>
              <div class="reviews-item__rating-block">
                <div class="rating">
                  <div
                    v-for="(star, key) in initStars(options.reviewMark)"
                    :key="key"
                    class="star"
                    :class="star ? `star${star}` : star"
                  />
                </div>
                <div class="rating-mark">
                  {{ options.reviewMark }}
                </div>
              </div>
            </div>
            <div class="reviews-item__subheader">
              <div class="card-subtitle">
                {{ $t('quests.questBig') }}
              </div>
              <div class="card-subtitle__title">
                {{ options.questTitle }}
              </div>
            </div>
            <div class="description">
              {{ options.reviewMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'ModalReviewDetails',
  data() {
    return {
      review: {
        reviewerName: 'Edward Cooper',
        reviewerRating: '4.00',
        questName: 'SPA saloon design',
        reviewDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facilisis nunc tincidunt nec, vel malesuada risus tempor massa. Turpis amet, amet vitae integer molestie pretium purus nec. Habitasse ipsum sed dictumst elementum purus amet placerat orci, nulla. Arcu, vel enim ultricies pellentesque ac libero fermentum pulvinar. Pretium at tellus porta nulla tortor pellentesque. Facilisi ut posuere mi eget euismod condimentum massa varius. Eu at egestas justo nunc mauris integer velit sit.\n'
          + 'Tristique mattis faucibus nunc enim malesuada suspendisse. Feugiat etiam ornare fermentum at. Enim ultricies etiam et aliquam, ac enim nisi cras mattis. Neque, id faucibus purus in in erat a. Nunc urna, aliquet facilisis turpis morbi. Nibh vel sit nisi consequat mattis egestas ac est at. Sit tortor fermentum vestibulum auctor diam nullam fringilla mi ac. Pretium, sed euismod vestibulum non enim arcu. Massa aenean libero, vestibulum in ut risus, tincidunt est.',
      },
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    initStars(mark) {
      let specialNumber = 0;
      const starArray = [];
      for (let i = 0; i < 5; i += 1) {
        if (mark > i) {
          starArray.push('__full');
        } else {
          specialNumber = mark - (i);
          if ((specialNumber >= 0.3 && specialNumber <= 0.7) && !this.userStars.includes('__half')) {
            starArray.push('__half');
          } else {
            starArray.push('');
          }
        }
      }
      return starArray;
    },
    hide() {
      this.CloseModal();
    },
    showProfile() {
      this.$router.push('/show-profile');
    },
    success() {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/success.svg'),
        title: this.$t('modals.success'),
        subtitle: this.$t('modals.SMSVerConnected'),
      });
    },
    nextStep() {
      // eslint-disable-next-line no-plusplus
      this.step++;
    },
  },
};
</script>

<style lang="scss" scoped>
.ctm-modal {
  @include modalKit;
}

.styles {
  &__flex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
}

.card-subtitle {
  font-weight: 500;
  font-size: 12px;
  color: $black600;
  &_green {
    @include text-simple;
    font-weight: 400;
    font-size: 12px;
    color: $green;
  }
  &__name {
    @include text-simple;
    font-weight: 500;
    font-size: 20px;
    color: $black800;
  }
  &__title {
    @include text-simple;
    margin: 0 0 0 10px;
    font-weight: 400;
    font-size: 12px;
    color: $black500;
  }
}
.rating {
  height: 20px;
  display: flex;
  margin-top: 2px;
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
.reviews-item {
  width: 100%;
  background-color: #fff;
  border-radius: 6px;
  position: relative;
  &__rating-block, &__user-data {
    grid-gap: 10px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }
  &__img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
  &__header {
    @extend .styles__flex;
    justify-content: space-between;
  }
  &__avatar {
    margin-right: 15px;
  }
  &__subheader {
    @extend .styles__flex;
    margin: 15px 0;
    display: flex;
    align-items: baseline;
    height: 20px;
  }
  &__rating {
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: #4C5767;
    padding-left: 133px;
    position: absolute;
    top: 20px;
    right: 20px;
    background-image: url("data:image/svg+xml,%3Csvg width='120' height='21' viewBox='0 0 120 21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E\a           %3Cpath d='M10 0.5L12.9389 6.45492L19.5106 7.40983L14.7553 12.0451L15.8779 18.5902L10 15.5L4.12215 18.5902L5.24472 12.0451L0.489435 7.40983L7.06107 6.45492L10 0.5Z' fill='%23E8D20D'/%3E\a           %3Cpath d='M35 0.5L37.9389 6.45492L44.5106 7.40983L39.7553 12.0451L40.8779 18.5902L35 15.5L29.1221 18.5902L30.2447 12.0451L25.4894 7.40983L32.0611 6.45492L35 0.5Z' fill='%23E8D20D'/%3E\a           %3Cpath d='M60 0.5L62.9389 6.45492L69.5106 7.40983L64.7553 12.0451L65.8779 18.5902L60 15.5L54.1221 18.5902L55.2447 12.0451L50.4894 7.40983L57.0611 6.45492L60 0.5Z' fill='%23E8D20D'/%3E\a           %3Cpath d='M85 0.5L87.9389 6.45492L94.5106 7.40983L89.7553 12.0451L90.8779 18.5902L85 15.5L79.1221 18.5902L80.2447 12.0451L75.4894 7.40983L82.0611 6.45492L85 0.5Z' fill='%23E8D20D'/%3E\a           %3Cpath d='M110 0.5L112.939 6.45492L119.511 7.40983L114.755 12.0451L115.878 18.5902L110 15.5L104.122 18.5902L105.245 12.0451L100.489 7.40983L107.061 6.45492L110 0.5Z' fill='%23E9EDF2'/%3E\a           %3C/svg%3E                               \a           ");
    background-position: 0 0;
    background-repeat: no-repeat;
  }
}

.message {
  &__action {
    width: 100%;
  }
}

.messageSend {
  max-width: 600px !important;
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    grid-gap: 10px;
  }
  &__action {
    margin-top: 10px;
    width: 100%;
  }
}
</style>
