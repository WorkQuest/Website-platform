<template>
  <div
    v-if="userRole === 'worker'"
    :class="[
      {'btns__container':
        ![InfoModeWorker.WaitConfirm, InfoModeWorker.Closed, InfoModeWorker.Done].includes(infoDataMode)},
      {'btns__margin': [InfoModeWorker.WaitConfirm, InfoModeWorker.Closed, InfoModeWorker.Done].includes(infoDataMode)}
    ]"
  >
    <div
      v-if="infoDataMode === InfoModeWorker.ADChat"
      class="btns__wrapper"
    >
      <div class="btn__wrapper">
        <base-btn
          @click="acceptWorkOnQuest"
        >
          {{ $t('btn.agree') }}
        </base-btn>
      </div>
      <div class="btn__wrapper">
        <base-btn
          mode="outline"
          @click="rejectWorkOnQuest"
        >
          {{ $t('btn.disagree') }}
        </base-btn>
      </div>
      <div class="btn__wrapper">
        <base-btn
          class="base-btn_goToChat"
          @click="goToChat"
        >
          {{ $t('btn.goToChat') }}
          <template v-slot:right>
            <span class="icon-chat icon_fs-20" />
          </template>
        </base-btn>
      </div>
    </div>
    <div
      v-if="infoDataMode === InfoModeWorker.Active"
      class="btns__wrapper"
    >
      <div class="btn__wrapper">
        <base-btn
          disabled="true"
          class="base-btn_dispute"
        >
          {{ $t('btn.dispute') }}
        </base-btn>
      </div>
      <div class="btn__wrapper">
        <base-btn
          @click="completeWorkOnQuest"
        >
          {{ $t('btn.completeWorkOnQuest') }}
        </base-btn>
      </div>
      <div class="btn__wrapper">
        <base-btn
          class="base-btn_goToChat"
          @click="goToChat"
        >
          {{ $t('btn.goToChat') }}
          <template v-slot:right>
            <span class="icon-chat icon_fs-20" />
          </template>
        </base-btn>
      </div>
    </div>
    <div
      v-if="[InfoModeWorker.Rejected, InfoModeWorker.Created].includes(infoDataMode)"
      class="btns__wrapper"
    >
      <div class="btn__wrapper">
        <base-btn
          :disabled="disabledBtn"
          @click="sendARequestOnQuest"
        >
          {{ InfoModeWorker.Created ? $t('btn.sendARequest') : $t('btn.responded') }}
        </base-btn>
      </div>
    </div>
    <div
      v-if="infoDataMode === InfoModeWorker.Dispute"
      class="btns__wrapper"
    >
      <div class="btn__wrapper">
        <base-btn>
          {{ $t('btn.dispute') }}
        </base-btn>
      </div>
    </div>
    <div class="priority">
      <div
        v-if="![InfoModeWorker.WaitConfirm, InfoModeWorker.Closed].includes(infoDataMode)"
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
          v-if="![InfoModeWorker.WaitConfirm, InfoModeWorker.Closed].includes(infoDataMode)"
          class="priority__title"
          :class="getPriorityClass(questData.priority)"
        >
          {{ getPriority(questData.priority) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import modals from '~/store/modals/modals';
import { InfoModeWorker, QuestStatuses } from '~/utils/enums';

export default {
  name: 'QuestIdWorker',
  data() {
    return {
      userAvatar: '',
      questResponses: {},
      response: {},
    };
  },
  computed: {
    ...mapGetters({
      userData: 'user/getUserData',
      userRole: 'user/getUserRole',
      questData: 'quests/getQuest',
      infoDataMode: 'quests/getInfoDataMode',
    }),
    QuestStatuses() {
      return QuestStatuses;
    },
    InfoModeWorker() {
      return InfoModeWorker;
    },
    disabledBtn() {
      return this.infoDataMode === InfoModeWorker.Rejected;
    },
  },
  async created() {
    await this.getResponsesToQuestForAuthUser();
    await this.initData();
  },
  async mounted() {
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
    async initData() {
      if (this.userRole === 'worker') {
        await this.$store.dispatch('quests/getQuest', this.$route.params.id);
      }
    },
    async goToChat() {
      this.SetLoader(true);
      await this.$router.push('/messages/1');
      this.SetLoader(false);
    },
    async acceptWorkOnQuest() {
      this.SetLoader(true);
      await this.$store.dispatch('quests/acceptWorkOnQuest', this.questData.id);
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.$t('quests.questInfo'),
        subtitle: this.$t('quests.workOnQuestAccepted'),
      });
      await this.$store.dispatch('quests/setInfoDataMode', InfoModeWorker.Active);
      this.SetLoader(false);
    },
    async rejectWorkOnQuest() {
      this.SetLoader(true);
      await this.$store.dispatch('quests/rejectWorkOnQuest', this.questData.id);
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.$t('quests.questInfo'),
        subtitle: this.$t('quests.workOnQuestRejected'),
      });
      await this.$store.dispatch('quests/setInfoDataMode', InfoModeWorker.Created);
      this.SetLoader(false);
    },
    async completeWorkOnQuest() {
      this.SetLoader(true);
      await this.$store.dispatch('quests/completeWorkOnQuest', this.questData.id);
      this.ShowModal({
        key: modals.status,
        img: require('~/assets/img/ui/questAgreed.svg'),
        title: this.$t('quests.questInfo'),
        subtitle: this.$t('quests.pleaseWaitEmp'),
      });
      await this.$store.dispatch('quests/setInfoDataMode', InfoModeWorker.WaitConfirm);
      this.SetLoader(false);
    },
    async getResponsesToQuestForAuthUser() {
      if (this.userRole === 'worker') {
        this.questResponses = await this.$store.dispatch('quests/getResponsesToQuestForAuthUser');
      }
    },
    async sendARequestOnQuest() {
      this.ShowModal({
        key: modals.sendARequest,
        questId: this.questData.id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  color: $black500;
  font-size: 20px;
  &-chat::before {
    @extend .icon;
    color: $green !important;
  }
}
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
  &__margin {
    margin: 0 0 20px 0;
  }
  &__container {
    display: grid;
    grid-template-columns: 8fr 4fr;
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

</style>
