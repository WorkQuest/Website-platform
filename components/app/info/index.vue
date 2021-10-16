<template>
  <div>
    <span v-if="userRole === 'employer'">
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
                  {'info__text_white': ![3,6,7,8,9].includes(infoDataMode)}
                ]"
              >
                {{ infoStatusText }}
              </div>
            </div>
          </div>
        </div>
      </span>
    </span>
    <span v-if="userRole === 'worker'">
      <div>
        <div
          v-if="infoDataMode !== 5"
          class="info"
          :class="infoClass"
        >
          <div class="info__body">
            <div class="info__left">
              <div
                class="info__text"
                :class="[
                  {
                    'info__text_white': ![3,7,8,9].includes(infoDataMode)
                  },
                  {
                    'info__text_black': [3,7,8,9].includes(infoDataMode)
                  }
                ]"
              >
                {{ infoStatusText }}
              </div>
            </div>
            <div class="info__right">
              <div
                v-if="infoDataMode === 3"
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
      if (this.userRole === 'employer') {
        if (this.infoDataMode === 2) {
          return this.$t('quests.activeQuest');
        } if (this.infoDataMode === 4) {
          return 'Wait worker';
        } if (this.infoDataMode === 6) {
          return 'Pending consideration';
        }
      } if (this.userRole === 'worker') {
        if (this.infoDataMode === 1) {
          return this.$t('invite.title');
        } if (this.infoDataMode === 2) {
          return this.$t('quests.activeQuest');
        } if (this.infoDataMode === 3) {
          return this.$t('response.title');
        } if (this.infoDataMode === 4) {
          return this.$t('performed.title');
        }
      } if (this.userRole) {
        if (this.infoDataMode === 7) {
          return 'Dispute';
        } if (this.infoDataMode === 8) {
          return 'Quest Closed';
        } if (this.infoDataMode === 9) {
          return 'Quest Finished';
        }
      }
      return '';
    },
    infoClass() {
      return [
        {
          'info_bg-yellow': this.infoDataMode === 1,
        },
        {
          'info_bg-green': this.infoDataMode === 2,
        },
        {
          'info_bg-grey': this.infoDataMode === 3,
        },
        {
          'info_bg-blue': this.infoDataMode === 4,
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
          info_yellow: this.infoDataMode === 1,
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
  min-height: 54px;
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
