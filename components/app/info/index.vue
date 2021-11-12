<template>
  <div
    class="info"
    :class="infoClass"
  >
    <div
      v-if="userRole === 'employer' && ![1,3,5].includes(infoDataMode)"
      class="info__body"
    >
      <div class="info__left">
        <div
          class="info__text"
          :class="[
            {'info__text_white': ![3,6].includes(infoDataMode)}
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
              'info__text_white': ![3,7,8].includes(infoDataMode)
            },
            {
              'info__text_black': [3,7,8].includes(infoDataMode)
            }
          ]"
        >
          {{ infoStatusText }}
        </div>
      </div>
      <div class="info__right">
        <div
          v-if="[3].includes(infoDataMode)"
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

export default {
  name: 'InfoVue',
  props: {
    info: {
      type: Number,
      default: () => 0,
    },
  },
  computed: {
    infoStatusText() {
      if (this.userRole === 'employer') {
        const obj = {
          2: 'quests.activeQuest',
          4: 'quests.waitWorker',
          6: 'quests.pendingConsideration',
          7: 'quests.dispute',
          8: 'performed.title',
          9: 'performed.title',
        };
        return this.$t(`${obj[this.infoDataMode]}`);
      }
      if (this.userRole === 'worker') {
        const obj = {
          1: 'invite.title',
          2: 'quests.activeQuest',
          3: 'response.title',
          4: 'quests.completed',
          7: 'quests.dispute',
          8: 'quests.questClosed',
          9: 'quests.completed',
        };
        return this.$t(`${obj[this.infoDataMode]}`);
      }
      return '';
    },
    infoClass() {
      if (this.userRole === 'worker') {
        return [
          {
            'info_bg-yellow': [1].includes(this.infoDataMode),
          },
          {
            'info_bg-green': [2].includes(this.infoDataMode),
          },
          {
            'info_bg-grey': [3].includes(this.infoDataMode),
          },
          {
            'info_bg-blue': [4, 9].includes(this.infoDataMode),
          },
          {
            'info_bg-red': [7, 8].includes(this.infoDataMode),
          },
        ];
      }
      if (this.userRole === 'employer') {
        return [
          {
            'info_bg-yellow': [4].includes(this.infoDataMode),
          },
          {
            'info_bg-green': [2].includes(this.infoDataMode),
          },
          {
            'info_bg-grey': [6].includes(this.infoDataMode),
          },
          {
            'info_bg-red': [7].includes(this.infoDataMode),
          },
          {
            'info_bg-blue': [8, 9].includes(this.infoDataMode),
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
