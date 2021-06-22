<template>
  <div class="reviews-grid">
    <span
      v-for="(item, i) in reviews"
      :key="i"
    >
      <div class="reviews-item">
        <div class="header">
          <div class="avatar">
            <img
              src="~/assets/img/temp/avatar-medium.jpg"
              alt=""
            >
          </div>
          <div class="name__container">
            <div class="card-subtitle__name">
              {{ item.reviewerName }}
            </div>
            <div class="card-subtitle_green">
              {{ $t('role.worker') }}
            </div>
          </div>
        </div>
        <div class="subheader">
          <div class="card-subtitle">
            {{ $t('quests.questBig') }}
          </div>
          <div class="card-subtitle__title">
            {{ item.questName }}
          </div>
        </div>
        <div class="description">
          {{ item.reviewDesc }}
        </div>

        <div class="rating">
          {{ item.reviewerRating }}
        </div>
        <base-btn
          mode="borderless-right"
          @click="showCompany()"
        >
          {{ $t('quests.readCompletely') }}
          <template v-slot:right>
            <span class="icon-short_right" />
          </template>
        </base-btn>
      </div>
    </span>
  </div>
</template>

<script>
export default {
  name: 'ReviewsTab',
  data() {
    return {
      reviews: [
        {
          reviewerName: 'Edward Cooper',
          reviewerRating: '4.00',
          questName: 'SPA saloon design',
          reviewDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum ...',
        },
        {
          reviewerName: 'Edward Cooper',
          reviewerRating: '4.00',
          questName: 'SPA saloon design',
          reviewDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum ...',
        },
        {
          reviewerName: 'Edward Cooper',
          reviewerRating: '4.00',
          questName: 'SPA saloon design',
          reviewDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum ...',
        },
        {
          reviewerName: 'Edward Cooper',
          reviewerRating: '4.00',
          questName: 'SPA saloon design',
          reviewDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum ...',
        },
      ],
    };
  },
  methods: {
    showCompany() {
      this.$router.push('/company');
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

.icon {
  font-size: 20px;
  cursor: pointer;
  &-short_right:before {
    @extend .icon;
    content: "\ea6e";
    color: #0083C7;
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
  padding-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  .reviews-item {
    width: 100%;
    background-color: #fff;
    border-radius: 6px;
    padding: 20px 20px 10px;
    position: relative;
  }
  .reviews-item .header {
    @extend .styles__flex;
  }
  .reviews-item .header .avatar {
    margin-right: 15px;
  }
  .reviews-item .subheader {
    @extend .styles__flex;
    margin: 15px 0;
    display: flex;
    align-items: baseline;
    height: 20px;
  }
  .reviews-item .rating {
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
  .header {
    align-items: flex-start;
  }
  .reviews-grid {
    .reviews-item .header {
      flex-direction: column;
    }
  }
  .reviews-item {
    .name {
      margin-top: 10px;
    }
  }
}
</style>
