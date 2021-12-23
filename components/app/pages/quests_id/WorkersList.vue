<template>
  <div class="worker__card">
    <div class="worker__title">
      {{ $t(`${isInvited ? 'quests.invited' : 'response.title'}`) }}
    </div>
    <div
      v-if="getCurrUsersArr.length"
      class="invited__list"
    >
      <div
        v-for="response in getCurrUsersArr"
        :key="response.worker.id"
        class="worker__container"
      >
        <div class="worker user-data">
          <img
            class="worker__avatar"
            :src="response.worker.avatar ? response.worker.avatar.url : require('~/assets/img/app/avatar_empty.png')"
            alt=""
          >
          <div class="worker__name">
            {{ `${response.worker.firstName} ${response.worker.lastName}` }}
          </div>
        </div>
        <base-dd
          class="worker__menu"
          :placeholder="30"
          :items="ddUserActions"
          is-dots-vue
          @input="handleUserAction($event, response)"
        />
        <div>
          <div class="worker__message">
            {{ response.message }}
          </div>
          <div v-if="response.medias.length">
            <files-preview
              :medias="response.medias"
              small
            />
          </div>
        </div>
        <!--        <div>-->
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
        <!--        </div>-->
      </div>
    </div>
    <div
      v-else
      class="invited__title"
    >
      {{ $t(`quests.${isInvited ? 'workersNotInvited' : 'employer.usersNotResponded'}`) }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'WorkersList',
  props: {
    isInvited: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currUsers: [],
      ddUserActions: [
        this.$t('btn.goToChat'),
        this.$t('quests.startQuest'),
        this.$t('quests.decline'),
      ],
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
    handleUserAction(index, response) {
      const funcKey = ['goToChat', 'startQuest', 'reject'][index];
      this[funcKey](response);
    },
    goToChat(response) {
      this.$router.push(`/messages/${response.questChat.chatId}`);
    },
    async initData() {
      await this.$store.dispatch('quests/getQuest', this.$route.params.id);
    },
    async startQuest(response) {
      this.SetLoader(true);
      const payload = {
        config: {
          assignedWorkerId: response.worker.id,
        },
        questId: this.questData.id,
      };
      await this.$store.dispatch('quests/startQuest', payload);
      this.SetLoader(false);
    },
    async reject(response) {
      this.SetLoader(true);
      await this.$store.dispatch(`quests/${this.isInvited ? 'rejectQuestInvitation' : 'rejectTheAnswerToTheQuest'}`, response.worker.id);
      this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.invited {
  &__title {
    color: #7C838DFF;
    font-size: 16px;
  }
  &__list {
    display: grid;
    gap: 20px;
  }
}
.user-data {
  display: grid;
  grid-template-columns: 40px 1fr;
  align-items: center;
  gap: 10px;
}
.worker {
  font-size: 16px;
  font-weight: 500;
  color: $black800;
  &__menu {
    align-self: center;
  }
   &__card {
    background: $white;
    border-radius: 6px;
     padding: 15px;
  }
 &__message {
   @include text-simple;
   margin: 0 0 10px 0;
   font-size: 16px;
   color: $black500;
 }

  &__container {
    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 10px;
  }
  &__avatar {
    border-radius: 50%;
    width: 40px;
    height: 40px;
 }
  &__name {
    @extend .worker;
  }
 &__title {
    font-size: 18px;
    margin-bottom: 20px;
  }
}
</style>
