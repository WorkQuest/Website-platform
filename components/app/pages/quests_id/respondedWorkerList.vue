<template>
  <div
    v-if="currentWorker"
    class="worker worker__card"
  >
    <div class="worker__title">
      {{ $t('response.title') }}
    </div>
    <div class="worker__container">
      <div
        v-if="filteredResponses.length === 0"
        class="info__message"
      >
        {{ $t('quests.employer.usersNotResponded') }}
      </div>
      <div
        v-for="(response, i) in filteredResponses"
        :key="i"
        class="worker worker__col_two"
      >
        <div
          v-if="response.worker.firstName && response.worker.lastName"
          class="worker row"
        >
          <nuxt-link :to="`/profile/${response.workerId}`">
            <img
              class="worker__avatar"
              :src="response.worker.avatar ? response.worker.avatar.url: require('~/assets/img/app/avatar_empty.png')"
              alt=""
            >
          </nuxt-link>
          <div class="worker__name">
            {{ response.worker.firstName }} {{ response.worker.lastName }}
          </div>
        </div>
        <quest-id-dd
          :i="i"
          :response-id="response.id"
          :chat-id="response.questChat.chatId"
        />
        <div>
          <div class="worker__message">
            {{ response.message }}
          </div>
          <div v-if="response.medias">
            <files-preview
              :medias="response.medias"
              :small="true"
            />
          </div>
        </div>
      </div>
      <div>
        <!--                      TODO: НАСТРОИТЬ ВЫВОД СТАТУСА нет бэка-->
        <!--                    <div-->
        <!--                      v-if="item.badge.code !== 0"-->
        <!--                      class="card__level_higher"-->
        <!--                      :class="[-->
        <!--                        {'card__level_higher': item.badge.code === 1},-->
        <!--                        {'card__level_reliable': item.badge.code === 2},-->
        <!--                        {'card__level_checked': item.badge.code === 3}-->
        <!--                      ]"-->
        <!--                    >-->
        <!--                      <span v-if="item.badge.code === 1">-->
        <!--                        {{ $t('levels.higher') }}-->
        <!--                      </span>-->
        <!--                      <span v-if="item.badge.code === 2">-->
        <!--                        {{ $t('levels.reliableEmp') }}-->
        <!--                      </span>-->
        <!--                      <span v-if="item.badge.code === 3">-->
        <!--                        {{ $t('levels.checkedByTime') }}-->
        <!--                      </span>-->
        <!--                    </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'RespondedWorkerList',
  props: {
    filteredResponses: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters({
      currentWorker: 'quests/getCurrentWorker',
    }),
  },
};
</script>

<style lang="scss" scoped>
.info {
  &__message {
    @include text-simple;
    margin: 0 0 15px 0;
    font-size: 16px;
    color: $black400;
  }
}
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 10px 0;
}
.worker {
  font-size: 16px;
  font-weight: 500;
  color: $black800;
  &__card {
    margin: 30px 0;
    background: $white;
    border-radius: 6px;
  }
  &__message {
    @include text-simple;
    margin: 0 0 10px 0;
    font-size: 16px;
    color: $black500;
  }
  &__col {
    &_two {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, auto);
      justify-content: space-between;
      align-items: center;
    }
  }
  &__container_row {
    display: flex;
    flex-direction: row;
    justify-items: flex-start;
    align-items: center;
    margin: 20px 15px;
  }
  &__container {
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
    align-items: flex-start;
    margin: 20px 15px;
  }
  &__avatar {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
  &__name {
    @extend .worker;
    margin: 0 10px 0 10px;
  }
  &__title {
    @extend .worker;
    font-size: 18px;
    margin: 0 0 0 15px;
    padding: 15px 15px 0 0;
  }
}
</style>
