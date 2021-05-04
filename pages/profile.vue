<template>
  <div class="my-profile">
    <div class="my-profile__header">
      <div
        v-for="(item, i) in profile"
        :key="i"
        class="my-profile__block block"
      >
        <div class="block__left">
          <div class="block__img image">
            <img
              class="my-profile__img"
              :src="item.background"
              alt=""
            >
            <div class="block__rating">
              <div class="block__rating_star">
                <img
                  class="block__rating block__rating__star_checked"
                  src="~assets/img/ui/star_checked.svg"
                  alt=""
                >
                <img
                  class="block__rating block__rating__star_checked"
                  src="~assets/img/ui/star_checked.svg"
                  alt=""
                >
                <img
                  class="block__rating block__rating__star_checked"
                  src="~assets/img/ui/star_checked.svg"
                  alt=""
                >
                <img
                  class="block__rating block__rating__star_checked"
                  src="~assets/img/ui/star_checked.svg"
                  alt=""
                >
                <img
                  class="block__rating block__rating__star_checked"
                  src="~assets/img/ui/star_simple.svg"
                  alt=""
                >
              </div>
              <div class="block__rating__quantity">
                {{ item.reviews }}
              </div>
            </div>
          </div>
        </div>
        <div class="block__right">
          <div class="block__head">
            <div class="block__title">
              <div class="block__text block__text_title">
                {{ item.title }}
              </div>
              <div class="block__text block__text_level">
                {{ item.level }}
              </div>
            </div>
            <div class="block__icon block__icon_share">
              <span
                class="icon-circle_up"
              />
              <span
                class="icon-share_outline"
              />
            </div>
          </div>
          <div class="block__text block__text_text">
            {{ item.desc }}
          </div>
          <div class="block__icon block__icon__social">
            <span
              class="icon-facebook"
            />
            <span
              class="icon-twitter"
            />
            <span
              class="icon-instagram"
            />
            <span
              class="icon-LinkedIn"
            />
          </div>
          <div class="block__text block__text_date">
            <div class="location">
              <span class="icon-location" />
              <span class="block__text block__text_locate">{{ item.location }}</span>
            </div>
            <div class="phone">
              <span class="icon-phone" />
              <span class="block__text block__text_phone">{{ item.number }}</span>
            </div>
            <div class="mail">
              <span class="icon-mail" />
              <span class="block__text block__text_mail">{{ item.email }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="my-profile__content">
      <base-btn
        v-for="item in profileList"
        :key="item.id"
        :mode="btnMode(item.id)"
        class="profile__content__btn"
        @click="selectedTab(item.id)"
      >
        {{ item.title }}
      </base-btn>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MyProfile',
  data() {
    return {
      selectedTab: 0,
      profileList: [
        {
          title: 'Quests',
          id: 0,
        },
        {
          title: 'Reviews',
          id: 1,
        },
        {
          title: 'Portfolio',
          id: 2,
        },
      ],
      profile: [
        {
          title: 'Rosalia Vans',
          level: 'HIGHER LEVEL',
          reviews: '23 reviews',
          location: 'Moscow, Lenina street, 3d',
          number: '+7 989 989 98 98',
          email: 'worker@gmail.com',
          background: require('~/assets/img/temp/profile.svg'),
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel',
        },
      ],
    };
  },
  computed: {},
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    btnMode(id) {
      if (this.selectedTab === id) {
        return ' ';
      }
      return 'light';
    },
  },
};
</script>

<style lang="scss" scoped>
.my-profile {
  display: grid;
  justify-content: center;
  background-color: #FFFFFF;

  &__header {
    height: 253px;
    width: 100%;
  }

  &__img {
    display: block;
    width: 100%;
    height: 100%;
  }

  &__content {
    height: 46px;
    width: 100%;
    display: grid;
    grid-template-columns: 54px 63px 65px;
    grid-gap: 10px;
    background-color: #FFFFFF;

  }
}

.quests {
  width: 80%;
  display: grid;
  align-items: center;
  grid-template-columns: 114px 110px 181px 176px 143px 147px;
  grid-gap: 10px;
  padding: 20px 0;

  &__btn {
    padding: 10px 20px;
    width: max-content;
    height: 41px;
  }
}

.icon-share_outline {
  object-fit: cover;
  height: 20px;
  width: 20px;
}

.block {
  max-width: 1180px;
  display: grid;
  padding: 25px 0;
  grid-template-columns: 142px 1008px;
  grid-gap: 30px;
  width: 100%;

  &__icon {
    display: grid;
    grid-template-columns: 20px 20px;
    grid-gap: 27px;
    object-fit: cover;
    height: 20px;
    width: 20px;

    span::before {
      font-size: 20px;
    }

    &__social {
      font-size: 24px;
      grid-gap: 15px;
      display: grid;
      grid-template-columns: 24px 24px 24px 24px;
      align-items: center;
    }
  }

  &__rating {
    display: grid;
    justify-content: center;

    &__quantity {
      font-size: 12px;
      width: 100%;
      padding: 5px 30px;
      color: #7C838D;
    }

    &_star {
      grid-template-columns: 20px 20px 20px 20px 20px;
      display: grid;
      grid-gap: 5px;
      justify-content: center;
      align-content: center;
      padding: 20px 11px;
      width: 120px;
      height: 20px;

      &_checked {
        width: 20px;
        height: 20px;
      }
    }
  }

  &__head {
    display: grid;
    align-items: center;
    justify-content: space-between;
    grid-template-columns: 216px 67px;
  }

  &__title {
    display: grid;
    grid-template-columns: 121px 95px;
  }

  &__text {

    &_title {
      width: 121px;
      height: 26px;
      font-weight: 500;
      font-size: 20px;
      line-height: 130%;
      color: #1D2127;
    }

    &_text {
      width: 908px;
      height: 46px;
      left: 0;
      top: 49px;
      font-size: 16px;
      line-height: 145%;
      color: #4C5767;
      margin: 15px 0;
    }

    &_level {
      font-size: 12px;
      width: 100%;
      height: 20px;
      color: #FFFFFF;
      background: #F7CF00;
      border-radius: 3px;
      padding: 2px 5px;
    }

    &__icon {
      &_share {
        cursor: pointer;
      }
    }

    &_date {
      display: grid;
      grid-gap: 30px;
      grid-template-columns: 200px 146px 150px;
      font-size: 15px;
      padding: 15px 0;
    }

    span::before {
      font-size: 15px
    }
  }

  .icon-facebook:before {
    font-size: 24px;
    background: #4C80CE;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .icon-twitter:before {
    font-size: 24px;
    background: #52D0EC;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .icon-instagram:before {
    font-size: 24px;
    background: linear-gradient(180deg, #AD00FF 0%, #FF9900 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .icon-LinkedIn:before {
    font-size: 24px;
    background: #57A6EF;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
