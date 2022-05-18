<template>
  <div
    v-if="infoDataMode !== $options.QuestStatuses.Pending"
    class="info"
    :class="infoClass"
  >
    <div
      v-if="userRole === $options.UserRole.EMPLOYER
        && infoDataMode !== $options.InfoModeEmployer.Created"
      class="info__body"
    >
      <div class="info__left">
        <div
          class="info__text"
          :class="[{'info__text_white': ![
            $options.InfoModeEmployer.Created,
          ].includes(infoDataMode)}]"
        >
          {{ infoStatusText }}
        </div>
      </div>
    </div>
    <div
      v-if="userRole === $options.UserRole.WORKER"
      class="info__body"
    >
      <div class="info__left">
        <div
          class="info__text"
          :class="infoStatusTextColor"
        >
          {{ infoStatusText }}
        </div>
      </div>
      <div
        v-if="infoDataMode === $options.InfoModeWorker.Rejected"
        class="info__right"
      >
        <base-btn
          v-if="respondOnQuest || (questData.response && questData.response.message)"
          v-click-outside="closeMessage"
          data-selector="TOGGLE-SHOW-MESSAGE"
          class="message message__btn"
          mode="showYourMessage"
          @click="toggleShowMessage"
        >
          <template v-slot:right>
            <span class="icon-caret_down" />
          </template>
          {{ isShowMessage ? $t('info.hideYourMessage') : $t('info.showYourMessage') }}
          <div
            v-if="isShowMessage"
            class="message message__container"
          >
            <div class="message__title">
              {{ $t('info.yourMessage') }}
            </div>
            <div class="message__body">
              {{ respondOnQuest.message || questData.response.message }}
            </div>
          </div>
        </base-btn>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import ClickOutside from 'vue-click-outside';
import { ResponseStatus, UserRole } from '~/utils/enums';
import { QuestStatuses, InfoModeEmployer, InfoModeWorker } from '~/utils/сonstants/quests';

export default {
  name: 'InfoVue',
  directives: { ClickOutside },
  UserRole,
  InfoModeEmployer,
  InfoModeWorker,
  ResponseStatus,
  QuestStatuses,
  data() {
    return {
      isShowMessage: false,
    };
  },
  computed: {
    ...mapGetters({
      respondOnQuest: 'quests/getRespondOnQuest',
      questData: 'quests/getQuest',
      userRole: 'user/getUserRole',
      infoDataMode: 'quests/getInfoDataMode',
    }),
    infoStatusTextColor() {
      if ([InfoModeWorker.Rejected].includes(this.infoDataMode)) return 'info__text_black';
      return 'info__text_white';
    },
    infoStatusText() {
      if (this.userRole === UserRole.EMPLOYER) {
        const obj = {
          [InfoModeEmployer.WaitWorker]: 'quests.activeQuest',
          [InfoModeEmployer.WaitWorkerOnAssign]: 'quests.waitWorker',
          [InfoModeEmployer.WaitEmployerConfirm]: 'quests.pendingConsideration',
          [InfoModeEmployer.Dispute]: 'meta.dispute',
          [InfoModeEmployer.Closed]: 'quests.closed',
          [InfoModeEmployer.Done]: 'meta.completed',
        };
        return this.$t(`${obj[this.infoDataMode]}`);
      }
      if (this.userRole === UserRole.WORKER) {
        const { response } = this.questData;
        const { awaiting, accepted } = ResponseStatus;
        const obj = {
          [InfoModeWorker.Pending]: '',
          [InfoModeWorker.Created]: '',
          [InfoModeWorker.ADChat]: 'meta.invited',
          [InfoModeWorker.WaitWorker]: 'quests.activeQuest',
          [InfoModeWorker.Rejected]: 'quests.requested',
          [InfoModeWorker.WaitWorkerOnAssign]: 'quests.pendingConsideration',
          [InfoModeWorker.WaitEmployerConfirm]: 'quests.pendingConsideration',
          [InfoModeWorker.Dispute]: 'meta.dispute',
          [InfoModeWorker.Closed]: 'quests.questClosed',
          [InfoModeWorker.Done]: 'meta.completed',
          [InfoModeWorker.Responded]: 'meta.responded',
          [InfoModeWorker.Invited]: 'meta.invited',
        };
        if (this.infoDataMode === InfoModeWorker.Invited && response.status !== awaiting) {
          return this.$t(`quests.${response.status === accepted ? 'acceptedTheInvitation' : 'declinedTheInvitation'}`);
        }
        return this.$t(`${obj[this.infoDataMode]}`);
      }
      return '';
    },
    infoClass() {
      const { infoDataMode } = this;
      if (this.userRole === UserRole.WORKER) {
        const { response } = this.questData;
        return [
          { 'info-hide': infoDataMode === InfoModeWorker.Created },
          { 'info_bg-yellow': [InfoModeWorker.ADChat, InfoModeWorker.Invited].includes(infoDataMode) },
          { 'info_bg-green': infoDataMode === InfoModeWorker.WaitWorker || response?.status === ResponseStatus.accepted },
          { 'info_bg-grey': infoDataMode === InfoModeWorker.Rejected },
          { 'info_bg-blue': [InfoModeWorker.WaitWorkerOnAssign, InfoModeWorker.WaitEmployerConfirm, InfoModeWorker.Done, InfoModeWorker.Responded].includes(infoDataMode) },
          { 'info_bg-red': [InfoModeWorker.Dispute, InfoModeWorker.Closed].includes(infoDataMode) || response?.status === ResponseStatus.rejected },
        ];
      }
      if (this.userRole === UserRole.EMPLOYER) {
        return [
          { 'info-hide': infoDataMode === InfoModeEmployer.Created },
          { 'info_bg-yellow': infoDataMode === InfoModeEmployer.WaitWorkerOnAssign },
          { 'info_bg-green': infoDataMode === InfoModeEmployer.WaitWorker },
          { 'info_bg-red': [InfoModeEmployer.Closed, InfoModeEmployer.Dispute].includes(infoDataMode) },
          { 'info_bg-blue': [InfoModeEmployer.WaitEmployerConfirm, InfoModeEmployer.Done].includes(infoDataMode) },
        ];
      }
      return '';
    },
  },
  methods: {
    closeMessage() {
      this.isShowMessage = false;
    },
    toggleShowMessage() {
      this.isShowMessage = !this.isShowMessage;
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  &__container {
    position: absolute;
    top: 45px;
    right: 0;
    background: $white;
    box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.0325794), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
    border-radius: 6px;
    max-width: 220px;
    min-width: 200px;
    z-index: 2;
  }
  &__btn {
    position: relative;
  }
  &__title {
    padding: 5px 0 0 10px;
    font-size: 16px;
    color: $blue;
    text-align: left;
  }
  &__body {
    padding: 10px 0 5px 10px;
    color: $black600;
    text-align: left;
    word-wrap: break-word;
  }
}
.icon {
  &-caret_down:before {
    content: "\ea48";
    color: $blue;
    font-size: 20px;
  }
}
.info {
  min-height: 41px;
  box-shadow: 0 1px 0 #e6e9ec;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &-hide {
    display: none;
  }
  &_bg-yellow {
    background-color: $yellow;
  }
  &_bg-green {
    background-color: $green;
  }
  &_bg-grey {
    background-color: $grey;
  }
  &_bg-blue {
    background-color: $blue;
  }
  &_bg-red {
    background-color: $red;
  }
  &__body {
    max-width: 1180px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__left {
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr;
    grid-gap: 35px;
  }
  &__right {
    display: flex;
    grid-gap: 10px;
    align-items: center;
    justify-content: center;
  }
  &__text {
    @include text-simple;
    font-size: 16px;
    font-weight: 400;
    z-index: 11;
    justify-content: space-between;
    &_white {
      color: $white;
    }
    &_black {
      color: $black600;
    }
    &_bold {
      font-weight: 500;
    }
    &_normal {
      font-weight: 300;
    }
  }
}
@include _1199 {
  .info {
    &__right {
      margin-right: 40px;
    }
    &__text {
      margin-left: 18px;
    }
  }
}
</style>
