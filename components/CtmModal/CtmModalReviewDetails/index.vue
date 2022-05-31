<template>
  <ctm-modal-box
    :title="$tc('modals.titles.review')"
  >
    <div class="ctm-modal__content content">
      <div class="content__review review">
        <div class="review__block">
          <div class="review__header">
            <div
              class="review__user-data user-data"
              @click="toUserProfile(options)"
            >
              <div class="user-data__avatar">
                <img
                  class="user-data__img"
                  :src="options.userAvatar ? options.userAvatar: $options.images.EMPTY_AVATAR"
                  alt=""
                >
              </div>
              <div class="user-data__text">
                <div class="user-data__name">
                  {{ options.userFullName }}
                </div>
                <div class="user-data__subtitle">
                  {{ $t('role.worker') }}
                </div>
              </div>
            </div>
            <div class="review__rating-block">
              <div class="rating">
                <div
                  v-for="(star,idx) in 5"
                  :key="idx"
                  class="rating__star"
                  :class="initStarClass(star)"
                />
              </div>
              <div class="rating__mark">
                {{ options.reviewMark }}
              </div>
            </div>
          </div>
          <div class="review__subheader subheader">
            <div class="subheader__title subheader__title_dark">
              {{ $t('quests.questBig') }}
            </div>
            <div class="subheader__title subheader__title_grey">
              {{ options.questTitle }}
            </div>
          </div>
          <div class="review__description">
            {{ options.reviewMessage }}
          </div>
        </div>
      </div>
    </div>
  </ctm-modal-box>
</template>

<script>
import { mapGetters } from 'vuex';
import { Path, UserRole } from '~/utils/enums';
import { images } from '~/utils/images';

export default {
  name: 'ModalReviewDetails',
  images,
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
      userRole: 'user/getUserRole',
    }),
  },
  methods: {
    toUserProfile(options) {
      this.$router.push(`${Path.PROFILE}/${this.userRole === UserRole.EMPLOYER ? options?.assignedWorkerId : options?.employerId}`);
      this.CloseModal();
    },
    initStarClass(star) {
      const { reviewMark } = this.options;
      const a = this.Floor(star - reviewMark, 2);
      return [
        { rating__star_full: star <= reviewMark },
        { rating__star_half: (a >= 0.3 && a <= 0.7) },
      ];
    },
    success() {
      this.ShowModalSuccess({ title: this.$t('meta.success'), subtitle: this.$t('modals.SMSVerConnected') });
    },
    nextStep() {
      this.step += 1;
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

.user-data {
  font-weight: 500;
  font-size: 12px;
  color: $black600;
  &__img {
    max-width: 50px;
    max-height: 50px;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
  &__subtitle {
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
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
    cursor: pointer;
    transition: .3s;
    &:hover {
      color: $blue;
    }
  }
  &__title {
    @include text-simple;
    margin: 0 0 0 10px;
    font-weight: 400;
    font-size: 12px;
    color: $black500;
  }
  &__avatar {
    margin-right: 15px;
    cursor: pointer;
  }
  &__text {
    width: 200px;
  }
}

.content {
  max-width: 600px !important;
  &__review {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 10px;
  }
  &__action {
    margin-top: 10px;
    width: 100%;
  }
}

.review {
  width: 100%;
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
.rating {
  height: 20px;
  display: flex;
  margin-top: 2px;
  width: 142px;
  &__star {
    width: inherit;
    background-image: url('~assets/img/ui/star-empty.svg');
    background-repeat: no-repeat;
    background-position: center;
    &_half {
      background-image: url('~assets/img/ui/star-half.svg');
    }
    &_full {
      background-image: url('~assets/img/ui/star-small.svg');
    }
  }
}
.subheader {
  &__title {
    font-size: 12px;
    &_dark {
      font-weight: 500;
      color: #4C5767;
    }
    &_grey {
      margin: 0 0 0 10px;
      font-weight: 400;
      color: #7C838D;
    }
  }
}
@include _575() {
  .review {
    &__user-data {
      display: grid;
      grid-template-columns: 50px 280px;
    }
    &__header {
      flex-direction: column;
    }
  }
  .user-data {
    &__name, &__text {
      width: 100%;
    }
  }
}
@include _380() {
  .review {
    &__user-data {
      grid-template-columns: 50px 200px;
    }
  }
}
</style>
