<template>
  <div
    :class="[
      {'btns__container':
        ![InfoModeWorker.WaitWorker, InfoModeWorker.Closed, InfoModeWorker.Done].includes(infoDataMode)},
      {'btns__margin': [InfoModeWorker.WaitWorker, InfoModeWorker.Closed, InfoModeWorker.Done].includes(infoDataMode)}
    ]"
  >
    <div class="btns__wrapper">
      <div
        v-for="(btn, i) in setBtnsArr"
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
          <template
            v-if="btn.icon"
            v-slot:right
          >
            <span :class="btn.icon" />
          </template>
        </base-btn>
      </div>
    </div>
    <div class="priority">
      <div
        v-if="![InfoModeWorker.WaitWorker, InfoModeWorker.Closed].includes(infoDataMode)"
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
          v-if="![InfoModeWorker.WaitWorker, InfoModeWorker.Closed].includes(infoDataMode)"
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
import { InfoModeWorker, responseStatus } from '~/utils/enums';

export default {
  name: 'QuestIdWorker',
  computed: {
    ...mapGetters({
      questData: 'quests/getQuest',
      infoDataMode: 'quests/getInfoDataMode',
    }),
    InfoModeWorker() {
      return InfoModeWorker;
    },
    setBtnsArr() {
      const {
        ADChat, Active, Rejected, Created, Dispute, Invited, WaitWorker,
      } = InfoModeWorker;
      const { response } = this.questData;

      let arr = [];
      switch (this.infoDataMode) {
        case ADChat: {
          arr = [{
            name: this.$t('btn.agree'),
            class: '',
            mode: '',
            funcKey: 'acceptWorkOnQuest',
            icon: '',
            disabled: false,
          },
          {
            name: this.$t('btn.disagree'),
            class: '',
            mode: 'outline',
            funcKey: 'rejectWorkOnQuest',
            icon: '',
            disabled: false,
          },
          {
            name: this.$t('btn.goToChat'),
            class: 'base-btn_goToChat',
            mode: '',
            funcKey: 'goToChat',
            icon: 'icon-chat icon_fs-20',
            disabled: false,
          }];
          break;
        }
        case Active: {
          arr = [{
            name: this.$t('btn.dispute'),
            class: 'base-btn_dispute',
            mode: '',
            funcKey: '',
            icon: '',
            disabled: true,
          },
          {
            name: this.$t('btn.completeWorkOnQuest'),
            class: '',
            mode: '',
            funcKey: 'completeWorkOnQuest',
            icon: '',
            disabled: false,
          },
          {
            name: this.$t('btn.goToChat'),
            class: 'base-btn_goToChat',
            mode: '',
            funcKey: 'goToChat',
            icon: 'icon-chat icon_fs-20',
            disabled: false,
          }];
          break;
        }
        case Rejected:
        case Created: {
          arr = [{
            name: this.$t(`btn.${Created ? 'sendARequest' : 'responded'}`),
            class: 'base-btn_dispute',
            mode: '',
            funcKey: 'sendARequestOnQuest',
            icon: '',
            disabled: !response,
          }];
          break;
        }
        case Dispute: {
          arr = [{
            name: this.$t('btn.dispute'),
            class: 'base-btn_dispute',
            mode: '',
            funcKey: '',
            icon: '',
            disabled: true,
          }];
          break;
        }
        case Invited: {
          if (response.status === responseStatus.rejected) break;

          arr = [{
            name: this.$t('btn.goToChat'),
            class: 'base-btn_goToChat',
            mode: '',
            funcKey: 'goToChat',
            icon: 'icon-chat icon_fs-20',
            disabled: false,
          }];
          if (response.status === responseStatus.awaiting) {
            arr = [{
              name: this.$t('btn.agree'),
              class: '',
              mode: '',
              funcKey: 'acceptQuestInvitation',
              icon: '',
              disabled: false,
            },
            {
              name: this.$t('btn.disagree'),
              class: '',
              mode: 'outline',
              funcKey: 'rejectQuestInvitation',
              icon: '',
              disabled: false,
            }].concat(arr);
          }
          break;
        }
        case WaitWorker: {
          arr = [{
            name: this.$t('btn.agree'),
            class: '',
            mode: '',
            funcKey: 'acceptWorkOnQuest',
            icon: '',
            disabled: false,
          },
          {
            name: this.$t('btn.disagree'),
            class: '',
            mode: 'outline',
            funcKey: 'rejectWorkOnQuest',
            icon: '',
            disabled: false,
          },
          {
            name: this.$t('btn.goToChat'),
            class: 'base-btn_goToChat',
            mode: '',
            funcKey: 'goToChat',
            icon: 'icon-chat icon_fs-20',
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
    async rejectQuestInvitation() {
      this.SetLoader(true);
      await this.$store.dispatch('quests/rejectQuestInvitation', this.questData.response.id);
      await this.getQuest();
      this.SetLoader(false);
    },
    async acceptQuestInvitation() {
      this.SetLoader(true);
      await this.$store.dispatch('quests/acceptQuestInvitation', this.questData.response.id);
      await this.getQuest();
      this.SetLoader(false);
    },
    async getQuest() {
      await this.$store.dispatch('quests/getQuest', this.questData.id);
    },
    handleClickSpecBtn(funcKey) {
      this[funcKey]();
    },
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
      await this.getQuest();
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
      await this.getQuest();
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
      await this.$store.dispatch('quests/setInfoDataMode', InfoModeWorker.WaitWorker);
      this.SetLoader(false);
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
    grid-template-columns: 2fr 1fr;
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
