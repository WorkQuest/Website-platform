<template>
  <div>
    <span v-if="['employer'].includes(userRole)">
      <span v-if="![1,3,5].includes(infoDataMode)">
        <div
          class="info"
          :class="infoClass"
        >
          <div class="info__body">
            <div class="info__left">
              <div
                class="info__text"
                :class="[
                  {'info__text_white': ![3,6,7].includes(infoDataMode)}
                ]"
              >
                {{ infoStatusText }}
              </div>
            </div>
          </div>
        </div>
      </span>
    </span>
    <span v-if="['worker'].includes(userRole)">
      <div>
        <div
          class="info"
          :class="infoClass"
        >
          <div class="info__body">
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
      </div>
    </span>
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
      if (['employer'].includes(this.userRole)) {
        if ([2].includes(this.infoDataMode)) {
          return this.$t('quests.activeQuest');
        } if ([4].includes(this.infoDataMode)) {
          return this.$t('quests.waitWorker');
        } if ([6].includes(this.infoDataMode)) {
          return this.$t('quests.pendingConsideration');
        } if ([8, 9].includes(this.infoDataMode)) {
          return this.$t('performed.title');
        } if ([7].includes(this.infoDataMode)) {
          return this.$t('quests.dispute');
        }
      }
      if (['worker'].includes(this.userRole)) {
        if ([1].includes(this.infoDataMode)) {
          return this.$t('invite.title');
        } if ([2].includes(this.infoDataMode)) {
          return this.$t('quests.activeQuest');
        } if ([3].includes(this.infoDataMode)) {
          return this.$t('response.title');
        } if ([4, 9].includes(this.infoDataMode)) {
          return this.$t('quests.completed');
        } if ([8].includes(this.infoDataMode)) {
          return this.$t('quests.questClosed');
        } if ([7].includes(this.infoDataMode)) {
          return this.$t('quests.dispute');
        }
      }
      return '';
    },
    infoClass() {
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
      ];
    },
    ...mapGetters({
      tags: 'ui/getTags',
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      infoDataMode: 'quests/getInfoDataMode',
    }),
  },
  methods: {
    infoText(type) {
      const texts = {
        invited: this.$t('invite.title'),
        response: this.$t('response.title'),
        active: this.$t('quests.activeQuest'),
        performed: this.$t('performed.title'),
      };
      return texts[type] || '';
    },
    infoTextStyle() {
      return [
        {
          info_yellow: [1].includes(this.infoDataMode),
        },
      ];
    },
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
