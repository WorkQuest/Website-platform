<template>
  <div
    class="reviews-grid reviews-grid__reviews-item"
    data-selector="COMPONENT-REVIEWS-TAB"
  >
    <div
      v-for="(reviewData, i) in object.reviews"
      :key="i"
      class="reviews-item"
    >
      <div class="reviews-item__header">
        <div class="reviews-item__user-data">
          <div class="reviews-item__avatar">
            <img
              class="reviews-item__img"
              :src="initAvatar(reviewData.fromUser)"
              alt=""
              loading="lazy"
              :data-selector="`ACTION-BTN-GO-TO-REVIEWER-PROFILE-${i}`"
              @click="goToProfile(reviewData.fromUser.id)"
            >
          </div>
          <div class="name__container">
            <div
              class="card-subtitle__name"
              :data-selector="`ACTION-BTN-GO-TO-REVIEWER-PROFILE-${i}`"
              @click="goToProfile(reviewData.fromUser.id)"
            >
              {{ CropTxt(reviewData.fromUser.firstName, 10) }} {{ CropTxt(reviewData.fromUser.lastName, 5) }}
            </div>
            <div class="card-subtitle_green">
              {{ $t('role.worker') }}
            </div>
          </div>
        </div>
        <div class="reviews-item__rating-block">
          <div class="rating">
            <div
              v-for="(star,idx) in 5"
              :key="idx"
              :data-selector="`STAR-RATING-STAR-${idx}`"
              class="star"
              :class="initStarClass(star, reviewData.mark)"
            />
          </div>
          <div class="rating-mark">
            {{ reviewData.mark }}
          </div>
        </div>
      </div>
      <div class="reviews-item__subheader">
        <div class="card-subtitle">
          {{ $t('quests.questBig') }}
        </div>
        <div class="card-subtitle__title">
          {{ reviewData.quest.title }}
        </div>
      </div>
      <div class="card-subtitle__description">
        {{ CropTxt(reviewData.message, 120) }}
      </div>

      <div class="reviews-item__rating">
        {{ reviewData.reviewerRating }}
      </div>
      <div class="reviews-item__btn-read-container">
        <base-btn
          class="reviews-item__btn-read"
          mode="borderless-right"
          :data-selector="`SHOW-REVIEW-DETAILS-${i}`"
          @click="showReviewDetails(reviewData)"
        >
          {{ $t('quests.readCompletely') }}
          <template v-slot:right>
            <span class="icon-short_right" />
          </template>
        </base-btn>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { images } from '~/utils/images';
import { Path } from '~/utils/enums';

export default {
  name: 'ReviewsTab',
  props: {
    object: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      reviewMark: 0,
      userStars: [],
      allStars: [],
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
    }),
  },
  methods: {
    goToProfile(id) {
      this.$router.push(`${Path.PROFILE}/${id}`);
    },
    initStarClass(star, reviewMark) {
      const a = this.Floor(star - reviewMark, 2);
      return [
        { star__full: star <= reviewMark },
        { star__half: (a >= 0.3 && a <= 0.7) },
      ];
    },
    initAvatar(userData) {
      return userData?.avatar?.url || images.EMPTY_AVATAR;
    },
    showReviewDetails(data) {
      this.ShowModal({
        key: modals.reviewDetails,
        title: data.quest.title,
        userAvatar: this.initAvatar(data.fromUser),
        userFullName: `${data.fromUser.firstName} ${data.fromUser.lastName}`,
        reviewMark: data.mark,
        reviewMessage: data.message,
        questTitle: data.quest.title,
        assignedWorkerId: data.quest.assignedWorkerId,
        employerId: data.quest.userId,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    font-size: 20px;
    color: $black800;
    transition: 0.3s color;
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
  &__description {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
.name {
  &__container {
    cursor: pointer;
  }
}
.icon {
  font-size: 20px;
  cursor: pointer;
  &-short_right:before {
    @extend .icon;
    content: "\ea6e";
    color: #0083C7;
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
.styles {
  &__flex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
}
.reviews-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  width: 100%;
}
.reviews-item {
  min-width: 0;
  background-color: #fff;
  border-radius: 6px;
  padding: 20px 20px 10px;
  position: relative;
  transition: .5s;
  border: 1px solid $white;
  &:hover {
    border: 1px solid $black100;
  }
  &__btn-read {
    width: 151px;
  }
  &__btn-read-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  &__header {
    @extend .styles__flex;
    justify-content: space-between;
  }
  &__img {
    max-width: 40px;
    max-height: 40px;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  &__rating-block, &__user-data {
    grid-gap: 10px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }
  &__avatar {
    cursor: pointer;
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

@include _991 {
  .reviews-grid {
    grid-template-columns: auto;
  }
}
@include _575 {
  .reviews-item {
    &__header {
      align-items: flex-start;
    }
  }
  .reviews-grid {
    .reviews-item .reviews-item__header {
      flex-direction: column;
    }
  }
  .reviews-item {
    .name {
      margin-top: 10px;
    }
  }
}
@include _350 {
  .reviews-item {
    &__header {
      overflow: hidden;
    }
  }
}
</style>
