<template>
  <div
    v-if="infoDataMode !== $options.QuestStatuses.Pending"
    class="info"
    :class="questStatusesData[infoDataMode].class"
  >
    <div
      v-if="infoDataMode !== $options.QuestStatuses.Created"
      class="info__body"
    >
      <div class="info__left">
        <div
          class="info__text"
          :class="infoStatusTextColor"
        >
          {{ questStatusesData[infoDataMode].text }}
        </div>
      </div>
      <div
        v-if="infoDataMode === $options.QuestStatuses.Responded"
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
              {{ questData.response.message || respondOnQuest.message }}
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
import { QuestStatuses } from '~/utils/сonstants/quests';

export default {
  name: 'InfoVue',
  directives: { ClickOutside },
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
      infoDataMode: 'quests/getInfoDataMode',
    }),
    questStatusesData() {
      return {
        [QuestStatuses.Created]: {
          text: '',
          class: 'info_hide',
        },
        [QuestStatuses.ADChat]: {
          text: this.$t('meta.invited'),
          class: 'info_bg-yellow',
        },
        [QuestStatuses.WaitWorker]: {
          text: this.$t('quests.activeQuest'),
          class: 'info_bg-green',
        },
        [QuestStatuses.Rejected]: {
          text: this.$t('quests.rejected'),
          class: 'info_bg-red',
        },
        [QuestStatuses.WaitWorkerOnAssign]: {
          text: this.$t('meta.invited'),
          class: 'info_bg-yellow',
        },
        [QuestStatuses.WaitEmployerConfirm]: {
          text: this.$t('quests.pendingConsideration'),
          class: 'info_bg-blue',
        },
        [QuestStatuses.Dispute]: {
          text: this.$t('meta.dispute'),
          class: 'info_bg-red',
        },
        [QuestStatuses.Closed]: {
          text: this.$t('quests.questClosed'),
          class: 'info_bg-red',
        },
        [QuestStatuses.Done]: {
          text: this.$t('meta.completed'),
          class: 'info_bg-blue',
        },
        [QuestStatuses.Responded]: {
          text: this.$t('meta.responded'),
          class: 'info_bg-grey',
        },
        [QuestStatuses.Invited]: {
          text: this.$t('meta.invited'),
          class: 'info_bg-yellow',
        },
      };
    },
    infoStatusTextColor() {
      if ([QuestStatuses.Responded].includes(this.infoDataMode)) return 'info__text_black';
      return 'info__text_white';
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
    z-index: 2;
    position: absolute;
    top: 45px;
    right: 0;
    background: $white;
    box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.0325794), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
    border-radius: 6px;
    width: 320px;
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
  &_hide {
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
@include _575 {
  .message__container {
    right: 0;
    width: 80vw !important;
  }
}
</style>
