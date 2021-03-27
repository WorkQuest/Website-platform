<template>
  <div class="profile">
    <Header
      :title="'John Queston'"
      :sub-title="'Last seen 23 min.'"
      :avatar="avatar"
    />
    <div
      class="profile__container"
      :class="{'profile__container_sidebar': isShowSidebar}"
    >
      <div
        class="profile__main"
        :class="{'profile__main_sidebar': isShowSidebar}"
      >
        <div>
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
                  <div class="info__action info__action_buttons">
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
                  <div
                    class="info__col"
                    @click="toggleFilter()"
                  >
                    <base-btn class="info__btn">
                      <img
                        src="~/assets/img/ui/filter.png"
                        alt=""
                      >
                    </base-btn>
                  </div>
                </div>
                <div class="info__row info__row_stat">
                  <div class="info__text info__text_simple">
                    {{ $t('profile.lead') }}
                  </div>
                  <div class="info__locate locate">
                    <div class="locate">
                      <div class="locate__body locate__body_simple">
                        <div class="locate__icon locate__icon_right">
                          <img
                            src="~/assets/img/ui/time.png"
                            alt=""
                          >
                        </div>
                        <div class="locate__text">
                          24:00
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="info__row info__row_proposal">
                  <div class="info__text info__text_simple">
                    <span>{{ $t('profile.proposalLocation') }}</span>
                  </div>
                  <div class="info__locate locate">
                    <div class="locate">
                      <div class="locate__body locate__body_simple">
                        <div class="locate__icon locate__icon_right">
                          <img
                            src="~/assets/img/ui/location.png"
                            alt=""
                          >
                        </div>
                        <div class="locate__text">
                          200 M
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="info__row info__row_status">
                  <div class="info__text info__text_simple">
                    {{ $t('profile.proposalStatus') }}
                  </div>
                  <div class="info__text info__text_bold">
                    {{ $t('profile.urgently') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="box">
            <div class="box__container">
              <div class="box__left">
                <img
                  class="box__img"
                  src="~/assets/img/app/fake_quote.png"
                  alt="profile"
                >
              </div>
              <div class="box__right">
                <div class="box__row">
                  <div class="box__text box__text_title">
                    Work proposal from Samantha Sparks
                  </div>
                </div>
                <div class="box__row box__row_about">
                  <div class="box__text box__text_about">
                    about
                  </div>
                </div>
                <div class="box__row box__row_text">
                  <div class="box__text box__text_quote">
                    <span>Hi
                      I’m urgently looking for a skilled man that can paint my Garage doors and a couple of walls around the garage...
                    </span>
                  </div>
                </div>
                <div class="box__row box__row_details">
                  <div class="box__text box__text_bottom">
                    Specialized quest
                  </div>
                  <div
                    class="box__details"
                    @click="viewDetails()"
                  >
                    <img
                      src="~/assets/img/app/next-page_blue.png"
                      alt="->"
                    >
                    <div class="box__text box__text_details">
                      {{ $t('profile.details') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="isShowSidebar"
        class="profile__sidebar sidebar"
      >
        <div class="sidebar__header">
          <div class="sidebar__left">
            <div class="sidebar__text">
              <span>
                {{ $t('profile.sidebar.filter') }}
              </span>
              <span class="sidebar__text sidebar__text_medium">
                {{ $t('profile.sidebar.choose') }}
              </span>
            </div>
          </div>
          <div
            class="sidebar__close"
            @click="toggleFilter()"
          >
            <img
              src="~/assets/img/app/close.png"
              alt="x"
            >
          </div>
        </div>
        <div class="sidebar__filter filter">
          <div
            v-b-toggle.quests
            class="filter__row"
          >
            <div class="filter__icon">
              <img
                src="~/assets/img/ui/SELECT.png"
                alt=">"
              >
            </div>
            <div class="filter__text">
              QUESTS
            </div>
          </div>
          <b-collapse
            id="quests"
          >
            <b-form-group v-slot="{ ariaDescribedby }">
              <b-form-checkbox-group
                v-model="selected"
                :options="questsOptions"
                :aria-describedby="ariaDescribedby"
                name="items"
                stacked
              />
            </b-form-group>
          </b-collapse>
          <div
            v-b-toggle.specialized
            class="filter__row"
          >
            <div class="filter__icon">
              <img
                src="~/assets/img/ui/SELECT.png"
                alt=">"
              >
            </div>
            <div class="filter__text">
              SPECIALIZED QUESTS
            </div>
          </div>
          <b-collapse
            id="specialized"
          >
            <b-form-group v-slot="{ ariaDescribedby }">
              <b-form-checkbox-group
                v-model="selected"
                :options="specializedOptions"
                :aria-describedby="ariaDescribedby"
                name="items"
                stacked
              />
            </b-form-group>
          </b-collapse>
          <div
            v-b-toggle.find
            class="filter__row"
          >
            <div class="filter__icon">
              <img
                src="~/assets/img/ui/SELECT.png"
                alt=">"
              >
            </div>
            <div class="filter__text">
              FIND A JOB
            </div>
          </div>
          <b-collapse
            id="find"
          >
            <b-form-group v-slot="{ ariaDescribedby }">
              <b-form-checkbox-group
                v-model="selected"
                :options="jobOptions"
                :aria-describedby="ariaDescribedby"
                name="items"
                stacked
              />
            </b-form-group>
          </b-collapse>
        </div>
      </div>
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
        lat: 56.475565,
        lng: 84.967270,
      },
    ],
    selected: [],
    questsOptions: [
      {
        text: '- Quest One',
        value: 't',
      },
      {
        text: '- Quest Two',
        value: 'p',
      },
    ],
    specializedOptions: [
      {
        text: '- Retail / sales / purchases',
        value: 'r',
      },
      {
        text: '- Transport / logistic',
        value: 'tr',
      },
      {
        text: '- Construction',
        value: 'c',
      },
      {
        text: '- Telecommunications / Communication',
        value: 'tcc',
      },
      {
        text: '- Bars / Restaurants',
        value: 'b',
      },
      {
        text: '- Jurisprudence and accounting',
        value: 'j',
      },
      {
        text: '- HR / HR',
        value: 'hrs',
      },
      {
        text: '- Guard / security',
        value: 'hsr',
      },
      {
        text: '- Home stuff',
        value: 'hrf',
      },
      {
        text: '- Beauty / fitness / sports',
        value: 'hr2',
      },
      {
        text: '- Tourism / Recreation / Entertainment',
        value: 'Tourism',
      },
      {
        text: '- Education',
        value: 'Education',
      },
      {
        text: '- Culture / Art',
        value: 'Culture',
      },
      {
        text: '- Medicine / Pharmacy',
        value: 'Medicine',
      },
      {
        text: '- IT / telecom / computers',
        value: 'IT',
      },
      {
        text: '- Banks / Finance / Insurance',
        value: 'Banks',
      },
    ],
    jobOptions: [
      {
        text: '- Temporary work',
        value: 't',
      },
      {
        text: '- Permanent job',
        value: 'p',
      },
    ],
  }),
  methods: {
    toggleFilter() {
      this.isShowSidebar = !this.isShowSidebar;
    },
    viewDetails() {
      this.$router.push('/proposal');
    },
  },
};
</script>

<style lang="scss" scoped>
.profile {
  &__container {
    display: flex;
    justify-content: center;
    padding-bottom: 40px;
    &_sidebar {
      grid-template-columns: 9fr 3fr;
    }
  }
  &__main {
    padding-top: 50px;
    width: 780px;
    max-width: 1000px;
    margin: 0 auto;
    //min-height: calc(100vh - 125px);
    &_sidebar {
    }
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
    overflow: hidden;
  }
}

.sidebar {
  background: #FFFFFF;
  position: relative;
  box-shadow: 0 6px 4px 0 rgba(0, 7, 5, .3);
  width: 430px;
  &::after {
    content: '';
    background: #FFFFFF;
    position: absolute;
    top: -124px;
    right: 0;
    min-height: 124px;
    width: 100px;
    z-index: -5;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    min-height: 130px;
    box-shadow: 0 0 4px rgba(0, 7, 5, 0.3);
    padding: 34px;
  }
  &__text {
    color: #20253b;
    font-family: 'GothamProBlack', sans-serif;
    line-height: 20.17px;
    letter-spacing: normal;
    font-weight: 400;
    &_medium {
      font-weight: 500;
      font-family: 'GothamProMedium', sans-serif;
      line-height: normal;
      white-space: pre-line;
    }
  }
  &__filter {
    padding: 20px 25px;
  }
  &__close {
    cursor: pointer;
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
    &_stat {
      padding-top: 10px;
      align-items: flex-start;
    }
    &_proposal {
      padding-top: 22px;
    }
    &_status {
      padding-top: 50px;
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
    box-shadow: 0 0 4px rgba(0, 7, 5, 0.3);
  }
  &__action {
    display: flex;
    align-items: center;
    grid-gap: 7px;
    &_buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
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
    &_simple {
      font-family: 'GothamProMedium', sans-serif;
      font-weight: 500;
      font-size: 14px;
      span {
        white-space: pre-line;
      }
    }
    &_bold {
      color: #ff0000;
      text-transform: uppercase;
      font-size: 16px;
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
    &_simple {
      padding-right: 14px;
      grid-template-columns: 34px auto;
      background: transparent;
      border: 2px solid #20253b !important;
    }
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
    &_right {
      padding-right: 3px;
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
    white-space: nowrap;
  }
}

.filter {
  display: flex;
  flex-direction: column;
  grid-gap: 13px;
  height: 100%;
  max-height: calc(100vh - 124px - 130px);
  overflow-y: auto;
  &__row {
    display: flex;
    align-items: center;
    grid-gap: 16px;
    cursor: pointer;
  }
  &__text {
    color: #20253b;
    font-family: 'GothamProBlack', sans-serif;
    font-size: 16px;
    font-weight: 400;
    font-style: normal;
    letter-spacing: normal;
    line-height: 25px;
    text-transform: uppercase;
  }
}
.box {
  margin-top: 21px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  border-radius: 40px;
  &__container {
    box-shadow: 0 0 4px rgba(0, 7, 5, 0.3);
    border-radius: 40px;
    background: #FFFFFF;
    max-width: 690px;
    width: 100%;
    min-height: 200px;
    display: grid;
    grid-template-columns: 3fr 9fr;
  }
  &__img {
    max-width: 130px;
    max-height: 130px;
  }
  &__left {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
    box-shadow: 3px 0 4px rgba(95, 86, 86, .3);
  }
  &__right {
    padding: 20px;
  }
  &__text {
    font-style: normal;
    letter-spacing: normal;
    line-height: normal;
    text-align: left;
    color: #20253b;
    &_title {
      font-family: 'GothamProBlack', sans-serif;
      font-weight: 400;
      font-size: 19px;
    }
    &_about {
      padding-top: 15px;
      font-family: 'GothamProMedium', sans-serif;
      font-weight: 500;
      color: #c3c4c4;
      font-size: 14px;
    }
    &_bottom {
      font-family: 'GothamProMedium', sans-serif;
      font-weight: 500;
      font-size: 14px;
    }
    &_quote {
      padding-top: 17px;
      font-size: 16px;
      font-family: 'GothamProBold', sans-serif;
      white-space: pre-line;
      font-weight: 700;
    }
    &_details {
      font-family: 'GothamProBlack', sans-serif;
      font-weight: 400;
      font-size: 19px;
      color: #0c82c3;
      text-transform: uppercase;
    }
  }
  &__row {
    &_details {
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
  }
  &__details {
    cursor: pointer;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    grid-gap: 10px;
  }
}

@include _575 {
  .profile {
    &__box {
      grid-template-rows: 250px 1fr;
      grid-template-columns: 1fr;
      border-radius: 14px 50px 50px 50px;
    }
    &__main {
      margin: 0 15px;
      padding-bottom: 120px;
    }
  }
  .box {
    &__row {
      &_about {
        display: none;
      }
      &_text {
        display: none;
      }
      &_details {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 20px;
      }
    }
    &__details {
      display: grid;
      grid-template-columns: 35px 1fr;
      grid-gap: 10px;
    }
    &__text {
      &_details {
        white-space: nowrap;
      }
    }
    &__container {
      grid-template-columns: 4fr 8fr;
    }
    &__left {
      img {
        max-width: 100px;
      }
    }
  }
  .info {
    &__btn {
      width: 41px;
      height: 41px;
      img {
        width: 50% !important;
      }
    }
    &__action {
      &_buttons {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 5px;
      }
    }
  }
  .sidebar {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    max-width: 280px;
    z-index: 1200;
  }
}
</style>
