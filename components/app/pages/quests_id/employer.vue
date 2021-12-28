<template>
  <div class="employer-cont">
    <template v-if="assignedWorker">
      <div class="worker__title">
        {{ $t('quests.worker') }}
      </div>
      <div class="worker__container">
        <nuxt-link
          :to="`/profile/${assignedWorker.id}`"
          class="worker__user-data"
        >
          <img
            class="worker__avatar"
            :src="avatar"
            alt=""
          >
          <div class="worker__name">
            {{ assignedWorker.firstName }} {{ assignedWorker.lastName }}
          </div>
        </nuxt-link>
        <div
          v-if="![0].includes(badge.code)"
          class="card__level_higher"
          :class="cardBadgeLevel"
        >
          {{ cardBadgeLevelText }}
        </div>
      </div>
    </template>
    <div
      v-if="actionBtnsArr.length || ![InfoModeEmployer.WaitWorker, InfoModeEmployer.Closed, InfoModeEmployer.Done].includes(infoDataMode)"
      class="employer-cont__more-data"
    >
      <div
        v-if="actionBtnsArr.length"
        class="btns__wrapper"
      >
        <div
          v-for="(btn, i) in actionBtnsArr"
          :key="i"
          class="btn__wrapper"
        >
          <base-btn
            :class="btn.class"
            :mode="btn.mode"
            :disabled="btn.disabled"
            @click="handleClickSpecBtn(btn.funcKey)"
          >
            {{ btn.name }}
          </base-btn>
        </div>
      </div>
      <div
        v-if="![InfoModeEmployer.WaitWorker, InfoModeEmployer.Closed, InfoModeEmployer.Done].includes(infoDataMode)"
        class="priority"
      >
        <span class="price__value">
          {{ questData.price }} {{ $t('quests.wusd') }}
        </span>
        <div
          class="priority__title"
          :class="getPriorityClass"
        >
          {{ getPriority }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { InfoModeEmployer, QuestStatuses } from '~/utils/enums';

export default {
  name: 'QuestIdEmployer',
  data() {
    return {
      badge: {
        code: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      assignedWorker: 'quests/getAssignedWorker',
      questData: 'quests/getQuest',
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
    avatar() {
      return this.assignedWorker.avatar?.url || require('~/assets/img/app/avatar_empty.png');
    },
    getPriority() {
      const { priority } = this.questData;

      return priority !== null ? this.$t(`priority.${['low', 'normal', 'urgent'][priority]}`) : '';
    },
    getPriorityClass() {
      const { priority } = this.questData;

      return priority !== null ? `priority__title_${['low', 'normal', 'urgent'][priority]}` : '';
    },
    actionBtnsArr() {
      const { WaitConfirm, Dispute, Created } = InfoModeEmployer;

      let arr = [];

      switch (this.infoDataMode) {
        case Created: {
          arr = [{
            name: this.$t('quests.raiseViews'),
            class: '',
            mode: '',
            funcKey: 'toRaisingViews',
            disabled: false,
          },
          {
            name: this.$t('btn.closeQuest'),
            class: '',
            mode: 'delete',
            funcKey: 'closeQuest',
            disabled: false,
          }];
          break;
        }
        case WaitConfirm: {
          arr = [{
            name: this.$t('btn.acceptCompletedWorkOnQuest'),
            class: '',
            mode: 'approve',
            funcKey: 'acceptCompletedWorkOnQuest',
            disabled: false,
          },
          {
            name: this.$t('btn.rejectCompletedWorkOnQuest'),
            class: '',
            mode: '',
            funcKey: 'rejectCompletedWorkOnQuest',
            disabled: false,
          }];
          break;
        }
        case Dispute: {
          arr = [{
            name: this.$t('btn.dispute'),
            class: '',
            mode: '',
            funcKey: 'openDispute',
            disabled: false,
          }];
          break;
        }
        default: break;
      }
      return arr;
    },
  },
  methods: {
    handleClickSpecBtn(funcKey) {
      this[funcKey]();
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
.employer-cont {

  &__more-data {
    display: grid;
    grid-template-columns: 1fr max-content;
    padding: 20px 0;
    border-top: 1px solid #F7F8FA;
  }
}
.priority {
  display: grid;
  grid-auto-flow: column;
  gap: 15px;
  align-items: center;
  justify-content: end;

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
}
.btns {
  &__wrapper {
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    gap: 20px;
    justify-content: start;
  }
}
.btn {
  &__wrapper {
    width: 220px;
  }
}

.worker {
  font-size: 16px;
  font-weight: 500;
  color: $black800;
  &__container {
    display: grid;
    grid-auto-flow: column;
    gap: 10px;
    justify-content: start;
    align-items: center;
    margin: 20px 0;
  }
  &__user-data {
    display: grid;
    grid-auto-flow: column;
    gap: 10px;
    justify-content: start;
    align-items: center;
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
