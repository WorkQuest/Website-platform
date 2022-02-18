<template>
  <div
    class="info"

    :class="infoClass"
  >
    <div
      v-if="userRole === 'employer' && infoDataMode !== InfoModeEmployer.Created"
      class="info__body"
    >
      <div class="info__left">
        <div
          class="info__text"
          :class="[{'info__text_white': ![InfoModeEmployer.Created, InfoModeEmployer.WaitConfirm].includes(infoDataMode)}]"
        >
          {{ infoStatusText }}
        </div>
      </div>
    </div>
    <div
      v-if="userRole === 'worker'"
      class="info__body"
    >
      <div class="info__left">
        <div
          class="info__text"
          :class="[
            {'info__text_white': ![InfoModeWorker.Rejected, InfoModeWorker.Closed].includes(infoDataMode)},
            {'info__text_black': [InfoModeWorker.Rejected, InfoModeWorker.Closed].includes(infoDataMode)}
          ]"
        >
          {{ infoStatusText }}
        </div>
      </div>
      <div
        v-if="infoDataMode === InfoModeWorker.Rejected"
        class="info__right"
      >
        <base-btn
          v-if="respondOnQuest || (questData.response && questData.response.message)"
          v-click-outside="closeMessage"
          selector="TOGGLE-SHOW-MESSAGE"
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
import { InfoModeEmployer, InfoModeWorker, ResponseStatus } from '~/utils/enums';

export default {
  name: 'InfoVue',
  directives: {
    ClickOutside,
  },
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
    InfoModeEmployer() {
      return InfoModeEmployer;
    },
    InfoModeWorker() {
      return InfoModeWorker;
    },
    responseStatus() {
      return ResponseStatus;
    },
    infoStatusText() {
      if (this.userRole === 'employer') {
        const obj = {
          [InfoModeEmployer.Active]: 'quests.activeQuest',
          [InfoModeEmployer.WaitWorker]: 'quests.waitWorker',
          [InfoModeEmployer.WaitConfirm]: 'quests.pendingConsideration',
          [InfoModeEmployer.Dispute]: 'quests.dispute',
          [InfoModeEmployer.Closed]: 'quests.closed',
          [InfoModeEmployer.Done]: 'performed.title',
        };
        return this.$t(`${obj[this.infoDataMode]}`);
      }
      if (this.userRole === 'worker') {
        const { response } = this.questData;
        const { awaiting, accepted } = ResponseStatus;
        const obj = {
          [InfoModeWorker.Created]: '',
          [InfoModeWorker.ADChat]: 'invite.title',
          [InfoModeWorker.Active]: 'quests.activeQuest',
          [InfoModeWorker.Rejected]: 'quests.requested',
          [InfoModeWorker.WaitWorker]: 'quests.pendingConsideration',
          [InfoModeWorker.WaitConfirm]: 'quests.pendingConsideration',
          [InfoModeWorker.Dispute]: 'quests.dispute',
          [InfoModeWorker.Closed]: 'quests.questClosed',
          [InfoModeWorker.Done]: 'quests.completed',
          [InfoModeWorker.Responded]: 'quests.responded',
          [InfoModeWorker.Invited]: 'quests.invited',
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
      if (this.userRole === 'worker') {
        const { response } = this.questData;
        return [
          { 'info-hide': infoDataMode === InfoModeWorker.Created },
          { 'info_bg-yellow': [InfoModeWorker.ADChat, InfoModeWorker.Invited].includes(infoDataMode) },
          { 'info_bg-green': infoDataMode === InfoModeWorker.Active || (InfoModeWorker.Invited && response?.status === ResponseStatus.accepted) },
          { 'info_bg-grey': infoDataMode === InfoModeWorker.Rejected },
          { 'info_bg-blue': [InfoModeWorker.WaitWorker, InfoModeWorker.WaitConfirm, InfoModeWorker.Done, InfoModeWorker.Responded].includes(infoDataMode) },
          { 'info_bg-red': [InfoModeWorker.Dispute, InfoModeWorker.Closed].includes(infoDataMode) || (InfoModeWorker.Invited && response?.status === ResponseStatus.rejected) },
        ];
      }
      if (this.userRole === 'employer') {
        return [
          { 'info-hide': infoDataMode === InfoModeEmployer.Created },
          { 'info_bg-yellow': infoDataMode === InfoModeEmployer.WaitWorker },
          { 'info_bg-green': infoDataMode === InfoModeEmployer.Active },
          { 'info_bg-grey': infoDataMode === InfoModeEmployer.WaitConfirm },
          { 'info_bg-red': infoDataMode === InfoModeEmployer.Dispute },
          { 'info_bg-blue': [InfoModeEmployer.Closed, InfoModeEmployer.Done].includes(infoDataMode) },
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
