<template>
  <div class="main">
    <div class="main__body">
      <div class="chat">
        <h2 class="page__title">
          {{ $t('chat.messages') }}
        </h2>
        <div class="chat__body">
          <div class="chat__header">
            <div class="chat__title">
              <div>{{ $t('chat.chat') }}</div>
              <div class="icon-more">
                <ChatMenu />
              </div>
            </div>
          </div>
          <div class="chat__cards">
            <div
              v-for="(item, i) in messages"
              :key="i"
            >
              <div
                class="chat__card profile"
                @click="showDetails()"
              >
                <div class="chat__data">
                  <div class="avatar__row">
                    <div>
                      <img
                        class="profile__img"
                        src="~/assets/img/temp/profile.svg"
                      >
                    </div>
                    <div>
                      <span class="profile__name">
                        {{ item.name }}
                      </span>
                    </div>
                    <div>
                      <span class="profile__company">
                        {{ item.company }}
                      </span>
                    </div>
                  </div>
                  <div class="quest__row">
                    <div class="quest">
                      <span class="params">{{ $t('chat.quest') }}</span>
                      <span class="quest__title">{{ item.questName }}</span>
                    </div>
                  </div>
                  <div class="you__row">
                    <div class="you">
                      <span class="params">{{ $t('chat.you') }}</span>
                      <span class="you__message">{{ item.body }}</span>
                    </div>
                  </div>
                </div>
                <div class="chat__status">
                  <div class="chat__new" />
                  <div
                    v-if="isHideStar(item.type)"
                    class="block__icon block__icon_fav star"
                    @click="item.isFavourite = !item.isFavourite"
                  >
                    <img
                      class="star__hover"
                      src="~assets/img/ui/star_hover.svg"
                      alt=""
                    >
                    <img
                      v-if="!item.isFavourite"
                      class="star__default"
                      src="~assets/img/ui/star_simple.svg"
                      alt=""
                    >
                    <img
                      v-if="item.isFavourite"
                      class="star__checked"
                      src="~assets/img/ui/star_checked.svg"
                      alt=""
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="nav_block">
            <ul class="nav">
              <li class="nav-item">
                <button
                  class="nav-btn nav-btn_prev"
                  @click="prevTab()"
                >
                  <div
                    class="nav-arrow"
                    :disabled="tab === 1"
                    :class="tab === 1 ? 'nav-arrow_disabled' : 'nav-arrow_active'"
                  />
                </button>
              </li>
              <li
                v-for="(item, i) in pages"
                :key="i"
                class="nav-item"
              >
                <button
                  class="nav-btn"
                  :class="[{'nav-btn__active' :tab === item}]"
                  @click="tab = item"
                >
                  {{ item }}
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-btn nav-btn_next"
                  :disabled="tab === 5"
                  @click="nextTab()"
                >
                  <div
                    class="nav-arrow"
                    :class="tab === 5 ? 'nav-arrow_disabled' : 'nav-arrow_active'"
                  />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ChatMenu from '~/components/ui/ChatMenu';

export default {
  name: 'Messages',
  components: {
    ChatMenu,
  },
  data() {
    return {
      tab: 1,
      pages: [1, 2, 3, 4, 5],
    };
  },
  computed: {
    ...mapGetters({
      messages: 'data/getMessages',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    showDetails() {
      this.$router.push('/messages/1');
    },
    isHideStar(type) {
      return !(type === 4 || type === 3);
    },
    prevTab() {
      if (this.tab > 1) {
        this.tab -= 1;
      }
    },
    nextTab() {
      this.tab += 1;
    },
  },
};
</script>

<style lang="scss" scoped>

.nav_block {
  background-color: #FFFFFF;
  display: flex;
  justify-content: flex-end;
  border-radius: 6px;
  width: max-content;
  margin-top: 25px;
  float: right;
  .nav {
    align-content: center;
    &-btn {
      border-left: 1px solid #F7F8FA;
      width:43px;
      height:43px;
      &__active {
        background-color: #E6F3F9;
        color: #0083c7;
      }
      &_next .nav-arrow {
        mask-image: url('~assets/img/ui/coolicon_next.svg');
      }
      &_prev .nav-arrow {
        mask-image: url('~assets/img/ui/coolicon_prev.svg');
      }
    }
    &-arrow {
      margin-left: auto;
      margin-right: auto;
      height: 10px;
      width: 5px;
      &_disabled {
        background-color: #c2c2c2;
      }
      &_active {
        background-color: #4C5767;
      }
    }
  }
}
.star {
  &__default {
    display: flex;
  }
  &__hover {
    display: none;
  }
  &:hover {
    .star {
      &__hover {
        display: flex;
      }
      &__default {
        display: none;
      }
      &__checked {
        display: none;
      }
    }
  }
}
.message {
  &__avatar {
    max-width: 74px;
    max-height: 74px;
    border-radius: 118px;
  }
  &__name {
    @include text-simple;
    color: $black800;
    font-weight: 500;
    font-size: 16px;
  }
  &__body {
    @include text-simple;
    display: grid;
    padding: 10px 0 0 0;
    border-bottom: 1px solid $black100;
    justify-items: center;
  }
  &__text {
    @include text-simple;
    font-weight: 400;
    font-size: 14px;
    color: $black500;
  }
  &__data {
    @include text-simple;
    font-weight: 400;
    font-size: 12px;
    color: $black200;
    padding: 0 0 10px 0;
  }
}

.mobile {
  &__body {
    display: grid;
  }
  &__title {
    @include text-simple;
    color: $black800;
    font-weight: 700;
    font-size:30px;
    margin: 18px 20px 0 20px;
  }
  &__header {
    display: flex;
    align-items: baseline;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 20px 0 0;
    margin: 0 0 20px 0;
  }
}

.icon {
  color: $black500;
  font-size: 26px;
  &-more_vertical::before {
    @extend .icon;
    content: "\e952";
    color: $blue;
  }
  &-more_horizontal::before {
    @extend .icon;
    content: "\e951";
  }
  &-more {
    margin: 0 7px 0 0;
  }
}

.you {
  margin: 0 0 20px 0;
  &__row {
    display: flex;
    flex-direction: row;
    margin: 14.5px 0 0 30px;
  }
  &__message {
    font-weight: 400;
    font-size: 16px;
    color: $black500;
  }
}

.quest {
  &__row {
    display: flex;
    flex-direction: row;
    margin: 14.5px 0 0 30px;
  }
  &__title {
    color: $blue;
    font-size: 16px;
    font-weight: 500;
  }
}

.profile {
  &__img {
    height: 30px;
    width: 30px;
    border-radius: 84px;
    object-fit: cover;
  }
  &__name {
    color: $black800;
    font-size:16px;
    font-weight: 500;
    margin: 0 10px 0 10px;
  }
  &__company {
    color: $black500;
    font-size: 16px;
    font-weight: 400;
  }
}
.avatar {
  &__row {
    display: flex;
    flex-direction: row;
    margin: 20px 0 0 30px;
  }
}
.main {
  @include main;
  &-white {
   @include main-white;
    justify-self: center;
   border-radius: 6px;
 }
}
.chat {
  &__status {
    display: flex;
    flex-direction: column;
    height: 80px;
    justify-content: space-between;
    align-items: center;
    .chat__new {
      border-radius: 50%;
      width: 8px;
      height: 8px;
      background: #0083C7;
    }
  }
  &__header {
    border: 1px solid #E9EDF2;
    border-radius: 6px 0 0 0;
  }
  &__title {
    background-color: $white;
    margin: 15px 0 15px 15px;
    font-weight: 500;
    font-size: 18px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  &__body {
    background-color: $white;
    border: 1px solid #E9EDF2;
    border-radius: 6px;
    width: 100%;
    max-width: 1180px;
    height: 100%;
  }
  &__cards {
    overflow-y: hidden;
    height: 100%;
    width: 100%;
  }
  &__card {
    display: flex;
    border: 1px solid #E9EDF2;
    cursor: pointer;
    justify-content: space-evenly;
    align-items: center;
  }
}
.page {
  &__title {
    margin: 20px 0 20px 0;
  }
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  border-radius: 2px;
  -webkit-box-shadow: inset 0 0 24px rgba(0, 131, 199, 1);
}

@include _1199 {
  .chat {
    margin: 0 20px 0 20px;
    &__status {
      width: 80px;
    }
  }
}
@include _991 {
  .avatar {
    &__container {
      margin: 6px 0 0 0;
    }
  }
  .message {
    &__avatar {
      max-height: 54px;
      max-width: 54px;
    }
    &__body {
      grid-template-columns: 1fr 6fr;
      align-items: flex-start;
    }
  }
  .chat {
    &__status {
      width: 110px;
    }
  }
}

@include _480 {
  .message {
    &__container {
      margin: 0 0 0 10px;
    }
  }
  .chat {
    &__status {
      width: 140px;
      grid-gap: 60px;
      height: 170px;
      justify-content: flex-start;
    }
  }
}

@include _380 {
  .message {
    &__body {
      padding: 10px;
    }
    &__data {
      padding: 0;
    }
  }
  .chat {
    &__status {
      height: 190px;
    }
  }
}
</style>
