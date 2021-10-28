<template>
  <div class="proposal">
    <Header
      :title="'Work proposal'"
      :sub-title="'Details'"
    />
    <div class="box">
      <div class="box__container">
        <div
          class="box__back"
          @click="back()"
        >
          <img
            src="~assets/img/ui/back.png"
            alt=""
          >
        </div>
        <div class="box__body">
          <div class="box__title">
            Work proposal from Samantha Sparks
          </div>
          <div class="box__info">
            <img
              class="box__image"
              src="~assets/img/ui/fake_proposal.png"
              alt=""
            >
            <div class="box__desc desc">
              <div class="desc__top">
                <div class="desc__left">
                  <div class="desc__text desc__text_name">
                    <span>Work
                      proposal name</span>
                  </div>
                  <div class="desc__text desc__text_title">
                    <span>GARAGE DOORS
                      PAINTING
                    </span>
                  </div>
                </div>
                <div class="desc__right">
                  <div class="desc__text desc__text_type">
                    Specialized quest
                  </div>
                  <div class="desc__text desc__text_time">
                    14/08/2018 23:00
                  </div>
                </div>
              </div>
              <div class="desc__bottom">
                <div class="desc__text desc__text_big">
                  <span>Hi

                    I’m urgently looking for a skilled man that can paint my Garage doors and a couple of walls around the garage. Garage doors and walls need to be painted realy fast, becose Im going on weekend holidays home, so I need dase work done in two days.
                    Olso work must be done good, quality painting with technique. Garage door size is 4x6m and a three walls is 3x4m each. Ellow paint  botted yesturday so it’s no need to spend time in market.

                    So if you think you have perfect skills in painting and you can take care of it in two days. I will be werry happy!

                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="box__info info">
            <div class="info__container">
              <div class="info__video">
                <div class="desc__text">
                  Video quest details
                </div>
                <img
                  class="info__image"
                  src="~assets/img/ui/fake_video.png"
                  alt=""
                >
              </div>
              <div class="info__table">
                <div class="info__row info__row_mobile">
                  <div class="desc__text">
                    Proposal status
                  </div>
                  <div class="desc__text desc__text_bold">
                    URGENTLY
                  </div>
                </div>
                <div class="info__row info__row_wrap">
                  <div class="desc__text">
                    <span> Proposal location
                      according to your
                      current location</span>
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
                <div class="info__row info__row_wrap">
                  <div class="desc__text">
                    Location Address
                  </div>
                  <div class="desc__text desc__text_address">
                    str. Visoka 111, Uzhhorod
                  </div>
                </div>
                <div class="info__row info__row_wrap">
                  <div class="desc__text">
                    <span>Proposal will
                      be active</span>
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
              </div>
              <div class="info__accept">
                <div class="info__row">
                  <div class="desc__text">
                    <span> Full Payment
                      for successfully
                      done work</span>
                  </div>
                  <div class="info__locate locate">
                    <div class="locate">
                      <div class="locate__body locate__body_simple">
                        <div class="locate__icon locate__icon_right">
                          <img
                            src="~/assets/img/ui/hryvnia.png"
                            alt=""
                          >
                        </div>
                        <div class="locate__text">
                          1100
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="info__action">
                  <base-btn
                    :mode="'green'"
                  >
                    ACCEPT
                  </base-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Proposal',
  methods: {
    back() {
      this.$router.push('/profile');
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  padding: 50px 0;
  &__container {
    display: flex;
    width: 100%;
    justify-content: center;
  }
  &__body {
    box-shadow: 0 0 4px rgba(0, 7, 5, 0.3);
    background-color: #ffffff;
    max-width: 1000px;
    border-radius: 50px;
    width: 100%;
    padding: 50px;
  }
  &__title {
    font-family: 'GothamProBlack', sans-serif;
    line-height: 20.17px;
    font-size: 31px;
    color: #20253b;
  }
  &__info {
    padding-top: 20px;
    display: flex;
  }
  &__desc {
    padding-left: 48px;
    width: 100%;
  }
  &__image {
    max-width: 150px;
    max-height: 150px;
  }
  &__back {
    padding-right: 25px;
    padding-top: 20px;
    cursor: pointer;
  }
}

.desc {
  &__top {
    display: flex;
    justify-content: space-between;
  }
  &__left {
    display: flex;
  }
  &__bottom {
    padding-top: 30px;
  }
  &__text {
    font-family: 'GothamProMedium', sans-serif;
    color: #20253b;
    font-weight: 500;
    line-height: 14px;
    &_title {
      font-family: 'GothamProBlack', sans-serif;
      line-height: 13px;
      font-weight: 400;
      padding-left: 50px;
      font-size: 16px;
    }
    &_type {
      font-family: 'GothamProBlack', sans-serif;
      font-weight: 400;
    }
    &_time {
      padding-top: 5px;
    }
    &_name {
      font-size: 16px;
    }
    &_big {
      line-height: normal;
    }
    &_address {
      text-align: right;
    }
    &_bold {
      font-family: 'GothamProBlack', sans-serif;
      color: #fd0000;
      text-transform: uppercase;
      font-size: 18px;
    }
    span {
      white-space: pre-line;
    }
  }
}
.info {
  &__container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 100%;
  }
  &__image {
    padding-top: 10px;
  }
  &__row {
    display: flex;
    justify-content: space-between;
    &_wrap {
      padding-top: 23px;
    }
  }
  &__accept {
    padding-left: 50px;
    display: grid;
    grid-auto-rows: auto 45px;
  }
  &__action {
    display: flex;
    justify-content: flex-end;
    button {
      width: 180px;
      height: 45px;
      align-self: flex-end;
    }
  }
}
.locate {
  &__body {
    height: 34px;
    border: 2px solid #20253b;
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
    &_left {
      padding-left: 1px;
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

@include _575 {
  .box {
    padding: 15px;
    margin-bottom: 70px;
    &__title {
      font-size: 22px;
    }
    &__back {
      padding: 10px 0 10px 10px;
    }
    &__info {
      flex-direction: column;
    }
    &__image {
      max-width: 75px;
      max-height: 75px;
    }
    &__container {
      flex-direction: column;
    }
  }
  .desc {
    padding: 0;
    margin-top: 20px;
    &__top {
      flex-direction: column;
    }
    &__right {
      padding-top: 20px;
    }
    &__text {
      font-size: 14px;
    }
  }
  .info {
    &__container {
      grid-template-columns: 1fr;
    }
    &__accept {
      padding: 20px 0 20px 0;
      display: flex;
      flex-direction: column;
    }
    &__action {
      padding-top: 20px;
    }
    &__row {
      &_mobile {
        padding-top: 20px;
      }
    }
  }
  .locate {
    &__text {
      font-size: 12px;
    }
  }
}
</style>
