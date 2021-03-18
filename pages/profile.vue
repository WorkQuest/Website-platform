<template>
  <div class="profile">
    <Header
      :title="'John Queston'"
      :sub-title="'Last sin 23 min.'"
      :avatar="avatar"
    />
    <div
      class="profile__container"
      :class="{'profile__container_sidebar': isShowSidebar}"
    >
      <div class="profile__main">
        <div class="profile__box">
          <div class="profile__map">
            <GMap
              ref="gMap"
              language="en"
              :center="{lat: locations[0].lat, lng: locations[0].lng}"
              :zoom="6"
            />
          </div>
          <div class="profile__info">
            <div class="info">
              <div class="info__row">
                <div class="info__locate locate">
                  <div class="locate">
                    <div class="locate__body">
                      <div class="locate__icon">
                        <img
                          src="~/assets/img/ui/compass.png"
                          alt=""
                        >
                      </div>
                      <div class="locate__text">
                        1 km
                      </div>
                      <div class="locate__icon locate__icon_arrow">
                        <img
                          src="~/assets/img/ui/arrow_down_grey.png"
                          alt=""
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div class="info__action">
                  <base-btn
                    :mode="'green'"
                    class="info__btn"
                  >
                    <img
                      src="~/assets/img/ui/refresh-button.png"
                      alt=""
                    >
                  </base-btn>
                  <base-btn
                    :mode="'orange'"
                    class="info__btn"
                  >
                    <img
                      src="~/assets/img/ui/info-button.png"
                      alt=""
                    >
                  </base-btn>
                </div>
              </div>
              <div class="info__row info__row_filter">
                <div class="info__text">
                  15 {{ $t('profile.active') }}
                  <div class="info__text info__text_light">
                    {{ $t('profile.radius') }}
                  </div>
                </div>
                <div>
                  <base-btn class="info__btn">
                    <img
                      src="~/assets/img/ui/filter.png"
                      alt=""
                    >
                  </base-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--        <base-btn-->
        <!--          style="width: 200px;"-->
        <!--          @click="isShowSidebar = !isShowSidebar"-->
        <!--        >-->
        <!--          Change-->
        <!--        </base-btn>-->
      </div>
      <transition name="fade">
        <div v-if="isShowSidebar">
          Sidebar
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import GMap from '~/components/GMap';

export default {
  name: 'Profile',
  components: {
    GMap,
  },
  data: () => ({
    isShowSidebar: false,
    avatar: require('~/assets/img/app/fake_profile.png'),
    locations: [
      {
        lat: 44.933076,
        lng: 15.629058,
      },
      {
        lat: 45.815,
        lng: '15.9819',
      },
      {
        lat: '45.12',
        lng: '16.21',
      },
    ],

  }),
};
</script>

<style lang="scss" scoped>
.profile {
  &__container {
    display: grid;
    grid-template-columns: 1fr;
    &_sidebar {
      grid-template-columns: 9fr 3fr;
      grid-gap: 30px;
    }
  }
  &__main {
    padding-top: 50px;
    min-width: 780px;
    max-width: 1000px;
    margin: 0 auto;
  }
  &__box {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    min-height: 325px;
    border-radius: 14px 50px 50px 14px;
    background-color: #ffffff;
    box-shadow: 0 0 4px rgba(0, 7, 5, 0.3);
  }
  &__map {
    border: 3px solid #20253b;
    border-radius: 14px;
  }
}

.info {
  padding: 20px 30px;
  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &_filter {
      padding-top: 22px;
    }
  }
  &__locate {
    display: flex;
  }
  &__btn {
    width: 61px;
    height: 61px;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__action {
    display: flex;
    align-items: center;
    grid-gap: 7px;
  }
  &__text {
    color: #20253b;
    font-family: 'GothamProBlack', sans-serif;
    font-size: 21px;
    font-weight: 400;
    line-height: 20.17px;
    &_light {
      font-family: 'GothamProMedium', sans-serif;
      font-weight: 500;
    }
  }
}

.locate {
  &__body {
    height: 34px;
    background-color: #ebecec;
    border-radius: 17px;
    display: grid;
    grid-template-columns: 34px auto 23px;
    grid-gap: 11px;
    padding-right: 7px;
  }
  &__icon {
    background-color: #20253b;
    border-radius: 17px;
    display: flex;
    align-items: center;
    justify-content: center;
    &_arrow {
      background: none;
      border: none;
    }
  }
  &__text {
    display: flex;
    align-items: center;
    color: #20253b;
    font-family: 'GothamProMedium', sans-serif;
    font-size: 20px;
    font-weight: 500;
    font-style: normal;
    letter-spacing: normal;
    line-height: normal;
    text-align: left;
  }
}
</style>
