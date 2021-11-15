<template>
  <div
    class="info"
    :class="infoClass"
  >
    <div
      v-if="userRole === 'employer'
        && ![InfoModeEmployer.RaiseViews, InfoModeEmployer.Created].includes(infoDataMode)"
      class="info__body"
    >
      <div class="info__left">
        <div
          class="info__text"
          :class="[
            {'info__text_white': ![InfoModeEmployer.Created, InfoModeEmployer.WaitConfirm].includes(infoDataMode)}
          ]"
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
            {
              'info__text_white': ![InfoModeWorker.Rejected, InfoModeWorker.Closed].includes(infoDataMode)
            },
            {
              'info__text_black': [InfoModeWorker.Rejected, InfoModeWorker.Closed].includes(infoDataMode)
            }
          ]"
        >
          {{ infoStatusText }}
        </div>
      </div>
      <div class="info__right">
        <div
          v-if="infoDataMode === InfoModeWorker.Rejected"
        >
          <base-btn mode="showYourMessage">
            <template v-slot:right>
              <span class="icon-caret_down" />
            </template>
            {{ $t('info.showYourMessage') }}
          </base-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import { InfoModeE, InfoModeW } from '~/utils/enums';

export default {
  name: 'InfoVue',
  props: {
    info: {
      type: Number,
      default: () => 0,
    },
  },
  computed: {
    InfoModeEmployer() {
      return InfoModeE;
    },
    InfoModeWorker() {
      return InfoModeW;
    },
    infoStatusText() {
      if (this.userRole === 'employer') {
        const obj = {
          [InfoModeE.Active]: 'quests.activeQuest',
          [InfoModeE.WaitWorker]: 'quests.waitWorker',
          [InfoModeE.WaitConfirm]: 'quests.pendingConsideration',
          [InfoModeE.Dispute]: 'quests.dispute',
          [InfoModeE.Closed]: 'quests.closed',
          [InfoModeE.Done]: 'performed.title',
        };
        return this.$t(`${obj[this.infoDataMode]}`);
      }
      if (this.userRole === 'worker') {
        const obj = {
          [InfoModeW.ADChat]: 'invite.title',
          [InfoModeW.Active]: 'quests.activeQuest',
          [InfoModeW.Rejected]: 'quests.requested',
          [InfoModeW.WaitConfirm]: 'quests.pendingConsideration',
          [InfoModeW.Dispute]: 'quests.dispute',
          [InfoModeW.Closed]: 'quests.questClosed',
          [InfoModeW.Done]: 'quests.completed',
        };
        return this.$t(`${obj[this.infoDataMode]}`);
      }
      return '';
    },
    infoClass() {
      if (this.userRole === 'worker') {
        return [
          {
            'info-hide': this.infoDataMode === InfoModeW.Created,
          },
          {
            'info_bg-yellow': this.infoDataMode === InfoModeW.ADChat,
          },
          {
            'info_bg-green': this.infoDataMode === InfoModeW.Active,
          },
          {
            'info_bg-grey': this.infoDataMode === InfoModeW.Rejected,
          },
          {
            'info_bg-blue': [InfoModeW.WaitConfirm, InfoModeW.Done].includes(this.infoDataMode),
          },
          {
            'info_bg-red': [InfoModeW.Dispute, InfoModeW.Closed].includes(this.infoDataMode),
          },
        ];
      }
      if (this.userRole === 'employer') {
        return [
          {
            'info-hide': this.infoDataMode === InfoModeE.Created,
          },
          {
            'info_bg-yellow': this.infoDataMode === InfoModeE.WaitWorker,
          },
          {
            'info_bg-green': this.infoDataMode === InfoModeE.Active,
          },
          {
            'info_bg-grey': this.infoDataMode === InfoModeE.WaitConfirm,
          },
          {
            'info_bg-red': this.infoDataMode === InfoModeE.Dispute,
          },
          {
            'info_bg-blue': [InfoModeE.Closed, InfoModeE.Done].includes(this.infoDataMode),
          },
        ];
      }
      return '';
    },
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      infoDataMode: 'quests/getInfoDataMode',
    }),
  },
};

</script>

<style lang="scss" scoped>
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
  &_bg-green {
    background-color: $green;
  }
  &_bg-yellow {
    background-color: $yellow;
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
</style>
