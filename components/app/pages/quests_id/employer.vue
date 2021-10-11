<template>
  <span v-if="userRole === 'employer'">
    <div v-if="infoData.mode === 2">
      <div class="worker__title">{{ $t('quests.worker') }}</div>
      <div class="worker__container">
        <div>
          <img
            class="worker__avatar"
            src="~/assets/img/temp/avatar.jpg"
            alt=""
          >
        </div>
        <div class="worker__name">
          Rosalia Vans
        </div>
        <div>
          <div
            v-if="badge.code !== 0"
            class="card__level_higher"
            :class="[
              {'card__level_higher': badge.code === 1},
              {'card__level_reliable': badge.code === 2},
              {'card__level_checked': badge.code === 3}
            ]"
          >
            <span v-if="badge.code === 1">
              {{ $t('levels.higher') }}
            </span>
            <span v-if="badge.code === 2">
              {{ $t('levels.reliableEmp') }}
            </span>
            <span v-if="badge.code === 3">
              {{ $t('levels.checkedByTime') }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="infoData.mode === 3">
      <div class="worker__title">{{ $t('response.title') }}</div>
      <span
        v-for="(response, i) in filteredResponses"
        :key="i"
      >
        <div
          v-if="response.worker.firstName && response.worker.lastName"
          class="worker__container"
        >
          <div>
            <img
              class="worker__avatar"
              :src="response.worker.avatar ? response.worker.avatar.url : require('~/assets/img/app/avatar_empty.png')"
              :alt="`${response.firstName} ${response.lastName}`"
              loading="lazy"
            >
          </div>
          <div class="worker__name">
            {{ response.worker.firstName }} {{ response.worker.lastName }}
            <div>
              <base-btn
                :disabled="selectedWorker[0]"
                @click="selectWorker(i)"
              >+</base-btn>
              <base-btn @click="rejectQuestInvitation(response.id)">-</base-btn>
            </div>
          </div>
          <div>
            <!--                      TODO: НАСТРОИТЬ ВЫВОД СТАТУСА-->
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
      </span>
    </div>
    <!--                      TODO: НАСТРОИТЬ ВЫВОД ЕСЛИ ПОЛЬЗОВАТЕЛЬ ПРИГЛАШЕН КЕМ-ТО INVITED-->
    <!--              <div class="worker__title">{{ $t('quests.youInvited') }}</div>-->
    <!--              <div class="worker__container">-->
    <!--                <div>-->
    <!--                  <img-->
    <!--                    class="worker__avatar"-->
    <!--                    src="~/assets/img/temp/avatar.jpg"-->
    <!--                    alt=""-->
    <!--                  >-->
    <!--                </div>-->
    <!--                <div class="worker__name">-->
    <!--                  Rosalia Vans-->
    <!--                </div>-->
    <!--                <div>-->
    <!--                  <div-->
    <!--                    v-if="badge.code !== 0"-->
    <!--                    class="card__level_higher"-->
    <!--                    :class="[-->
    <!--                      {'card__level_higher': badge.code === 1},-->
    <!--                      {'card__level_reliable': badge.code === 2},-->
    <!--                      {'card__level_checked': badge.code === 3}-->
    <!--                    ]"-->
    <!--                  >-->
    <!--                    <span v-if="badge.code === 1">-->
    <!--                      {{ $t('levels.higher') }}-->
    <!--                    </span>-->
    <!--                    <span v-if="badge.code === 2">-->
    <!--                      {{ $t('levels.reliableEmp') }}-->
    <!--                    </span>-->
    <!--                    <span v-if="badge.code === 3">-->
    <!--                      {{ $t('levels.checkedByTime') }}-->
    <!--                    </span>-->
    <!--                  </div>-->
    <!--                </div>-->
    <!--              </div>-->
    <!--    </div>-->
    <div v-if="infoData.mode === 4">
      <div class="worker__title">
        {{ $t('quests.worker') }}
      </div>
      <div class="worker__container">
        <div>
          <img
            class="worker__avatar"
            :src="questData.assignedWorker.avatar ? questData.assignedWorker.avatar.url : require('~/assets/img/app/avatar_empty.png')"
            alt=""
          >
        </div>
        <div class="worker__name">
          {{ questData.assignedWorker.firstName }} {{ questData.assignedWorker.lastName }}
        </div>
        <div>
          <!--                      TODO: НАСТРОИТЬ ВЫВОД СТАТУСА-->
          <div
            v-if="badge.code !== 0"
            class="card__level_higher"
            :class="[
              {'card__level_higher': badge.code === 1},
              {'card__level_reliable': badge.code === 2},
              {'card__level_checked': badge.code === 3}
            ]"
          >
            <span v-if="badge.code === 1">
              {{ $t('levels.higher') }}
            </span>
            <span v-if="badge.code === 2">
              {{ $t('levels.reliableEmp') }}
            </span>
            <span v-if="badge.code === 3">
              {{ $t('levels.checkedByTime') }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="btns__container">
      <div>
        <div
          v-if="infoData.mode === 1"
          class="btns__wrapper"
        >
          <div class="btn__wrapper">
            <base-btn
              @click="toRaisingViews()"
            >
              {{ $t('quests.raiseViews') }}
            </base-btn>
          </div>
          <div class="btn__wrapper">
            <base-btn
              mode="delete"
              @click="showAreYouSureDeleteQuestModal()"
            >
              {{ $t('quests.deleteQuest') }}
            </base-btn>
          </div>
        </div>
        <div
          v-if="infoData.mode === 2"
          class="btns__wrapper"
        >
          <div class="btn__wrapper">
            <base-btn mode="approve">
              {{ $t('quests.approve') }}
            </base-btn>
          </div>
        </div>
        <div
          v-if="infoData.mode === 3"
          class="btns__wrapper"
        >
          <div class="btn__wrapper">
            <base-btn
              :disabled="!selectedWorker[0]"
              @click="startQuest()"
            >
              {{ $t('quests.startQuest') }}
            </base-btn>
          </div>
        </div>
        <div
          v-if="infoData.mode !== 4"
          class="price__container"
        >
          <span class="price__value">
            {{ questData.price }} WUSD
          </span>
        </div>
      </div>
    </div>
  </span>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';

export default {
  name: 'QuestIdEmployer',
  props: {
    infoData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      selectedWorker: [],
      filteredResponses: [],
      questData: {},
      userAvatar: '',
      badge: {
        code: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      quest: 'quests/getQuest',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      responsesToQuest: 'quests/getResponsesToQuest',
    }),
  },
  async mounted() {
    this.SetLoader(true);
    await this.initData();
    await this.getResponsesToQuest();
    await this.getFilteredResponses();
    this.SetLoader(false);
  },
  methods: {
    async initData() {
      this.questData = await this.$store.dispatch('quests/getQuest', this.$route.params.id);
      this.userAvatar = this.questData?.user?.avatar?.url || require('~/assets/img/app/avatar_empty.png');
    },
    async getFilteredResponses() {
      if (this.userRole === 'employer') {
        this.filteredResponses = this.responsesToQuest.filter((response) => response.status === 0);
        return this.filteredResponses;
      }
      return '';
    },
    async getResponsesToQuest() {
      if (this.userRole === 'employer') {
        await this.$store.dispatch('quests/responsesToQuest', this.questData.id);
      }
    },
    async selectWorker(i) {
      const { worker } = this.responsesToQuest[i];
      this.selectedWorker.push(worker);
    },
    async rejectQuestInvitation(responseId) {
      await this.$store.dispatch('quests/rejectQuestInvitation', responseId);
    },
    toRaisingViews() {
      this.$router.push('/edit-quest');
      this.$store.dispatch('quests/getCurrentStepEditQuest', 2);
    },
    async startQuest() {
      const data = {
        assignedWorkerId: this.selectedWorker[0].id,
      };
      const questId = this.questData.id;
      await this.$store.dispatch('quests/startQuest', { questId, data });
    },
    showAreYouSureDeleteQuestModal() {
      this.ShowModal({
        key: modals.areYouSureDeleteQuest,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.badge-list {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.price {
  display: flex;
  flex-direction: row;
  align-items: center;
  &__value {
    @include text-simple;
    color: $green;
    font-weight: bold;
    font-size: 25px;
  }
  &__container {
    @extend .price;
    justify-content: flex-end;
  }
  &__wrapper {
    @extend .price;
    margin:0 0 30px 0;
    justify-content: space-between;
  }
}
.btns {
  &__container {
    display: grid;
    margin-bottom: 20px;
  }
  &__wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
.btn {
  &__wrapper {
    width: 220px;
    margin: 0 20px 0 0;
  }
}
.worker {
  font-size: 16px;
  font-weight: 500;
  color: $black800;
  &__container {
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
    margin: 20px 0 20px 0;
  }
  &__avatar {
    border-radius: 50%;
    width: 60px;
    height: 60px;
  }
  &__name {
    @extend .worker;
    margin: 0 10px 0 10px;
  }
  &__title {
    @extend .worker;
    font-size: 18px;
  }
}
.card {
  padding: 2px 8px;
  align-items: center;
  border-radius: 3px;
  color: $white;
  &__level {
    display: grid;
    grid-template-columns: 20px auto;
    grid-gap: 7px;
    font-size: 12px;
    justify-content: flex-start;
    align-items: center;
    height: 20px;
    &_higher {
      @extend .card;
      background-color: #F6CF00;

    }
    &_reliable {
      @extend .card;
      background-color: #BBC0C7;
    }
    &_checked {
      background-color: #B79768;
    }
    &_disabled {
      display: none;
    }
  }
}
</style>
