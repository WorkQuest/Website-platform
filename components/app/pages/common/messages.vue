<template>
  <div class="messages__container">
    <!--    <div-->
    <!--      v-for="(item, i) in messages"-->
    <!--      :key="i"-->
    <!--    >-->
    <!--      <div-->
    <!--        class="chat__message"-->
    <!--      >-->
    <!--        <div>-->
    <!--          <div class="row__container">-->
    <!--            <div class="chat__img-container">-->
    <!--              <img-->
    <!--                class="chat__img"-->
    <!--                src="~/assets/img/temp/profile.svg"-->
    <!--              >-->
    <!--            </div>-->
    <!--            <div class="chat__name-container">-->
    <!--              <div class="chat__name">-->
    <!--                {{ item.name }}-->
    <!--              </div>-->
    <!--              <div class="chat__star">-->
    <!--                <div-->
    <!--                  class="block__icon block__icon_fav star"-->
    <!--                  @click="item.isFavourite = !item.isFavourite"-->
    <!--                >-->
    <!--                  <img-->
    <!--                    class="star__hover"-->
    <!--                    src="~assets/img/ui/star_hover.svg"-->
    <!--                    alt=""-->
    <!--                  >-->
    <!--                  <img-->
    <!--                    v-if="!item.isFavourite"-->
    <!--                    class="star__default"-->
    <!--                    src="~assets/img/ui/star_simple.svg"-->
    <!--                    alt=""-->
    <!--                  >-->
    <!--                  <img-->
    <!--                    v-if="item.isFavourite"-->
    <!--                    class="star__checked"-->
    <!--                    src="~assets/img/ui/star_checked.svg"-->
    <!--                    alt=""-->
    <!--                  >-->
    <!--                </div>-->
    <!--              </div>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--          <div-->
    <!--            class="message__interlocutor"-->
    <!--            :class="{ message__owner: +item.type === 2 }"-->
    <!--          >-->
    <!--            <span class="message__body">-->
    <!--              {{ item.body }}-->
    <!--            </span>-->
    <!--            <div class="message__time">-->
    <!--              {{ item.messageTime }}-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'Messages',
  data() {
    return {
      isShowFavourite: false,
      message_input: '',
    };
  },
  computed: {
    ...mapGetters({
      messages: 'chat/getMessages',
    }),
  },
};
</script>

<style lang="scss" scoped>

.messages {
  &__container {
    height: 500px;
    overflow-y: auto;
  }
}

.message {
  &__interlocutor {
    background-color:#0083C7;
    margin: 0 54px 0 60px;
    border-radius: 6px;
    color: $white;
    padding: 15px;
  }
  &__owner {
    background-color:$black0;
    color: $black800;
    padding: 15px;
    margin: 0 54px 0 60px;
    border-radius: 6px;
  }
  &__body {
    display: flex;
    word-break: break-word;
    width: 100%;
  }
  &__time {
    margin: 15px 15px 0 15px;
    padding: 0;
    text-align: right;
  }
}

.chat {
  &__name-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }
  &__messages {
    overflow-y: scroll;
    height: 100%;
    width: 100%;
    max-height: 722px;
  }
  &__img {
    width: 100%;
    height: 100%;
    max-height: 30px;
    max-width: 30px;
    border-radius: 84px;
    margin: 10px 10px 10px 20px;
  }
  &__name {
    padding: 0 0 0 12px;
  }
  &__star {
    margin: 0 20px 0 0;
  }
}

.star {
  &__default {
    display: flex;
    width: 22px !important;
  }
  &__hover {
    display: none;
    width: 22px !important;
  }
  &__checked {
    width: 22px !important;
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

.block {
  background: #FFFFFF;
  border-radius: 6px;
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100%;
  &__icon {
    &_fav {
      cursor: pointer;
    }
    &_perf {
      display: grid;
      grid-template-columns: 25px 25px 25px 25px 25px;
    }
  }
}

.row {
  &__container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

</style>
