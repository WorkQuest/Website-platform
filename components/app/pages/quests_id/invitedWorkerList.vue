<template>
  <!--      TODO: Вывести список Invited!-->
  <div class="worker worker__card">
    <div class="worker__cols-two">
      <div class="worker__title">
        {{ $t('quests.invited') }}
      </div>
    </div>
    <div
      v-if="getCurrUsersArr.length"
      class="invited__list"
    >
      <div
        v-for="(response, i) in getCurrUsersArr"
        :key="i"
        class="invited__response"
      >
        <div
          v-if="response.worker.firstName && response.worker.lastName"
          class="worker__container"
        >
          <div class="worker worker__col_two">
            <div class="worker row">
              <img
                class="worker__avatar"
                :src="response.worker.avatar ? response.worker.avatar.url: require('~/assets/img/app/avatar_empty.png')"
                alt=""
              >
              <div class="worker__name">
                {{ `${response.worker.firstName} ${response.worker.lastName}` }}
              </div>
            </div>
            <quest-id-dd
              class="worker__menu"
              :i="i"
              :response-id="response.id"
              :chat-id="response.questChat.chatId"
            />
          </div>
          <div class="worker__message">
            {{ response.message }}
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
    </div>
    <div
      v-else
      class="invited__title"
    >
      {{ $t('quests.workersNotInvited') }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'InvitedWorkerList',
  props: {
    isInvited: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currUsers: [],
    };
  },
  computed: {
    ...mapGetters({
      currentWorker: 'quests/getCurrentWorker',
      questData: 'quests/getQuest',
      invited: 'quests/getInvited',
      responded: 'quests/getResponded',
    }),
    getCurrUsersArr() {
      const { isInvited, invited, responded } = this;

      return isInvited ? invited : responded;
    },
  },
  async created() {
    this.SetLoader(true);
    await this.initData();
    this.SetLoader(false);
  },
  methods: {
    async initData() {
      await this.$store.dispatch('quests/getQuest', this.$route.params.id);
    },
    async startQuest() {
      this.SetLoader(true);
      const payload = {
        assignedWorkerId: this.currentWorker.id,
      };
      const questId = this.questData.id;
      await this.$store.dispatch('quests/startQuest', { questId, payload });
      await this.$store.dispatch('quests/setInfoDataMode', 4);
      this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.invited {
  &__title {
    margin: 15px 0 0 15px;
    padding: 0 0 15px 0;
    color: #7C838DFF;
    font-size: 16px;
  }
  &__list {
    width: 100%;
    display: flex;
    flex-direction: column;
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
  &__menu {
    justify-self: self-end;
  }
  &__cols-two {
    display: grid;
    grid-template-columns: 9fr 3fr;
  }
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
      display: grid;
      grid-template-columns: 11fr 1fr;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
    }
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
