<template>
  <div v-if="userRole === 'employer'">
    <div
      v-if="infoDataMode === InfoModeEmployer.RaiseViews"
      class="btns__container"
    >
      <div
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
            @click="closeQuest"
          >
            {{ $t('btn.closeQuest') }}
          </base-btn>
        </div>
      </div>
    </div>
    <div v-if="infoDataMode === InfoModeEmployer.Active">
      <div class="worker__title">
        {{ $t('quests.worker') }}
      </div>
      <div class="worker__container">
        <div>
          <img
            class="worker__avatar"
            :src="userAvatar ? userAvatar : require('~/assets/img/app/avatar_empty.png')"
            alt=""
          >
        </div>
        <div
          class="worker__name"
        >
          {{ assignWorker ? assignWorker.firstName : 'Nameless' }} {{ assignWorker ? assignWorker.lastName : '' }}
        </div>
        <div>
          <itemRating :rating="assignWorker ? assignWorker.ratingStatistic.status : ''" />
        </div>
      </div>
    </div>
    <!--                      TODO: НАСТРОИТЬ ВЫВОД ЕСЛИ ПОЛЬЗОВАТЕЛЬ ПРИГЛАШЕН КЕМ-ТО INVITED-->
    <!--                  <div class="worker__title">{{ $t('quests.youInvited') }}</div>
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
        </div>-->
    <div v-if="infoDataMode === InfoModeEmployer.WaitWorker">
      <div class="worker__title">
        {{ $t('quests.worker') }}
      </div>
      <div class="worker__container_row">
        <nuxt-link :to="`/profile/${workerId}`">
          <img
            class="worker__avatar"
            :src="userAvatar ? userAvatar : require('~/assets/img/app/avatar_empty.png')"
            alt=""
          >
        </nuxt-link>
        <div
          class="worker__name"
        >
          {{ assignWorker ? assignWorker.firstName : 'Nameless' }} {{ assignWorker ? assignWorker.lastName : '' }}
        </div>
        <div>
          <itemRating :rating="assignWorker ? assignWorker.ratingStatistic.status : ''" />
          <!--                      TODO: НАСТРОИТЬ ВЫВОД СТАТУСА нет бэка-->
          <!--          <div-->
          <!--            v-if="![0].includes(badge.code)"-->
          <!--            class="card__level_higher"-->
          <!--            :class="cardBadgeLevel"-->
          <!--          >-->
          <!--            {{ cardBadgeLevelText }}-->
          <!--          </div>-->
        </div>
      </div>
    </div>
    <div
      v-if="infoDataMode === InfoModeEmployer.WaitConfirm"
      class="btns__container"
    >
      <div>
        <div class="worker__title">
          {{ $t('quests.worker') }}
        </div>
        <div class="worker__container_row">
          <img
            class="worker__avatar"
            :src="userAvatar ? userAvatar : require('~/assets/img/app/avatar_empty.png')"
            alt=""
          >
          <div
            class="worker__name"
          >
            {{ assignWorker ? assignWorker.firstName : 'Nameless' }} {{ assignWorker ? assignWorker.lastName : '' }}
          </div>
          <div>
            <itemRating :rating="assignWorker ? assignWorker.ratingStatistic.status : ''" />
            <!--                      TODO: НАСТРОИТЬ ВЫВОД СТАТУСА-->
            <!--            <div-->
            <!--              v-if="![0].includes(badge.code)"-->
            <!--              class="card__level_higher"-->
            <!--              :class="cardBadgeLevel"-->
            <!--            >-->
            <!--              {{ cardBadgeLevelText }}-->
            <!--            </div>-->
          </div>
        </div>
        <div class="btns__wrapper">
          <div class="btn__wrapper">
            <base-btn
              mode="approve"
              @click="acceptCompletedWorkOnQuest"
            >
              {{ $t('btn.acceptCompletedWorkOnQuest') }}
            </base-btn>
          </div>
          <div class="btn__wrapper">
            <base-btn
              @click="rejectCompletedWorkOnQuest"
            >
              {{ $t('btn.rejectCompletedWorkOnQuest') }}
            </base-btn>
          </div>
        </div>
      </div>
    </div>
    <div v-if="[InfoModeEmployer.Dispute, InfoModeEmployer.Closed].includes(infoDataMode)">
      <div class="worker__title">
        {{ $t('quests.worker') }}
      </div>
      <div class="worker__container_row">
        <div>
          <img
            class="worker__avatar"
            :src="userAvatar ? userAvatar : require('~/assets/img/app/avatar_empty.png')"
            alt=""
          >
        </div>
        <div
          class="worker__name"
        >
          {{ assignWorker ? assignWorker.firstName : 'Nameless' }} {{ assignWorker ? assignWorker.lastName : '' }}
        </div>
        <div>
          <itemRating :rating="assignWorker ? assignWorker.ratingStatistic.status : ''" />
          <!--                      TODO: НАСТРОИТЬ ВЫВОД СТАТУСА нет бэка-->
          <!--          <div-->
          <!--            v-if="![0].includes(badge.code)"-->
          <!--            class="card__level_higher"-->
          <!--            :class="cardBadgeLevel"-->
          <!--          >-->
          <!--            {{ cardBadgeLevelText }}-->
          <!--          </div>-->
        </div>
      </div>
      <div class="btns__container">
        <div
          v-if="infoDataMode === InfoModeEmployer.Dispute"
          class="btns__wrapper"
        >
          <div class="btn__wrapper">
            <base-btn @click="openDispute()">
              {{ $t('btn.dispute') }}
            </base-btn>
          </div>
        </div>
      </div>
    </div>
    <div v-if="infoDataMode === InfoModeEmployer.Done">
      <div class="worker__title">
        {{ $t('quests.worker') }}
      </div>
      <div class="worker__container_row">
        <div>
          <img
            class="worker__avatar"
            :src="userAvatar ? userAvatar : require('~/assets/img/app/avatar_empty.png')"
            alt=""
          >
        </div>
        <div
          class="worker__name"
        >
          {{ assignWorker ? assignWorker.firstName : 'Nameless' }} {{ assignWorker ? assignWorker.lastName : '' }}
        </div>
        <div>
          <itemRating :rating="assignWorker ? assignWorker.ratingStatistic.status : ''" />
          <!--                      TODO: НАСТРОИТЬ ВЫВОД СТАТУСА нет бэка-->
          <!--          <div-->
          <!--            v-if="![0].includes(badge.code)"-->
          <!--            class="card__level_higher"-->
          <!--            :class="cardBadgeLevel"-->
          <!--          >-->
          <!--            {{ cardBadgeLevelText }}-->
          <!--          </div>-->
        </div>
      </div>
    </div>
    <div
      v-if="![InfoModeEmployer.WaitWorker, InfoModeEmployer.Closed, InfoModeEmployer.Done].includes(infoDataMode)"
      class="btns__container"
    >
      <div class="priority">
        <div
          class="price__container"
        >
          <span class="price__value">
            {{ questData.price }} {{ $t('quests.wusd') }}
          </span>
        </div>
        <div
          class="priority__container"
        >
          <div
            class="priority__title"
            :class="getPriorityClass(questData.priority)"
          >
            {{ getPriority(questData.priority) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { InfoModeEmployer, QuestStatuses } from '~/utils/enums';
import itemRating from '~/components/app/info/item-rating';

export default {
  name: 'QuestIdEmployer',
  components: {
    itemRating,
  },
  props: {
    infoData: {
      type: Object,
      default: () => {},
    },
    userAvatar: {
      type: String,
      default: () => '',
    },
    assignWorker: {
      type: Object,
      default: () => {},
    },
    workerId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      filteredResponses: [],
      badge: {
        code: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      currentWorker: 'quests/getCurrentWorker',
      questData: 'quests/getQuest',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      responsesToQuest: 'quests/getResponsesToQuest',
      infoDataMode: 'quests/getInfoDataMode',
    }),
    InfoModeEmployer() {
      return InfoModeEmployer;
    },
    cardBadgeLevel() {
      return [
        {
          card__level_higher: this.badge.code === 1,
        },
        {
          card__level_reliable: this.badge.code === 2,
        },
        {
          card__level_checked: this.badge.code === 3,
        },
      ];
    },
    cardBadgeLevelText() {
      if (this.badge.code === 1) {
        return this.$t('levels.higher');
      } if (this.badge.code === 2) {
        return this.$t('levels.reliableEmp');
      } if (this.badge.code === 3) {
        return this.$t('levels.checkedByTime');
      }
      return '';
    },
  },
  async created() {
    await this.initData();
    await this.getResponsesToQuest();
    await this.getFilteredResponses();
  },
  mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
  methods: {
    getPriority(index) {
      const priority = {
        0: this.$t('priority.low'),
        1: this.$t('priority.normal'),
        2: this.$t('priority.urgent'),
      };
      return priority[index] || '';
    },
    getPriorityClass(index) {
      const priority = {
        0: 'priority__title_low',
        1: 'priority__title_normal',
        2: 'priority__title_urgent',
      };
      return priority[index] || '';
    },
    async closeQuest() {
      const modalMode = 1;
      this.SetLoader(true);
      if (this.questData.status !== InfoModeEmployer.Active) {
        await this.$store.dispatch('quests/closeQuest', this.questData.id);
        this.showQuestModal(modalMode);
      }
      await this.$router.push('/my');
      this.SetLoader(false);
    },
    openDispute() {
      const modalMode = 4;
      this.showQuestModal(modalMode);
    },
    async acceptCompletedWorkOnQuest() {
      const modalMode = 2;
      this.SetLoader(true);
      await this.$store.dispatch('quests/acceptCompletedWorkOnQuest', this.questData.id);
      this.showQuestModal(modalMode);
      await this.$store.dispatch('quests/setInfoDataMode', InfoModeEmployer.Done);
      this.SetLoader(false);
    },
    async rejectCompletedWorkOnQuest() {
      const modalMode = 3;
      this.SetLoader(true);
      await this.$store.dispatch('quests/rejectCompletedWorkOnQuest', this.questData.id);
      this.showQuestModal(modalMode);
      await this.$store.dispatch('quests/setInfoDataMode', InfoModeEmployer.Dispute);
      this.SetLoader(false);
    },
    async initData() {
      await this.$store.dispatch('quests/getQuest', this.$route.params.id);
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
    toRaisingViews() {
      if (![QuestStatuses.Closed, QuestStatuses.Dispute].includes(this.questData.status)) {
        this.$router.push(`/edit-quest/${this.questData.id}`);
        this.$store.dispatch('quests/getCurrentStepEditQuest', 2);
      } else {
        this.showToastWrongStatusRaisingViews();
      }
    },
    showToastWrongStatusRaisingViews() {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.questInfo'),
        variant: 'warning',
        text: this.$t('toasts.questCantRaisingViews'),
      });
    },
    showQuestModal(modalMode) {
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.$t('quests.questInfo'),
        subtitle: this.modalMode(modalMode),
      });
    },
    modalMode(modalMode) {
      const subtitles = {
        1: this.$t('quests.questClosed!'),
        2: this.$t('quests.completedWorkAccepted'),
        3: this.$t('quests.completedWorkRejected'),
        4: 'Discussion flow in progress..',
      };
      return subtitles[modalMode];
    },
  },
};
</script>

<style lang="scss" scoped>
.priority {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  &__container {
    @include text-simple;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    display: flex;
    grid-gap: 10px;
  }
  &__title {
    @include text-simple;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    font-size: 12px;
    line-height: 130%;
    height: 24px;
    padding: 0 5px;
    &_low {
      background: rgba(34, 204, 20, 0.1);
      color: #22CC14;
    }
    &_urgent {
      background: rgba(223, 51, 51, 0.1);
      color: #DF3333;
    }
    &_normal {
      background: rgba(232, 210, 13, 0.1);
      color: #E8D20D;
    }
  }
}
.info__message {
  margin: 10px 0;
}
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
    margin: 20px 0;
  }
  &__container {
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
    align-items: flex-start;
    margin: 20px 0;
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
    margin: 20px 0 20px 0;
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
